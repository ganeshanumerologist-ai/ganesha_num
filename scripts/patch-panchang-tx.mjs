// Panchang ke city-aware times ke liye labels.
//
// Problem: "pan_godhuli_time" har bhasha me STATIC tha —
//   "17:12 - 18:00 (approximate sunset)"
// Wo sirf Delhi ke liye sahi tha. Nagpur/Mumbai/Chennai par galat.
//
// Fix: time ab calculate hoga (suryast se 1:28 pehle), aur sirf LABEL chahiye.
//   pan_godhuli_time : ab sirf note hai, time nahi
//   pan_godhuli_note : "suryast se 1 ghanta 28 minute pehle"
//   pan_hora_note    : ab "suryodaya se" (pehle "6:00 se" likha tha)
import fs from "node:fs";

const FILE = "src/i18n/siteTx.js";

const ADD = {
  hi: { godhuli_note: "सूर्यास्त से 1 घंटा 28 मिनट पहले", hora_note: "सूर्योदय से शुरू, प्रत्येक 1 घंटा", city_note: "सूर्योदय, सूर्यास्त और शुभ समय इसी शहर के हिसाब से।" },
  en: { godhuli_note: "1 hour 28 minutes before sunset", hora_note: "Starts at sunrise, 1 hour each", city_note: "Sunrise, sunset and auspicious times follow the city you pick." },
  mr: { godhuli_note: "सूर्यास्तापूर्वी 1 तास 28 मिनिटे", hora_note: "सूर्योदयापासून सुरू, प्रत्येक 1 तास", city_note: "सूर्योदय, सूर्यास्त आणि शुभ वेळा तुम्ही निवडलेल्या शहरानुसार." },
  bn: { godhuli_note: "সূর্যাস্তের ১ ঘণ্টা ২৮ মিনিট আগে", hora_note: "সূর্যোদয় থেকে শুরু, প্রতি ১ ঘণ্টা", city_note: "সূর্যোদয়, সূর্যাস্ত ও শুভ সময় আপনার বেছে নেওয়া শহর অনুযায়ী।" },
  te: { godhuli_note: "సూర్యాస్తానికి ముందు 1 గంట 28 నిమిషాలు", hora_note: "సూర్యోదయం నుండి, ప్రతి 1 గంట", city_note: "సూర్యోదయం, సూర్యాస్తం మరియు శుభ సమయాలు మీరు ఎంచుకున్న నగరం ప్రకారం." },
  ta: { godhuli_note: "மூர்த்திக்கு முன் 1 மணி 28 நிமிடங்கள்", hora_note: "சூரிய உதயத்திலிருந்து, ஒவ்வொரு 1 மணி", city_note: "சூரிய உதயம், மூர்த்தம் மற்றும் நல்வேளைகள் நீங்கள் தேர்ந்தெடுத்த நகரத்தின் படி." },
  gu: { godhuli_note: "સૂર્યાસ્ત પહેલાં 1 કલાક 28 મિનિટ", hora_note: "સૂર્યોદયથી શરૂ, દરેક 1 કલાક", city_note: "સૂર્યોદય, સૂર્યાસ્ત અને શુભ સમય તમે પસંદ કરેલા શહેર પ્રમાણે." },
  ur: { godhuli_note: "غروبِ آفتاب سے 1 گھنٹے 28 منٹ پہلے", hora_note: "طلوعِ آفتاب سے شروع، ہر 1 گھنٹے", city_note: "طلوعِ آفتاب، غروبِ آفتاب اور مبارک اوقات آپ کے منتخب کردہ شہر کے مطابق ہیں۔" },
  kn: { godhuli_note: "ಸೂರ್ಯಾಸ್ತಕ್ಕೂ ಮೊದಲು 1 ಗಂಟೆ 28 ನಿಮಿಷ", hora_note: "ಸೂರ್ಯೋದಯದಿಂದ, ಪ್ರತಿ 1 ಗಂಟೆ", city_note: "ಸೂರ್ಯೋದಯ, ಸೂರ್ಯಾಸ್ತ ಮತ್ತು ಶುಭ ಸಮಯಗಳು ನೀವು ಆಯ್ಕೆಮಾಡಿದ ನಗರದ ಪ್ರಕಾರ." },
  ml: { godhuli_note: "അസ്തമയത്തിന് 1 മണിക്കൂർ 28 മിനിറ്റ് ശേഷം", hora_note: "ഉദയത്തിൽ തുടങ്ങി, ഓരോ 1 മണിക്കൂർ", city_note: "ഉദയം, അസ്തമയം, നല്ല സമയങ്ങൾ നിങ്ങൾ തിരഞ്ഞെടുത്ത നഗരത്തിന് അനുസരിച്ച്." },
  pa: { godhuli_note: "ਸੂਰਜ ਡੁੱਬਣ ਤੋਂ 1 ਘੰਟਾ 28 ਮਿੰਟ ਪਹਿਲਾਂ", hora_note: "ਸੂਰਜ ਚੜ੍ਹਨ ਤੋਂ, ਹਰ 1 ਘੰਟਾ", city_note: "ਸੂਰਜ ਚੜ੍ਹਨ, ਸੂਰਜ ਡੁੱਬਣ ਅਤੇ ਸ਼ੁਭ ਸਮਾਂ ਤੁਹਾਡੇ ਚੁਣੇ ਸ਼ਹਿਰ ਅਨੁਸਾਰ।" },
  or: { godhuli_note: "ସୂର୍ୟାସ୍ତଠାରୁ 1 ଘଣ୍ଟା 28 ମିନିଟ ପୂର୍ବେ", hora_note: "ସୂର୍ୟୋଦୟରୁ, ପ୍ରତ୍ୟେକ 1 ଘଣ୍ଟା", city_note: "ସୂର୍ୟୋଦୟ, ସୂର୍ୟାସ୍ତ ଓ ଶୁଭ ସମୟ ଆପଣ ବାଛିଥିବା ସହର ଅନୁସାରେ।" },
  as: { godhuli_note: "সূৰ্যাস্তৰ পূৰ্বে 1 ঘণ্টা 28 মিনিট", hora_note: "সূৰ্যোদয়ৰ পৰা আৰম্ভণি, প্ৰতি 1 ঘণ্টা", city_note: "সূৰ্যোদয়, সূৰ্যাস্ত আৰু শুভ সময় আপুনি বাছনি কৰা নগৰ অনুসৰি।" },
};

let src = fs.readFileSync(FILE, "utf8");

// Har block ka language nikaalo, phir us block ki line badlo
// (String.replace pehla occurrence hi badalta hai — isliye index se chala rahe hain)
const blockRe = /^  ([a-z]{2,4}): \{/gm;
const blocks = [];
let m;
while ((m = blockRe.exec(src))) blocks.push({ lang: m[1], start: m.index });

// har bhasha ka PEHLA block lo (duplicate blocks ignore)
const first = new Map();
for (const b of blocks) if (!first.has(b.lang)) first.set(b.lang, b);

let changed = 0;
const report = [];

for (const [lang, b] of first) {
  if (!ADD[lang]) continue;
  // block ke andar ka hissa
  const nextStart = blocks.filter((x) => x.start > b.start)[0]?.start ?? src.length;
  const body = src.slice(b.start, nextStart);

  const nb = body
    .replace(/pan_hora_note:\s*"[^"]*"/,
      `pan_hora_note: ${JSON.stringify(ADD[lang].hora_note)}`)
    .replace(/pan_godhuli_time:\s*"[^"]*"/,
      `pan_godhuli_time: ${JSON.stringify(ADD[lang].godhuli_note)}`);

  if (nb !== body) {
    src = src.slice(0, b.start) + nb + src.slice(nextStart);
    changed++;
    report.push(`  ${lang.padEnd(4)} hora_note + godhuli_time update`);
  } else {
    report.push(`  ${lang.padEnd(4)} *** kuch nahi mila ***`);
  }
}

// naya key: pan_city_note — har block me pan_city ke baad
let cityAdded = 0;
const blocks2 = [];
blockRe.lastIndex = 0;
while ((m = blockRe.exec(src))) blocks2.push({ lang: m[1], start: m.index });
const first2 = new Map();
for (const b of blocks2) if (!first2.has(b.lang)) first2.set(b.lang, b);

for (const [lang, b] of [...first2].reverse()) {
  if (!ADD[lang]) continue;
  const nextStart = blocks2.filter((x) => x.start > b.start)[0]?.start ?? src.length;
  const body = src.slice(b.start, nextStart);
  if (body.includes("pan_city_note")) continue;
  const line = body.match(/\n(\s*)pan_city:[^\n]*/);
  if (!line) continue;
  const insertAt = b.start + line.index + line[0].length;
  const indent = line[1];
  src = src.slice(0, insertAt) +
    `, pan_city_note: ${JSON.stringify(ADD[lang].city_note)}` +
    src.slice(insertAt);
  cityAdded++;
}

fs.writeFileSync(FILE, src, "utf8");
console.log(report.join("\n"));
console.log(`\n${changed} bhasha update, ${cityAdded} pan_city_note add`);