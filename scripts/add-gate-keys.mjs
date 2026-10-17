// Login gate ke labels. Pehle ye keys kahin nahi thi.
import fs from "node:fs";

const FILE = "src/i18n/siteTx.js";

const GATE = {
  en: {
    gate_title: "Everything unlocks after you log in",
    gate_sub: "Create a free account with your email or mobile number. Your birth details stay private to you.",
    gate_cta: "Login / Sign Up",
    gate_home: "Back to Home",
    gate_unlocks: "What you get after login",
    gate_notfound: "This page does not exist.",
  },
  hi: {
    gate_title: "लॉगिन करने पर सब कुछ खुल जाता है",
    gate_sub: "अपने ईमेल या मोबाइल नंबर से मुफ़्त खाता बनाएँ। आपकी जन्मतिथि सिर्फ आपको दिखेगी।",
    gate_cta: "लॉगिन / साइन अप",
    gate_home: "होम पर लौटें",
    gate_unlocks: "लॉगिन के बाद आपको यह मिलेगा",
    gate_notfound: "यह पेज नहीं मिला।",
  },
  mr: {
    gate_title: "लॉगिन केल्यावर सर्व काही उघडते",
    gate_sub: "तुमच्या ईमेल किंवा मोबाइल क्रमांकाने मोफत खाते तयार करा. तुमची जन्मतारीख फक्त तुम्हाला दिसेल.",
    gate_cta: "लॉगिन / साइन अप",
    gate_home: "मुख्य पृष्ठावर परा",
    gate_unlocks: "लॉगिननंतर तुम्हाला हे मिळेल",
    gate_notfound: "हे पान उपलब्ध नाही.",
  },
  bn: {
    gate_title: "লগইন করলে সবকিছু খুলে যাবে",
    gate_sub: "আপনার ইমেল বা মোবাইল নম্বর দিয়ে বিনামূল্যে অ্যাকাউন্ট খুলুন। আপনার জন্মতারিখ শুধু আপনিই দেখবেন।",
    gate_cta: "লগইন / সাইন আপ",
    gate_home: "হোমে ফিরুন",
    gate_unlocks: "লগইনের পর আপনি যা পাবেন",
    gate_notfound: "এই পাতা পাওয়া যায়নি।",
  },
  te: {
    gate_title: "లాగిన్ చేస్తే అంతా తెరుచుకుంటుంది",
    gate_sub: "మీ ఇమెయిల్ లేదా మొబైల్ సంఖ్యతో ఉచిత ఖాతా తెరవండి. మీ జన్మతేదీ మీకు మాత్రమే కనిపిస్తుంది.",
    gate_cta: "లాగిన్ / సైన్ అప్",
    gate_home: "హోమ్‌కు వెళ్లండి",
    gate_unlocks: "లాగిన్ తర్వాత మీకు ఇది లభిస్తుంది",
    gate_notfound: "ఈ పేజీ కనబడలేదు.",
  },
  ta: {
    gate_title: "உள்நுழைந்தால் அனைத்தும் திறக்கும்",
    gate_sub: "உங்கள் மின்னஞ்சல் அல்லது மொபைல் எண்ணால் இலவசம் கணக்கு திறக்கவும். உங்கள் பிறந்த நாள் உங்களுக்கு மட்டுமே தெரியும்.",
    gate_cta: "உள்நுழை / பதிவு",
    gate_home: "முகப்பு",
    gate_unlocks: "உள்நுழைந்த பிறகு நீங்கள் பெறுவது",
    gate_notfound: "இந்தப் பக்கம் கிடைக்கவில்லை.",
  },
  gu: {
    gate_title: "લોગિન કર્યા પછી બધું ખૂલી જશે",
    gate_sub: "તમારા ઈમેલ કે મોબાઇલ નંબરથી મફત ખાતું બનાવો. તમારી જન્મતારીખ ફક્ત તમને દેખાશે.",
    gate_cta: "લોગિન / સાઇન અપ",
    gate_home: "હોમ પર પાછા",
    gate_unlocks: "લોગિન के बाद आपको यह मिलेगा",
    gate_notfound: "આ પાનું મળ્યું નથી.",
  },
  ur: {
    gate_title: "لاگ اِن کے بعد سب کچھ کھل جائے گا",
    gate_sub: "اپنے ای میل یا موبائل نمبر سے مفت اکاؤنٹ بنائیں۔ آپ کی تاریخِ پیدائش صرف آپ کو دکھے گی۔",
    gate_cta: "لاگ اِن / سائن اپ",
    gate_home: "ہوم واپس",
    gate_unlocks: "لاگ اِن کے بعد آپ کو یہ ملے گا",
    gate_notfound: "یہ صفحہ نہیں ملا۔",
  },
  kn: {
    gate_title: "ಲಾಗಿನ್ ಮಾಡಿದ ಮೇಲೆ ಎಲ್ಲವೂ ತೆರೆಯುತ್ತದೆ",
    gate_sub: "ನಿಮ್ಮ ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಿಂದ ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ. ನಿಮ್ಮ ಜನನ ದಿನಾಂಕ ನಿಮಗೆ ಮಾತ್ರ ಕಾಣುತ್ತದೆ.",
    gate_cta: "ಲಾಗಿನ್ / ಸೈನ್ ಅಪ್",
    gate_home: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    gate_unlocks: "ಲಾಗಿನ್ ನಂತರ ನಿಮಗೆ ಸಿಗುತ್ತದೆ",
    gate_notfound: "ಈ ಪುಟ ಸಿಗಲಿಲ್ಲ.",
  },
  ml: {
    gate_title: "ലോഗിൻ ചെയ്താൽ എല്ലാം തുറക്കും",
    gate_sub: "നിങ്ങളുടെ ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ നമ്പറിലാണ് സൗജന്യ അക്കൗണ്ട് തുറക്കൂ. നിങ്ങളുടെ ജനനത്തെയത്തീ കാണാവുന്നത് നിങ്ങൾക്ക് മാത്രമാണ്.",
    gate_cta: "ലോഗിൻ / സൈൻ അപ്പ്",
    gate_home: "ഹോമിലേക്ക്",
    gate_unlocks: "ലോഗിൻ ചെയ്ത ശേഷം നിങ്ങൾക്ക് ലഭിക്കുക",
    gate_notfound: "ഈ പേജ് കണ്ടെത്തിയില്ല.",
  },
  pa: {
    gate_title: "ਲੌਗਇਨ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਭ ਖੁੱਲ ਜਾਵੇਗਾ",
    gate_sub: "ਆਪਣੀ ਈਮੇਲ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ ਨਾਲ ਮੁਫ਼ਤ ਖਾਤਾ ਖੋਲ੍ਹੋ। ਤੁਹਾਡੀ ਜਨਮ ਤਾਰੀਖ ਸਿਰਫ਼ ਤੁਹਾਨੂੰ ਦਿਸੇਗੀ।",
    gate_cta: "ਲੌਗਇਨ / ਸਾਈਨ ਅਪ",
    gate_home: "ਹੋਮ 'ਤੇ ਵਾਪਸ",
    gate_unlocks: "ਲੌਗਇਨ ਤੋਂ ਬਾਅਦ ਤੁਹਾਨੂੰ ਇਹ ਮਿਲੇਗਾ",
    gate_notfound: "ਇਹ ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ।",
  },
  or: {
    gate_title: "ଲଗଇନ କରିବା ପରେ ସବୁ ଖୋଲିଯିବ",
    gate_sub: "ଆପଣଙ୍କ ଇମେଲ କିମ୍ବା ମୋବାଇଲ ନମ୍ବରରେ ମଫ଼ତ ଖାତା ଖୋଲନ୍ତୁ। ଆପଣଙ୍କ ଜନ୍ମତାରିଖ କେବଳ ଆପଣଙ୍କୁ ଦେଖାଯିବ।",
    gate_cta: "ଲଗଇନ / ସାଇନ ଅପ",
    gate_home: "ହୋମକୁ ଫେରନ୍ତୁ",
    gate_unlocks: "ଲଗଇନ ପରେ ଆପଣ ଯାହା ପାଣିବ",
    gate_notfound: "ଏହି ପୃଷ୍ଠା ମିଳିଲା ନାହିଁ।",
  },
  as: {
    gate_title: "লগইন কৰিলৈ সকলো খুলি যাব",
    gate_sub: "আপোনাৰ ইমেইল বা মোবাইল নম্বৰৰে বিনামূল্যে একাউণ্ট খুলক। আপোনাৰ জন্মতাৰিখ কেৱল আপোনাকেই দেখা যাব।",
    gate_cta: "লগইন / ছাইন আপ",
    gate_home: "ঘৰলৈ ঘূৰক",
    gate_unlocks: "লগইনৰ পিছত আপুনি যি পাব",
    gate_notfound: "এই পৃষ্ঠাটো পোৱা নগ\'ল।",
  },
  ne: {
    gate_title: "लगइन गरेपछि सबै खुल्छ",
    gate_sub: "आफ्नो इमेल वा मोबाइल नम्बरबाटे निःशुल्क खाता खोल्नुहोस्। तपाईंको जन्म मिति तपाईंलाई मात्र देखिन्छ।",
    gate_cta: "लगइन / साइन अप",
    gate_home: "गृहमा फर्कनुहोस्",
    gate_unlocks: "लगइनपछि तपाईंलाई यो पाउनुहुन्छ",
    gate_notfound: "यो पृष्ठ भेटिएन।",
  },
  doi: {
    gate_title: "लॉगिन कन्ने बाद सारे खुलै",
    gate_sub: "अपनै ईमेल जां मोबाइल नंबर नैंग मुफ्त खाता खोलो। तुंसारी जन्मतारीख सिर्फ तुंसें नेँ दिखै।",
    gate_cta: "लॉगिन / साइन अप",
    gate_home: "घर जाओ",
    gate_unlocks: "लॉगिन बाद तुंसें की मिलै",
    gate_notfound: "इस पन्नै नेँ मिल्या।",
  },
  mai: {
    gate_title: "लगइन करै बा सब कुछ खुलि जाब",
    gate_sub: "अपन इमेल वा मोबाइल नंबर सँ बिनामूल्य खाता खोलू। अहाँक जन्मतिथि सिर्फ अहाँकें दिआ जाब।",
    gate_cta: "लगइन / साइन अप",
    gate_home: "घरवा जाऊ",
    gate_unlocks: "लगइनक बाद अहाँक मिलब",
    gate_notfound: "ई पन्ना नँ भेटल।",
  },
  brx: {
    gate_title: "लॉगिन खालमे होनि सबै खुलि",
    gate_sub: "नोंगानि ईमेल जां मोबाइल नामार निङ मुफ्त खाता खानल। नोंगानि जन्म दान खांगोरि नोंगानिआव सारा दिखि दिब।",
    gate_cta: "लॉगिन / साइन अप",
    gate_home: "गोजा खाम",
    gate_unlocks: "लॉगिन बाद नोंगानि मिथि",
    gate_notfound: "इस पानिटा नङ नागिर।",
  },
  sa: {
    gate_title: "प्रवेशे सर्वं उद्घट्यते",
    gate_sub: "स्वेल्पीयद्रव्येण वा फोननम्बरेण निःशुल्कं खात्रं सृज्यतु। तव जन्मतिथिः केवलं तव एव दृश्यते।",
    gate_cta: "प्रवेशः / पञ्जीकरणम्",
    gate_home: "गृहम् प्रति",
    gate_unlocks: "प्रवेशपश्चात् तव यत् लभ्यते",
    gate_notfound: "इदं पृष्ठं न प्राप्यते।",
  },
  ks: {
    gate_title: "لاگِن کٲنہٕ وی زی ٲل ژٲ ٹڪنٲە",
    gate_sub: "تُنہٕن ٕی میل یا موبائل نمبر نٲن پٲنی نہٕکھ کٲکہ انٛیاں۔ تُنہٕن زَمانٛی روز ناہ یہ ہٲندی۔",
    gate_cta: "لاگِن / سائن اپ",
    gate_home: "ہور واپس",
    gate_unlocks: "لاگِن پٲر تو واکی مٹنٛی",
    gate_notfound: "یہ صفحہ نہٕ بند۔",
  },
  sd: {
    gate_title: "لاگِن ڪرڻ کانپ Vintage کي کي کي کُلِ ٿيندو",
    gate_sub: "پنهنجو ايميل يا موبائل نمبر سان مفت گهاڻ کولو. پنهنجي تاريخ پيدائش صرف پنهنجي کي ڏيک ويندو.",
    gate_cta: "لاگِن / سائن اپ",
    gate_home: "گهر ڏيک",
    gate_unlocks: "لاگِن کانپ بعد پنهنجي کي اهو ملي ٿيندو",
    gate_notfound: "هي صفحو نه مليو.",
  },
  sat: {
    gate_title: "ᱞᱚᱜᱤᱱ ᱦᱩᱭᱟᱹᱨᱟᱹ ᱛᱮ ᱡᱚᱛᱚ ᱡᱷᱤᱲᱟᱹ",
    gate_sub: "ᱟᱹᱢᱩᱜᱟᱣᱟᱜ ᱤᱢᱮᱤᱞ ᱥᱟᱝᱟᱱᱤ ᱢᱚᱪᱟᱶᱤᱞ ᱱᱚᱢᱪᱚᱨ ᱜᱚᱱᱟᱝ ᱠᱚᱢᱤ ᱠᱚᱪᱚᱭᱟᱹᱠᱟᱹ। ᱟᱹᱢᱩᱜᱟᱣᱟᱜ ᱡᱚᱛᱚ ᱴᱟᱹᱨᱤᱠᱷᱚ ᱠᱚᱯᱟ ᱯᱟᱹᱛᱟᱹ।",
    gate_cta: "ᱞᱚᱜᱤᱱ / ᱥᱟᱭᱟᱹ ᱥᱤᱯ",
    gate_home: "ᱜᱚᱲᱟᱝ ᱚᱲᱟᱝ",
    gate_unlocks: "ᱞᱚᱜᱤᱱ ᱛᱟᱝᱮ ᱟᱹᱢᱩᱜᱟᱣᱟᱜ ᱢᱮᱸᱩᱛᱚ",
    gate_notfound: "ᱤᱥ ᱯᱟᱨᱟᱜ ᱧᱮᱞᱟᱹ ᱵᱟᱹᱛᱟᱹᱫᱟᱹᱫᱟᱹ।",
  },
  mni: {
    gate_title: "লগইন করিয়া সব খুলি যাব",
    gate_sub: "অপোনাৰ ইমেল বা মোবাইল নম্বৰেৰে বিনামূল্যে একাউণ্ট খুলক। অপোনাৰ জন্মতাৰিখ কেৱল অপোনাক দেখা যাব।",
    gate_cta: "লগইন / সাইন আপ",
    gate_home: "হোমলৈ ঘূৰক",
    gate_unlocks: "লগইনৰ পিছত অপোনে যি পাব",
    gate_notfound: "এই পৃষ্ঠাটো পোৱা নগ’ল।",
  },
};

let src = fs.readFileSync(FILE, "utf8");

// Har block me keys insert karo. Block marker: "  <code>: {" (2 space)
// aur EN const "const EN = {". Hum LAST marker se shuru karte hain jahan
// us bhasha ka EXTRA/D block hai, kyunki wahi jagah EXTRA keys rehti hain.
const blockRe = /^(const EN = \{|  ([a-z]{2,4}): \{)/gm;
const marks = [];
let m;
while ((m = blockRe.exec(src))) marks.push({ lang: (m[2] || "en").toLowerCase(), start: m.index });

let added = 0;
const log = [];
// ulta chalo taaki index shift na ho
for (let i = marks.length - 1; i >= 0; i--) {
  const b = marks[i];
  const kv = GATE[b.lang];
  if (!kv) continue;
  const next = marks[i + 1]?.start ?? src.length;
  const body = src.slice(b.start, next);
  if (body.includes("gate_title:")) continue;

  const line = `\n    ${Object.entries(kv).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ")},`;
  // block ke andar pehli line ke baad (us block ki indent copy karke)
  const firstNL = body.indexOf("\n");
  src = src.slice(0, b.start + firstNL) + line + src.slice(b.start + firstNL);
  added++;
  log.unshift(`  ${b.lang.padEnd(4)} gate keys`);
}

fs.writeFileSync(FILE, src, "utf8");
console.log(log.join("\n"));
console.log(`\n${added} block me gate keys mili`);