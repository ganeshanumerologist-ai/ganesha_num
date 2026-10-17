// har bhasha ke "pan_city" ke baad ek chhota hint add karo:
// "Sunrise, sunset and auspicious times follow the city you pick."
// Isse user ko pata chale ki time badal raha hai.
import fs from "node:fs";

const FILE = "src/i18n/siteTx.js";
const NOTE = {
  en: "Sunrise, sunset and auspicious times follow the city you pick.",
  hi: "सूर्योदय, सूर्यास्त और शुभ समय इसी शहर के हिसाब से।",
  mr: "सूर्योदय, सूर्यास्त आणि शुभ वेळा तुम्ही निवडलेल्या शहरानुसार.",
  bn: "সূর্যোদয়, সূর্যাস্ত ও শুভ সময় আপনার বেছে নেওয়া শহর অনুযায়ী।",
  te: "సూర్యోదయం, సూర్యాస్తం మరియు శుభ సమయాలు మీరు ఎంచుకున్న నగరం ప్రకారం.",
  ta: "சூரிய உதயம், மூர்த்தம் மற்றும் நல்வேளைகள் நீங்கள் தேர்ந்தெடுத்த நகரத்தின் படி.",
  gu: "સૂર્યોદય, સૂર્યાસ્ત અને શુભ સમય તમે પસંદ કરેલા શહેર પ્રમાણે.",
  ur: "طلوعِ آفتاب، غروبِ آفتاب اور مبارک اوقات آپ کے منتخب کردہ شہر کے مطابق ہیں۔",
  kn: "ಸೂರ್ಯೋದಯ, ಸೂರ್ಯಾಸ್ತ ಮತ್ತು ಶುಭ ಸಮಯಗಳು ನೀವು ಆಯ್ಕೆಮಾಡಿದ ನಗರದ ಪ್ರಕಾರ.",
  ml: "ഉദയം, അസ്തമയം, നല്ല സമയങ്ങൾ നിങ്ങൾ തിരഞ്ഞെടുത്ത നഗരത്തിന് അനുസരിച്ച്.",
  pa: "ਸੂਰਜ ਚੜ੍ਹਨ, ਸੂਰਜ ਡੁੱਬਣ ਅਤੇ ਸ਼ੁਭ ਸਮਾਂ ਤੁਹਾਡੇ ਚੁਣੇ ਸ਼ਹਿਰ ਅਨੁਸਾਰ।",
  or: "ସୂର୍ୟୋଦୟ, ସୂର୍ୟାସ୍ତ ଓ ଶୁଭ ସମୟ ଆପଣ ବାଛିଥିବା ସହର ଅନୁସାରେ।",
  as: "সূৰ্যোদয়, সূৰ্যাস্ত আৰু শুভ সময় আপুনি বাছনি কৰা নগৰ অনুসৰি।",
};

let src = fs.readFileSync(FILE, "utf8");

// Block markers: EN/HI/MR... uppercase consts (0 indent) AUR
// en/hi/mr... inline objects (2 indent) — dono tarah ka data yahan hai.
const blockRe = /^  ([a-z]{2,4}): \{|^const ([A-Z]{2,3}) = \{/gm;
const marks = [];
let m;
while ((m = blockRe.exec(src))) {
  marks.push({ lang: (m[2] || m[1]).toLowerCase(), start: m.index });
}

// Ulta chalo taaki index shift na ho
const cityRe = /^([ \t]*)pan_city: ("(?:[^"\\]|\\.)*")/gm;
const hits = [];
while ((m = cityRe.exec(src))) hits.push({ indent: m[1], quote: m[2], start: m.index, end: m.index + m[0].length });

let added = 0;
const log = [];
for (const h of [...hits].reverse()) {
  // is occurrence se pehle ka sabse nazdeqi block
  const owner = [...marks].reverse().find((x) => x.start < h.start);
  if (!owner || !NOTE[owner.lang]) { log.push(`  ??? orphan pan_city @${h.start}`); continue; }
  const line = `\n${h.indent}pan_city_note: ${JSON.stringify(NOTE[owner.lang])},`;
  src = src.slice(0, h.end) + line + src.slice(h.end);
  added++;
  log.unshift(`  ${owner.lang.padEnd(4)} pan_city_note add`);
}

fs.writeFileSync(FILE, src, "utf8");
console.log(log.join("\n"));
console.log(`\n${added} / 13 add hue`);