import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/asha/asha.css", import.meta.url), "utf8");
const js = await readFile(new URL("../assets/asha/asha.js", import.meta.url), "utf8");

const mapsUrl =
  "https://google.com/maps?gs_lcrp=EgZjaHJvbWUqCAgBEEUYJxg7MggIABBFGCcYOzIICAEQRRgnGDsyBggCEEUYOTIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIGCAYQRRhBMgYIBxBFGD3SAQg1NDU4ajBqN6gCALACAA&amp;um=1&amp;ie=UTF-8&amp;fb=1&amp;gl=in&amp;sa=X&amp;geocode=KdHEtCIqGA05MZuQie8uwJln&amp;daddr=Jyoti+Park,+Main+Rd,+near+Ashirwad+Marriage+Lawn+Banquet,+Sector+7+Ext,+Gurugram,+Haryana+122001";
const listingName =
  "Asha Boutique & Collections | Best Boutique in Gurgaon | Ethinic Wear Shop | Latkan, Button & Laces Store";
const escapedListingName =
  "Asha Boutique &amp; Collections | Best Boutique in Gurgaon | Ethinic Wear Shop | Latkan, Button &amp; Laces Store";

assert.match(html, /<link rel="canonical" href="https:\/\/asha-stylehub\.vercel\.app\/">/);
assert.match(html, /<meta property="og:url" content="https:\/\/asha-stylehub\.vercel\.app\/">/);
assert.match(html, /"url": "https:\/\/asha-stylehub\.vercel\.app\/"/);
assert.match(html, /Custom stitching &amp; fitting in Gurugram/);
assert.match(html, /Jyoti Park, Sector 7 Ext\., Gurugram/);
assert.match(html, new RegExp(listingName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(html, new RegExp(escapedListingName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(html, new RegExp(mapsUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.doesNotMatch(html, /google\.com\/maps\/search/);
assert.match(html, /https:\/\/wa\.me\/919718213716/);
assert.match(html, /tel:\+918118837701/);
assert.match(css, /\.sticky-cta\.is-visible/);
assert.match(css, /@media \(max-width: 340px\)/);
assert.match(js, /setupStickyCta/);

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
