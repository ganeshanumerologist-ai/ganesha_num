// Rashi details — Marathi + English (luckyNum/mantra base se)
const MR = [
  { traits: "धाडसी, स्वाभिमानी, नेता-स्वभाव.", prem: "प्रेमात स्पष्ट; जोडीदाराची भावना समजा, राग कमी करा. विवाह-योग प्रबळ.", arthik: "उत्पन्न वाढेल, पण धोकादायक गुंतवणूक टाळा.", career: "नवी जबाबदारी मिळेल.", varshik: "2026 मध्ये शनीची मेहनत जास्त, फळ हळू. गुरुकृपेने उत्तरार्धात प्रगती.", luckyColor: "लाल", day: "मंगळवार" },
  { traits: "धीरजवान, कला-प्रेमी, व्यवहारिक.", prem: "नात्यात स्थिरता येईल. लग्नासाठी उत्तम वर्ष.", arthik: "धन-संचयाचे वर्ष. जमीन-वाहन योग.", career: "कला, डिझाइन, व्यापारात यश.", varshik: "शनी 11व्या स्थानी — लाभ. गुरु वर्षमध्यापासून धन-भावात.", luckyColor: "पांढरा", day: "शुक्रवार" },
  { traits: "बुद्धिमान, वक्तृत्ववान, मिळूनमिसळणारे.", prem: "संवादाने नाती सुधारतील.", arthik: "लहान-लहान लाभ मिळून मोठे धन.", career: "मीडिया, लेखन, व्यापारात चमक.", varshik: "गुरु तुमच्याच राशीत — ज्ञान, सन्मान. शनी कर्म-भावातून कामाचा ताण.", luckyColor: "हिरवा", day: "बुधवार" },
  { traits: "भावूक, कौटुंबिक, रक्षक-स्वभाव.", prem: "कुटुंबाचे सहकार्य मिळेल. विवाह-योग.", arthik: "घर-मालमत्तेतून लाभ.", career: "सेवा, शिक्षण, वैद्यकीय क्षेत्रात प्रगती.", varshik: "वर्षअखेरीस गुरु तुमच्या राशीत (उच्च) — मोठे शुभ संकेत.", luckyColor: "पांढरा", day: "सोमवार" },
  { traits: "तेजस्वी, महत्त्वाकांक्षी, उदार.", prem: "आकर्षण वाढेल. अहंकार टाळा.", arthik: "उत्पन्नाचे नवे स्रोत उघडतील.", career: "नेतृत्वाची संधी.", varshik: "शनी सप्तमात — भागीदारीत सावधगिरी. गुरु लाभ-भावात.", luckyColor: "सोनेरी", day: "रविवार" },
  { traits: "विश्लेषणात्मक, सेवा-भावी.", prem: "नात्यात स्पष्टता येईल.", arthik: "हिशेब सुधारेल.", career: "तज्ज्ञ म्हणून ओळख.", varshik: "शनी सहाव्यात — शत्रूंवर विजय. गुरु दशमात — बढती.", luckyColor: "हिरवा", day: "बुधवार" },
  { traits: "समतोल-प्रिय, न्यायप्रिय.", prem: "प्रेमसंबंध गोड होतील. विवाह-योग प्रबळ.", arthik: "भागीदारीतून धनलाभ.", career: "कायदा, कला, व्यापारात यश.", varshik: "शनी पंचमात — संतती-सुख. गुरु नवमात — नशीबाची साथ.", luckyColor: "गुलाबी", day: "शुक्रवार" },
  { traits: "दृढ-संकल्पी, पराक्रमी.", prem: "खोल नाती जुळतील.", arthik: "अडकलेले धन मिळेल.", career: "संशोधन, वैद्यकीय, तंत्रज्ञानात यश.", varshik: "शनी चतुर्थात — घरबदल योग. गुरु अष्टमात — सावधगिरी.", luckyColor: "केशरी", day: "मंगळवार" },
  { traits: "आशावादी, धार्मिक.", prem: "उदार प्रेम मिळेल.", arthik: "नशिबाने धनलाभ.", career: "शिक्षण, परदेश-संबंधित कामांत प्रगती.", varshik: "शनी तृतीयात — पराक्रमाने यश. गुरु सप्तमात — विवाहासाठी सर्वोत्तम.", luckyColor: "पिवळा", day: "गुरुवार" },
  { traits: "कर्मठ, धीरजवान.", prem: "गंभीर नाती; वेळ दिल्याने प्रेम वाढेल.", arthik: "हळू पण पक्की प्रगती.", career: "दीर्घ मेहनतीचे फळ.", varshik: "शनी द्वितीयात — बोलताना तोल सांभाळा. गुरु सहाव्यात — स्पर्धेत विजय.", luckyColor: "निळा", day: "शनिवार" },
  { traits: "तत्त्वनिष्ठ, मानवतावादी.", prem: "मैत्री प्रेमात बदलेल.", arthik: "तंत्रज्ञानातून उत्पन्न. साडेसातीचा शेवटचा टप्पा.", career: "नवे तंत्रज्ञान शिका.", varshik: "साडेसाती शेवटच्या टप्प्यात. गुरु पंचमात शुभ.", luckyColor: "आकाशी", day: "शनिवार" },
  { traits: "कल्पनाशील, दयाळू.", prem: "आदर्शवादी प्रेम.", arthik: "खर्चावर नियंत्रण ठेवा.", career: "कला, सेवा, परदेशात यश.", varshik: "साडेसाती शिखरावर — हनुमान-उपासना, धीरज. गुरु चतुर्थात.", luckyColor: "पिवळा", day: "गुरुवार" },
];

const EN = [
  { traits: "Brave, proud, leader-like.", prem: "Direct in love; understand partner's feelings, control anger.", arthik: "Income rises; avoid risky investments.", career: "New responsibilities coming.", varshik: "Saturn demands hard work in 2026; Guru favours the second half.", luckyColor: "Red", day: "Tuesday" },
  { traits: "Patient, artistic, practical.", prem: "Stability in relations. Excellent year for marriage.", arthik: "Year of savings. Land-vehicle yog.", career: "Success in arts, design, business.", varshik: "Saturn 11th — gains. Guru moves to wealth house mid-year.", luckyColor: "White", day: "Friday" },
  { traits: "Intelligent, eloquent, sociable.", prem: "Communication heals relations.", arthik: "Small gains add up.", career: "Shine in media, writing, business.", varshik: "Guru in your sign — knowledge and honour. Saturn adds workload.", luckyColor: "Green", day: "Wednesday" },
  { traits: "Emotional, family-loving, protective.", prem: "Family support; marriage yog.", arthik: "Gains via home-property.", career: "Progress in service, education, medicine.", varshik: "Guru exalted in your sign late year — big blessing.", luckyColor: "White", day: "Monday" },
  { traits: "Radiant, ambitious, generous.", prem: "Attraction rises; curb ego.", arthik: "New income sources open.", career: "Leadership chance.", varshik: "Saturn 7th — caution in partnerships. Guru in gains.", luckyColor: "Golden", day: "Sunday" },
  { traits: "Analytical, service-minded.", prem: "Clarity in relations.", arthik: "Accounts improve.", career: "Known as an expert.", varshik: "Saturn 6th — victory over rivals. Guru 10th — promotion.", luckyColor: "Green", day: "Wednesday" },
  { traits: "Balance-loving, just.", prem: "Sweet relations; strong marriage yog.", arthik: "Gains via partnership.", career: "Success in law, arts, business.", varshik: "Saturn 5th — children, studies. Guru 9th — full luck.", luckyColor: "Pink", day: "Friday" },
  { traits: "Determined, brave.", prem: "Deep bonds form.", arthik: "Stuck money returns.", career: "Success in research, medicine, tech.", varshik: "Saturn 4th — possible house change. Guru 8th — be careful.", luckyColor: "Saffron", day: "Tuesday" },
  { traits: "Optimistic, religious.", prem: "Generous love.", arthik: "Luck brings wealth.", career: "Growth in teaching, foreign links.", varshik: "Saturn 3rd — success via courage. Guru 7th — best for marriage.", luckyColor: "Yellow", day: "Thursday" },
  { traits: "Hardworking, patient.", prem: "Serious relations; time nurtures love.", career: "Long effort pays.", arthik: "Slow but steady progress.", varshik: "Saturn 2nd — weigh your words. Guru 6th — win competitions.", luckyColor: "Blue", day: "Saturday" },
  { traits: "Principled, humanitarian.", prem: "Friendship turns to love.", arthik: "Income via technology; sadesati ending.", career: "Learn new tech.", varshik: "Sadesati final phase ending. Guru 5th — children, studies, love.", luckyColor: "Sky blue", day: "Saturday" },
  { traits: "Imaginative, kind.", prem: "Idealistic love.", arthik: "Control spending.", career: "Success in arts, service, abroad.", varshik: "Sadesati peak — Hanuman worship, patience. Guru 4th — home comforts.", luckyColor: "Yellow", day: "Thursday" },
];

export function rashiLang(i, lang, base) {
  const T = lang === "mr" ? MR : lang === "hi" ? null : EN;
  if (!T) return base;
  return { ...base, ...T[i] };
}

export const DAILY_TX = {
  hi: [
    "आज आपका आत्मविश्वास बढ़ेगा — रुका काम पूरा होगा।",
    "धन-लाभ के संकेत; किसी पुराने मित्र से मदद मिलेगी।",
    "परिवार में खुशी का माहौल; शाम सुखद रहेगी।",
    "काम में थोड़ी रुकावट संभव — धैर्य रखें।",
    "यात्रा-लाभ योग; नए संपर्क फायदेमंद होंगे।",
    "सेहत का ध्यान रखें; हल्का भोजन और पूरी नींद लें।",
    "रिश्तों में मधुरता बढ़ेगी; क्षमा करना शुभ रहेगा।",
    "पढ़ाई-प्रतियोगिता में सफलता; गुरु-जन का आशीर्वाद मिलेगा।",
    "अचानक खर्च बढ़ सकता है; बजट से चलें।",
    "सम्मान मिलेगा; अपने विचार सबके सामने रखें।",
    "धार्मिक कार्य में मन लगेगा; दान करना शुभ।",
    "नई योजना बनेगी; बड़े फैसले दोपहर बाद लें।",
  ],
  mr: [
    "आज तुमचा आत्मविश्वास वाढेल — रखडलेले काम पूर्ण होईल.",
    "धन-लाभाचे संकेत; जुन्या मित्राकडून मदत मिळेल.",
    "कुटुंबात आनंदाचे वातावरण; संध्याकाळ सुखद राहील.",
    "कामात थोडी अडचण शक्य — धीरज ठेवा.",
    "प्रवास-लाभ योग; नवे संपर्क फायदेशीर होतील.",
    "आरोग्याची काळजी घ्या; हलके जेवण आणि पूर्ण झोप घ्या.",
    "नात्यात गोडवा वाढेल; क्षमा करणे शुभ राहील.",
    "अभ्यास-स्पर्धेत यश; गुरुजनांचा आशीर्वाद मिळेल.",
    "अचानक खर्च वाढू शकतो; बजेटनुसार चाला.",
    "सन्मान मिळेल; तुमचे विचार सर्वांसमोर मांडा.",
    "धार्मिक कार्यात मन रमेल; दान करणे शुभ.",
    "नवीन योजना बनेल; मोठे निर्णय दुपारनंतर घ्या.",
  ],
};
export default rashiLang;
