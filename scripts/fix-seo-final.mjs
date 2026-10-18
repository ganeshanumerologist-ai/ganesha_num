// ─────────────────────────────────────────────────────────────
// BUG jo hua: regex `.replace()` sirf PEHLA occurrence badalta hai.
// 13 bhasha blocks me same keys hain, EN sabse pehle — isliye
// meri "Tamil/Urdu" fix ne ENGLISH ko overwrite kar diya.
//
// Fix: block-scoped replace. `const XX = {` se `};` tak ka
// hissa alag karke, usi me replace karo, phir wapas jodo.
// Return order [count, src] — sahi destructuring ke saath.
//
// Tamil SSA  = U+0BB7   (main type karunga to U+0937 banta hai)
// Arabic N   = U+0646
// ─────────────────────────────────────────────────────────────
import fs from "node:fs";

const F = "src/seo/seoDesc.js";
let src = fs.readFileSync(F, "utf8");

const TA_SHA = String.fromCharCode(0x0bb7);
const AR_NOON = String.fromCharCode(0x0646);

// ── 1. ENGLISH block wapas theek karo (8 keys damage hue) ──
const EN_FIX = {
  seo_desc_reports:
    "Detailed free astrology report with dasha, varga, lagna, Lal Kitab upay, ratna, dosh analysis and remedies. No sign-up fee.",
  seo_desc_experts:
    "Talk to verified astrologers for personalised guidance on career, marriage and problems. Free first consultation in your language.",
  seo_desc_about:
    "Ganesha Suyog Astrology is a free, multilingual astrology platform offering numerology, kundli, rashifal and panchang in 22 Indian languages.",
  seo_desc_contact:
    "Contact Ganesha Suyog Astrology for support, feedback or astrologer enquiries. We reply in your chosen language.",
  seo_desc_blog:
    "Astrology and numerology articles on dasha, varga, remedies, gemstones and panchang, written for beginners and experts alike.",
  seo_desc_calculator:
    "Free numerology calculator. Find your Moolank, Bhagyank, Life Path, Birthday, Destiny, Soul Urge and Attitude numbers instantly.",
  seo_desc_login:
    "Log in or create a free account to save your kundli and reports. Your birth details stay private on your device.",
  seo_desc_daily:
    "Daily lucky time, shubh and ashubh muhurat, Rahu Kaal and auspicious timings for your city, every day of the year.",
  // em-dash hata diya — SERP me colon saaf dikhta hai
  seo_desc_forecast:
    "Free Varshphal: your personal year forecast for numbers 1 to 9, covering career, marriage, money, health and remedies for the year ahead.",
};

// ── 2. TAMIL block — Devanagari ष (U+0937) ko Tamil ஷ (U+0BB7) se badlo ──
const TA_FIX = {
  seo_desc_reports: `விரிவான இலவச ஜாதக அறிக்கை — தசை, வர்கம், லக்ஷணம், லால் புத்தகம், ரத்னம், தோ${TA_SHA} பகுப்பாய்வு, நிவாரணம். கட்டணம் இல்லை.`,
  seo_desc_daily:
    "தினம் நல்ல நேரம், நல்ல மற்றும் தீம்ப் முகூர்த்தம், ராஹு காலம், உங்கள் நகரத்திற்கேற்ப சரியான நேரம், ஆண்டு முழுவதும்.",
  seo_desc_experts: `சரிபார்க்கப்பட்ட ஜோதி${TA_SHA}ிகளிடம் தொழில், திருமணம், சிக்கல்களுக்கு ஆலோசனை. முதல் ஆலோசனை உங்கள் மொழியில் இலவசம்.`,
  seo_desc_about: `கணேஷ சுயோக ஜோதி${TA_SHA}ம் — இலவச பன்மொழி தளம், 22 இந்திய மொழிகளில் எண்கதி, ஜாதகம், ராசிபலம், பஞ்சாங்கம் கிடைக்கின்றன.`,
  seo_desc_contact: `கணேஷ சுயோக ஜோதி${TA_SHA}த்தைத் தொடர்புகொள்ளுங்கள் — உதவி, கருத்து அல்லது ஜோதி${TA_SHA}ர் கேள்விகள். உங்கள் மொழியில் பதிலளிப்போம்.`,
  seo_desc_blog: `தசை, வர்கம், நிவாரணம், ரத்னம், பஞ்சாங்கம் பற்றிய ஜோதி${TA_SHA} மற்றும் எண்கதி கட்டுரைகள் — தொடக்கத்தவருக்கும் நிபுணர்களுக்கும்.`,
};

// ── 3. URDU block — Devanagari anusvara (U+0902) / न (U+0928) hatao ──
const UR_FIX = {
  seo_desc_calculator: `مفت نمبر شاست کیلکولیٹر۔ مولاںک نمبر، بھاگیاںک نمبر، لائف پاتھ نمبر، ج${AR_NOON}متاریخ نمبر، نام نمبر، آتما نمبر اور ذہنی نمبر فوراً جانیں۔`,
  seo_desc_login: `اپنی کنڈلی اور رپورٹ محفوظ کرنے کے لیے مفت اکاؤنٹ بنائیں یا لاگ ان کریں۔ پیدائش کی تفصیلات آپ کے ڈیوائس پر ہی رہیں گی۔`,
};

// block-scoped patch — returns [count, newSource]
function patchBlock(text, blockName, dict) {
  const start = text.indexOf(`const ${blockName} = {`);
  if (start < 0) return [0, text];
  const end = text.indexOf("\n};", start);
  if (end < 0) return [0, text];

  let body = text.slice(start, end);
  let n = 0;
  for (const [k, v] of Object.entries(dict)) {
    const re = new RegExp(`(  ${k}:\\s*)"[^"]*"`);
    if (!re.test(body)) continue;
    body = body.replace(re, `$1${JSON.stringify(v)}`);
    n++;
  }
  return [n, text.slice(0, start) + body + text.slice(end)];
}

let total = 0;
for (const [name, dict] of [["EN", EN_FIX], ["TA", TA_FIX], ["UR", UR_FIX]]) {
  const [n, next] = patchBlock(src, name, dict);
  src = next;
  total += n;
  console.log(`  ${name}: ${n}/${Object.keys(dict).length} value set`);
}
fs.writeFileSync(F, src, "utf8");
console.log(`\n${total} value likha gaya\n`);

// ─────────────────────────────────────────────────────────────
// VERIFY — har bhasha apni script me
// ─────────────────────────────────────────────────────────────
const mod = await import("../src/seo/seoDesc.js?v=" + Date.now());

const OK_RANGES = [
  [0x0964, 0x0965], [0x060c, 0x060c], [0x061b, 0x061f],
  [0x2013, 0x2014], [0x2018, 0x201f], [0x2026, 0x2026],
  [0x00b7, 0x00b7], [0x00b0, 0x00b0],
];
const inR = (cp, r) => cp >= r[0] && cp <= r[1];

function badChar(v, lo, hi) {
  for (const ch of v.replace(/\{[a-z]\}/g, "")) {
    const cp = ch.codePointAt(0);
    if (cp < 0x80) continue;
    if (inR(cp, [lo, hi])) continue;
    if (OK_RANGES.some((r) => inR(cp, r))) continue;
    return `${ch} U+${cp.toString(16).toUpperCase()}`;
  }
  return null;
}

const ALL = [
  ["hi", 0x0900, 0x097f], ["mr", 0x0900, 0x097f], ["bn", 0x0980, 0x09ff],
  ["ta", 0x0b80, 0x0bff], ["te", 0x0c00, 0x0c7f], ["gu", 0x0a80, 0x0aff],
  ["ur", 0x0600, 0x06ff], ["kn", 0x0c80, 0x0cff], ["or", 0x0b00, 0x0b7f],
  ["ml", 0x0d00, 0x0d7f], ["pa", 0x0a00, 0x0a7f], ["as", 0x0980, 0x09ff],
];

let bad = 0;
console.log("══════ SCRIPT PURITY ══════");
for (const [lang, lo, hi] of ALL) {
  const d = mod.SEO_DESC[lang];
  const b = Object.entries(d).filter(([, v]) => badChar(v, lo, hi));
  if (b.length) {
    bad += b.length;
    console.log(`  [FAIL] ${lang}: ` + b.map(([k, v]) => `${k}(${badChar(v, lo, hi)})`).join(", "));
  } else {
    console.log(`  [ OK ] ${lang.padEnd(4)} ${Object.keys(d).length} value apni script me`);
  }
}

// English pure ASCII hona chahiye
const enBad = Object.entries(mod.SEO_DESC.en).filter(([, v]) => /[^\x00-\x7F]/.test(v));
console.log(enBad.length
  ? `\n  [FAIL] EN me non-ASCII: ${enBad.map(([k]) => k).join(", ")}`
  : "\n  [ OK ] EN pure ASCII ✅");

// corrupt char (U+FFFD)
let corrupt = 0;
for (const [lang, d] of Object.entries(mod.SEO_DESC)) {
  for (const [k, v] of Object.entries(d)) {
    if (/[\uFFFD]/.test(v)) { console.log(`  [FAIL] corrupt ${lang}.${k}`); corrupt++; }
  }
}
if (!corrupt) console.log("  [ OK ] koi corrupt char nahi ✅");

console.log(bad || enBad.length || corrupt ? "\n❌ ab bhi problem hai" : "\nSAARI 13 BASHAA SAHI ✅");
process.exit(bad || enBad.length || corrupt ? 1 : 0);