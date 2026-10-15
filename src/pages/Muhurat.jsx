import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { pgT } from "../i18n/jyotish_b.js";
import kundliT from "../i18n/kundli.js";
import { jdFromDateStr, sunTropical, moonTropical, lahiriAyanamsa, rev, nakshatraOf, tithiOf, karanaOf, taraBala } from "../utils/astro.js";
import { MUHURAT_RULES } from "../data/jyotish.js";
import { loadProfile, saveProfile } from "../profile/profile.js";
import { VAAR } from "../data/daily.js";

const KARYAS = Object.keys(MUHURAT_RULES);

const TX = {
  hi: {
    title: "शुभ मुहूर्त", sub: "विवाह, अन्नप्राशन, कर्णवेध, विद्यारंभ — तारीख जांचकर गणना से।",
    dobL: "जातक की जन्मतिथि (तारा-बल हेतु)", dateL: "कार्य की तारीख",
    note: {
      vivah: "रिक्त तिथि (4,9,14), भद्रा/विष्टि करण और मंगल-शनिवार वर्जित। गुरु-शुक्र अस्त काल में विवाह नहीं।",
      annaprashan: "पुत्र हेतु जन्म से सम मास (6,8,10), पुत्री हेतु विषम मास (5,7,9) में संस्कार श्रेष्ठ।",
      karnavedh: "जन्म से 6-8वें मास में संस्कार। शनिवार-मंगलवार वर्जित।",
      vidyarambh: "वसंत पंचमी और अक्षय तृतीया को बिना मुहूर्त शुभ। मंगल-शनिवार वर्जित।",
    },
    name: { vivah: "विवाह मुहूर्त", annaprashan: "अन्नप्राशन मुहूर्त", karnavedh: "कर्णवेध मुहूर्त", vidyarambh: "विद्यारंभ मुहूर्त" },
  },
  mr: {
    title: "शुभ मुहूर्त", sub: "विवाह, अन्नप्राशन, कर्णवेध, विद्यारंभ — तारीख तपासून गणनेतून.",
    dobL: "जातकाची जन्मतारीख (तारा-बलासाठी)", dateL: "कार्याची तारीख",
    note: {
      vivah: "रिक्त तिथी (4,9,14), भद्रा/विष्टी करण आणि मंगळ-शनिवार वर्जित. गुरु-शुक्र अस्त काळात विवाह नाही.",
      annaprashan: "मुलासाठी सम महिन्यात (6,8,10), मुलीसाठी विषम महिन्यात (5,7,9) संस्कार श्रेष्ठ.",
      karnavedh: "जन्मापासून 6-8व्या महिन्यात संस्कार. शनिवार-मंगळवार वर्जित.",
      vidyarambh: "वसंत पंचमी आणि अक्षय्य तृतीया मुहूर्ताशिवाय शुभ. मंगळ-शनिवार वर्जित.",
    },
    name: { vivah: "विवाह मुहूर्त", annaprashan: "अन्नप्राशन मुहूर्त", karnavedh: "कर्णवेध मुहूर्त", vidyarambh: "विद्यारंभ मुहूर्त" },
  },
  bn: {
    title: "শুভ মুহূর্ত", sub: "বিবাহ, অন্নপ্রাশন, কর্ণবেধ, বিদ্যারম্ভ — গণনা করে যাচাই করা।",
    dobL: "জাতকের জন্মতারিখ (তারা-বলের জন্য)", dateL: "অনুষ্ঠানের তারিখ",
    note: {
      vivah: "রিক্ত তিথি (4,9,14), ভদ্রা/বিষ্টি করণ এবং মঙ্গল-শনিবার বর্জন। গুরু-শুক্র অস্ত কালে বিবাহ নয়।",
      annaprashan: "পুরুষ: জন্ম থেকে সম মাস (6,8,10); মেয়ে: বিষম মাস (5,7,9) সংস্কার শ্রেষ্ঠ।",
      karnavedh: "জন্ম থেকে ৬-৮ মাসে সংস্কার। শনি-মঙ্গল বার বর্জন।",
      vidyarambh: "বসন্ত পঞ্চমী ও অক্ষয় তৃতীয়া মুহূর্ত ছাড়াই শুভ। মঙ্গল-শনিবার বর্জন।",
    },
    name: { vivah: "বিবাহ মুহূর্ত", annaprashan: "অন্নপ্রাশন মুহূর্ত", karnavedh: "কর্ণবেধ মুহূর্ত", vidyarambh: "বিদ্যারম্ভ মুহূর্ত" },
  },
  te: {
    title: "శుభ ముహూర్తం", sub: "వివాహం, అన్నప్రాశన, కర్ణవేధ, విద్యారంభం — గణన ద్వారా పరీక్షించబడినవి.",
    dobL: "జాతకుని పుట్టిన తేదీ (తార-బలం కోసం)", dateL: "కార్యక్రమం తేదీ",
    note: {
      vivah: "రిక్త తిథి (4,9,14), భద్ర/విష్టి కరణ మరియు మంగళ-శనివార నిషేధం. గురు-శుక్ర అస్త కాలంలో వివాహం కాదు.",
      annaprashan: "పురుషులు: జనన నుండి సమ మాసాలు (6,8,10); మహిళా: విషమ మాసాలు (5,7,9) సంస్కారం ఉత్తమం.",
      karnavedh: "జనన నుండి 6-8వ నెలలో సంస్కారం. శని-మంగళ వారాలు నిషేధం.",
      vidyarambh: "వసంత పంచమీ మరియు అక్షయ తృతీయా ముహూర్తం లేకుండానే శుభం. మంగళ-శనివార నిషేధం.",
    },
    name: { vivah: "వివాహ ముహూర్తం", annaprashan: "అన్నప్రాశన ముహూర్తం", karnavedh: "కర్ణవేధ ముహూర్తం", vidyarambh: "విద్యారంభ ముహూర్తం" },
  },
  ta: {
    title: "நல்ல நேரம்", sub: "திருமணம், அன்னப்பிரசனம், கார்ணவேதம், விடயரம்பம் — கணக்கீட்டால் சரிபார்க்கப்பட்டவை.",
    dobL: "ஜாதகனின் பிறந்த தேதி (தார-பலம்)", dateL: "சடங்கு தேதி",
    note: {
      vivah: "ரிக்த திதி (4,9,14), பத்ரா/விஷ்டி கரணம் மற்றும் செவ்வாய்-சனிமுன் தவிர்க்கவும். குரு-வெள்ளி அஸ்த காலத்தில் திருமணம் இல்லை.",
      annaprashan: "ஆண்கள்: பிறந்ததிலிருந்து சம மாதங்கள் (6,8,10); பெண்கள்: விசிம மாதங்கள் (5,7,9) சடங்கு சிறந்தது.",
      karnavedh: "பிறந்ததிலிருந்து 6-8ஆம் மாதத்தில் சடங்கு. சனி-செவ்வாய் தவிர்க்கவும்.",
      vidyarambh: "வசந்த பஞ்சமி மற்றும் அட்சய திருதியா முஹூர்த்தமில்லாமே சுபம். செவ்வாய்-சனிமுன் தவிர்க்கவும்.",
    },
    name: { vivah: "திருமண நேரம்", annaprashan: "அன்னப்பிரசன நேரம்", karnavedh: "கார்ணவேத நேரம்", vidyarambh: "விடயரம்ப நேரம்" },
  },
  gu: {
    title: "શુભ મુહૂર્ત", sub: "વિવાહ, અન્નપ્રાશન, કર્ણવેધ, વિદ્યારંભ — ગણતરી કરીને ચકાસાયેલા.",
    dobL: "જાતકની જન્મતારીખ (તારા-બલ માટે)", dateL: "કાર્યની તારીખ",
    note: {
      vivah: "રિક્ત તિથિ (4,9,14), ભદ્રા/વિષ્ટિ કરણ અને મંગળ-શનિવાર વર્જિત। ગુરુ-શુક્ર અસ્ત કાલમાં વિવાહ નહીં.",
      annaprashan: "પુરુષો: જન્મથી સમ મહિના (6,8,10); સ્ત્રીઓ: વિષમ મહિના (5,7,9) સંસ્કાર શ્રેષ્ઠ.",
      karnavedh: "જન્મથી 6-8મા મહિને સંસ્કાર. શનિ-મંગળ વાર વર્જિત.",
      vidyarambh: "વસંત પંચમી અને અક્ષય તૃતીયા મુહૂર્ત વગર શુભ. મંગળ-શનિવાર વર્જિત.",
    },
    name: { vivah: "વિવાહ મુહૂર્ત", annaprashan: "અન્નપ્રાશન મુહૂર્ત", karnavedh: "કર્ણવેધ મુહૂર્ત", vidyarambh: "વિદ્યારંભ મુહૂર્ત" },
  },
  ur: {
    title: "مبارک وقت", sub: "شادی، آنن پراشَن، کان ویده، ویدیارمبھ — حساب سے جانچے گئے۔",
    dobL: "جاتک کی تاریخِ پیدائش (تارے کی طاقت کے لیے)", dateL: "تقریب کی تاریخ",
    note: {
      vivah: "رکت تیتھی (4,9,14)، بھدرہ/وِشٹی کرن اور منگل-ہفتہ پریہیز کریں۔ گرم-زحل کی بلندی میں شادی نہیں۔",
      annaprashan: "لڑکے: پیدائش سے برابر مہینے (6,8,10)؛ لڑکیاں: برابر نहीं (5,7,9) میں رسماً بہتر۔",
      karnavedh: "پیدائش سے 6-8ویں مہینے میں رسماً۔ ہفتہ-منگل پریہیز کریں۔",
      vidyarambh: "بہار پنچمی اور اکشے ترتیا بغیر وقت کے بھی مبارک ہیں۔ منگل-ہفتہ پریہیز کریں۔",
    },
    name: { vivah: "شادی کا وقت", annaprashan: "آنن پراشَن کا وقت", karnavedh: "کان ویده کا وقت", vidyarambh: "ویدیارمبھ کا وقت" },
  },
  kn: {
    title: "ಶುಭ ಮುಹೂರ್ತ", sub: "ವಿವಾಹ, ಅನ್ನಪ್ರಾಶನ, ಕರ್ಣವೇಧ, ವಿದ್ಯಾರಂಭ — ಲೆಕ್ಕಿಸಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
    dobL: "ಜಾತಕನ ಹುಟ್ಟಿದ ದಿನ (ತಾರ-ಬಲಕ್ಕಾಗಿ)", dateL: "ಕಾರ್ಯದ ದಿನ",
    note: {
      vivah: "ರಿಕ್ತ ತಿಥಿ (4,9,14), ಭದ್ರ/ವಿಷ್ಟಿ ಕರಣ ಮತ್ತು ಮಂಗಳ-ಶನಿವಾರ ವರ್ಜಿಸಿ. ಗುರು-ಶುಕ್ರ ಅಸ್ತ ಕಾಲದಲ್ಲಿ ವಿವಾಹ ಇಲ್ಲ.",
      annaprashan: "ಪುರುಷರು: ಜನನದಿಂದ ಸಮ ತಿಂಗಳು (6,8,10); ಮಹಿಳೆಯರು: ವಿಷಮ ತಿಂಗಳು (5,7,9) ಸಂಸ್ಕಾರ ಶ್ರೇಷ್ಠ.",
      karnavedh: "ಜನನದಿಂದ 6-8ನೇ ತಿಂಗಳಿನಲ್ಲಿ ಸಂಸ್ಕಾರ. ಶನಿ-ಮಂಗಳ ವಾರ ವರ್ಜಿಸಿ.",
      vidyarambh: "ವಸಂತ ಪಂಚಮಿ ಮತ್ತು ಅಕ್ಷಯ ತೃತೀಯ ಮುಹೂರ್ತವಿಲ್ಲದೆ ಶುಭ. ಮಂಗಳ-ಶನಿವಾರ ವರ್ಜಿಸಿ.",
    },
    name: { vivah: "ವಿವಾಹ ಮುಹೂರ್ತ", annaprashan: "ಅನ್ನಪ್ರಾಶನ ಮುಹೂರ್ತ", karnavedh: "ಕರ್ಣವೇಧ ಮುಹೂರ್ತ", vidyarambh: "ವಿದ್ಯಾರಂಭ ಮುಹೂರ್ತ" },
  },
  ml: {
    title: "നല്ല മുഹൂർത്തം", sub: "വിവാഹം, അന്നപ്രാശനം, കാർണവേദം, വിദ്യാരംഭം — കണക്കിലെ പരിശോധിച്ചവ.",
    dobL: "ജാതകന്റെ ജനനത്തീയതി (താർ-ബലത്തിനായി)", dateL: "ചടങ്ങിന്റെ തീയതി",
    note: {
      vivah: "റിക്ത തിഥി (4,9,14), ഭദ്ര/വിഷ്ടി കരണവും ചൊവ്വ-ശനിയാഴ്ചയും ഒഴിവാക്കുക. ഗുരു-ശുക്ര അസ്ത കാലത്ത് വിവാഹമില്ല.",
      annaprashan: "പുരുഷർ: ജനനം മുതൽ സമ മാസങ്ങൾ (6,8,10); സ്ത്രീകൾ: വിഷമ മാസങ്ങൾ (5,7,9) സംസ്കാരം മികച്ചത്.",
      karnavedh: "ജനനം മുതൽ 6-8ാം മാസത്ത് സംസ്കാരം. ശനി-ചൊവ്വ ഒഴിവാക്കുക.",
      vidyarambh: "വസന്ത പഞ്ചമിയും അക്ഷയ തൃതീയയും മുഹൂർത്തമില്ലാതെ ശുഭം. ചൊവ്വ-ശനി ഒഴിവാക്കുക.",
    },
    name: { vivah: "വിവാഹ മുഹൂർത്തം", annaprashan: "അന്നപ്രാശന മുഹൂർത്തം", karnavedh: "കാർണവേദ മുഹൂർത്തം", vidyarambh: "വിദ്യാരംഭ മുഹൂർത്തം" },
  },
  pa: {
    title: "ਸ਼ੁਭ ਮਹੂਰਤ", sub: "ਵਿਆਹ, ਅੰਨ-ਪ੍ਰਾਸ਼ਨ, ਕਰਨ ਵੇਧ, ਵਿਦਿਆਰੰਭ — ਗਣਨਾ ਕਰਕੇ ਜਾਂਚਿਆ ਗਿਆ।",
    dobL: "ਜਾਤਕ ਦੀ ਜਨਮ ਤਾਰੀਖ (ਤਾਰ ਬਲ ਲਈ)", dateL: "ਕਾਰਜ ਦੀ ਤਾਰੀਖ",
    note: {
      vivah: "ਰਿਕਤ ਤਿਥੀ (4,9,14), ਭਦਰਾ/ਵਿਸ਼ਟੀ ਕਰਣ ਅਤੇ ਮੰਗਲ-ਸ਼ਨਿਵਾਰ ਵਰਜਨ। ਗੁਰੂ-ਸ਼ੁਕਰ ਅਸਤ ਕਾਲ ਵਿੱਚ ਵਿਆਹ ਨਹੀਂ।",
      annaprashan: "ਮਰਦ: ਜਨਮ ਤੋਂ ਸਮ ਮਹੀਨੇ (6,8,10); ਔਰਤਾਂ: ਵਿਸਮ ਮਹੀਨੇ (5,7,9) ਸੰਸਕਾਰ ਵਧੀਆ।",
      karnavedh: "ਜਨਮ ਤੋਂ 6-8ਵੇਂ ਮਹੀਨੇ ਸੰਸਕਾਰ। ਸ਼ਨਿ-ਮੰਗਲ ਵਾਰ ਵਰਜੀਂ।",
      vidyarambh: "ਵਸੰਤ ਪੰਚਮੀ ਅਤੇ ਅਕਸ਼ਯ ਤ੍ਰਿਤੀਆ ਬਿਨਾਂ ਮਹੂਰਤ ਵੀ ਸ਼ੁਭ। ਮੰਗਲ-ਸ਼ਨਿਵਾਰ ਵਰਜੀਂ।",
    },
    name: { vivah: "ਵਿਆਹ ਮਹੂਰਤ", annaprashan: "ਅੰਨ-ਪ੍ਰਾਸ਼ਨ ਮਹੂਰਤ", karnavedh: "ਕਰਨ ਵੇਧ ਮਹੂਰਤ", vidyarambh: "ਵਿਦਿਆਰੰਭ ਮਹੂਰਤ" },
  },
  or: {
    title: "ଶୁଭ ମୁହୂର୍ତ", sub: "ବିବାହ, ଅନ୍ନପ୍ରାସନ, କର୍ଣବେଧ, ବିଦ୍ୟାରମ୍ଭ — ଗଣନା କରି ଯାଞ୍ଚାଯାଇଥିଲା।",
    dobL: "ଜାତକର ଜନ୍ମତାରିଖ (ତାର-ବଳ ପାଇଁ)", dateL: "କାର୍ଯ୍ୟର ତାରିଖ",
    note: {
      vivah: "ରିକ୍ତ ତିଥି (4,9,14), ଭଦ୍ରା/ବିଷ୍ଟି କରଣ ଏବଂ ମଙ୍ଗଳ-ଶନିବାର ବର୍ଜନ। ଗୁରୁ-ଶୁକ୍ର ଅସ୍ତ କାଲରେ ବିବାହ ନାହିଁ।",
      annaprashan: "ପୁରୁଷ: ଜନ୍ମଠାରୁ ସମ ମାସ (6,8,10); ମହିଳା: ବିଷମ ମାସ (5,7,9) ସଂସ୍କାର ଉତ୍ତମ।",
      karnavedh: "ଜନ୍ମଠାରୁ 6-8ମ ମାସରେ ସଂସ୍କାର। ଶନି-ମଙ୍ଗଳ ଦିନ ବର୍ଜନ।",
      vidyarambh: "ବସନ୍ତ ପଞ୍ଚମୀ ଓ ଅକ୍ଷୟ ତୃତୀୟ ମୁହୂର୍ତ ବିନା ଶୁଭ। ମଙ୍ଗଳ-ଶନିବାର ବର୍ଜନ।",
    },
    name: { vivah: "ବିବାହ ମୁହୂର୍ତ", annaprashan: "ଅନ୍ନପ୍ରାସନ ମୁହୂର୍ତ", karnavedh: "କର୍ଣବେଧ ମୁହୂର୍ତ", vidyarambh: "ବିଦ୍ୟାରମ୍ଭ ମୁହୂର୍ତ" },
  },
  as: {
    title: "শুভ মুহূৰ্ত", sub: "বিয়া, অন্নপ্ৰাশন, কৰ্ণবেধ, বিদ্যাৰম্ভ — গণনা কৰি যাচাই কৰা।",
    dobL: "জাতকৰ জন্মতাৰিখ (তৰা-বলৰ বাবে)", dateL: "কাৰ্যত তাৰিখ",
    note: {
      vivah: "ৰিক্ত তিথি (4,9,14), ভদ্ৰ/বিষ্টি কৰণ আৰু মঙ্গল-শনিবাৰ বৰ্জন। গুৰু-শুক্ৰ অস্ত কালত বিয়া নহয়।",
      annaprashan: "পুৰুষ: জন্মৰ পৰা সম মাহ (6,8,10); মহিলা: বিষম মাহ (5,7,9) সংস্কাৰ শ্ৰেষ্ঠ।",
      karnavedh: "জন্মৰ পৰা 6-8ম মাহত সংস্কাৰ। শনি-মঙ্গল দিন বৰ্জন।",
      vidyarambh: "বসন্ত পঞ্চমী আৰু অক্ষয় তৃতীয়া মুহূৰ্তৰ অভাৰত শুভ। মঙ্গল-শনিবাৰ বৰ্জন।",
    },
    name: { vivah: "বিয়া মুহূৰ্ত", annaprashan: "অন্নপ্ৰাশন মুহূৰ্ত", karnavedh: "কৰ্ণবেধ মুহূৰ্ত", vidyarambh: "বিদ্যাৰম্ভ মুহূৰ্ত" },
  },
  en: {
    title: "Auspicious Muhurat", sub: "Marriage, Annaprashan, Karnavedh, Vidyarambh — checked by calculation.",
    dobL: "Native's birthdate (for Tara-bala)", dateL: "Ceremony date",
    note: {
      vivah: "Avoid Rikta tithi (4,9,14), Bhadra/Vishti karana and Tue-Sat. No vivah when Guru/Shukra combust.",
      annaprashan: "Boys: even months (6,8,10); girls: odd months (5,7,9) from birth.",
      karnavedh: "Sanskar in 6th-8th month from birth. Avoid Sat-Tue.",
      vidyarambh: "Vasant Panchami and Akshaya Tritiya auspicious without muhurat. Avoid Tue-Sat.",
    },
    name: { vivah: "Vivah Muhurat", annaprashan: "Annaprashan Muhurat", karnavedh: "Karnavedh Muhurat", vidyarambh: "Vidyarambh Muhurat" },
  },
};

export default function Muhurat() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const L = kundliT(lang);
  const T = pageTX(TX, lang);
  const [karya, setKarya] = useState("vivah");
  const [dob, setDob] = useState(() => loadProfile().birthdate || "");
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);

  const check = (e) => {
    e.preventDefault();
    if (!dob || !date) return;
    saveProfile({ birthdate: dob });
    const R = MUHURAT_RULES[karya];
    const jdE = jdFromDateStr(date, 12);
    const sun = sunTropical(jdE);
    const moon = moonTropical(jdE);
    const aya = lahiriAyanamsa(jdE);
    const moonS = rev(moon - aya);
    const nak = nakshatraOf(moonS);
    const ti = tithiOf(sun, moon);
    const kar = karanaOf(sun, moon);
    const wd = new Date(date + "T12:00:00").getDay();

    const jdB = jdFromDateStr(dob, 12);
    const moonB = moonTropical(jdB);
    const nakB = nakshatraOf(rev(moonB - lahiriAyanamsa(jdB)));
    const tara = taraBala(nakB.index, nak.index);

    const tithiDay = ti.n <= 15 ? ti.n : ti.n - 15;
    const checks = [
      { label: `Tithi (${ti.paksha} ${ti.name})`, ok: R.shubhTithi.includes(tithiDay) && !R.varjitTithi.includes(tithiDay) },
      { label: `Vaar (${VAAR[wd]})`, ok: R.shubhVaar.includes(wd) },
      { label: `Nakshatra (${nak.name})`, ok: R.shubhNak.includes(nak.name) },
      { label: `Karana (${kar})`, ok: kar !== "Vishti" },
      { label: `Tara Bal (${tara.name})`, ok: tara.shubh },
    ];
    const passed = checks.filter((c) => c.ok).length;
    const verdict = passed === 5 ? P.pg_uttam : passed >= 3 ? P.pg_madhyam : P.pg_varjit;
    setResult({ checks, passed, verdict, tara, nakB });
  };

  return (
    <div>
      <h1 className="text-gradient">{T.title}</h1>
      <p>{T.sub}</p>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {KARYAS.map((k) => (
            <button key={k} type="button" className={karya === k ? "btn" : "btn secondary"} onClick={() => { setKarya(k); setResult(null); }}>
              {T.name[k]}
            </button>
          ))}
        </div>
        <p style={{ marginTop: 12, fontSize: ".9rem" }}>{T.note[karya]}</p>
        <form onSubmit={check} className="grid grid-2" style={{ marginTop: 12 }}>
          <div>
            <label className="label">{T.dobL}</label>
            <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>
          <div>
            <label className="label">{T.dateL}</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <button className="btn" type="submit">{P.pg_check}</button>
          </div>
        </form>
      </div>

      {result && (
        <div className="card" style={{ marginTop: 20 }}>
          <h2>{result.verdict} ({result.passed}/5)</h2>
          <div style={{ marginTop: 10 }}>
            {result.checks.map((c) => (
              <div key={c.label} className="kv">
                <span className="k">{c.ok ? "✅" : "❌"} {c.label}</span>
                <span className="v">{c.ok ? P.pg_shubh : P.pg_ashubh}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
