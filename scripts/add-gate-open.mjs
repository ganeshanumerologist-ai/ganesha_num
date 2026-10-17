// gate_sub_open — login hone ke baad home page par dikhta hai.
import fs from "node:fs";

const FILE = "src/i18n/siteTx.js";
const V = {
  en: "Everything is unlocked. Choose any service below.",
  hi: "सब कुछ खुल चुका है। नीचे से कोई भी सेवा चुनें।",
  mr: "सर्व काही उघडले गेले आहे. खालीलून कोणतीही सेवा निवडा.",
  bn: "সবকিছু খুলে গেছে। নিচ থেকে যেকোনো সেবা বেছে নিন।",
  te: "అంతా తెరుచుకుంది. కింది నుండి ఏ సేవనుైనా ఎంచుకోండి.",
  ta: "அனைத்தும் திறக்கப்பட்டுள்ளது. கீழே இருந்து எந்த சேவையையும் தேர்வு செய்க.",
  gu: "બધું ખુલી ગયું છે. નીચેથી કોઈપણ સેવા પસંદ કરો.",
  ur: "سب کچھ کھل چکا ہے۔ نیچے سے کوئی بھی خدمت منتخب کریں۔",
  kn: "ಎಲ್ಲವೂ ತೆರೆದಿದೆ. ಕೆಳಗಿನಿಂದ ಯಾವುದೇ ಸೇವೆ ಆಯ್ಕಿಸಿ.",
  ml: "എല്ലാം തുറന്നിരിക്കുന്നു. താഴെ നിന്ന് ഏതെങ്കിലും സേവനം തിരഞ്ഞെടുക്കുക.",
  pa: "ਸਭ ਖੁੱਲ ਚੁੱਕਾ ਹੈ। ਹੇਠਾਂ ਤੋਂ ਕੋਈ ਵੀ ਸੇਵਾ ਚੁਣੋ।",
  or: "ସବୁ ଖୋଲିଗଲା। ତଳେ ଥରୁ ଯେକୌଣସି ସେବା ବାଛନ୍ତୁ।",
  as: "সকলো খুলি গৈছে। তলৰ পৰা যিকোনো সেৱা বাছনি কৰক।",
};

let src = fs.readFileSync(FILE, "utf8");
const blockRe = /^(const EN = \{|  ([a-z]{2,4}): \{)/gm;
const marks = [];
let m;
while ((m = blockRe.exec(src))) marks.push({ lang: (m[2] || "en").toLowerCase(), start: m.index });

let n = 0;
for (let i = marks.length - 1; i >= 0; i--) {
  const b = marks[i];
  if (!V[b.lang]) continue;
  const next = marks[i + 1]?.start ?? src.length;
  const body = src.slice(b.start, next);
  if (body.includes("gate_sub_open:")) continue;
  const line = `\n    gate_sub_open: ${JSON.stringify(V[b.lang])},`;
  const nl = body.indexOf("\n");
  src = src.slice(0, b.start + nl) + line + src.slice(b.start + nl);
  n++;
}
fs.writeFileSync(FILE, src, "utf8");
console.log(`${n} block me gate_sub_open mila`);