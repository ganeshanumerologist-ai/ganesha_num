// Personal Year varshphal — Hindi, Marathi, English (compact)
const HI = {
  1: { t: "नया आरंभ", d: "नौ वर्ष के चक्र का पहला वर्ष — नई शुरुआत और नए निर्णयों का समय।",
    c: "नई नौकरी, व्यापार आरंभ और पदोन्नति हेतु उत्तम।", love: "नए संबंध बनेंगे; पहले स्वयं को समझें।",
    h: "ऊर्जा अधिक रहेगी; जल्दबाजी में चोट से बचें।", col: "लाल", adv: "रुके काम शुरू करें।" },
  2: { t: "धैर्य और संबंध", d: "रिश्ते सींचने का वर्ष — साझेदारी और परिवार पर ध्यान दें।",
    c: "टीम-कार्य और योजना का वर्ष; बड़े फैसले रुककर लें।", love: "गहराई आएगी; विवाह-सगाई हेतु शुभ।",
    h: "मानसिक शांति और पूरी नींद जरूरी।", col: "नारंगी", adv: "झगड़े से बचें, सुनें अधिक।" },
  3: { t: "आनंद और सृजन", d: "खुलकर जीने का वर्ष — कला, लेखन और सामाजिक जीवन चमकेगा।",
    c: "मीडिया, कला और मार्केटिंग में सफलता।", love: "रोमांस बढ़ेगा।",
    h: "गला और त्वचा का ध्यान रखें।", col: "पीला", adv: "खर्च पर लगाम रखें।" },
  4: { t: "परिश्रम की नींव", d: "मेहनत का वर्ष — घर, धन और सेहत की नींव मजबूत करें।",
    c: "नियमित मेहनत और हिसाब-किताब; जिम्मेदारी बढ़ेगी।", love: "रिश्ते गंभीर होंगे।",
    h: "दिनचर्या, भोजन और नींद सुधारें।", col: "हरा", adv: "छोटे कदम, रोज के कदम।" },
  5: { t: "बदलाव और स्वतंत्रता", d: "तबदीली का वर्ष — नौकरी, शहर या घर बदल सकता है; यात्रा होगी।",
    c: "ट्रांसफर और नई भूमिका; यात्रा से लाभ।", love: "उत्तेजक वर्ष रहेगा।",
    h: "तनाव से बचें।", col: "आसमानी", adv: "कागज पढ़कर हस्ताक्षर करें।" },
  6: { t: "परिवार और दायित्व", d: "घर-परिवार केंद्र में — विवाह, संतान और गृह-लाभ संभव।",
    c: "सेवा, शिक्षा और स्वास्थ्य कार्यों में उन्नति।", love: "सबसे शुभ वर्ष — विवाह और सगाई।",
    h: "परिवार के साथ समय ही दवा है।", col: "गुलाबी", adv: "अपनी सेहत न भूलें।" },
  7: { t: "आत्म-चिंतन", d: "ठहरो, सोचो, सीखो — पढ़ाई, ध्यान और योजना का वर्ष।",
    c: "शोध और पढ़ाई; नया व्यापार थोड़ा रुककर।", love: "अकेलेपन की इच्छा; साथी को समझाएं।",
    h: "नींद, ध्यान और कम स्क्रीन।", col: "बैंगनी", adv: "जल्द फैसले न लें।" },
  8: { t: "धन और सफलता", d: "कर्म का हिसाब — पिछले वर्षों की मेहनत का फल; धन, पद और प्रतिष्ठा।",
    c: "पदोन्नति, बड़ा सौदा और व्यापार विस्तार।", love: "व्यस्तता बढ़ेगी; साथी को समय दें।",
    h: "काम के बोझ में खानपान न बिगाड़ें।", col: "सुनहरा", adv: "पैसा आए तो बचत भी करें।" },
  9: { t: "पूर्णता", d: "चक्र का अंतिम वर्ष — पुराने हिसाब चुकाएं, क्षमा करें, बोझ उतारें।",
    c: "पुराने प्रोजेक्ट पूरे करें।", love: "पुराने घाव भरेंगे।",
    h: "विश्राम करें।", col: "सफेद", adv: "पुराने झगड़े और कर्ज निपटाएं।" },
};

const MR = {
  1: { t: "नवी सुरुवात", d: "नऊ वर्षांच्या चक्राचे पहिले वर्ष — नवी सुरुवात आणि नवे निर्णय घेण्याची वेळ।",
    c: "नवी नोकरी, व्यवसाय सुरू करणे आणि बढतीसाठी उत्तम।", love: "नवे संबंध जुळतील।",
    h: "ऊर्जा जास्त राहील; घाईत दुखापत टाळा।", col: "लाल", adv: "रखडलेली कामे सुरू करा।" },
  2: { t: "संयम आणि नाती", d: "नाती जपण्याचे वर्ष — भागीदारी आणि कुटुंबाकडे लक्ष द्या।",
    c: "टीम-वर्क आणि नियोजनाचे वर्ष।", love: "नात्यात खोली येईल; विवाह-साखरपुड्यासाठी शुभ।",
    h: "मानसिक शांती आणि पूर्ण झोप गरजेची।", col: "नारंगी", adv: "भांडण टाळा।" },
  3: { t: "आनंद आणि सृजन", d: "मोकळेपणाने जगण्याचे वर्ष — कला आणि लेखन चमकेल।",
    c: "मीडिया, कला आणि मार्केटिंगमध्ये यश।", love: "प्रेम वाढेल।",
    h: "घसा आणि त्वचेची काळजी घ्या।", col: "पिवळा", adv: "खर्चावर ताबा ठेवा।" },
  4: { t: "कष्टाचा पाया", d: "मेहनतीचे वर्ष — घर, पैसा आणि आरोग्याचा पाया भक्कम करा।",
    c: "नियमित मेहनत आणि हिशेब; जबाबदारी वाढेल।", love: "नाती गंभीर होतील।",
    h: "दिनचर्या, जेवण आणि झोप सुधारा।", col: "हिरवा", adv: "लहान पावले, रोजची पावले।" },
  5: { t: "बदल आणि स्वातंत्र्य", d: "बदलाचे वर्ष — नोकरी, शहर किंवा घर बदलू शकते; प्रवास होईल।",
    c: "बदली आणि नवी भूमिका; प्रवासाने लाभ।", love: "उत्तेजक वर्ष राहील।",
    h: "तणाव टाळा।", col: "आकाशी", adv: "कागद वाचून सही करा।" },
  6: { t: "कुटुंब आणि जबाबदारी", d: "घर-कुटुंब केंद्रस्थानी — लग्न, संतती आणि घरलाभ शक्य।",
    c: "सेवा, शिक्षण आणि आरोग्य कामांत प्रगती।", love: "सर्वात शुभ वर्ष — लग्न आणि साखरपुडा।",
    h: "कुटुंबासोबत वेळ हेच औषध।", col: "गुलाबी", adv: "स्वतःच्या आरोग्याकडे दुर्लक्ष नको।" },
  7: { t: "आत्मचिंतन", d: "थांबा, विचार करा, शिका — अभ्यास, ध्यान आणि नियोजनाचे वर्ष।",
    c: "संशोधन आणि अभ्यास; नवा व्यवसाय थोडा थांबून।", love: "एकटेपणाची इच्छा; जोडीदाराला समजावून सांगा।",
    h: "झोप, ध्यान आणि कमी स्क्रीन।", col: "जांभळा", adv: "घाईने निर्णय नका घेऊ।" },
  8: { t: "धन आणि यश", d: "कर्माचा हिशेब — मागील मेहनतीचे फळ; धन, पद आणि प्रतिष्ठा।",
    c: "बढती, मोठा व्यवहार आणि व्यवसाय विस्तार।", love: "व्यस्तता वाढेल; जोडीदाराला वेळ द्या।",
    h: "कामाच्या ताणात खाणेपिणे बिघडवू नका।", col: "सोनेरी", adv: "पैसा आला तर बचतही करा।" },
  9: { t: "पूर्णता", d: "चक्राचे शेवटचे वर्ष — जुने हिशेब चुकते करा, क्षमा करा।",
    c: "जुने प्रोजेक्ट पूर्ण करा।", love: "जुनी दुःखे भरतील।",
    h: "विश्रांती घ्या।", col: "पांढरा", adv: "जुने वाद आणि कर्ज संपवा।" },
};

const EN = {
  1: { t: "New Beginnings", d: "First year of the 9-year cycle — start new ventures and decisions.",
    c: "Best for new job, business and promotion.", love: "New relationships may form.",
    h: "High energy; avoid hasty injuries.", col: "Red", adv: "Begin pending work." },
  2: { t: "Patience & Bonds", d: "Year to nurture relations — partnerships and family need care.",
    c: "Teamwork and planning year.", love: "Deeper bonds; good for engagement.",
    h: "Mental peace and full sleep.", col: "Orange", adv: "Avoid quarrels." },
  3: { t: "Joy & Creativity", d: "Year to live fully — art, writing and social life shine.",
    c: "Success in media, arts and marketing.", love: "Romance rises.",
    h: "Care for throat and skin.", col: "Yellow", adv: "Control spending." },
  4: { t: "Work & Foundation", d: "Year of effort — strengthen home, money and health foundations.",
    c: "Regular effort and accounts; duties grow.", love: "Relations turn serious.",
    h: "Fix routine, food and sleep.", col: "Green", adv: "Small steps daily." },
  5: { t: "Change & Freedom", d: "Year of change — job, city or home may shift; travel likely.",
    c: "Transfer and new roles; gains via travel.", love: "An exciting year.",
    h: "Avoid stress.", col: "Sky blue", adv: "Read papers before signing." },
  6: { t: "Family & Duty", d: "Home and family at centre — marriage, children and house possible.",
    c: "Growth in service, education and health work.", love: "Best year — marriage and engagement.",
    h: "Time with family heals.", col: "Pink", adv: "Don't neglect your health." },
  7: { t: "Reflection", d: "Pause, think, learn — study, meditation and planning year.",
    c: "Research and study; hold new business.", love: "Need for solitude; explain to partner.",
    h: "Sleep, meditation, less screen.", col: "Violet", adv: "No hasty decisions." },
  8: { t: "Money & Success", d: "Karma pays — rewards of past efforts; wealth, rank and fame.",
    c: "Promotion, big deals and expansion.", love: "Busier; give time to partner.",
    h: "Don't spoil diet in workload.", col: "Golden", adv: "Save as money comes." },
  9: { t: "Completion", d: "Last year of cycle — settle dues, forgive and release burdens.",
    c: "Finish old projects.", love: "Old wounds heal.",
    h: "Rest well.", col: "White", adv: "Clear old disputes and loans." },
};

const YEAR_MEAN = { hi: HI, mr: MR, en: EN };
export function yearMeaning(py, lang) {
  const T = YEAR_MEAN[lang] || YEAR_MEAN.en;
  return T[py] || YEAR_MEAN.en[py];
}

// Varshphal vistar — padhai, shaadi, share, business, samman (hi/mr/en)
const YDET_HI = [
  { edu: "Naya course shuru karne ka uttam saal.", mar: "Naye rishte; shaadi ki baatcheet shuru ho sakti hai.", share: "Lambe samay ka nivesh shuru karein.", biz: "Naya business shuru karne ka sabse shubh saal.", rep: "Nayi pehchan banegi." },
  { edu: "Sahyog se padhai; group-study labhdayak.", mar: "Rishte gehre honge; sagaai yog.", share: "Dhairya rakhein; SIP jaari rakhein.", biz: "Sajhedari me soch-samajhkar aage badhein.", rep: "Vinamrata se sammaan milega." },
  { edu: "Rachnatmak vishayon me safalta.", mar: "Mangal-karya me khushi; prem-parinay yog.", share: "Chhota-mota labh; afwah se bachein.", biz: "Prachar-marketing se vyapar badhega.", rep: "Samajik mel-jol se pratishtha." },
  { edu: "Mehnat ka saal; niyamit abhyas safalta dega.", mar: "Parivarik sahamati se baat aage badhegi.", share: "Jokhim na lein; surakshit nivesh rakhein.", biz: "Neenv majboot karein; vistaar agle saal.", rep: "Karmathata ki tareef hogi." },
  { edu: "Naya vishay/shahar badlav sambhav.", mar: "Achanak prastaav; soch-samajhkar haan kahein.", share: "Utaar-chadhav; stop-loss zaroor lagayein.", biz: "Naye prayog ka saal; yatra se labh.", rep: "Badlav se pehchan banegi." },
  { edu: "Kala-sangeet padhai me safalta.", mar: "Vivah ka sabse shubh saal.", share: "Sthir nivesh labhdayak.", biz: "Parivarik vyapar phalega.", rep: "Ghar-samaj dono me sammaan." },
  { edu: "Shodh-adhyan ka saal; gehrai se padhein.", mar: "Jaldi na karein; rishte par vichar karein.", share: "Bazaar se door rahein; adhyayan karein.", biz: "Naya nivesh rokein; yojana banayein.", rep: "Gyaan se pratishtha milegi." },
  { edu: "Pratiyogita me safalta.", mar: "Dhoom-dhaam se vivah yog.", share: "Dhan-yog prabal; samajh se nivesh karein.", biz: "Vistaar ka saal; bada faisla shubh.", rep: "Pad-pratishtha charam par." },
  { edu: "Purani padhai poori karein.", mar: "Purane rishte sudhrenge; naye me jaldbazi na karein.", share: "Munafa book karein; naya paisa na lagayein.", biz: "Hisaab niptayein; udhaar vasool karein.", rep: "Seva-bhaav se sammaan." },
];
const YDET_MR = [
  { edu: "Nava course suru karnyache uttam varsha.", mar: "Nave nate; lagna-bolani suru hou shakte.", share: "Dirghakalin guntavanuk suru kara.", biz: "Nava vyapar suru karnyache sarvottam varsha.", rep: "Navi olakh banel." },
  { edu: "Sahkaryane abhyas; group-study labhdayak.", mar: "Nati khol hotil; sakharpuda yog.", share: "Dhirya theva; SIP chalu theva.", biz: "Bhagidarit vichar karoon pudhe ja.", rep: "Vinamratene sanman milel." },
  { edu: "Rachnatmak vishayat yash.", mar: "Mangal-karyat anand; prem-vivah yog.", share: "Chhota-motha labh; afvapasoon dura raha.", biz: "Prachar-marketingne vyapar vadhel.", rep: "Samajik melavyanmule pratishtha." },
  { edu: "Mehnatiche varsha; niyamit abhyas yash deil.", mar: "Kutumb-sammatine goshta pudhe jail.", share: "Jokhim gheu naka.", biz: "Paya majboot kara.", rep: "Kashtachi tareef hoil." },
  { edu: "Nava vishay/shahar badal shakya.", mar: "Achanak prastav; vichar karoon ho mhano.", share: "Chadh-utaar; stop-loss lava.", biz: "Navya prayoganche varsha.", rep: "Badalane olakh banel." },
  { edu: "Kala-sangeet abhyasat yash.", mar: "Lagnache sarvottam varsha.", share: "Sthir guntavanuk labhdayak.", biz: "Kautumbik vyapar phalel.", rep: "Ghar-samajat sanman." },
  { edu: "Sanshodhan-abhyasache varsha.", mar: "Ghai karu naka.", share: "Bazarapasoon dura raha.", biz: "Navi guntavanuk thambva.", rep: "Dnyanane pratishtha milel." },
  { edu: "Spardhet yash.", mar: "Dhoom-dhadakyat vivah yog.", share: "Dhan-yog prabal.", biz: "Vistarache varsha.", rep: "Pad-pratishtha shikharavar." },
  { edu: "Juni padhai purna kara.", mar: "Juni nati sudhartil.", share: "Napha book kara.", biz: "Hisheb nikta kara.", rep: "Seva-bhavane sanman." },
];
const YDET_EN = [
  { edu: "Best year to start a new course.", mar: "New bonds; marriage talks may begin.", share: "Start long-term investment.", biz: "Best year to start business.", rep: "A new identity forms." },
  { edu: "Study with support; group study pays.", mar: "Bonds deepen; engagement yog.", share: "Stay patient; continue SIP.", biz: "Move ahead carefully in partnerships.", rep: "Humility earns respect." },
  { edu: "Success in creative subjects.", mar: "Joy in family events; love-marriage yog.", share: "Small gains; avoid rumours.", biz: "Publicity-marketing grows business.", rep: "Socialising builds prestige." },
  { edu: "Year of effort; regular study wins.", mar: "Talks progress with family consent.", share: "Avoid risk; stay safe.", biz: "Strengthen foundations.", rep: "Hard work gets praised." },
  { edu: "New subject/city change possible.", mar: "Sudden proposal; decide thoughtfully.", share: "Volatile; always use stop-loss.", biz: "Year of experiments; gains via travel.", rep: "Change builds identity." },
  { edu: "Success in arts-music studies.", mar: "Most auspicious year for marriage.", share: "Stable investments pay.", biz: "Family business blooms.", rep: "Honour at home and society." },
  { edu: "Year of research; study deeply.", mar: "Don't rush; reflect on relations.", share: "Stay away from markets.", biz: "Hold new investments; plan.", rep: "Knowledge earns prestige." },
  { edu: "Win competitions.", mar: "Grand marriage yog.", share: "Strong wealth yog; invest wisely.", biz: "Year of expansion.", rep: "Rank and fame peak." },
  { edu: "Finish old studies.", mar: "Old bonds heal; don't rush new ones.", share: "Book profits; invest no fresh money.", biz: "Settle accounts.", rep: "Service earns honour." },
];
const YDET = { hi: YDET_HI, mr: YDET_MR, en: YDET_EN };
export function yearDetail(py, lang) {
  const T = YDET[lang] || YDET.en;
  return T[py - 1] || YDET.en[py - 1];
}
export const YCAT = {
  hi: { edu: "पढ़ाई", mar: "विवाह", share: "शेयर बाज़ार", biz: "व्यापार", rep: "सम्मान", health: "सेहत", color: "शुभ रंग", adv: "सलाह" },
  mr: { edu: "अभ्यास", mar: "विवाह", share: "शेअर बाजार", biz: "व्यापार", rep: "सन्मान", health: "आरोग्य", color: "शुभ रंग", adv: "सल्ला" },
  en: { edu: "Studies", mar: "Marriage", share: "Stock Market", biz: "Business", rep: "Prestige", health: "Health", color: "Lucky Colour", adv: "Advice" },
};
export function ycat(lang) {
  return YCAT[lang] || YCAT.en;
}
export default YEAR_MEAN;
