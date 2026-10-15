// Dainik ank-phal — Hindi, Marathi, English
import { DAY_INFO } from "../data/daily.js";

const HI = {
  1: { vibe: "नई शुरुआत और हिम्मत का दिन।", color: "लाल", dir: "पूरब", upay: "सूर्य को जल दें, पिता का आशीर्वाद लें।" },
  2: { vibe: "रिश्ते और नम्रता का दिन।", color: "सफेद", dir: "उत्तर-पश्चिम", upay: "चंद्र को दूध-चावल, शांत मन रखें।" },
  3: { vibe: "खुशी और सृजन का दिन।", color: "पीला", dir: "ईशान", upay: "गुरु को नमस्कार, पढ़ाई-लिखाई पर ध्यान।" },
  4: { vibe: "मेहनत और अनुशासन का दिन।", color: "नीला", dir: "दक्षिण", upay: "काम की सूची बनाकर एक-एक निपटाएं।" },
  5: { vibe: "बदलाव और लाभ का दिन।", color: "हरा", dir: "उत्तर", upay: "गणपति स्मरण, यात्रा-योजना शुभ।" },
  6: { vibe: "प्रेम और सुख का दिन।", color: "गुलाबी", dir: "आग्नेय", upay: "परिवार के साथ समय, किसी की मदद करें।" },
  7: { vibe: "चिंतन और अध्ययन का दिन।", color: "बैंगनी", dir: "वायव्य", upay: "ध्यान-जप, कम बोलें।" },
  8: { vibe: "धन और सफलता का दिन।", color: "सुनहरा", dir: "पश्चिम", upay: "बड़ा फैसला शुभ, शनि स्मरण।" },
  9: { vibe: "सेवा और पूर्णता का दिन।", color: "केसरिया", dir: "मध्य", upay: "दान-सेवा, पुराने काम पूरे करें।" },
};
const MR = {
  1: { vibe: "नव्या सुरुवातीचा आणि धाडसाचा दिवस.", color: "लाल", dir: "पूर्व", upay: "सूर्याला जल द्या, वडिलांचा आशीर्वाद घ्या." },
  2: { vibe: "नात्यांचा आणि नम्रतेचा दिवस.", color: "पांढरा", dir: "उत्तर-पश्चिम", upay: "चंद्राला दूध-तांदूळ, मन शांत ठेवा." },
  3: { vibe: "आनंद आणि सृजनाचा दिवस.", color: "पिवळा", dir: "ईशान्य", upay: "गुरूंना नमस्कार, अभ्यास-लेखनावर लक्ष." },
  4: { vibe: "मेहनत आणि शिस्तीचा दिवस.", color: "निळा", dir: "दक्षिण", upay: "कामांची यादी करून एकेक संपवा." },
  5: { vibe: "बदल आणि लाभाचा दिवस.", color: "हिरवा", dir: "उत्तर", upay: "गणपती स्मरण, प्रवास-योजना शुभ." },
  6: { vibe: "प्रेम आणि सुखाचा दिवस.", color: "गुलाबी", dir: "आग्नेय", upay: "कुटुंबासोबत वेळ, कुणाची तरी मदत करा." },
  7: { vibe: "चिंतन आणि अभ्यासाचा दिवस.", color: "जांभळा", dir: "वायव्य", upay: "ध्यान-जप, कमी बोला." },
  8: { vibe: "धन आणि यशाचा दिवस.", color: "सोनेरी", dir: "पश्चिम", upay: "मोठा निर्णय शुभ, शनि स्मरण." },
  9: { vibe: "सेवा आणि पूर्णतेचा दिवस.", color: "केशरी", dir: "मध्य", upay: "दान-सेवा, जुनी कामे पूर्ण करा." },
};
const EN = {
  1: { vibe: "Day of new starts and courage.", color: "Red", dir: "East", upay: "Offer water to the Sun, seek father's blessings." },
  2: { vibe: "Day of relations and humility.", color: "White", dir: "North-West", upay: "Offer milk-rice to the Moon, keep calm." },
  3: { vibe: "Day of joy and creativity.", color: "Yellow", dir: "North-East", upay: "Salute the Guru, focus on study." },
  4: { vibe: "Day of effort and discipline.", color: "Blue", dir: "South", upay: "List tasks and finish one by one." },
  5: { vibe: "Day of change and gains.", color: "Green", dir: "North", upay: "Remember Ganpati; travel plans auspicious." },
  6: { vibe: "Day of love and comfort.", color: "Pink", dir: "South-East", upay: "Spend time with family, help someone." },
  7: { vibe: "Day of reflection and study.", color: "Violet", dir: "North-West", upay: "Meditate, speak less." },
  8: { vibe: "Day of wealth and success.", color: "Golden", dir: "West", upay: "Big decisions auspicious; remember Shani." },
  9: { vibe: "Day of service and completion.", color: "Saffron", dir: "Centre", upay: "Donate-serve, finish old work." },
};
const T = { hi: HI, mr: MR, en: EN };
export function dayInfo(n, lang) {
  const t = T[lang] || DAY_INFO;
  if (t === DAY_INFO) return DAY_INFO[n];
  return t[n] || DAY_INFO[n];
}
// color/dir keys for kv rows stay simple — caller uses pgT labels
export default dayInfo;
