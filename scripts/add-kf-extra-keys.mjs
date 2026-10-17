// Naye labels — varshphal scope, lal kitab, ratna recommendation,
// shubh/ashubh ke asli time. Pehle inme se koi key hi nahi tha.
import fs from "node:fs";

const FILE = "scripts/kf-source.json";   // source of truth: kfTX("en")
const SRC = "src/i18n/kundliFullTX.js";

// ── English (source) ──
const EN = {
  k_niji_saal: "Your personal year",
  k_calendar_year: "Calendar year",
  k_chalu_saal: "running now",

  k_lk_bhavfal: "Result in this house",
  k_lk_rogi: "Trouble it may cause",
  k_lk_daan: "Donation (daan)",
  k_lk_puja: "Worship (puja)",
  k_lk_mantra: "Mantra",
  k_lk_time: "Best time",
  k_lk_base: "Base remedy:",
  k_lk_first: "do first",
  k_lk_urgent: "urgent",
  k_lk_normal: "normal",

  k_gem_recommend: "Recommended for you",
  k_gem_none: "No gemstone is strongly indicated for this chart. Remedies (mantra, daan, seva) work better than a stone here.",
  k_gem_max3: "Wear at most three stones, and only one at a time. Try each for 3 months before adding another. Stones for Rahu or Ketu (Gomed, Lehsunia) are not advised.",
  k_k_status: "Should you wear it?",
  k_gem_yes: "Yes",
  k_gem_no: "No",
  k_gem_maybe: "Optional",

  note_shubh_src: "All times are calculated from your birth city's sunrise and sunset, so they differ from the usual panchang times.",
  note_no_time: "Birth time and place are needed to calculate real timings. Please enter both.",
};

// ── 10 bhasha + hi/mr — sirf naye keys, purane wahi rehte hain ──
const T = {
  hi: {
    k_niji_saal: "आपका निजी वर्ष", k_calendar_year: "कैलेंडर वर्ष", k_chalu_saal: "अभी चल रहा है",
    k_lk_bhavfal: "इस भाव में फल", k_lk_rogi: "किन कष्ट हो सकते हैं",
    k_lk_daan: "दान", k_lk_puja: "पूजा", k_lk_mantra: "मंत्र", k_lk_time: "उत्तम समय",
    k_lk_base: "मूल उपाय:", k_lk_first: "सबसे पहले", k_lk_urgent: "ज़रूरी", k_lk_normal: "सामान्य",
    k_gem_recommend: "आपके लिए सुझाया गया", k_k_status: "पहनना चाहिए?",
    k_gem_yes: "हाँ", k_gem_no: "नहीं", k_gem_maybe: "वैकल्पिक",
    note_shubh_src: "सभी समय आपके जन्म स्थान की सूर्योदय-सूर्यास्त से निकाले गए हैं, इसलिए सामान्य पंचांग से अलग हैं।",
    note_no_time: "असली समय निकालने के लिए जन्म समय और स्थान दोनों चाहिए। कृपया दोनों भरें।",
  },
  mr: {
    k_niji_saal: "तुमचा वैयक्तिक वर्ष", k_calendar_year: "कॅलेंडर वर्ष", k_chalu_saal: "सध्या चालू",
    k_lk_bhavfal: "या भावातील फळ", k_lk_rogi: "कोणते त्रास होऊ शकतात",
    k_lk_daan: "दान", k_lk_puja: "पूजा", k_lk_mantra: "मंत्र", k_lk_time: "उत्तम वेळ",
    k_lk_base: "मूळ उपाय:", k_lk_first: "सर्वात आधी", k_lk_urgent: "अत्यंत आवश्यक", k_lk_normal: "सामान्य",
    k_gem_recommend: "तुमच्यासाठी शिफारस", k_k_status: "घालायचे का?",
    k_gem_yes: "होय", k_gem_no: "नाही", k_gem_maybe: "ऐच्छिक",
    note_shubh_src: "सर्व वेळ तुमच्या जन्मस्थानच्या सूर्योद्य-सूर्यास्तावरून काढल्या आहेत, म्हणून पंचांगातील वेळेपेक्षा वेगळ्या आहेत.",
    note_no_time: "खरी वेळ काढण्यासाठी जन्म वेळ आणि स्थान दोन्ही आवश्यक आहेत.",
  },
  bn: {
    k_niji_saal: "আপনার ব্যক্তিগত বছর", k_calendar_year: "ক্যালেন্ডার বছর", k_chalu_saal: "এখন চলছে",
    k_lk_bhavfal: "এই ভবে ফল", k_lk_rogi: "কী কষ্ট হতে পারে",
    k_lk_daan: "দান", k_lk_puja: "পূজা", k_lk_mantra: "মন্ত্র", k_lk_time: "উত্তম সময়",
    k_lk_base: "মূল উপায়:", k_lk_first: "আগে করুন", k_lk_urgent: "জরুরি", k_lk_normal: "সাধারণ",
    k_gem_recommend: "আপনার জন্য পরামর্শ", k_k_status: "পরবে?",
    k_gem_yes: "হ্যাঁ", k_gem_no: "না", k_gem_maybe: "ঐচ্ছিক",
    note_shubh_src: "সব সময় আপনার জন্মস্থানের সূর্যোদয়-সূর্যাস্ত থেকে হিসাব করা, তাই সাধারণ পঞ্চাঙ্গের চেয়ে আলাদা।",
    note_no_time: "আসল সময় বের করতে জন্মের সময় ও স্থান দুটোই দরকার।",
  },
  ta: {
    k_niji_saal: "உங்கள் தனிப்பட்ட ஆண்டு", k_calendar_year: "காலண்டர் ஆண்டு", k_chalu_saal: "இப்போது நடக்கிறது",
    k_lk_bhavfal: "இந்த பாவத்தில் விளைவு", k_lk_rogi: "என்ன துன்பங்கள் ஏற்படலாம்",
    k_lk_daan: "தானம்", k_lk_puja: "பூஜை", k_lk_mantra: "மந்திரம்", k_lk_time: "சிறந்த நேரம்",
    k_lk_base: "அடிப்படை சிகிச்சை:", k_lk_first: "முதலில் செய்ய", k_lk_urgent: "அவசரம்", k_lk_normal: "சாதாரண",
    k_gem_recommend: "உங்களுக்குப் பரிந்துரை", k_k_status: "அணியவா?",
    k_gem_yes: "ஆம்", k_gem_no: "இல்லை", k_gem_maybe: "விருப்பம்",
    note_shubh_src: "அனைத்து நேரங்களும் உங்கள் பிறந்த இடத்தின் சூரியோதயம்-சூரிய அஸ்தமனத்திலிருந்து கணக்கிடப்பட்டவை.",
    note_no_time: "உண்மையான நேரத்தைக் கணக்கிட பிறந்த நேரமும் இடமும் இரண்டும் தேவை.",
  },
  te: {
    k_niji_saal: "మీ వ్యక్తిగత సంవత్సరం", k_calendar_year: "క్యాలెండర్ సంవత్సరం", k_chalu_saal: "ఇప్పుడు కొనసాగుతోంది",
    k_lk_bhavfal: "ఈ భావంలో ఫలితం", k_lk_rogi: "ఏ బాధలు రావచ్చు",
    k_lk_daan: "దానం", k_lk_puja: "పూజ", k_lk_mantra: "మంత్రం", k_lk_time: "మంచి సమయం",
    k_lk_base: "ప్రాథమిక పరిహారం:", k_lk_first: "ముందుగా", k_lk_urgent: "అత్యవసరం", k_lk_normal: "సాధారణం",
    k_gem_recommend: "మీకు సిఫార్సు", k_k_status: "ధరించాలా?",
    k_gem_yes: "అవును", k_gem_no: "కాదు", k_gem_maybe: "ఐచ్ఛికం",
    note_shubh_src: "అన్ని సమయాలు మీ పుట్టుకోళ్ళ సూర్యోదయం-సూర్యాస్తం నుండి లెక్కించబడ్డాయి.",
    note_no_time: "నిజమైన సమయం కోసం పుట్టుకోళ్ళ సమయం మరియు స్థానం రెండూ కావాలి.",
  },
  gu: {
    k_niji_saal: "તમારું વ્યક્તિગત વર્ષ", k_k_status: "ધારવું?",
  },
  ur: { k_niji_saal: "آپ کا ذاتی سال", k_k_status: "پہننا چاہیے؟" },
  kn: { k_niji_saal: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವರ್ಷ", k_k_status: "ಧರಿಸಬೇಕೇ?" },
  or: { k_niji_saal: "ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ବର୍ଷ", k_k_status: "ପିନିବେ?" },
  ml: { k_niji_saal: "നിങ്ങളുടെ സ്വകാര്യ വർഷം", k_k_status: "ധരിക്കണോ?" },
  pa: { k_niji_saal: "ਤੁਹਾਡਾ ਨਿੱਜੀ ਸਾਲ", k_k_status: "ਪਾਉਣਾ ਚਾਹੀਦਾ?" },
  as: { k_niji_saal: "আপোনাৰ ব্যক্তিগত বছৰ", k_k_status: "পিনিব লাগিব নেকি?" },
};

// English + hi/mr source file me add karo (kf-source.json se keys le kar)
const src = fs.readFileSync(SRC, "utf8");

// pehle: JSON me naye English keys daalo (taaki agents/validators ko dikhe)
const json = JSON.parse(fs.readFileSync(FILE, "utf8"));
for (const [k, v] of Object.entries(EN)) {
  if (!(k in json.source)) {
    json.source[k] = v;
    json.keys.push(k);
  }
}
fs.writeFileSync(FILE, JSON.stringify(json, null, 2), "utf8");

console.log("kf-source.json: +" + Object.keys(EN).length + " naye English keys");
console.log("total keys ab:", json.keys.length);
console.log("");
console.log("Agli step: kundliFullTX.js me EN + HI + MR add karne hain.");
console.log("Translations:", Object.keys(T).join(", "));
void T;
