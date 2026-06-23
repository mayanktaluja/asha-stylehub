import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

// ── Canonical surface (asha-stylehub.vercel.app) ────────────────────────────
assert.match(html, /<link rel="canonical" href="https:\/\/asha-stylehub\.vercel\.app\/">/);
assert.match(html, /<meta property="og:url" content="https:\/\/asha-stylehub\.vercel\.app\/">/);
assert.match(html, /"url": "https:\/\/asha-stylehub\.vercel\.app\/"/);

// ── Brand + positioning ─────────────────────────────────────────────────────
assert.match(html, /Asha Style Hub/);
assert.match(html, /formerly known as Asha Boutique and Collections/i);
assert.match(html, /Serving Gurugram since 1996/);

// ── Conversion paths (WhatsApp-first, with call fallback) ────────────────────
assert.match(html, /https:\/\/wa\.me\/919718213716/);
assert.match(html, /tel:\+919718213716/);
assert.match(html, /97182 13716/);
assert.match(html, /81188 37701/);
assert.match(html, /query_place_id=ChIJ0cS0IioYDTkRm5CJ7y7AmWc/);
assert.match(html, /instagram\.com\/asha\.stylehub/);

// ── JSON-LD local business ──────────────────────────────────────────────────
const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(schemaMatch, "index.html should include JSON-LD");
const schema = JSON.parse(schemaMatch[1]);
assert.equal(schema["@type"], "ClothingStore");
assert.equal(schema.name, "Asha Style Hub");
assert.equal(schema.alternateName, "Asha Boutique and Collections");
assert.equal(schema.address.addressLocality, "Gurugram");
assert.deepEqual(schema.sameAs, ["https://www.instagram.com/asha.stylehub/"]);

// ── FAQ: every JSON-LD block parses, and an FAQPage backs the visible FAQ ────
const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
  (m) => JSON.parse(m[1])
);
const faq = ldBlocks.find((b) => b["@type"] === "FAQPage");
assert.ok(faq, "index.html should include FAQPage JSON-LD");
assert.ok(
  Array.isArray(faq.mainEntity) && faq.mainEntity.length >= 6,
  "FAQPage should list the visitor questions"
);
assert.match(html, /<details class="faq-item">/, "FAQ should render as no-JS details items");

// ── Self-contained page: no external CSS/JS bundle, only local images ────────
assert.doesNotMatch(html, /\/assets\/asha\//, "landing should be self-contained (no legacy asha.css/asha.js)");
const imageRefs = [...new Set(html.match(/\/assets\/launch-assets\/[^"'\s,)]+/g) || [])];
assert.ok(imageRefs.length >= 6, "landing should reference optimized local images");
const onDisk = new Set(await readdir(new URL("../assets/launch-assets", import.meta.url)));
for (const ref of imageRefs) {
  const file = ref.split("/").pop();
  assert.ok(onDisk.has(file), `${ref} should exist on disk`);
}

// ── No marketing claims the owner did not approve ───────────────────────────
const forbidden = [
  /Grand Launch/i,
  /22 June/i,
  /No\.\s*1/i,
  /\bcart\b|\bcheckout\b|\bpayment\b/i,
  /5\s*star|five\s*star|\breviews?\b|\brated\b/i,
  /future photos?|future collections?|placeholder|lookbook ready/i,
  /perfect fit guaranteed/i,
];
for (const pattern of forbidden) {
  assert.doesNotMatch(html, pattern);
}

console.log("Asha static checks passed");
