// sitemapindex.xml — bade site (>50k URL) ya kai alag sitemap ho to
// Google ko ek index chahiye. 273 URL to kam hai, par ye future-proof
// hai aur robots.txt me mention karna free SEO signal hai.
import fs from "node:fs";
import { SITE_URL } from "../src/seo/routes.js";

const today = new Date().toISOString().slice(0, 10);

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!-- sitemap index — robots.txt yahi point karta hai -->\n` +
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `  <sitemap>\n` +
  `    <loc>${SITE_URL}/sitemap.xml</loc>\n` +
  `    <lastmod>${today}</lastmod>\n` +
  `  </sitemap>\n` +
  `</sitemapindex>\n`;

fs.writeFileSync("public/sitemapindex.xml", xml, "utf8");
console.log(`public/sitemapindex.xml  ${Buffer.byteLength(xml)} bytes`);