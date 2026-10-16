// Brand ka naam badalta hai: "Numerology VIP" -> "GANESHA SUYOG ASTROLOGY"
//
// Ye ek brand naam hai, isliye har bhasha me Latin me hi rahega —
// translation nahi. Site ka UI (labels, buttons) translated rahega.

import fs from "node:fs";

const BRAND = "GANESHA SUYOG ASTROLOGY";
const SHORT = "SUYOG";
const TITLE = "Ganesha Suyog Astrology - Numerology, Kundli, Rashifal";

/* ---------- 1. src/i18n/translations.js — app_name ---------- */
{
  const F = "src/i18n/translations.js";
  let s = fs.readFileSync(F, "utf8");
  let n = 0;
  // app_name ke baad ki value badlo (script-pure, koi regex risk nahi)
  s = s.replace(/(app_name:\s*)"[^"]*"/g, (m, p1) => {
    n++;
    return `${p1}"${BRAND}"`;
  });
  fs.writeFileSync(F, s);
  console.log(`translations.js : ${n} app_name badle`);
}

/* ---------- 2. index.html ---------- */
{
  const F = "index.html";
  let s = fs.readFileSync(F, "utf8");
  const before = s;
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`);
  s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${TITLE}$2`);
  s = s.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${TITLE}$2`);
  // description me bhi brand
  s = s.replace(/(<meta name="description" content=")[^"]*(")/, `$1${TITLE}. ${BRAND} - free numerology, kundli, rashifal, panchang in 13 languages.$2`);
  fs.writeFileSync(F, s);
  console.log(`index.html      : ${before !== s ? "title badla" : "kuch nahi badla"}`);
}

/* ---------- 3. public/manifest.json ---------- */
{
  const F = "public/manifest.json";
  let s = fs.readFileSync(F, "utf8");
  let n = 0;
  s = s.replace(/("name":\s*)"[^"]*"/, (m, p1) => { n++; return `${p1}"${BRAND}"`; });
  s = s.replace(/("short_name":\s*)"[^"]*"/, (m, p1) => { n++; return `${p1}"${SHORT}"`; });
  fs.writeFileSync(F, s);
  console.log(`manifest.json   : ${n} field badle`);
}

console.log(`\nBrand set: ${BRAND}`);