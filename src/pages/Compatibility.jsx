import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { pgT } from "../i18n/jyotish_b.js";
import kundliT from "../i18n/kundli.js";
import { personNumbers, matchScore } from "../utils/compatibility.js";
import { loadProfile, saveProfile } from "../profile/profile.js";
import ShareButtons from "../components/ShareButtons.jsx";

const TX = {
  hi: {
    title: "नाम-मिलन", sub: "शादी या भागीदारी — दोनों के अंक मिलाकर देखें।",
    p1: "पहला व्यक्ति", p2: "दूसरा व्यक्ति", btn: "मिलान देखें",
    err: "दोनों के नाम और जन्मतिथि भरें।",
    verdict: { "Uttam Milan": ["उत्तम मिलन", "बहुत सुंदर जोड़ा! भरोसा और आकर्षण दोनों रहेंगे।"],
      "Achha Milan": ["अच्छा मिलन", "अच्छा जोड़ा है। एक-दूसरे की खूबी को जगह दो।"],
      "Madhyam Milan": ["मध्यम मिलन", "मेहनत वाला रिश्ता है। बातचीत खुली रखो।"],
      "Kathin Milan": ["कठिन मिलन", "अंक टकरा रहे हैं। Expert से सलाह लें।"] },
    note: { same: "समान अंक — तुरंत समझ, थोड़ी तकरार भी।", friend: "मित्र अंक — स्वाभाविक तालमेल।", hard: "चुनौती वाला जोड़ — समझौते से चलेगा।" },
  },
  mr: {
    title: "नाव-मिलन", sub: "लग्न किंवा भागीदारी — दोघांचे अंक मिळवून पहा.",
    p1: "पहिली व्यक्ती", p2: "दुसरी व्यक्ती", btn: "मिलन पहा",
    err: "दोघांची नावे आणि जन्मतारखा भरा.",
    verdict: { "Uttam Milan": ["उत्तम मिलन", "खूप सुंदर जोडी! विश्वास आणि आकर्षण दोन्ही राहतील."],
      "Achha Milan": ["चांगले मिलन", "चांगली जोडी आहे. एकमेकांच्या गुणांना वाव द्या."],
      "Madhyam Milan": ["मध्यम मिलन", "मेहनतीचे नाते आहे. मोकळा संवाद ठेवा."],
      "Kathin Milan": ["कठीण मिलन", "अंक एकमेकांशी भिडत आहेत. Expert चा सल्ला घ्या."] },
    note: { same: "समान अंक — लगेच समज, थोडी भांडणेही.", friend: "मित्र अंक — नैसर्गिक ताळमेळ.", hard: "आव्हानात्मक जोडी — तडजोडीने चालेल." },
  },
  bn: {
    title: "নাম-মিলন", sub: "বিয়ে বা অংশীদার — দুজনের সংখ্যা মিলিয়ে দেখুন।",
    p1: "প্রথম ব্যক্তি", p2: "দ্বিতীয় ব্যক্তি", btn: "মিল দেখুন",
    err: "দুজনের নাম ও জন্ম তারিখ দিন।",
    verdict: { "Uttam Milan": ["চমৎকার মিল", "দারুণ জোড়া! বিশ্বাস ও আকর্ষণ দুটোই থাকবে।"],
      "Achha Milan": ["ভালো মিল", "ভালো জোড়া। একে অপরের গুণের প্রতি সম্মান দিন।"],
      "Madhyam Milan": ["মাঝারি মিল", "পরিশ্রমের বিষয়। কথা অবাধ রাখুন।"],
      "Kathin Milan": ["কঠিন মিল", "সংখ্যায় সংঘর্ষ। বিশেষজ্ঞের পরামর্শ নিন।"] },
    note: { same: "একই সংখ্যা — সঙ্গে সঙ্গে বোঝাপড়া, কিছুটা মেলানেও।", friend: "বন্ধুত্বপূর্ণ সংখ্যা — স্বাভাবিক সামঞ্জস্য।", hard: "কঠিন জোড়া — সমঝোতায় চলবে।" },
  },
  te: {
    title: "పేరు-సరిపోలిక", sub: "వివాహం లేదా భాగస్వామ్యం — ఇద్దరి సంఖ్యలను పోల్చండి.",
    p1: "మొదటి వ్యక్తి", p2: "రెండవ వ్యక్తి", btn: "సరిపోలిక చూడండి",
    err: "ఇద్దరి పేర్లు మరియు పుట్టిన తేదీలు నమోదు చేయండి.",
    verdict: { "Uttam Milan": ["అద్భుతమైన సరిపోలిక", "చాలా అద్భుతమైన జంట! విశ్వాసం మరియు ఆకర్షన రెండూ ఉంటాయి."],
      "Achha Milan": ["మంచి సరిపోలిక", "మంచి జంట. ఒకరి బలాలను గౌరవించండి."],
      "Madhyam Milan": ["సగటు సరిపోలిక", "ఉన్న సంబంధం శ్రమాసలకమైనది. సంభాషణను తెరిచి ఉంచండి."],
      "Kathin Milan": ["కష్టమైన సరిపోలిక", "సంఖ్యలు ఒకటితో ఒకటి ఢీక్తున్నాయి. నిపుణుల సలహా తీసుకోండి."] },
    note: { same: "ఒకే సంఖ్యలు — వెంటనే అర్థం, కొంత పోటాటం కూడా.", friend: "స్నేహ సంఖ్యలు — సహజ సౌహార్దం.", hard: "సవాచన పూర్తి జంట — అంగీకారంతో నడుస్తుంది." },
  },
  ta: {
    title: "பெயர் பொருத்தம்", sub: "திருமணம் அல்லது கூட்டு — இருவரின் எண்களை ஒப்பிடுங்கள்.",
    p1: "முதல் நபர்", p2: "இரண்டாவது நபர்", btn: "பொருத்தம் பார்க்க",
    err: "இருவரின் பெயர் மற்றும் பிறந்த தேதியை நிரப்பவும்.",
    verdict: { "Uttam Milan": ["சிறந்த பொருத்தம்", "மிக அழகான ஜோடி! நம்பிக்கையும் ஆர்வமும் நிலைத்திருக்கும்."],
      "Achha Milan": ["நல்ல பொருத்தம்", "நல்ல ஜோடி. ஒருவரின் வலிமைகளை மதிப்புங்கள்."],
      "Madhyam Milan": ["நடுத்தர பொருத்தம்", "உழைப்பு தேவை. பேச்சு திறந்து வையுங்கள்."],
      "Kathin Milan": ["கடின பொருத்தம்", "எண்கள் மோதுகின்றன. நிபுணர் ஆலோசனை பெறுங்கள்."] },
    note: { same: "ஒரே எண்கள் — உடனே புரிந்தல், சிறிது மற்றும் வேறுபாடும்.", friend: "நண்பர்கள் எண்கள் — இயற்கையான ஒற்றுமை.", hard: "சவாலான ஜோடி — சமவாசத்தால் நடக்கும்." },
  },
  gu: {
    title: "નામ-મિલાન", sub: "લગ્ન અથવા ભાગીદારી — બંનેનાં સંખ્યાઓ સરખાવો.",
    p1: "પ્રથમ વ્યક્તિ", p2: "બીજી વ્યક્તિ", btn: "મિલાન જુઓ",
    err: "બંનેનાં નામ અને જન્મ તારીખ ભરો.",
    verdict: { "Uttam Milan": ["ઉત્તમ મિલાન", "ખૂબ સુંદર જોડી! વિશ્વાસ અને આકર્ષણ બંને રહેશે."],
      "Achha Milan": ["સારું મિલાન", "સારી જોડી. એકબીજાની ગુણોને ઓળખો."],
      "Madhyam Milan": ["મધ્યમ મિલાન", "મહેનતવાળું સંબંધ. વાતચીત ખુલ્લી રાખો."],
      "Kathin Milan": ["અઘરું મિલાન", "સંખ્યાઓ ટકરાય છે. નિષ્ણાતની સલાહ લો."] },
    note: { same: "સરખી સંખ્યા — તરત સમજવાય, થોડી ઝઘડવાણી પણ.", friend: "મિત્ર સંખ્યા — કુદરતી સહાભાગિત્વ.", hard: "પડકારજનક જોડી — સમાધાનથી ચાલશે." },
  },
  ur: {
    title: "نام کی مطابقت", sub: "شادی یا شراکت — دونوں کے اعداد ملائیں۔",
    p1: "پہلا فرد", p2: "دوسرا فرد", btn: "مطابقت دیکھیں",
    err: "دونوں کے نام اور تاریخِ پیدائش درج کریں۔",
    verdict: { "Uttam Milan": ["بہترین مطابقت", "بہت خوبصورت جوڑی! اعتماد اور کشش دونوں رہیں گے۔"],
      "Achha Milan": ["اچھی مطابقت", "اچھی جوڑی ہے۔ ایک دوسرے کی خوبیوں کو قدر دیں۔"],
      "Madhyam Milan": ["درمیانہ مطابقت", "محنت کا معاملہ ہے۔ گفتگو کھلی رکھیں۔"],
      "Kathin Milan": ["مشکل مطابقت", "اعداد آمنے سامنے ہیں۔ ماہر سے مشورہ لیں۔"] },
    note: { same: "یکساں اعداد — فوری سمجھ، کچھ ناکامی بھی۔", friend: "دوستانہ اعداد — قدرتی ہم آہنگی۔", hard: "مشکل جوڑی — رضامندی سے چلے گی۔" },
  },
  kn: {
    title: "ಹೆಸರು ಹೊಂದಾಣಿಕೆ", sub: "ಮದುವೆ ಅಥವಾ ಜೊಡಿಕೆ — ಎರಡರ ಸಂಖ್ಯೆಗಳನ್ನು ಹೋಲಿಸಿ.",
    p1: "ಮೊದಲ ವ್ಯಕ್ತಿ", p2: "ಎರಡನೇ ವ್ಯಕ್ತಿ", btn: "ಹೊಂದಾಣಿಕೆ ನೋಡಿ",
    err: "ಎರಡರ ಹೆಸರು ಮತ್ತು ಹುಟ್ಟಿದ ದಿನಾಂಕ ತುಂಬಿ.",
    verdict: { "Uttam Milan": ["ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ", "ಅದ್ಭುತ ಜೋಡಿ! ನಂಬಿಕೆ ಮತ್ತು ಆಕರ್ಷಣ ಎರಡೂ ಇರುತ್ತದೆ."],
      "Achha Milan": ["ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ", "ಉತ್ತಮ ಜೋಡಿ. ಪರಸ್ಪರದ ಗುಣಗಳನ್ನು ಗೌರಿಸಿ."],
      "Madhyam Milan": ["ಸರಾಸರಿ ಹೊಂದಾಣಿಕೆ", "ಪರಿಶ್ರಮದ ಸಂಬಂಧ. ಮಾತನಾಡಣೆ ತೆರೆದಿಡಿ."],
      "Kathin Milan": ["ಕಷ್ಟದ ಹೊಂದಾಣಿಕೆ", "ಸಂಖ್ಯೆಗಳು ಘರೆಣಿಕೆಯಾಗುತ್ತಿವೆ. ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ."] },
    note: { same: "ಒಂದೇ ಸಂಖ್ಯೆಗಳು — ತಕ್ಷಣ ಅರಿವು, ಸ್ವಲ್ಪ ಅಡದಲೂ ಸಹ.", friend: "ಸ್ನೇಹಿತ ಸಂಖ್ಯೆಗಳು — ನೈಸರ್ಗಿಕ ಐಕಿಯುತ್ವ.", hard: "ಸವಾಲಾತ್ಮಕ ಜೋಡಿ — ಒಪ್ಪಂದಿನಿಂದ ನಡೆಯುತ್ತದೆ." },
  },
  ml: {
    title: "പേര് പൊരുത്തം", sub: "വിവാഹമോ സഖ്യമോ — രണ്ടിന്റെയും അക്കങ്ങൾ താരതമ്യം ചെയ്യൂ.",
    p1: "ആദ്യ വ്യക്തി", p2: "രണ്ടാം വ്യക്തി", btn: "പൊരുത്തം പരിശോധിക്കുക",
    err: "രണ്ടിന്റെയും പേരുകളും ജനന തീയതികളും പൂരിപ്പിക്കുക.",
    verdict: { "Uttam Milan": ["മികച്ച പൊരുത്തം", "അത്യന്തമായ ജോഡി! വിശ്വാസവും ആകർഷണവും നിൽനിൽക്കും."],
      "Achha Milan": ["നല്ല പൊരുത്തം", "നല്ല ജോഡി. പരസ്പരം ശക്തികൾ അംഗീകരിക്കുക."],
      "Madhyam Milan": ["ശരാശരി പൊരുത്തം", "അധ്വാനമുള്ള ബന്ധം. സംഭാഷണം തുറന്തിടിക്കുക."],
      "Kathin Milan": ["ബുദ്ധിമുട്ടുള്ള പൊരുത്തം", "അക്കങ്ങൾ കൂടിപ്പിരിക്കുന്നു. വിദഗ്ധന്റെ നിർദ്ദേശം പരിഗണിക്കുക."] },
    note: { same: "ഒരേ അക്കങ്ങൾ — ഉടൻ മനസ്സിലാകുക, കുറച്ച് വിട്ടുമാറും.", friend: "സൗഹൃദ അക്കങ്ങൾ — സ്വാഭാവിക ഐക്കിയുത്വം.", hard: "വില്ലാത്ത ജോഡി — സമരമാദരമാണ് വേണ്ടിത്." },
  },
  pa: {
    title: "ਨਾਮ ਮੇਲ", sub: "ਸ਼ਾਦੀ ਜਾਂ ਸਾਂਝੀਦਾਰੀ — ਦੋਵਾਂ ਦੇ ਅੰਕ ਮਿਲਾਓ।",
    p1: "ਪਹਿਲਾ ਵਿਅਕਤੀ", p2: "ਦੂਜਾ ਵਿਅਕਤੀ", btn: "ਮੇਲ ਵੇਖੋ",
    err: "ਦੋਵਾਂ ਦੇ ਨਾਮ ਅਤੇ ਜਨਮ ਤਾਰੀਖ਼ ਭਰੋ।",
    verdict: { "Uttam Milan": ["ਉੱਤਮ ਮੇਲ", "ਬਹੁਤ ਸੁੰਦਰ ਜੋੜੀ! ਭਰੋਸਾ ਅਤੇ ਖਿੱਚ ਦੋਵੇਂ ਰਹਿਣਗੇ।"],
      "Achha Milan": ["ਵਧੀਆ ਮੇਲ", "ਵਧੀਆ ਜੋੜੀ ਹੈ। ਇੱਕ ਦੂਜੇ ਦੀਆਂ ਖੁਬੀਆਂ ਸਵਾਰ ਕਰੋ।"],
      "Madhyam Milan": ["ਔਸਤ ਮੇਲ", "ਮਿਹਨਤ ਵਾਲਾ ਰਿਸ਼ਤਾ ਹੈ। ਗੱਲਬਾਤ ਖੁਲ੍ਹੀ ਰੱਖੋ।"],
      "Kathin Milan": ["ਔਖਾ ਮੇਲ", "ਅੰਕ ਟਕਰਾ ਰਹੇ ਹਨ। ਮਾਹਰ ਤੋਂ ਸਲਾਹ ਲਓ।"] },
    note: { same: "ਇੱਕੋ ਅੰਕ — ਤੁਰੰਤ ਸਮਝ, ਥੋੜੀ ਝਗੜ ਵੀ।", friend: "ਮਿੱਤਰ ਅੰਕ — ਕੁਦਰਤੀ ਤਾਲਮੇਲ।", hard: "ਚੁਣੌਣੀ ਜੋੜੀ — ਸਮਝੌਤੇ ਨਾਲ ਚੱਲੇਗੀ।" },
  },
  or: {
    title: "ନାମ ମେଳ", sub: "ବିବାହ କିମ୍ବା ଅଂଶୀଦାରୀ — ଦୁଇଜଣଙ୍କ ସଂଖ୍ୟା ମେଳ ଦେଖନ୍ତୁ।",
    p1: "ପ୍ରଥମ ବ୍ୟକ୍ତି", p2: "ଦ୍ୱିତୀୟ ବ୍ୟକ୍ତି", btn: "ମେଳ ଦେଖନ୍ତୁ",
    err: "ଦୁଇଜଣଙ୍କ ନାମ ଓ ଜନ୍ମ ତାରିଖ ପୂରଣ କରନ୍ତୁ।",
    verdict: { "Uttam Milan": ["ଉତ୍ତମ ମେଳ", "ବହୁତ ସୁନ୍ଦର ଜୋଡ଼ି! ବିଶ୍ୱାସ ଓ ଆକର୍ଷଣ ଦୁଇଟା ଥିବ।"],
      "Achha Milan": ["ଭଲ ମେଳ", "ଭଲ ଜୋଡ଼ି। ପରସ୍ପରଙ୍କ ଗୁଣ ସମ୍ମାନ ଦିଅନ୍ତୁ।"],
      "Madhyam Milan": ["ମଧ୍ୟମ ମେଳ", "ଶ୍ରମର ସମ୍ପର୍କ। କଥାପକଥନ ଖୋଲା ରଖନ୍ତୁ।"],
      "Kathin Milan": ["କଷ୍ଟକର ମେଳ", "ସଂଖ୍ୟା ପରସ୍ପରକୁ ଲଡ଼ୁଛନ୍ତି। ବିଶେଷଜ୍ଞଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।"] },
    note: { same: "ସମାନ ସଂଖ୍ୟା — ତକ୍ଷଣ ବୁଝାମଣ, ଅଳ୍ପ ଝଗଡ଼ା ମଧ୍ୟ।", friend: "ବନ୍ଧୁତା ସଂଖ୍ୟା — ସ୍ୱାଭାବିକ ସମଞ୍ଜସତା।", hard: "ଚ୍ୟାହଲୀ ଜୋଡ଼ି — ସମଝୋତାରେ ଚଲିବ।" },
  },
  as: {
    title: "নাম-মিল", sub: "বিয়্য৲ বা অংশীদাৰ — দুজনৰ সংখ্যা মিলাওৱা চাওক।",
    p1: "প্ৰথম ব্যক্তি", p2: "দ্বিতীয় ব্যক্তি", btn: "মিল চাওক",
    err: "দুজনৰ নাম আৰু জন্ম তাৰিখ পূৰণ কৰক।",
    verdict: { "Uttam Milan": ["চৰম মিল", "বহুত সুন্দৰ জোড়া! বিশ্বাস আৰু আকর্ষণ দুয়োটাই থাকিব।"],
      "Achha Milan": ["ভাল মিল", "ভাল জোড়া। পৰস্পৰৰ শক্তিসমূহক স্বীকৃতি দিয়ক।"],
      "Madhyam Milan": ["মধ্যম মিল", "পৰিশ্ৰমৰ সম্পৰ্ক। আলোচনা খুলা ৰাখক।"],
      "Kathin Milan": ["কঠিন মিল", "সংখ্যাই প্ৰতিদ্বন্দ্ব কৰিছে। বিশেষজ্ঞৰ পৰামৰ্শ লওক।"] },
    note: { same: "একে সংখ্যা — সঙ্গে সঙ্গে বুজি লয়, অলপ সংঘর্ষ।", friend: "বন্ধুত্বৰ সংখ্যা — স্বাভাৱিক সামঞ্জস্য।", hard: "প্ৰত্যাহ্বানৰ জোড়া — সমধিৰে চলে।" },
  },
  en: {
    title: "Name Compatibility", sub: "Marriage or partnership — match both numbers.",
    p1: "First Person", p2: "Second Person", btn: "Check Match",
    err: "Fill both names and birthdates.",
    verdict: { "Uttam Milan": ["Excellent Match", "Wonderful match! Trust and attraction will last."],
      "Achha Milan": ["Good Match", "Good match. Honour each other's strengths."],
      "Madhyam Milan": ["Average Match", "Needs effort. Keep communication open."],
      "Kathin Milan": ["Difficult Match", "Numbers clash. Consult an expert."] },
    note: { same: "Same numbers — instant understanding, some friction.", friend: "Friendly numbers — natural harmony.", hard: "Challenging pair — needs compromise." },
  },
};

function PersonForm({ title, data, setData, L }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="grid" style={{ marginTop: 10 }}>
        <div>
          <label className="label">{L.k_name}</label>
          <input className="input" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        </div>
        <div>
          <label className="label">{L.k_dob}</label>
          <input className="input" type="date" value={data.birthdate} onChange={(e) => setData({ ...data, birthdate: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

export default function Compatibility() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const L = kundliT(lang);
  const T = pageTX(TX, lang);
  const [a, setA] = useState(() => ({ name: loadProfile().name || "", birthdate: loadProfile().birthdate || "" }));
  const [b, setB] = useState({ name: "", birthdate: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calc = (e) => {
    e.preventDefault();
    setError("");
    if (!a.name.trim() || !a.birthdate || !b.name.trim() || !b.birthdate) {
      setError(T.err);
      return;
    }
    const na = personNumbers({ name: a.name.trim(), birthdate: a.birthdate });
    const nb = personNumbers({ name: b.name.trim(), birthdate: b.birthdate });
    const m = matchScore(na, nb);
    if (!m) { setError(T.err); return; }
    saveProfile({ name: a.name.trim(), birthdate: a.birthdate });
    const v = T.verdict[m.verdict] || [m.verdict, m.advice];
    setResult({ na, nb, ...m, vTitle: v[0], vAdvice: v[1] });
  };

  const pairLabel = { lifePath: P.pg_lifepath, destiny: P.pg_destiny, soulUrge: P.pg_soul };

  return (
    <div>
      <h1 className="text-gradient">{T.title}</h1>
      <p>{T.sub}</p>

      <form onSubmit={calc} style={{ marginTop: 20 }}>
        <div className="grid grid-2">
          <PersonForm title={T.p1} data={a} setData={setA} L={L} />
          <PersonForm title={T.p2} data={b} setData={setB} L={L} />
        </div>
        <button className="btn" type="submit" style={{ marginTop: 16 }}>{T.btn}</button>
        {error && <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>}
      </form>

      {result && (
        <div style={{ marginTop: 24 }}>
          <div className="card number-card">
            <div className="num"><span>{result.total}%</span></div>
            <h2>{result.vTitle}</h2>
            <p style={{ marginTop: 8 }}>{result.vAdvice}</p>
          </div>
          <div className="grid grid-3" style={{ marginTop: 20 }}>
            {result.pairs.map((p) => (
              <div key={p.key} className="card" style={{ textAlign: "center" }}>
                <h3>{pairLabel[p.key] || p.label}</h3>
                <div className="num" style={{ fontSize: "2rem", fontWeight: 800 }}>
                  <span className="text-gradient">{p.a} × {p.b}</span>
                </div>
                <p style={{ fontWeight: 700 }}>{p.score}%</p>
                <p style={{ fontSize: ".85rem" }}>{T.note[p.key] || p.note}</p>
              </div>
            ))}
          </div>
          <ShareButtons title={T.title} text={`${result.total}% — ${result.vTitle}`} />
        </div>
      )}
    </div>
  );
}
