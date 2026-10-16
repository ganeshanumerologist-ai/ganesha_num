// ShareButtons labels — self-contained + idempotent.
// Pehle ke 2 attempts galat the (positional replace). Ye:
//   1. pehle se maujood SAARI share_* lines hata deta hai (har block se),
//   2. phir har bhasha block me exactly ek apni share line daalta hai.
import { readFileSync, writeFileSync } from "node:fs";

const SH = {
  hi: { share_title: "साझा करें", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram पर एक टैप में साझा करें।", share_copy_link: "लिंक कॉपी करें", share_copy_caption: "कैप्शन कॉपी करें", share_copied: "कॉपी हो गया!", share_phone: "फ़ोन से साझा करें", share_note: "ध्यान दें: Instagram/TikTok/YouTube वेबसाइट से सीधे पोस्ट नहीं करने देते — कैप्शन कॉपी करके वहाँ पेस्ट करें, या नीचे Follow बटन से प्रोफ़ाइल जोड़ें।", share_copy_fail: "कॉपी नहीं हुआ", share_default_msg: "न्यूमेरोलॉजी वीआईपी देखिए!" },
  mr: { share_title: "शेअर करा", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram वर एका टॅपमध्ये शेअर करा.", share_copy_link: "लिंक कॉपी करा", share_copy_caption: "कॅप्शन कॉपी करा", share_copied: "कॉपी झाले!", share_phone: "फोनवरून शेअर", share_note: "लक्षात ठेवा: Instagram/TikTok/YouTube वेबसाइटवरून थेट पोस्ट करू देत नाहीत — कॅप्शन कॉपी करून तिथे पेस्ट करा, किंवा खालील Follow बटनंनून प्रोफाइल जोडा.", share_copy_fail: "कॉपी झालं नाही", share_default_msg: "न्युमेरॉलॉजी व्हीआयपी पहा!" },
  bn: { share_title: "শেয়ার করুন", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram-এ এক ট্যাপেই শেয়ার করুন।", share_copy_link: "লিংক কপি করুন", share_copy_caption: "ক্যাপশন কপি করুন", share_copied: "কপি হয়েছে!", share_phone: "ফোনে শেয়ার", share_note: "লক্ষ্য করুন: Instagram/TikTok/YouTube ওয়েবসাইট থেকে সরাসরি পোস্ট করতে দেয় না — ক্যাপশন কপি করে সেখানে পেস্ট করুন, অথবা নিচের Follow বোতাম দিয়ে প্রোফাইল যুক্ত করুন।", share_copy_fail: "কপি হয়নি", share_default_msg: "নিউমেরোলজি ভিআইপি দেখুন!" },
  te: { share_title: "షేర్ చేయండి", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram వద్ద ఒకే ట్యాప్‌లో షేర్ చేయండి.", share_copy_link: "లింక్ కాపీ చేయండి", share_copy_caption: "క్యాప్షన్ కాపీ చేయండి", share_copied: "కాపీ అయ్యింది!", share_phone: "ఫోన్ ద్వారా షేర్", share_note: "గమనించండి: Instagram/TikTok/YouTube వెబ్‌సైట్ నుండి నేరుగా పోస్ట్ చేయనివ్వదు — క్యాప్షన్ కాపీ చేసి అక్కడ పేస్ట్ చేయండి, లేదా కింద ఉన్న Follow బటన్‌లతో ప్రొఫైల్ జోడించండి.", share_copy_fail: "కాపీ కాలేదు", share_default_msg: "న్యూమెరాలజీ వీఐపీ చూడండి!" },
  ta: { share_title: "பகிரவும்", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram ஆகியவற்றில் ஒரே தட்டில் பகிரவும்.", share_copy_link: "இணைப்பை நகலெடு", share_copy_caption: "தலைப்புரியை நகலெடு", share_copied: "நகலெடுக்கப்பட்டது!", share_phone: "தொலைபேசி மூலம் பகிரவும்", share_note: "கவனிக்கவும்: Instagram/TikTok/YouTube வலைதளத்திலிருந்து நேரடியாக இடுகை செய்ய முடியாது — தலைப்புரியை நகலெடுத்து அங்கு ஒட்டவும், அல்லது கீழே உள்ள Follow பொத்தான்களால் சுயவிவரம் இணைக்கவும்.", share_copy_fail: "நகலெடுக்க முடியவில்லை", share_default_msg: "நியூமராலஜி வீஐபி பாருங்கள்!" },
  gu: { share_title: "શેર કરો", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram પર એક ટેપમાં શેર કરો.", share_copy_link: "લિંક કોપી કરો", share_copy_caption: "કેપ્શન કોપી કરો", share_copied: "કોપી થઈ ગયું!", share_phone: "ફોનથી શેર કરો", share_note: "નોંધો: Instagram/TikTok/YouTube વેબસાઇટથી સીધું પોસ્ટ કરવા દેતું નથી — કેપ્શન કોપી કરી ત્યાં પેસ્ટ કરો, અથવા નીચેના Follow બટનોથી પ્રોફાઇલ જોડો.", share_copy_fail: "કોપી થયું નહીં", share_default_msg: "ન્યુમેરોલોજી વીઆઈપી જુઓ!" },
  ur: { share_title: "شیئر کریں", share_sub: "Facebook، X، LinkedIn، WhatsApp، Telegram پر ایک ٹیپ میں شیئر کریں۔", share_copy_link: "لنک کاپی کریں", share_copy_caption: "کیپشن کاپی کریں", share_copied: "کاپی ہو گیا!", share_phone: "فون سے شیئر", share_note: "نوٹ: Instagram/TikTok/YouTube ویب سائٹ سے براہِ راست پوسٹ نہیں کرنے دیتے — کیپشن کاپی کر کے وہاں پیسٹ کریں، یا نیچے Follow بٹن سے پروفائل جوڑیں۔", share_copy_fail: "کاپی نہیں ہوا", share_default_msg: "نیومرولوجی وی آئی پی دیکھیں!" },
  kn: { share_title: "ಹಂಚಿಕೊಳ್ಳಿ", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram ನಲ್ಲಿ ಒಂದೇ ಟ್ಯಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ.", share_copy_link: "ಲಿಂಕ್ ನಕಲಿಸಿ", share_copy_caption: "ಕ್ಯಾಪ್ಷನ್ ನಕಲಿಸಿ", share_copied: "ನಕಲಾಗಿದೆ!", share_phone: "ಫೋನ್‌ನಿಂದ ಹಂಚಿಕೊಳ್ಳಿ", share_note: "ಗಮನಿಸಿ: Instagram/TikTok/YouTube ವೆಬ್‌ಸೈಟ್‌ನಿಂದ ನೇರವಾಗಿ ಪೋಸ್ಟ್ ಮಾಡಲು ಅನುಮತಿ ಇಲ್ಲ — ಕ್ಯಾಪ್ಷನ್ ನಕಲಿಸಿ ಅಲ್ಲಿ ಅಂಟಿಸಿ, ಅಥವಾ ಕೆಳಗಿನ Follow ಬಟನ್‌ಗಳಿಂದ ಪ್ರೊಫೈಲ್ ಜೋಡಿಸಿ.", share_copy_fail: "ನಕಲಾಗಲಿಲ್ಲ", share_default_msg: "ನ್ಯೂಮರಾಲಜಿ ವಿಐಪಿ ನೋಡಿ!" },
  ml: { share_title: "പങ്കിടുക", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram എന്നിവയിൽ ഒരു ടാപ്പിൽ പങ്കിടുക.", share_copy_link: "ലിങ്ക് പകർത്തുക", share_copy_caption: "ക്യാപ്ഷൻ പകർത്തുക", share_copied: "പകർത്തി!", share_phone: "ഫോണിലൂടെ പങ്കിടുക", share_note: "ശ്രദ്ധിക്കുക: Instagram/TikTok/YouTube വെബ്‌സൈറ്റിൽ നേരിട്ട് പോസ്റ്റ് ചെയ്യാൻ അനുവദില്ല — ക്യാപ്ഷൻ പകർത്തി അവിടെ ഒട്ടിക്കുക, അല്ലെങ്കിൽ താഴെയുള്ള Follow ബട്ടണുകൾ വഴി പ്രൊഫൈൽ ചേർക്കുക.", share_copy_fail: "പകർത്തായില്ല", share_default_msg: "ന്യൂമറോളജി വിഐപി കാണൂ!" },
  pa: { share_title: "ਸਾਂਝਾ ਕਰੋ", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram ਉੱਤੇ ਇੱਕ ਟੈਪ ਵਿੱਚ ਸਾਂਝਾ ਕਰੋ।", share_copy_link: "ਲਿੰਕ ਕਾਪੀ ਕਰੋ", share_copy_caption: "ਕੈਪਸ਼ਨ ਕਾਪੀ ਕਰੋ", share_copied: "ਕਾਪੀ ਹੋ ਗਿਆ!", share_phone: "ਫ਼ੋਨ ਨਾਲ ਸਾਂਝਾ ਕਰੋ", share_note: "ਧਿਆਨ ਦਿਓ: Instagram/TikTok/YouTube ਵੈੱਬਸਾਈਟ ਤੋਂ ਸਿੱਧਾ ਪੋਸਟ ਨਹੀਂ ਕਰਨੇ ਦਿੰਦੇ — ਕੈਪਸ਼ਨ ਕਾਪੀ ਕਰਕੇ ਉੱਥੇ ਪੇਸਟ ਕਰੋ, ਜਾਂ ਹੇਠਾਂ Follow ਬਟਨਾਂ ਨਾਲ ਪ੍ਰੋਫਾਈਲ ਜੋੜੋ।", share_copy_fail: "ਕਾਪੀ ਨਹੀਂ ਹੋਇਆ", share_default_msg: "ਨਿਊਮਰੋਲੋਜੀ ਵੀਆਈਪੀ ਵੇਖੋ!" },
  or: { share_title: "ସାଂଝା କରନ୍ତୁ", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegram ରେ ଏକ ଟ୍ୟାପରେ ସାଂଝା କରନ୍ତୁ।", share_copy_link: "ଲିଙ୍କ କପି କରନ୍ତୁ", share_copy_caption: "କ୍ୟାପ୍ସନ କପି କରନ୍ତୁ", share_copied: "କପି ହେଇଛି!", share_phone: "ଫୋନରୁ ସାଂଝା", share_note: "ଧ୍ୟାନ ଦିଅନ୍ତୁ: Instagram/TikTok/YouTube ଓୱେବସାଇଟରୁ ସିଧାସିଧା ପୋଷ୍ଟ ହେବା ଦିଏନା — କ୍ୟାପ୍ସନ କପି କରି ସେଠାରେ ପେଷ୍ଟ କରନ୍ତୁ, କିମ୍ବା ତଳେ Follow ବଟନରୁ ପ୍ରୋଫାଇଲ ଯୋଡ଼ନ୍ତୁ।", share_copy_fail: "କପି ହେଇଲା ନାହିଁ", share_default_msg: "ନ୍ୟୁମେରୋଲୋଜି ଭିଆଇପି ଦେଖନ୍ତୁ!" },
  as: { share_title: "শেয়াৰ কৰক", share_sub: "Facebook, X, LinkedIn, WhatsApp, Telegramত এক টেপতেই শেয়াৰ কৰক।", share_copy_link: "লিংক কপি কৰক", share_copy_caption: "কেপশন কপি কৰক", share_copied: "কপি হ’ল!", share_phone: "ফ’নৰে শেয়াৰ কৰক", share_note: "লক্ষ্য ৰাখক: Instagram/TikTok/YouTubeৰ পৰা সধাৰে পোষ্ট কৰতে দিয়ে নাই — কেপশন কপি কৰি সেইখানত পেষ্ট কৰক, বা তলত Follow বোতামেৰে প্ৰ’ফাইল যুক্ত কৰক।", share_copy_fail: "কপি হ’ল নাই", share_default_msg: "নিউমেৰলজি ভিআইপি চাওক!" },
};

const P = "src/i18n/siteTx.js";
let lines = readFileSync(P, "utf8").split(/\r?\n/);

// 1) SAARI maujood share_* lines hatao (sirf EXTRA block ke andar — English base me rakhna hai)
const extraStart = lines.findIndex((l) => /^const EXTRA = \{/.test(l));
lines = lines.map((l, i) => {
  if (i < extraStart) return l;
  return /^\s*share_(title|sub|copy_link|copy_caption|copied|phone|note|copy_fail|default_msg):/.test(l) ? null : l;
}).filter((l) => l !== null);

// 2) har bhasha block me exactly ek apni share line daalo
const out = [];
let added = 0;
for (const ln of lines) {
  out.push(ln);
  const m = ln.match(/^ {2}(hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as): \{$/);
  if (!m || !SH[m[1]]) continue;
  out.push(`    ${Object.entries(SH[m[1]]).map(([k, v]) => `${k}: "${v}"`).join(", ")},`);
  added++;
}
writeFileSync(P, out.join("\n"));
console.log(`share labels: ${added}/12 blocks`);