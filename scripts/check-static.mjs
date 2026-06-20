import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/asha/asha.css", import.meta.url), "utf8");
const js = await readFile(new URL("../assets/asha/asha.js", import.meta.url), "utf8");

assert.match(html, /<link rel="canonical" href="https:\/\/asha-stylehub\.vercel\.app\/">/);
assert.match(html, /<meta property="og:url" content="https:\/\/asha-stylehub\.vercel\.app\/">/);
assert.match(html, /"url": "https:\/\/asha-stylehub\.vercel\.app\/"/);
assert.match(html, /Custom stitching &amp; fitting in Gurugram/);
assert.match(html, /Jyoti Park, Sector 7 Ext\., Gurugram/);
assert.match(html, /https:\/\/wa\.me\/919718213716/);
assert.match(html, /tel:\+918118837701/);
assert.match(css, /\.sticky-cta\.is-visible/);
assert.match(css, /@media \(max-width: 340px\)/);
assert.match(js, /setupStickyCta/);

const forbidden = [
  /Grand Launch/i,
  /22 June/i,
  /best boutique/i,
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
