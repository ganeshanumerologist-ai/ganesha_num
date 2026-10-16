// Navbar dropdown ke baaki English labels (Kundli, Varshphal, Rashifal, Gochar …)
// translations.js me 13 bhasha me add karta hai.
// Pehle wali script me out.length se index guess galat tha — is baar index se chalta hai.
import { readFileSync, writeFileSync } from "node:fs";

const NAV = {
  en: ["Kundli", "Kundli Charts", "Lo Shu Grid", "Matching", "Varshphal", "Rashifal", "Gochar", "Shani", "Muhurat", "Reports", "Rudraksha-Yantra", "Daily Lucky", "Calendar", "Blog", "Admin", "Shani Sade Sati"],
  hi: ["कुंडली", "कुंडली चार्ट", "लो शु ग्रिड", "मिलान", "वर्षफल", "राशिफल", "गोचर", "शनि", "मुहूर्त", "रिपोर्ट", "रुद्राक्ष-यंत्र", "दैनिक शुभ", "कैलेंडर", "ब्लॉग", "एडमिन", "शनि सदे साती"],
  mr: ["कुंडली", "कुंडली चार्ट", "लो शू ग्रिड", "जुळणी", "वर्षफळ", "राशिफल", "गोचर", "शनी", "मुहूर्त", "अहवाल", "रुद्राक्ष-यंत्र", "दैनिक शुभ", "दैनिकी", "ब्लॉग", "प्रशासक", "शनी साडेसाती"],
  bn: ["কুণ্ডলী", "কুণ্ডলী চার্ট", "লো শু গ্রিড", "মিলন", "বর্ষফল", "রাশিফল", "গোচর", "শনি", "মুহূর্ত", "রিপোর্ট", "রুদ্রাক্ষ-যন্ত্র", "দৈনিক শুভ", "ক্যালেন্ডার", "ব্লগ", "অ্যাডমিন", "শনি সদে সাতি"],
  te: ["కుండలి", "కుండలి చార్ట్‌లు", "లో షూ గ్రిడ్", "సరిపోలు", "వర్షఫలం", "రాశిఫల్", "గోచరం", "శని", "ముహూర్తం", "నివేదిక", "రుద్రాక్ష-యంత్రం", "రోజువారీ శుభం", "క్యాలెండర్", "బ్లాగ్", "అడ్మిన్", "శని సదే సాతి"],
  ta: ["குண்டளி", "குண்டளி வரைபடங்கள்", "லோ சு கிரிட்", "பொருத்தம்", "ஆண்டுபலன்", "ராசிபல்", "கோசர்", "சனி", "முஹூர்த்தம்", "அறிக்கை", "ருத்ராக்ஷ-யந்திர", "நாள் நல்ல", "நாட்காட்டி", "வலைப்பதிவு", "நிர்வாகம்", "சனி சதைஸதி"],
  gu: ["કુંડલી", "કુંડલી ચાર્ટ", "લો શુ ગ્રિડ", "મિલન", "વર્ષફળ", "રાશિફલ", "ગોચર", "શનિ", "મુહૂર્ત", "રિપોર્ટ", "રુદ્રાક્ષ-યંત્ર", "દૈનિક શુભ", "કૅલેન્ડર", "બ્લોગ", "એડમિન", "શનિ સતી"],
  ur: ["کنڈلی", "کنڈلی چارٹس", "لو شو گرڈ", "ملاقات", "سالی فیل", "راشی فال", "گوچر", "شنى", "میوقت", "رپورٹ", "رُद्रاکش-یانترا", "روزانہ مبارک", "کیلنڈر", "بلاگ", "ایڈمن", "شنبہ سادے ساتی"],
  kn: ["ಕುಂಡಲಿ", "ಕುಂಡಲಿ ಚಾರ್ಟ್‌ಗಳು", "ಲೋ ಶೂ ಗ್ರಿಡ್", "ಹೊಂದಾಣಿಕೆ", "ವರ್ಷಫಲ", "ರಾಶಿಫಲ", "ಗೋಚರ", "ಶನಿ", "ಮುಹೂರ್ತ", "ವರದಿ", "ರುದ್ರಾಕ್ಷ-ಯಂತ್ರ", "ದೈನಂದಿನ ಶುಭ", "ಕ್ಯಾಲೆಂಡರ್", "ಬ್ಲಾಗ್", "ಅಡ್ಮಿನ್", "ಶನಿ ಸಾಡೇಸಾತಿ"],
  ml: ["കുണ്ഡളി", "കുണ്ഡളി ചാർട്ടുകൾ", "ലോ ഷൂ ഗ്രിഡ്", "പൊരുത്തം", "വർഷഫലം", "രാശിഫലം", "ഗോചരം", "ശനി", "മുഹൂർത്തം", "റിപ്പോർട്ട്", "രുദ്രാക്ഷം-യന്ത്രം", "ദിനംദി ശുഭം", "കലണ്ടർ", "ബ്ലോഗ്", "അഡ്മിൻ", "ശനി സാഡേസാതി"],
  pa: ["ਕੁੰਡਲੀ", "ਕੁੰਡਲੀ ਚਾਰਟ", "ਲੋ ਸ਼ੂ ਗ੍ਰਿਡ", "ਮਿਲਾਪ", "ਵਰਸ਼ਫਲ", "ਰਾਸ਼ੀਫਲ", "ਗੋਚਰ", "ਸ਼ਨਿ", "ਮਹੂਰਤ", "ਰਿਪੋਰਟ", "ਰੁਦਰਾਖ਼-ਯੰਤਰ", "ਰੋਜ਼ਾਨਾ ਸ਼ੁਭ", "ਕੈਲੰਡਰ", "ਬਲਾਗ", "ਐਡਮਿਨ", "ਸ਼ਨਿ ਸਾਢੇਸਾਤੀ"],
  or: ["କୁଣ୍ଡଳୀ", "କୁଣ୍ଡଳୀ ଚାର୍ଟ", "ଲୋ ଶୁ ଗ୍ରିଡ୍", "ମିଳାନ", "ବର୍ଷଫଳ", "ରାଶିଫଲ", "ଗୋଚର", "ଶନି", "ମୁହୂର୍ତ୍ତ", "ରିପୋର୍ଟ", "ରୁଦ୍ରାକ୍ଷ-ଯନ୍ତ୍ର", "ଦୈନିକ ଶୁଭ", "କାଲେଣ୍ଡର", "ବ୍ଲଗ୍", "ଆଡମିନ", "ଶନି ସାଢେସାତୀ"],
  as: ["কুণ্ডলী", "কুণ্ডলী চাৰ্ট", "লো শু গ্ৰিড", "মিলন", "বৰষফল", "ৰাশিফল", "গোচৰ", "শনি", "মুহূৰ্ত", "ৰিপ'ৰ্ট", "ৰুদ্ৰাক্ষ-যন্ত্ৰ", "দৈনিক শুভ", "কেলেণ্ডাৰ", "ব্লগ", "এডমিন", "শনি সাদে সতি"],
};
const KEYS = ["nav_kundli_page", "nav_charts", "nav_loshu", "nav_match", "nav_varshphal",
  "nav_rashifal", "nav_gochar", "nav_shani", "nav_muhurat", "nav_reports", "nav_remedies",
  "nav_daily", "nav_calendar", "nav_blog", "nav_admin", "nav_shani_title"];
const toPair = (arr) => KEYS.map((k, i) => `${k}: "${arr[i]}"`).join(", ");

const P = "src/i18n/translations.js";
const lines = readFileSync(P, "utf8").split(/\r?\n/);
const out = [];
const done = new Set();
const skipped = [];

for (let i = 0; i < lines.length; i++) {
  const ln = lines[i];
  out.push(ln);
  const m = ln.match(/^ {2}(en|hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as):\s*(mk\(\{|\{)/);
  if (!m || done.has(m[1]) || !NAV[m[1]]) continue;
  // agle 4 lines me pehle se nav_kundli_page daali hui? (idempotency)
  const look = lines.slice(i + 1, i + 5).join("\n");
  if (/nav_kundli_page:/.test(look)) { done.add(m[1]); skipped.push(m[1]); continue; }
  out.push(`    ${toPair(NAV[m[1]])},`);
  done.add(m[1]);
}

// English base (const EN = { ... }) me alag se
if (!/nav_kundli_page:/.test(lines.slice(0, 80).join("\n"))) {
  const at = lines.findIndex((l) => l.includes('nav_experts: "Experts"'));
  if (at >= 0) {
    lines.splice(at + 1, 0, `  ${toPair(NAV.en)},`);
    done.add("en");
  }
}

writeFileSync(P, out.join("\n"));
console.log(`added to ${done.size}/13 blocks (skipped already-done: ${skipped.join(",") || "none"})`);