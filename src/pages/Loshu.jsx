import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { pgT } from "../i18n/jyotish_b.js";
import { pgX } from "../i18n/jyotish_c.js";
import kundliT from "../i18n/kundli.js";
import { destinyNumber, luckyNumber, reduceNumber } from "../utils/numerology.js";
import { loadProfile, saveProfile } from "../profile/profile.js";
import ShareButtons from "../components/ShareButtons.jsx";

const GRID = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];

const UPAY = {
  hi: {
    1: "आत्मविश्वास बढ़ाओ; रोज सूर्य-नमस्कार करो।", 2: "रिश्तों में धैर्य रखो; चांदी का प्रयोग करो।",
    3: "गुस्सा कंट्रोल करो; हनुमान-चालीसा पढ़ो।", 4: "काम लिखकर योजना बनाओ; हरे रंग का प्रयोग।",
    5: "संतुलन के लिए ध्यान करो।", 6: "परिवार को समय दो; सफेद वस्त्र पहनो।",
    7: "मीठा बोलना सीखो; जल-दान करो।", 8: "बचत की आदत डालो; शनिवार को शनि-सेवा।",
    9: "सेवा-भाव बढ़ाओ; लाल मसूर का दान करो।",
  },
  mr: {
    1: "आत्मविश्वास वाढवा; रोज सूर्यनमस्कार करा.", 2: "नात्यात संयम ठेवा; चांदी वापरा.",
    3: "रागावर ताबा ठेवा; हनुमान-चालिसा वाचा.", 4: "काम लिहून नियोजन करा; हिरवा रंग वापरा.",
    5: "संतुलनासाठी ध्यान करा.", 6: "कुटुंबाला वेळ द्या; पांढरे वस्त्र घाला.",
    7: "गोड बोलायला शिका; जलदान करा.", 8: "बचतीची सवय लावा; शनिवारी शनिसेवा.",
    9: "सेवाभाव वाढवा; लाल मसूर दान करा.",
  },
  bn: {
    1: "আত্মবিশ্বাস বাড়ান; প্রতিদিন সূর্যনমস্কার করুন।", 2: "সম্পর্কে ধৈর্য রাখুন; রূপা ব্যবহার করুন।",
    3: "ক্রোধ নিয়ন্ত্রণে রাখুন; হনুমান চালিশা পাঠ করুন।", 4: "লিখিতভাবে পরিকল্পনা করুন; সবুজ রঙ ব্যবহার করুন।",
    5: "ভারসাম্যের জন্য ধ্যান করুন।", 6: "পরিবারের সময় দিন; সাদা পোশাক পরুন।",
    7: "মিষ্টি কথা বলুন; জল দান করুন।", 8: "নিয়মিত সঞ্চয় করুন; শনিবারে সেবা করুন।",
    9: "অন্যদের সেবা করুন; লাল মসুর দান করুন।",
  },
  te: {
    1: "ఆత్మవిశ్వాసం పెంచండి; ప్రతిరోజు సూర్యనమస్కారం చేయండి.", 2: "సంబంధాల్లో ఓర్పు పాటించండి; వెండి ఉపయోగించండి.",
    3: "ఉగ్రతను నియంత్రించండి; హనుమాన్ చాలీసా చదవండి.", 4: "రాతపత్రికా రూపంలో ప్రణాళికా రూపొందించండి; ఆకుపచ్చ రంగు ఉపయోగించండి.",
    5: "సమతాకు ధ్యానం చేయండి.", 6: "కుటుంబానికి సమయం ఇవ్వండి; తెలుపు దుస్తులు ధరించండి.",
    7: "మాధుర్యంగా మాట్లాడండి; నీటి దానం చేయండి.", 8: "క్రమంగా ఆదా చేయండి; శనివారాలు సేవ చేయండి.",
    9: "ఇతరులకు సేవ చేయండి; ఎరుపు మసూర్ దానం చేయండి.",
  },
  ta: {
    1: "நம்பிக்கையை வளர்க்கவும்; தினமும் சூரிய நமஸ்காரம் செய்யவும்.", 2: "உறவுகளில் பொறுமை கடைபிடியுங்கள்; வெள்ளியைப் பயன்படுத்துங்கள்.",
    3: "சின்பைக் கட்டுப்படுத்துங்கள்; ஹனுமான் சாலீசா ஓதுங்கள்.", 4: "எழுத்து வழியில் திட்டமிடுங்கள்; பச்சை நிறத்தைப் பயன்படுத்துங்கள்.",
    5: "சமநிலைக்கு தியானம் செய்யவும்.", 6: "குடுமத்திற்கு நேரம் அளியுங்கள்; வெள்ளை ஆடை அணியுங்கள்.",
    7: "இனிய சொற்களைப் பேசுங்கள்; நீர் தானம் செய்யுங்கள்.", 8: "தொடர்ந்து சேமிக்கவும்; சனிவாரம் நாட்களில் சேவை செய்யவும்.",
    9: "பிறருக்கு உதவுங்கள்; செம்மசூர் தானம் செய்யுங்கள்.",
  },
  gu: {
    1: "આત્મવિશ્વાસ વધારો; રોજ સૂર્યનમસ્કાર કરો.", 2: "સંબંધોમાં ધૈર્ય રાખો; ચાંદીનો ઉપયોગ કરો.",
    3: "ગુસ્સાને કાબૂમાં રાખો; હનુમાન ચાળીસા વાંચો.", 4: "લખિત રીતે આયોજન કરો; લીલો રંગ વાપરો.",
    5: "સંતુલન માટે ધ્યાન કરો.", 6: "પરિવારને સમય આપો; સફેદ વસ્ત્ર પહેરો.",
    7: "મીઠા બોલો; પાણીનું દાન કરો.", 8: "નિયમિત બચત કરો; શનિવારે સેવા કરો.",
    9: "બીજાની સેવા કરો; લાલ મસૂરનું દાન કરો.",
  },
  ur: {
    1: "اعتماد بڑھائیں؛ روزانہ سورت نمسکار کریں۔", 2: "تعلقات میں صبر رکھیں؛ چاندی استعمال کریں۔",
    3: "غصہ پر قابو رکھیں؛ ہنومان چالیسہ پڑھیں۔", 4: "تحریر میں منصوبہ بنائیں؛ سبز رنگ استعمال کریں۔",
    5: "متوازن رہنے کے لیے مراقبت کریں۔", 6: "خاندان کو وقت دیں؛ سفید کپڑے پہنیں۔",
    7: "پیاری باتیں کہیں؛ پانی کا صدقہ دیں۔", 8: "باقاعدہ بچت کریں؛ ہفتے کے دن شنبہ کو خدمت کریں۔",
    9: "دوسروں کی خدمت کریں؛ سرخ ماسور کا صدقہ دیں۔",
  },
  kn: {
    1: "ಆತ್ಮವಿಶ್ವಾಸ ಹೆಚ್ಚಿಸಿ; ಪ್ರತಿದಿನ ಸೂರ್ಯನಮಸ್ಕಾರ ಮಾಡಿ.", 2: "ಸಂಬಂಧಗಳಲ್ಲಿ ತಾಳ್ಮೆ ಇಡಿ; ಬೆಳ್ಳಿ ಬಳಸಿ.",
    3: "ಕೋಪವನ್ನು ನಿಯಂತ್ರಿಸಿ; ಹನುಮಾನ್ ಚಾಲೀಸಾ ಓದಿ.", 4: "ಬರಹದಲ್ಲಿ ಯೋಜನೆ ಮಾಡಿ; ಹಸಿರು ಬಣ್ಣ ಬಳಸಿ.",
    5: "ಸಮತೆಗೆ ಧ್ಯಾನ ಮಾಡಿ.", 6: "ಕುಟುಂಬಕ್ಕೆ ಸಮಯ ಕೊಡಿ; ಬಿಳಿ ಬಟ್ಟೆ ಧರಿಸಿ.",
    7: "ಸಿಹಿಯಾಗಿ ಮಾತನಾಡಿ; ನೀರು ದಾನ ಮಾಡಿ.", 8: "ನಿಯಮಿತವಾಗಿ ಉಳಿತಿರಿ ಮಾಡಿ; ಶನಿವಾರಗಳಿಗೆ ಸೇವನೆ ಮಾಡಿ.",
    9: "ಇತರರಿಗೆ ಸೇವನೆ ಮಾಡಿ; ಕೆಂಪು ಮಸೂರು ದಾನ ಮಾಡಿ.",
  },
  ml: {
    1: "ആത്മവിശ്വാസം വർദ്ധിപ്പിക്കുക; ദിവസവും സൂര്യനമസ്കാരം ചെയ്യുക.", 2: "ബന്ധങ്ങളിൽ ക്ഷമയുടെ ആശ്രയം ചെയ്യുക; വെള്ളി ഉപയോഗിക്കുക.",
    3: "ഉഗ്രത നിയന്ത്രിക്കുക; ഹനുമാൻ ചാലീസ വായിക്കുക.", 4: "എഴുത്തിൽ പദ്ധതി തയ്യാറാക്കുക; പച്ച നിറം ഉപയോഗിക്കുക.",
    5: "സന്തുലനത്തിന് ധ്യാനിക്കുക.", 6: "കുടുംബത്തിന് സമയം നൽകുക; വെള്ളി വസ്ത്രം ധരിക്കുക.",
    7: "ഇനിയ വാക്കുകൾ പറയുക; ജലം ദാനം ചെയ്യുക.", 8: "പതിനീറാം സഞ്ചയിക്കുക; ശനിദിവാള്‍ സേവനം ചെയ്യുക.",
    9: "മറ്റുളളവർക്ക് സേവനം ചെയ്യുക; ചുവടെക്കറി ദാനം ചെയ്യുക.",
  },
  pa: {
    1: "ਆਤਮਾ ਵਿਸ਼ਵਾਸ ਵਧਾਓ; ਰੋਜ਼ ਸੂਰਜ ਨਮਸਕਾਰ ਕਰੋ।", 2: "ਸੰਬੰਧਾਂ ਵਿੱਚ ਧੀਰਜ ਰੱਖੋ; ਚਾਂਦੀ ਵਰਤੋ।",
    3: "ਗੁੱਸਾ ਕਾਬੂ ਵਿੱਚ ਰੱਖੋ; ਹਨੁਮਾਨ ਚਾਲੀਸਾ ਪੜ੍ਹੋ।", 4: "ਲਿਖਤੀ ਰੂਪ ਵਿੱਚ ਯੋਜਨਾ ਬਣਾਓ; ਹਰਾ ਰੰਗ ਵਰਤੋ।",
    5: "ਸੰਤੁਲਨ ਲਈ ਧਿਆਨ ਕਰੋ।", 6: "ਪਰਿਵਾਰ ਨੂੰ ਸਮਾਂ ਦਿਓ; ਚਿੱਟਾ ਕੱਪੜਾ ਪਾਓ।",
    7: "ਮਿੱਠੀਆਂ ਗੱਲਾਂ ਬੋਲੋ; ਪਾਣੀ ਦਾ ਕਰੋ।", 8: "ਨਿਯਮਿਤ ਬਚਤ ਕਰੋ; ਸ਼ਨਿਵਾਰ ਨੂੰ ਸੇਵਾ ਕਰੋ।",
    9: "ਹੋਰਾਂ ਦੀ ਸੇਵਾ ਕਰੋ; ਲਾਲ ਮਸੂਰ ਦਾਨ ਕਰੋ।",
  },
  or: {
    1: "ଆତ୍ମବିଶ୍ୱାସ ବଢ଼ାନ୍ତୁ; ପ୍ରତ୍ୟେକ ଦିନ ସୂର୍ୟନମସ୍କାର କରନ୍ତୁ।", 2: "ସମ୍ପର୍କରେ ଧୈର୍ଯ୍ୟ ରଖନ୍ତୁ; ଚାଁଦର ବ୍ୟବହାର କରନ୍ତୁ।",
    3: "କ୍ରୋଧ ନିୟନ୍ତ୍ରଣ କରନ୍ତୁ; ହନୁମାନ ଚାଳୀସା ପାଠ କରନ୍ତୁ।", 4: "ଲେଖିତ ଭାବେ ଯୋଜନା କରନ୍ତୁ; ହଳଦିଆ ରଙ୍ଗ ବ୍ୟବହାର କରନ୍ତୁ।",
    5: "ସନ୍ତୁଲନ ପାଇଁ ଧ୍ୟାନ ଦିଅନ୍ତୁ।", 6: "ପରିବାରକୁ ସମୟ ଦିଅନ୍ତୁ; ସଧା ପୋଷାକ ପିନଧନ୍ତୁ।",
    7: "ମଧୁର କଥା କୁହନ୍ତୁ; ଜଳ ଦାନ କରନ୍ତୁ।", 8: "ନିୟମିତ ସଞ୍ଚୟ କରନ୍ତୁ; ଶନିବାରରେ ସେବା କରନ୍ତୁ।",
    9: "ଅନ୍ୟଙ୍କୁ ସେବା କରନ୍ତୁ; ଲାଲ ମସୂର ଦାନ କରନ୍ତୁ।",
  },
  as: {
    1: "আত্মবিশ্বাস বৃদ্ধি কৰক; প্ৰতিদিন সূৰ্য নমস্কাৰ কৰক।", 2: "সম্পৰ্কত সাধাৰণ ধৈৰ্য ধৰক; ৰুপী ব্যবহাৰ কৰক।",
    3: "ক্ষোভ নিয়ন্ত্ৰণ কৰক; হনুমান চালিচিছা পঢ়ক।", 4: "লিখিতভাৱে পৰিকল্পনা কৰক; সেউদীয়া ৰং ব্যৱহাৰ কৰক।",
    5: "সন্তুলনৰ বাবে ধ্যান কৰক।", 6: "পৰিয়ালক সময় দিয়ক; বগালী কাপোড় পিন্ধক।",
    7: "মিঠা কথা কওক; পানীয়ৰ দান কৰক।", 8: "নিয়মিত সঞ্চয় কৰক; শনিবাৰত সেৱা কৰক।",
    9: "অন্যৰ সেৱা কৰক; লাল মসুৰ দান কৰক।",
  },
  en: {
    1: "Build confidence; do Surya-namaskar daily.", 2: "Be patient in relations; use silver.",
    3: "Control anger; read Hanuman-chalisa.", 4: "Plan in writing; use green.",
    5: "Meditate for balance.", 6: "Give time to family; wear white.",
    7: "Speak sweetly; donate water.", 8: "Save regularly; serve on Saturdays.",
    9: "Serve others; donate red lentils.",
  },
};
const VAAR_TX = {
  hi: { 1: "रविवार", 2: "सोमवार", 3: "गुरुवार", 4: "शनिवार", 5: "बुधवार", 6: "शुक्रवार", 7: "मंगलवार", 8: "शनिवार", 9: "मंगलवार" },
  mr: { 1: "रविवार", 2: "सोमवार", 3: "गुरुवार", 4: "शनिवार", 5: "बुधवार", 6: "शुक्रवार", 7: "मंगळवार", 8: "शनिवार", 9: "मंगळवार" },
  bn: { 1: "রবিবার", 2: "সোমবার", 3: "বৃহস্পতিবার", 4: "শনিবার", 5: "বুধবার", 6: "শুক্রবার", 7: "মঙ্গলবার", 8: "শনিবার", 9: "মঙ্গলবার" },
  te: { 1: "ఆదివారం", 2: "సోమవారం", 3: "గురువారం", 4: "శనివారం", 5: "బుధవారం", 6: "శుక్రవారం", 7: "మంగళవారం", 8: "శనివారం", 9: "మంగళవారం" },
  ta: { 1: "ஞாயிறு", 2: "திங்கட்கிழமை", 3: "வியாழக்கிழமை", 4: "சனிக்கிழமை", 5: "புதன்கிழமை", 6: "வெள்ளிக்கிழமை", 7: "செவ்வாய்க்கிழமை", 8: "சனிக்கிழமை", 9: "செவ்வாய்க்கிழமை" },
  gu: { 1: "રવિવાર", 2: "સોમવાર", 3: "ગુરુવાર", 4: "શનિવાર", 5: "બુધવાર", 6: "શુક્રવાર", 7: "મંગળવાર", 8: "શનિવાર", 9: "મંગળવાર" },
  ur: { 1: "اتوار", 2: "پیر", 3: "جمعرات", 4: "ہفتہ", 5: "بدھ", 6: "جمعہ", 7: "منگل", 8: "ہفتہ", 9: "منگل" },
  kn: { 1: "ರವಿವಾರ", 2: "ಸೋಮವಾರ", 3: "ಗುರುವಾರ", 4: "ಶನಿವಾರ", 5: "ಬುಧವಾರ", 6: "ಶುಕ್ರವಾರ", 7: "ಮಂಗಳವಾರ", 8: "ಶನಿವಾರ", 9: "ಮಂಗಳವಾರ" },
  ml: { 1: "ഞായർ", 2: "തിങ്കൾ", 3: "വ്യാഴം", 4: "ശനി", 5: "ബുധൻ", 6: "വെള്ളി", 7: "ചൊവ്വ", 8: "ശനി", 9: "ചൊവ്വ" },
  pa: { 1: "ਐਤਵਾਰ", 2: "ਸੋਮਵਾਰ", 3: "ਗੁਰਵਾਰ", 4: "ਸ਼ਨਿਵਾਰ", 5: "ਬੁੱਧਵਾਰ", 6: "ਸ਼ੁਕਰਵਾਰ", 7: "ਮੰਗਲਵਾਰ", 8: "ਸ਼ਨਿਵਾਰ", 9: "ਮੰਗਲਵਾਰ" },
  or: { 1: "ରବିବାର", 2: "ସୋମବାର", 3: "ଗୁରୁବାର", 4: "ଶନିବାର", 5: "ବୁଧବାର", 6: "ଶୁକ୍ରବାର", 7: "ମଙ୍ଗଳବାର", 8: "ଶନିବାର", 9: "ମଙ୍ଗଳବାର" },
  as: { 1: "ৰবিবাৰ", 2: "সোমবাৰ", 3: "বৃহস্পতিবাৰ", 4: "শনিবাৰ", 5: "বুধবাৰ", 6: "শুক্ৰবাৰ", 7: "মঙ্গলবাৰ", 8: "শনিবাৰ", 9: "মঙ্গলবাৰ" },
  en: { 1: "Sunday", 2: "Monday", 3: "Thursday", 4: "Saturday", 5: "Wednesday", 6: "Friday", 7: "Tuesday", 8: "Saturday", 9: "Tuesday" },
};

function kuaNumber(year, gender) {
  let x = reduceNumber(year, false);
  let k = gender === "female"
    ? (year < 2000 ? 4 : 6) + x
    : (year < 2000 ? 11 : 10) - x;
  k = ((k - 1) % 9 + 9) % 9 + 1;
  if (k === 5) k = gender === "female" ? 8 : 2;
  return k;
}

export default function Loshu() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const X = pgX(lang);
  const L = kundliT(lang);
  const U = UPAY[lang] || UPAY.en;
  const V = pageTX(VAAR_TX, lang);
  const [name, setName] = useState(() => loadProfile().name || "");
  const [dob, setDob] = useState(() => loadProfile().birthdate || "");
  const [gender, setGender] = useState(() => loadProfile().gender || "male");
  const [mobile, setMobile] = useState(() => loadProfile().mobile || "");
  const [r, setR] = useState(null);

  const calc = (e) => {
    e.preventDefault();
    if (!dob) return;
    saveProfile({ name: name.trim(), birthdate: dob, gender, mobile: mobile.trim() });
    const digits = dob.replace(/\D/g, "").split("").map(Number).filter((d) => d !== 0);
    const digitSum = digits.reduce((a, b) => a + b, 0);
    const counts = {};
    digits.forEach((d) => { counts[d] = (counts[d] || 0) + 1; });
    const day = Number(dob.split("-")[2]);
    const year = Number(dob.split("-")[0]);
    const moolank = reduceNumber(day, false);
    const bhagyank = reduceNumber(digitSum, false);
    const grid = { ...counts };
    grid[moolank] = (grid[moolank] || 0) + 1;
    grid[bhagyank] = (grid[bhagyank] || 0) + 1;
    const kua = kuaNumber(year, gender);
    const nameNum = name.trim() ? destinyNumber(name.trim()) : null;
    const lucky = bhagyank;
    const luckyMob = mobile.trim() ? luckyNumber(mobile.trim()) : null;
    const luckyVaar = V[moolank];
    const luckyDates = [];
    for (let d = 1; d <= 31; d++) {
      if (reduceNumber(d, false) === moolank) luckyDates.push(d);
    }
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !grid[n]);
    setR({ counts, grid, digitSum, moolank, bhagyank, kua, nameNum, lucky, luckyMob, luckyVaar, luckyDates, missing });
  };

  return (
    <div>
      <h1 className="text-gradient">{P.pg_grid} + {P.pg_lucky}</h1>
      <p>{P.pg_moolank}, {P.pg_bhagyank}, {P.pg_kua}, {P.pg_namank}, {P.pg_lucky} — {P.pg_grid}.</p>

      <div className="card" style={{ marginTop: 16 }}>
        <form onSubmit={calc} className="grid grid-2">
          <div>
            <label className="label">{L.k_name}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">{L.k_dob} *</label>
            <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>
          <div>
            <label className="label">{L.k_gender}</label>
            <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">{L.k_male}</option>
              <option value="female">{L.k_female}</option>
            </select>
          </div>
          <div>
            <label className="label">{X.pg_mobile}</label>
            <input className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. 9876543210" />
          </div>
          <div>
            <button className="btn" type="submit">{P.pg_grid} {X.pg_build}</button>
          </div>
        </form>
      </div>

      {r && (
        <div style={{ marginTop: 20 }}>
          <div className="grid grid-2">
            <div className="card" style={{ textAlign: "center" }}>
              <h3>{P.pg_grid}</h3>
              <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(3, 84px)", gap: 8, marginTop: 12 }}>
                {GRID.flat().map((n) => (
                  <div key={n} style={{
                    width: 84, height: 84, borderRadius: 12, border: "1px solid var(--border)",
                    background: r.grid[n] ? "linear-gradient(135deg, rgba(139,92,246,.35), rgba(34,211,238,.25))" : "rgba(255,255,255,.03)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "1.7rem", fontWeight: 800, opacity: r.grid[n] ? 1 : 0.35 }}>{n}</span>
                    {r.grid[n] > 1 && <span style={{ fontSize: ".75rem", color: "var(--gold)" }}>×{r.grid[n]}</span>}
                    {(n === r.moolank || n === r.bhagyank) && (
                      <span style={{ fontSize: ".7rem", color: "var(--accent-2)" }}>
                        {n === r.moolank && n === r.bhagyank ? "M+B" : n === r.moolank ? "M" : "B"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: ".8rem", marginTop: 8 }}>M = {P.pg_moolank}, B = {P.pg_bhagyank}.</p>
            </div>

            <div className="card">
              <h3>{P.pg_lucky}</h3>
              <p style={{ fontSize: ".85rem", marginTop: 6 }}>{P.pg_bhagyank} = {r.digitSum} → {r.bhagyank}</p>
              <div style={{ marginTop: 8 }}>
                <div className="kv"><span className="k">{P.pg_moolank}</span><span className="v">{r.moolank}</span></div>
                <div className="kv"><span className="k">{P.pg_bhagyank}</span><span className="v">{r.bhagyank}</span></div>
                <div className="kv"><span className="k">{P.pg_kua}</span><span className="v">{r.kua}</span></div>
                {r.nameNum && <div className="kv"><span className="k">{P.pg_namank}</span><span className="v">{r.nameNum}</span></div>}
                <div className="kv"><span className="k">{P.pg_luckynum}</span><span className="v">{r.lucky}</span></div>
                {r.luckyMob && <div className="kv"><span className="k">{P.pg_luckynum} (mobile)</span><span className="v">{r.luckyMob}</span></div>}
                <div className="kv"><span className="k">{P.pg_luckyvaar}</span><span className="v">{r.luckyVaar}</span></div>
                <div className="kv"><span className="k">{P.pg_dates}</span><span className="v">{r.luckyDates.join(", ")}</span></div>
              </div>
            </div>
          </div>

          {r.missing.length > 0 && (
            <div className="card" style={{ marginTop: 20 }}>
              <h3>{P.pg_missing} ({r.missing.join(", ")}) + {L.k_upay}</h3>
              {r.missing.map((n) => (
                <div key={n} className="kv"><span className="k">{n}</span><span className="v">{U[n]}</span></div>
              ))}
            </div>
          )}

          <ShareButtons title={P.pg_grid} text={`${P.pg_moolank} ${r.moolank}, ${P.pg_bhagyank} ${r.bhagyank}, ${P.pg_kua} ${r.kua}!`} />
        </div>
      )}
    </div>
  );
}
