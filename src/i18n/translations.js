// UI translations for English + scheduled Indian languages.
// Missing keys fall back to English.

export const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "mai", name: "Maithili", native: "मैथिली" },
  { code: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "ks", name: "Kashmiri", native: "कॉशुर" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "sd", name: "Sindhi", native: "سنڌي" },
  { code: "doi", name: "Dogri", native: "डोगरी" },
  { code: "mni", name: "Manipuri", native: "ꯃꯤꯇꯩ ꯂꯣꯟ" },
  { code: "brx", name: "Bodo", native: "बड़ो" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
];

const EN = {
  app_name: "Numerology VIP",
  nav_home: "Home",
  nav_calculator: "Calculator",
  nav_gallery: "Gallery",
  nav_about: "About",
  nav_contact: "Contact",
  nav_dashboard: "Dashboard",
  nav_experts: "Experts",
  nav_chat: "AI Chat",
  nav_login: "Login",
  nav_logout: "Logout",
  hero_title: "Discover the Power of Numbers",
  hero_sub: "Numerology reveals hidden patterns in names, birthdates and choices. Calculate your core numbers and talk to experts.",
  hero_cta: "Calculate Now",
  hero_cta2: "Talk to Expert",
  calc_title: "Numerology Calculator",
  calc_name: "Full Name",
  calc_dob: "Date of Birth",
  calc_mobile: "Mobile / Vehicle (optional)",
  calc_button: "Calculate",
  calc_reset: "Reset",
  result_title: "Your Core Numbers",
  gallery_title: "Image Gallery",
  gallery_upload: "Upload Image",
  gallery_refresh: "Refresh",
  gallery_empty: "No images yet.",
  about_title: "About Numerology",
  contact_title: "Contact Us",
  contact_name: "Name",
  contact_email: "Email",
  contact_message: "Message",
  contact_send: "Send",
  contact_success: "Message sent!",
  dashboard_title: "My Dashboard",
  experts_title: "Expert Guidance",
  chat_title: "AI Numerologist Chat",
  ai_placeholder: "Ask about your numbers...",
  language: "Language",
  loading: "Loading...",
  error_generic: "Something went wrong.",
  login_title: "Login / Sign Up",
  email: "Email",
  password: "Password",
  sign_in: "Sign In",
  sign_up: "Sign Up",
  google_signin: "Continue with Google",
  save_reading: "Save Reading",
  saved_readings: "Saved Readings",
  book_session: "Book Session",
  no_account: "No account yet?",
};

const make = (obj) => ({ ...EN, ...obj });

const HI = make({
  app_name: "न्यूमरोलॉजी वीआईपी",
  nav_home: "होम",
  nav_calculator: "कैलकुलेटर",
  nav_gallery: "गैलरी",
  nav_about: "हमारे बारे में",
  nav_contact: "संपर्क",
  nav_dashboard: "डैशबोर्ड",
  nav_experts: "विशेषज्ञ",
  nav_chat: "एआई चैट",
  nav_login: "लॉगिन",
  nav_logout: "लॉगआउट",
  hero_title: "संख्याओं की शक्ति जानें",
  hero_sub: "न्यूमरोलॉजी नाम, जन्मतिथि और चयन के पीछे छुपे पैटर्न बताती है। अपने मूल अंक जानें और विशेषज्ञों से बात करें।",
  hero_cta: "अभी गणना करें",
  hero_cta2: "विशेषज्ञ से बात करें",
  calc_title: "न्यूमरोलॉजी कैलकुलेटर",
  calc_name: "पूरा नाम",
  calc_dob: "जन्मतिथि",
  calc_mobile: "मोबाइल / वाहन (वैकल्पिक)",
  calc_button: "गणना करें",
  calc_reset: "रीसेट",
  result_title: "आपके मूल अंक",
  gallery_title: "चित्र गैलरी",
  gallery_upload: "चित्र अपलोड करें",
  gallery_refresh: "रिफ्रेश",
  gallery_empty: "अभी तक कोई चित्र नहीं।",
  about_title: "न्यूमरोलॉजी के बारे में",
  contact_title: "संपर्क करें",
  contact_send: "भेजें",
  contact_success: "संदेश भेजा गया!",
  dashboard_title: "मेरा डैशबोर्ड",
  experts_title: "विशेषज्ञ मार्गदर्शन",
  chat_title: "एआई न्यूमरोलॉजिस्ट चैट",
  ai_placeholder: "अपने अंकों के बारे में पूछें...",
  language: "भाषा",
  loading: "लोड हो रहा है...",
  login_title: "लॉगिन / साइन अप",
  sign_in: "साइन इन",
  sign_up: "साइन अप",
  google_signin: "गूगल से जारी रखें",
  save_reading: "रीडिंग सेव करें",
  saved_readings: "सेव की गई रीडिंग्स",
  book_session: "सेशन बुक करें",
});

// For all other Indian languages we provide translated core labels.
const generic = (langLabels) => make(langLabels);

const BN = generic({
  nav_home: "হোম", nav_calculator: "ক্যালকুলেটর", nav_gallery: "গ্যালারি", nav_about: "আমাদের সম্পর্কে", nav_contact: "যোগাযোগ", nav_dashboard: "ড্যাশবোর্ড", nav_experts: "বিশেষজ্ঞ", nav_chat: "এআই চ্যাট", nav_login: "লগইন", nav_logout: "লগআউট",
  hero_title: "সংখ্যার শক্তি জানুন", hero_cta: "এখনই হিসাব করুন", calc_title: "নিউমেরোলজি ক্যালকুলেটর", calc_name: "পূর্ণ নাম", calc_dob: "জন্মতারিখ", calc_button: "হিসাব করুন", result_title: "আপনার মূল সংখ্যা", loading: "লোড হচ্ছে...", language: "ভাষা",
});
const TE = generic({
  nav_home: "హోమ్", nav_calculator: "కాలిక్యులేటర్", nav_gallery: "గ్యాలరీ", nav_about: "గురించి", nav_contact: "సంప్రదించండి", nav_dashboard: "డ్యాష్‌బోర్డ్", nav_experts: "నిపుణులు", nav_chat: "ఏఐ చాట్", nav_login: "లాగిన్", nav_logout: "లాగౌట్",
  hero_title: "సంఖ్యల శక్తిని తెలుసుకోండి", hero_cta: "ఇప్పుడు లెక్కించండి", calc_title: "న్యూమరాలజీ కాలిక్యులేటర్", calc_name: "పూర్తి పేరు", calc_dob: "పుట్టిన తేదీ", calc_button: "లెక్కించు", result_title: "మీ మూల సంఖ్యలు", loading: "లోడవుతోంది...", language: "భాష",
});
const MR = generic({
  nav_home: "होम", nav_calculator: "कॅल्क्युलेटर", nav_gallery: "गॅलरी", nav_about: "आमच्याबद्दल", nav_contact: "संपर्क", nav_dashboard: "डॅशबोर्ड", nav_experts: "तज्ज्ञ", nav_chat: "एआय चॅट", nav_login: "लॉगिन", nav_logout: "लॉगआउट",
  hero_title: "संख्यांची शक्ती जाणून घ्या", hero_cta: "आता गणना करा", calc_title: "न्यूमरोलॉजी कॅल्क्युलेटर", calc_name: "पूर्ण नाव", calc_dob: "जन्मतारीख", calc_button: "गणना", result_title: "तुमचे मूल अंक", loading: "लोड होत आहे...", language: "भाषा",
});
const TA = generic({
  nav_home: "முகப்பு", nav_calculator: "கால்குலேட்டர்", nav_gallery: "கேலரி", nav_about: "எங்களைப் பற்றி", nav_contact: "தொடர்பு", nav_dashboard: "டாஷ்போர்ட்", nav_experts: "நிபுணர்கள்", nav_chat: "AI சாட்", nav_login: "உள்நுழை", nav_logout: "வெளியேறு",
  hero_title: "எண்களின் சக்தி", hero_cta: "இப்போது கணக்கிடு", calc_title: "எண் கணிதம்", calc_name: "முழு பெயர்", calc_dob: "பிறந்த தேதி", calc_button: "கணக்கிடு", result_title: "உங்கள் மூல எண்கள்", loading: "ஏற்றுகிறது...", language: "மொழி",
});
const GU = generic({
  nav_home: "હોમ", nav_calculator: "કેલ્ક્યુલેટર", nav_gallery: "ગેલરી", nav_about: "અમારા વિશે", nav_contact: "સંપર્ક", nav_dashboard: "ડેશબોર્ડ", nav_experts: "નિષ્ણાત", nav_chat: "એઆઈ ચેટ", nav_login: "લૉગિન", nav_logout: "લૉગઆઉટ",
  hero_title: "અંકોની શક્તિ", hero_cta: "હમણાં ગણતરી કરો", calc_title: "ન્યુમરોલોજી કેલ્ક્યુલેટર", calc_name: "પૂરું નામ", calc_dob: "જન્મતારીખ", calc_button: "ગણતરી", result_title: "તમારા મૂળ અંક", loading: "લોડ થઈ રહ્યું છે...", language: "ભાષા",
});
const UR = generic({
  nav_home: "ہوم", nav_calculator: "کیلکولیٹر", nav_gallery: "گیلری", nav_about: "ہمارے بارے", nav_contact: "رابطہ", nav_dashboard: "ڈیش بورڈ", nav_experts: "ماہر", nav_chat: "AI چیٹ", nav_login: "لاگ ان", nav_logout: "لاگ آؤٹ",
  hero_title: "اعداد کی طاقت", hero_cta: "ابھی حساب کریں", calc_title: "نیومرولوجی کیلکولیٹر", calc_name: "پورا نام", calc_dob: "تاریخِ پیدائش", calc_button: "حساب", result_title: "آپ کے بنیادی اعداد", loading: "لوڈ ہو رہا ہے...", language: "زبان",
});
const KN = generic({
  nav_home: "ಮುಖಪುಟ", nav_calculator: "ಕ್ಯಾಲ್ಕುಲೇಟರ್", nav_gallery: "ಗ್ಯಾಲರಿ", nav_about: "ನಮ್ಮ ಬಗ್ಗೆ", nav_contact: "ಸಂಪರ್ಕ", nav_dashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್", nav_experts: "ತಜ್ಞರು", nav_chat: "AI ಚಾಟ್", nav_login: "ಲಾಗಿನ್", nav_logout: "ಲಾಗ್ ಔಟ್",
  hero_title: "ಸಂಖ್ಯೆಗಳ ಶಕ್ತಿ", hero_cta: "ಈಗ ಲೆಕ್ಕಿಸಿ", calc_title: "ನ್ಯೂಮರಾಲಜಿ", calc_name: "ಪೂರ್ಣ ಹೆಸರು", calc_dob: "ಹುಟ್ಟಿದ ದಿನ", calc_button: "ಲೆಕ್ಕ", result_title: "ನಿಮ್ಮ ಮೂಲ ಸಂಖ್ಯೆಗಳು", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", language: "ಭಾಷೆ",
});
const OR = generic({
  nav_home: "ହୋମ", nav_calculator: "କାଲକୁଲେଟର", nav_gallery: "ଗ୍ୟାଲେରୀ", nav_about: "ଆମ ବିଷୟରେ", nav_contact: "ଯୋଗାଯୋଗ", nav_dashboard: "ଡ୍ୟାସବୋର୍ଡ", nav_experts: "ବିଶେଷଜ୍ଞ", nav_chat: "AI ଚାଟ", nav_login: "ଲଗଇନ", nav_logout: "ଲଗ ଆଉଟ",
  hero_title: "ସଂଖ୍ୟାର ଶକ୍ତି", hero_cta: "ଏବେ ଗଣନା", calc_title: "ନ୍ୟୁମେରୋଲଜି", calc_name: "ପୂରା ନାମ", calc_dob: "ଜନ୍ମତାରିଖ", calc_button: "ଗଣନା", result_title: "ଆପଣଙ୍କ ମୂଳ ସଂଖ୍ୟା", loading: "ଲୋଡ ହେଉଛି...", language: "ଭାଷା",
});
const ML = generic({
  nav_home: "ഹോം", nav_calculator: "കാൽക്കുലേറ്റർ", nav_gallery: "ഗാലറി", nav_about: "ഞങ്ങളെക്കുറിച്ച്", nav_contact: "ബന്ധപ്പെടുക", nav_dashboard: "ഡാഷ്ബോർഡ്", nav_experts: "വിദഗ്ധർ", nav_chat: "AI ചാറ്റ്", nav_login: "ലോഗിൻ", nav_logout: "ലോഗ് ഔട്ട്",
  hero_title: "സംഖ്യകളുടെ ശക്തി", hero_cta: "ഇപ്പോൾ കണക്കാക്കുക", calc_title: "ന്യൂമറോളജി", calc_name: "മുழു പേര്", calc_dob: "ജന്മതീയതി", calc_button: "കണക്കാക്കു", result_title: "നിങ്ങളുടെ മൂല സംഖ്യകൾ", loading: "ലോഡ് ചെയ്യുന്നു...", language: "ഭാഷ",
});
const PA = generic({
  nav_home: "ਹੋਮ", nav_calculator: "ਕੈਲਕੁਲੇਟਰ", nav_gallery: "ਗੈਲਰੀ", nav_about: "ਸਾਡੇ ਬਾਰੇ", nav_contact: "ਸੰਪਰਕ", nav_dashboard: "ਡੈਸ਼ਬੋਰਡ", nav_experts: "ਮਾਹਿਰ", nav_chat: "AI ਚੈਟ", nav_login: "ਲਾਗਇਨ", nav_logout: "ਲਾਗ ਆਊਟ",
  hero_title: "ਅੰਕਾਂ ਦੀ ਸ਼ਕਤੀ", hero_cta: "ਹੁਣ ਗਣਨਾ ਕਰੋ", calc_title: "ਨਿਊਮਰੋਲੋਜੀ", calc_name: "ਪੂਰਾ ਨਾਮ", calc_dob: "ਜਨਮ ਤਾਰੀਖ", calc_button: "ਗਣਨਾ", result_title: "ਤੁਹਾਡੇ ਮੂਲ ਅੰਕ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", language: "ਭਾਸ਼ਾ",
});
const AS = generic({
  nav_home: "হোম", nav_calculator: "কেলকুলেটৰ", nav_gallery: "গেলাৰী", nav_about: "আমাৰ বিষয়ে", nav_contact: "যোগাযোগ", nav_dashboard: "ডেশ্বব'ৰ্ড", nav_experts: "বিশেষজ্ঞ", nav_chat: "AI চেট", nav_login: "লগইন", nav_logout: "লগ আউট",
  hero_title: "সংখ্যাৰ শক্তি", hero_cta: "এতিয়াই গণনা", calc_title: "নিউমেৰলজি", calc_name: "সম্পূৰ্ণ নাম", calc_dob: "জন্ম তাৰিখ", calc_button: "গণনা", result_title: "আপোনাৰ মূল সংখ্যা", loading: "লোড হৈ আছে...", language: "ভাষা",
});
// remaining: use EN fallback but keep names
const REST = () => EN;

export const translations = {
  en: EN, hi: HI, bn: BN, te: TE, mr: MR, ta: TA, gu: GU, ur: UR,
  kn: KN, or: OR, ml: ML, pa: PA, as: AS, mai: HI, sat: EN, ks: UR,
  ne: HI, sd: UR, doi: HI, mni: EN, brx: HI, sa: HI,
};
