// Admin "empty state" labels — 13 bhasha.
// Pehle wala version galat tha (findIndex poore file me dhundhta tha).
// Is baar: (1) purani lines hatao, (2) har block ke andar insert karo.
import { readFileSync, writeFileSync } from "node:fs";

const M = {
  hi: { adm_none_booking: "अभी कोई बुकिंग नहीं है।", adm_none_inquiry: "अभी कोई पूछताछ नहीं है।", adm_none_photo: "कोई लंबित फ़ोटो नहीं है।", adm_none_review: "कोई लंबित समीक्षा नहीं है।", adm_social_help: "अपने पेज/प्रोफ़ाइल का पूरा लिंक डालें। खाली छोड़ने पर आइकॉन छिप जाएगा।" },
  mr: { adm_none_booking: "अद्यापर्यंत बुकिंग नाही.", adm_none_inquiry: "अद्यापर्यंत चौकशी नाही.", adm_none_photo: "प्रलंबित फोटो नाहीत.", adm_none_review: "प्रलंबित पुनरावलोकन नाही.", adm_social_help: "तुमच्या पान/प्रोफाइलचा संपूर्ण दुवा टाका. रिकामे ठेवल्यास आयकॉन दिसणार नाही." },
  bn: { adm_none_booking: "এখনও কোনো বুকিং নেই।", adm_none_inquiry: "এখনও কোনো জিজ্ঞাসা নেই।", adm_none_photo: "কোনো অপেক্ষমাণ ছবি নেই।", adm_none_review: "কোনো অপেক্ষমাণ পর্যালোচনা নেই।", adm_social_help: "আপনার পেজ/প্রোফাইলের সম্পূর্ণ লিঙ্ক দিন। খালি রাখলে আইকন লুকিয়ে যাবে।" },
  te: { adm_none_booking: "ఇంకా బుకింగ్‌లు లేవు.", adm_none_inquiry: "ఇంకా ప్రశ్నలు లేవు.", adm_none_photo: "పెండింగ్ ఫోటోలు లేవు.", adm_none_review: "పెండింగ్ సమీక్షలు లేవు.", adm_social_help: "మీ పేజు/ప్రొఫైల్ పూర్తి లింక్ ఇవ్వండి. ఖాళీగా ఉంచితే ఐకన్ దాచవజూపుతుంది." },
  ta: { adm_none_booking: "இன்னும் பதிவுகள் இல்லை.", adm_none_inquiry: "இன்னும் கேள்விகள் இல்லை.", adm_none_photo: "நிலுவையில் உள்ள படங்கள் இல்லை.", adm_none_review: "நிலுவையில் உள்ள மதிப்பீடுகள் இல்லை.", adm_social_help: "உங்கள் பக்கம்/சுயவிவரத்தின் முழு இணைப்பை உள்ளிடவும். காலியாக விட்டால் சின்னம் மறைந்துவிடும்." },
  gu: { adm_none_booking: "હજી કોઈ બુકિંગ નથી.", adm_none_inquiry: "હજી કોઈ પૂછપરછ નથી.", adm_none_photo: "કોઈ બાકી ફોટા નથી.", adm_none_review: "કોઈ બાકી સમીક્ષા નથી.", adm_social_help: "તમારા પેજ/પ્રોફાઇલનું સંપૂર્ણ લિંક મૂકો. ખાલી રાખશો તો આઇકન છુપાઈ જશે." },
  ur: { adm_none_booking: "ابھی کوئی بکنگ نہیں۔", adm_none_inquiry: "ابھی کوئی استفسار نہیں۔", adm_none_photo: "کوئی زیرِ التوا تصویر نہیں۔", adm_none_review: "کوئی زیرِ التوا جائزہ نہیں۔", adm_social_help: "اپنے صفحے/پروفائل کا مکمل لنک درج کریں۔ خالی چھوڑیں تو آئیکن چھپ جائے گا۔" },
  kn: { adm_none_booking: "ಇನ್ನೂ ಯಾವುದೇ ಬುಕಿಂಗ್ ಇಲ್ಲ.", adm_none_inquiry: "ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಇಲ್ಲ.", adm_none_photo: "ಬಾಕಿ ಇರುವ ಫೋಟೋಗಳಿಲ್ಲ.", adm_none_review: "ಬಾಕಿ ಇರುವ ವಿಮರ್ಶೆಗಳಿಲ್ಲ.", adm_social_help: "ನಿಮ್ಮ ಪುಟ/ಪ್ರೊಫೈಲ್‌ನ ಪೂರ್ಣ ಲಿಂಕ್ ಹಾಕಿ. ಖಾಲಿ ಬಿಟ್ಟರೆ ಚಿಹ್ನೆ ಮರೆಯುತ್ತದೆ." },
  ml: { adm_none_booking: "ഇതുവരെ ബുക്കിംഗുകളൊന്നില്ല.", adm_none_inquiry: "ഇതുവരെ ചോദ്യങ്ങളൊന്നില്ല.", adm_none_photo: "തീർമ്മാക്കുന്ന ചിത്രങ്ങളൊന്നില്ല.", adm_none_review: "തീർമ്മാക്കുന്ന അവലോകനങ്ങളൊന്നില്ല.", adm_social_help: "നിങ്ങളുടെ പേജ്/പ്രൊഫൈൽ പൂർണ്ണ ലിങ്ക് നൽകുക. ശൂന്യമായി വിട്ടാൽ ഐക്കൺ മറയും." },
  pa: { adm_none_booking: "ਹਾਲੇ ਕੋਈ ਬੁਕਿੰਗ ਨਹੀਂ।", adm_none_inquiry: "ਹਾਲੇ ਕੋਈ ਪੁੱਛਣ ਨਹੀਂ।", adm_none_photo: "ਕੋਈ ਬਾਕੀ ਤਸਵੀਰ ਨਹੀਂ।", adm_none_review: "ਕੋਈ ਬਾਕੀ ਸਮੀਖਿਆ ਨਹੀਂ।", adm_social_help: "ਆਪਣੀ ਪੇਜ/ਪ੍ਰੋਫਾਈਲ ਦਾ ਪੂਰਾ ਲਿੰਕ ਪਾਓ। ਖਾਲੀ ਛੱਡਿਆ ਤਾਂ ਆਈਕਨ ਲੁਕ ਜਾਵੇਗਾ।" },
  or: { adm_none_booking: "ଏପର୍ଯ୍ୟ କୌଣସି ବୁକିଂ ନାହିଁ।", adm_none_inquiry: "ଏପର୍ଯ୍ୟ କୌଣସି ପଚାରା ନାହିଁ।", adm_none_photo: "ଅପେକ୍ଷିତ ଫଟୋ କୌଣସି ନାହିଁ।", adm_none_review: "ଅପେକ୍ଷିତ ସମୀକ୍ଷା କୌଣସି ନାହିଁ।", adm_social_help: "ଆପଣଙ୍କ ପୃଷ୍ଠା/ପ୍ରୋଫାଇଲର ସମ୍ପୂର୍ଣ୍ଣ ଲିଙ୍କ ଦିଅନ୍ତୁ। ଖାଲି ରଖିଲେ ଆଇକନ ଲୁକାଯିବ।" },
  as: { adm_none_booking: "এতিয়ালৈকে কোনো বুকিং নাই।", adm_none_inquiry: "এতিয়ালৈকে কোনো সুধিটো নাই।", adm_none_photo: "অৰ্ধালম্প বাৰ্তবী ছবি নাই।", adm_none_review: "অৰ্ধালম্প সমীক্ষা নাই।", adm_social_help: "আপোনাৰ পৃষ্ঠা/প্ৰ’ফাইলৰ সম্পূৰ্ণ লিংক দিয়ক। খালী ৰাখিলে আইকন লুকাই যাব।" },
};

const P = "src/i18n/siteTx.js";
let s = readFileSync(P, "utf8");
const lines = s.split(/\r?\n/);

// 1) English base me keys add karo (agar nahi hain)
if (!/adm_none_booking: "No bookings/.test(s)) {
  s = s.replace(
    "  // ---- Common ----",
    `  // ---- Admin empty states ----
  adm_none_booking: "No bookings yet.",
  adm_none_inquiry: "No inquiries yet.",
  adm_none_photo: "No pending photos.",
  adm_none_review: "No pending reviews.",
  adm_social_help: "Paste the full link of your page/profile. Leaving it blank hides the icon.",

  // ---- Common ----`
  );
}

// 2) EXTRA ke andar se SAARI purani adm_none_* lines hatao
let cleaned = readFileSync(P, "utf8").split(/\r?\n/);
const extraStart = cleaned.findIndex((l) => /^const EXTRA = \{/.test(l));
cleaned = cleaned.filter((l, i) => !(i > extraStart && /^\s*adm_(none_booking|none_inquiry|none_photo|none_review|social_help):/.test(l)));

// 3) har bhasha block ke andar apni line insert karo
const out = [];
let n = 0;
let pending = null;
for (const ln of cleaned) {
  const m = ln.match(/^ {2}(hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as): \{$/);
  if (m && M[m[1]]) {
    out.push(ln);
    out.push(`    ${Object.entries(M[m[1]]).map(([k, v]) => `${k}: "${v}"`).join(", ")},`);
    n++;
    pending = m[1];
    continue;
  }
  out.push(ln);
}
void pending;
writeFileSync(P, out.join("\n"));
console.log(`admin empty-state labels written to ${n}/12 blocks`);