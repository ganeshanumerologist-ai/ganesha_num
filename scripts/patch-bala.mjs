// Reports.jsx me graha-bala (Sama/Uchcha/Neecha/Swa/Asta) aur nakshatra-lord
// ke Latin labels siteTx dictionary se jodta hai.
import { readFileSync, writeFileSync } from "node:fs";

// ---------- 1. siteTx.js me naye keys ----------
const BALA = {
  hi: { bala_sama: "साम", bala_uchcha: "उच्च", bala_neecha: "नीच", bala_swa: "स्व", bala_asta: "अस्त", remedies_guide: "📿 रुद्राक्ष · 🌿 जड़ी · 🔯 यंत्र गाइड" },
  mr: { bala_sama: "सम", bala_uchcha: "उच्च", bala_neecha: "नीच", bala_swa: "स्व", bala_asta: "अस्त", remedies_guide: "📿 रुद्राक्ष · 🌿 जडी · 🔯 यंत्र मार्गदर्शक" },
  bn: { bala_sama: "সম", bala_uchcha: "উচ্চ", bala_neecha: "নীচ", bala_swa: "স্ব", bala_asta: "অস্ত", remedies_guide: "📿 রুদ্রাক্ষ · 🌿 জড়ি · 🔯 যন্ত্র গাইড" },
  te: { bala_sama: "సమ", bala_uchcha: "ఉచ్చ", bala_neecha: "నీచ", bala_swa: "స్వ", bala_asta: "అస్త", remedies_guide: "📿 రుద్రాక్ష · 🌿 జడి · 🔯 యంత్ర మార్గదర్శకం" },
  ta: { bala_sama: "சம", bala_uchcha: "உச்ச", bala_neecha: "நீச்ச", bala_swa: "சுவ", bala_asta: "அஸ்த", remedies_guide: "📿 ருத்ராக்ஷம் · 🌿 மூலி · 🔯 யந்திர வழிகாட்டி" },
  gu: { bala_sama: "સમ", bala_uchcha: "ઉચ્ચ", bala_neecha: "નીચ", bala_swa: "સ્વ", bala_asta: "અસ્ત", remedies_guide: "📿 રુદ્રાક્ષ · 🌿 જડી · 🔯 યંત્ર માર્ગદર્શક" },
  ur: { bala_sama: "سما", bala_uchcha: "عروج", bala_neecha: "زوال", bala_swa: "سو", bala_asta: "اَست", remedies_guide: "📿 رُद्रاکش · 🌿 جڑی · 🔯 یانترا رہنمائی" },
  kn: { bala_sama: "ಸಮ", bala_uchcha: "ಉಚ್ಚ", bala_neecha: "ನೀಚ", bala_swa: "ಸ್ವ", bala_asta: "ಅಸ್ತ", remedies_guide: "📿 ರುದ್ರಾಕ್ಷ · 🌿 ಜಾಡಿ · 🔯 ಯಂತ್ರ ಮಾರ್ಗದರ್ಶಿ" },
  ml: { bala_sama: "സമ", bala_uchcha: "ഉച്ച", bala_neecha: "താഴ്", bala_swa: "സ്വ", bala_asta: "അസ്ത", remedies_guide: "📿 രുദ്രാക്ഷം · 🌿 മൂലി · 🔯 യന്ത്ര വഴികാട്ടി" },
  pa: { bala_sama: "ਸਮ", bala_uchcha: "ਉੱਚਾ", bala_neecha: "ਨੀਚਾ", bala_swa: "ਸਵ", bala_asta: "ਅਸਤ", remedies_guide: "📿 ਰੁਦਰਾਖ਼ · 🌿 ਜੜੀ · 🔯 ਯੰਤਰ ਮਾਰਗਦਰਸ਼ਕ" },
  or: { bala_sama: "ସମ", bala_uchcha: "ଉଚ୍ଚ", bala_neecha: "ନୀଚ", bala_swa: "ସ୍ୱ", bala_asta: "ଅସ୍ତ", remedies_guide: "📿 ରୁଦ୍ରାକ୍ଷ · 🌿 ଜଡ଼ି · 🔯 ଯନ୍ତ୍ର ମାର୍ଗଦର୍ଶକ" },
  as: { bala_sama: "সম", bala_uchcha: "উচ্চ", bala_neecha: "নীচ", bala_swa: "স্ব", bala_asta: "অস্ত", remedies_guide: "📿 ৰুদ্ৰাক্ষ · 🌿 জড়ি · 🔯 যন্ত্ৰ গাইড" },
};

const P = "src/i18n/siteTx.js";
let t = readFileSync(P, "utf8");

t = t.replace(
  '  kundli_word: "Kundli",',
  '  kundli_word: "Kundli",\n  bala_sama: "Neutral", bala_uchcha: "Exalted", bala_neecha: "Debilitated", bala_swa: "Own sign", bala_asta: "Retrograde",\n  remedies_guide: "📿 Rudraksha · 🌿 Herbs · 🔯 Yantra Guide",'
);

let added = 0;
for (const [L, obj] of Object.entries(BALA)) {
  const needle = `  ${L}: {\n    kundli_word:`;
  if (!t.includes(needle)) { console.log("MISS", L); continue; }
  const line = Object.entries(obj).map(([k, v]) => `${k}: "${v}"`).join(", ");
  t = t.replace(needle, `  ${L}: {\n    ${line},\n    kundli_word:`);
  added++;
}
writeFileSync(P, t);
console.log(`siteTx: bala keys added to ${added}/12`);

// ---------- 2. Reports.jsx wiring ----------
const R = "src/pages/Reports.jsx";
let r = readFileSync(R, "utf8");
const rb = r;

r = r.replace(
  '<span className="v">{v.bala}{v.asta ? " · Asta" : ""}</span>',
  '<span className="v">{S[v.bala]}{v.asta ? ` · ${S.bala_asta}` : ""}</span>'
);
r = r.replace(
  'let bala = "Sama";\n      if (rashi === EXALT[k][0]) bala = "Uchcha";\n      else if (rashi === EXALT[k][1]) bala = "Neecha";\n      else if ((OWN[k] || []).includes(rashi)) bala = "Swa";',
  'let bala = "bala_sama";\n      if (rashi === EXALT[k][0]) bala = "bala_uchcha";\n      else if (rashi === EXALT[k][1]) bala = "bala_neecha";\n      else if ((OWN[k] || []).includes(rashi)) bala = "bala_swa";'
);
r = r.replace(
  '📿 Rudraksha · 🌿 Jadi · 🔯 Yantra Guide</Link>',
  '{S.remedies_guide}</Link>'
);
// swami lines
r = r.replace('v: RASHI_LORD[pNow.moonR] || "-"', 'v: gName(RASHI_LORD[pNow.moonR] || "-", lang)');
r = r.replace('v: NAK_LORD[pNow.nak] || "-"', 'v: gName(NAK_LORD[pNow.nak] || "-", lang)');
r = r.replace(
  'v: lagIdx !== null ? RASHI_LORD[RASHIS[lagIdx]] || "-" : null',
  'v: lagIdx !== null ? gName(RASHI_LORD[RASHIS[lagIdx]] || "-", lang) : null'
);
r = r.replace(
  '{r.nak.name} (Charan {r.nak.pada}) · {T.dashanath} {NAK_LORD[r.nak.name]}',
  '{nakName(r.nak.index, lang)} ({T.naksh} {r.nak.pada}) · {T.dashanath} {gName(NAK_LORD[r.nak.name] || "-", lang)}'
);

writeFileSync(R, r);
console.log(`Reports.jsx wired: ${r !== rb}`);