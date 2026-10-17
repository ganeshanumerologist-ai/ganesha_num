// Kundli full-chart ke labels. Pehle ye the hi nahi — kundli page par
// sirf 5 number cards the. Ab 22 hisse hain, unke naam bhi chahiye.
import { langChain } from "./registry.js";

import bn from "./kf/bn.js";
import ta from "./kf/ta.js";
import te from "./kf/te.js";
import gu from "./kf/gu.js";
import ur from "./kf/ur.js";
import kn from "./kf/kn.js";
import or_ from "./kf/or.js";
import ml from "./kf/ml.js";
import pa from "./kf/pa.js";
import as_ from "./kf/as.js";

// 10 bhasha me poora chart ke labels. Chhoti bhasha (ne, doi, mai, brx, sa,
// ks, sd, sat, mni) inhi parivaar wale par giregi — English par nahi.
const PER_LANG = { bn, ta, te, gu, ur, kn, or: or_, ml, pa, as: as_ };

// ── English (source) ──
const EN = {
  kf_badge: "✦ COMPLETE CHART ✦",
  kf_title: "Your complete Kundli",
  kf_sub: "Every section below is calculated from your birth data.",
  kf_all: "All",

  s_janm: "Birth Details", s_panchang: "Panchang", s_lagna: "Lagna",
  s_graha: "Planet Positions", s_chalit: "Chalit Table", s_navamsa: "Navamsa (D9)",
  s_varga: "Shodashvarga (16 Charts)", s_ashtaka: "Ashtakavarga", s_shadbala: "Shadbala",
  s_karaka: "Karakamsha & Swaphala", s_drishti: "Special Aspects", s_maitri: "Maitri Chakra",
  s_avakanda: "Avakanda Chakra", s_dasha: "Dasha · Mahadasha · Antardasha",
  s_phaladesh: "Phaladesh", s_varshphal: "Varshphal", s_kp: "KP System",
  s_lalkitab: "Lal Kitab", s_ratna: "Gemstone", s_gochar: "Transit (Gochar)",
  s_shubh: "Auspicious & Inauspicious", s_actions: "Download & Next Steps",

  k_name: "Name", k_dob: "Date of Birth", k_time: "Birth Time", k_place: "Birth Place",
  k_gender: "Gender", k_male: "Male", k_female: "Female", k_other: "Other",
  k_age: "Age", k_years: "years", k_notgiven: "Not given",
  k_lagna: "Lagna (Ascendant)", k_d9lagna: "Navamsa Lagna", k_moon: "Moon Sign",
  k_sun: "Sun Sign", k_sunrise: "Sunrise", k_sunset: "Sunset",
  k_tithi: "Tithi", k_nak: "Nakshatra", k_pada: "pada", k_yoga: "Yoga",
  k_karana: "Karana", k_vaar: "Weekday", k_vaarlord: "lord",
  k_navamsa_lagna: "D9 Lagna", k_drekkana: "Drekkana", k_bhavamadhya: "Bhavamadhya",
  k_bal: "balance", k_graha: "Planet", k_rashi: "Sign", k_ang: "Degree",
  k_bhav: "House", k_swami: "Lord", k_sthiti: "State", k_vakri: "Retrograde",
  k_anuch: "Direct", k_total: "Total", k_kul: "Friends",
  k_h1: "H1", k_h2: "H2", k_h3: "H3", k_h4: "H4", k_h5: "H5", k_h6: "H6", k_h7: "H7", k_h8: "H8",
  k_bhavwise: "House-wise contributing planets", k_none: "None",
  k_karakamsha: "Karakamsha", k_swaphala: "Swaphala",
  k_chandra: "Chandra", k_chandrabala: "Chandrabala",
  k_chalu: "Running", k_mahadasha: "Mahadasha", k_antardasha: "Antardasha",
  k_sampoorna: "Summary", k_shubh: "Favourable", k_asubh: "Unfavourable",
  k_rahi: "Rahu", k_keetu: "Ketu", k_dashanath: "Dasha Lord", k_dasakalp: "Dasa Kendra",
  k_suryagraha: "Sun & Moon", k_ashtak: "Ashtakavarga",
  k_kp_lagna: "KP Lagna", k_kp_chandra: "KP Moon", k_kp_graha: "KP Nakshatra",
  k_kp_sanket: "KP Signature",
  k_din: "day", k_samesign: "same sign as birth",
  k_shubhkala: "Auspicious time", k_ashubhkala: "Inauspicious time", k_rahukaal: "Rahu Kaal",
  k_pdf: "Download PDF", k_reports: "Full Reports", k_expert: "Ask an Expert",
  k_muhurat: "Muhurat", k_remedies: "Remedies",

  note_nolagna: "Birth time not given, so Moon sign is used as reference.",
  note_navamsa: "D9 — the marriage and dharmic chart.",
  note_varga: "Each division is calculated from the planet's sidereal longitude.",
  note_shadbala: "Six-fold strength, shown as a proportion out of six.",
  note_drishti: "Jupiter 1-5-7-9, Saturn 3-7-10-12, Mars 4-7-8, Rahu-Ketu 7.",
  note_maitri: "Exaltation and natural friendship decide the relation.",
  note_avakanda: "Eight divisions counted from the Moon.",
  note_dasha: "Vimshottari order from your birth nakshatra.",
  note_phaladesh: "Overall outcome, built from every factor above.",
  note_varshphal: "Yearly outcome for all nine personal years.",
  note_kp: "Krishnamurti Paddhati — ruling planets at a glance.",
  note_lalkitab: "Lal Kitab remedy for each planet by house.",
  note_ratna: "Gemstone, metal and wearing day for each planet.",
  note_gochar: "Where each planet sits today versus your birth.",
  note_shubh: "Auspicious and inauspicious windows for the day.",
  note_pdf: "For PDF, use your browser's print button and choose 'Save as PDF'.",
  time_shubh: "Abhijit Muhurat, Brahma Muhurt, Vijay Muhurt",
  time_ashubh: "Rahu Kaal, Yamaganda, Gulika Kaal",
  note_rahu: "Calculated from your birth weekday",
};

// ── 12 aur bhasha ──
const HI = {
  kf_badge: "✦ पूरी कुंडली ✦", kf_title: "आपकी पूरी कुंडली",
  kf_sub: "नीचे हर हिस्सा आपकी जन्मतिथि से गणना किया गया है।",
  kf_all: "सभी",
  s_janm: "जन्म विवरण", s_panchang: "पंचांग", s_lagna: "लग्न",
  s_graha: "ग्रह स्थिति", s_chalit: "चलित तालिका", s_navamsa: "नवमांश (D9)",
  s_varga: "शोडषवर्ग (16 चार्ट)", s_ashtaka: "अष्टकवर्ग", s_shadbala: "षड्बल",
  s_karaka: "कारकांश एवं स्वांश", s_drishti: "पर दृष्टि", s_maitri: "मैत्र चक्र",
  s_avakanda: "अवकहड़ा चक्र", s_dasha: "दशा · महादशा · अंतरदशा",
  s_phaladesh: "फलादेश", s_varshphal: "वर्षफल", s_kp: "केपी पद्धति",
  s_lalkitab: "लालकिताब", s_ratna: "रत्न", s_gochar: "गोचर",
  s_shubh: "शुभ एवं अशुभ", s_actions: "डाउनलोड एवं आगे",
  k_name: "नाम", k_dob: "जन्मतिथि", k_time: "जन्म समय", k_place: "जन्म स्थान",
  k_gender: "लिंग", k_male: "पुरुष", k_female: "महिला", k_other: "अन्य",
  k_age: "आयु", k_years: "वर्ष", k_notgiven: "नहीं दिया",
  k_lagna: "लग्न", k_d9lagna: "नवमांश लग्न", k_moon: "चंद्र राशि",
  k_sun: "सूर्य राशि", k_sunrise: "सूर्योदय", k_sunset: "सूर्यास्त",
  k_tithi: "तिथि", k_nak: "नक्षत्र", k_pada: "चरण", k_yoga: "योग",
  k_karana: "करण", k_vaar: "वार", k_vaarlord: "स्वामी",
  k_navamsa_lagna: "D9 लग्न", k_drekkana: "द्रिक्काण", k_bhavamadhya: "भावमध्य",
  k_bal: "बल", k_graha: "ग्रह", k_rashi: "राशि", k_ang: "अंश",
  k_bhav: "भाव", k_swami: "स्वामी", k_sthiti: "स्थिति", k_vakri: "वक्र",
  k_anuch: "सूक्ष्म", k_total: "योग", k_kul: "मित्र",
  k_h1: "भाव1", k_h2: "भाव2", k_h3: "भाव3", k_h4: "भाव4", k_h5: "भाव5", k_h6: "भाव6", k_h7: "भाव7", k_h8: "भाव8",
  k_bhavwise: "भाववार योग देने वाले ग्रह", k_none: "कोई नहीं",
  k_karakamsha: "कारकांश", k_swaphala: "स्वांश",
  k_chandra: "चंद्र", k_chandrabala: "चंद्रबल",
  k_chalu: "चालू", k_mahadasha: "महादशा", k_antardasha: "अंतरदशा",
  k_sampoorna: "संपूर्ण", k_shubh: "शुभ", k_asubh: "अशुभ",
  k_rahi: "राहु", k_keetu: "केतु", k_dashanath: "दशानाथ", k_dasakalp: "दशा कल्प",
  k_suryagraha: "सूर्य एवं चंद्र", k_ashtak: "अष्टकवर्ग",
  k_kp_lagna: "केपी लग्न", k_kp_chandra: "केपी चंद्र", k_kp_graha: "केपी नक्षत्र",
  k_kp_sanket: "केपी संकेत",
  k_din: "दिन", k_samesign: "जन्म राशि ही",
  k_shubhkala: "शुभ समय", k_ashubhkala: "अशुभ समय", k_rahukaal: "राहु काल",
  k_pdf: "पीडीएफ डाउनलोड करें", k_reports: "पूरी रिपोर्ट", k_expert: "विशेषज्ञ से पूछें",
  k_muhurat: "शुभ मुहूर्त", k_remedies: "उपाय",
  note_nolagna: "जन्म समय नहीं दिया, इसलिए चंद्र राशि को आधार बनाया गया है।",
  note_navamsa: "D9 — विवाह और धर्म का चार्ट।",
  note_varga: "हर भाग ग्रह की निरयन दूरी से निकाला गया है।",
  note_shadbala: "छह गुना बल, छह में से अंश के रूप में।",
  note_drishti: "गुरु 1-5-7-9, शनि 3-7-10-12, मंगल 4-7-8, राहु-केतु 7।",
  note_maitri: "उच्चता और स्वाभाविक मित्रता से संबंध तय होता है।",
  note_avakanda: "चंद्र से गिने गए आठ भाग।",
  note_dasha: "आपकी जन्म नक्षत्र से विंशोत्तरी क्रम।",
  note_phaladesh: "ऊपर के सभी कारकों से बना समग्र फल।",
  note_varshphal: "नौ व्यक्तिगत वर्षों का वार्षिक फल।",
  note_kp: "कृष्णमूर्ति पद्धति — एक नज़र में राशि-निर्धारक ग्रह।",
  note_lalkitab: "हर ग्रह का भाव के अनुसार लालकिताब उपाय।",
  note_ratna: "हर ग्रह का रत्न, धातु और धारण दिवस।",
  note_gochar: "आज हर ग्रह कहाँ है, जन्म की तुलना में।",
  note_shubh: "दिन के शुभ और अशुभ समय।",
  note_pdf: "पीडीएफ के लिए ब्राउज़र का प्रिंट बटन दबाएँ और 'Save as PDF' चुनें।",
  time_shubh: "अभिजित मुहूर्त, ब्रह्म मुहूर्त, विजय मुहूर्त",
  time_ashubh: "राहु काल, यमगंड, गुलिका काल",
  note_rahu: "आपके जन्म वार से गणना",
};

const MR = {
  kf_badge: "✦ संपूर्ण कुंडली ✦", kf_title: "तुमची संपूर्ण कुंडली",
  kf_sub: "खालील प्रत्येक भाग तुमच्या जन्मतारीखेरून काढला आहे.",
  kf_all: "सर्व",
  s_janm: "जन्म विवरण", s_panchang: "पंचांग", s_lagna: "लग्न",
  s_graha: "ग्रह स्थिती", s_chalit: "चलित तालिका", s_navamsa: "नवमांश (D9)",
  s_varga: "शोडषवर्ग (16 चार्ट)", s_ashtaka: "अष्टकवर्ग", s_shadbala: "षड्बल",
  s_karaka: "कारकांश आणि स्वांश", s_drishti: "पर दृष्टी", s_maitri: "मैत्र चक्र",
  s_avakanda: "अवकहडा चक्र", s_dasha: "दशा · महादशा · अंतरदशा",
  s_phaladesh: "फळदेश", s_varshphal: "वर्षफळ", s_kp: "केपी पद्धती",
  s_lalkitab: "लालपुस्तक", s_ratna: "रत्न", s_gochar: "गोचर",
  s_shubh: "शुभ आणि अशुभ", s_actions: "डाउनलोड आणि पुढे",
  k_name: "नाव", k_dob: "जन्मतारीख", k_time: "जन्म वेळ", k_place: "जन्मस्थान",
  k_gender: "लिंग", k_male: "पुरुष", k_female: "स्त्री", k_other: "इतर",
  k_age: "वय", k_years: "वर्षे", k_notgiven: "दिले नाही",
  k_lagna: "लग्न", k_d9lagna: "नवमांश लग्न", k_moon: "चंद्र राशी",
  k_sun: "सूर्य राशी", k_sunrise: "सूर्योदय", k_sunset: "सूर्यास्त",
  k_tithi: "तिथी", k_nak: "नक्षत्र", k_pada: "चरण", k_yoga: "योग",
  k_karana: "करण", k_vaar: "वार", k_vaarlord: "स्वामी",
  k_navamsa_lagna: "D9 लग्न", k_drekkana: "द्रिक्काण", k_bhavamadhya: "भावमध्य",
  k_bal: "बळ", k_graha: "ग्रह", k_rashi: "राशी", k_ang: "अंश",
  k_bhav: "भाव", k_swami: "स्वामी", k_sthiti: "स्थिती", k_vakri: "वक्र",
  k_anuch: "सूक्ष्म", k_total: "एकूण", k_kul: "मित्र",
  k_h1: "भाव1", k_h2: "भाव2", k_h3: "भाव3", k_h4: "भाव4", k_h5: "भाव5", k_h6: "भाव6", k_h7: "भाव7", k_h8: "भाव8",
  k_bhavwise: "भाववार योग देणारे ग्रह", k_none: "काही नाही",
  k_karakamsha: "कारकांश", k_swaphala: "स्वांश",
  k_chandra: "चंद्र", k_chandrabala: "चंद्रबळ",
  k_chalu: "चालू", k_mahadasha: "महादशा", k_antardasha: "अंतरदशा",
  k_sampoorna: "संपूर्ण", k_shubh: "शुभ", k_asubh: "अशुभ",
  k_rahi: "राहु", k_keetu: "केतू", k_dashanath: "दशानाथ", k_dasakalp: "दशा कल्प",
  k_suryagraha: "सूर्य आणि चंद्र", k_ashtak: "अष्टकवर्ग",
  k_kp_lagna: "केपी लग्न", k_kp_chandra: "केपी चंद्र", k_kp_graha: "केपी नक्षत्र",
  k_kp_sanket: "केपी संकेत",
  k_din: "दिवस", k_samesign: "जन्म राशीसारखी",
  k_shubhkala: "शुभ वेळ", k_ashubhkala: "अशुभ वेळ", k_rahukaal: "राहु काळ",
  k_pdf: "पीडीएफ डाउनलोड", k_reports: "संपूर्ण अहवाल", k_expert: "तज्ज्ञांना विचारा",
  k_muhurat: "शुभ मुहूर्त", k_remedies: "उपाय",
  note_nolagna: "जन्म वेळ दिलेली नाही, म्हणून चंद्र राशी आधार घेतली आहे.",
  note_navamsa: "D9 — विवाह आणि धर्माचा चार्ट.",
  note_varga: "प्रत्येक भाग ग्रहाच्या निरयन अंशावरून काढला आहे.",
  note_shadbala: "सहा पटी बळ, सहामध्ये अंश म्हणून.",
  note_drishti: "गुरु 1-5-7-9, शनी 3-7-10-12, मंगळ 4-7-8, राहु-केतू 7.",
  note_maitri: "उच्चता आणि नैसर्गिक मैत्रीने संबंध ठरतो.",
  note_avakanda: "चंद्रापासून मोजलेले आठ भाग.",
  note_dasha: "तुमच्या जन्म नक्षत्रापासून विंशोत्तरी क्रम.",
  note_phaladesh: "वरील सर्व घटकांवरून झालेला एकूण फळ.",
  note_varshphal: "नऊ व्यक्तिगत वर्षांचे वार्षिक फळ.",
  note_kp: "कृष्णमूर्ती पद्धत — एक नजरेत राशी-निर्धारक ग्रह.",
  note_lalkitab: "प्रत्येक ग्रहाचा भावानुसार लालपुस्तक उपाय.",
  note_ratna: "प्रत्येक ग्रहाचा रत्न, धातू आणि धारण दिवस.",
  note_gochar: "आज प्रत्येक ग्रह कुठे, जन्माच्या तुलनेत.",
  note_shubh: "दिवसाची शुभ आणि अशुभ वेळा.",
  note_pdf: "पीडीएफसाठी ब्राउझरचा प्रिंट बटण दाबा आणि 'Save as PDF' निवडा.",
  time_shubh: "अभिजित मुहूर्त, ब्रह्म मुहूर्त, विजय मुहूर्त",
  time_ashubh: "राहु काळ, यमगंड, गुलिका काळ",
  note_rahu: "तुमच्या जन्म वारावरून गणना",
};

const DICT = { en: EN, hi: HI, mr: MR, ...PER_LANG };

/** Jis bhasha ka file nahi hai, wo apni parivarik bhasha par giregi. */
export function kfTX(lang) {
  let out = null;
  for (const code of langChain(lang)) {
    if (code === "en") break;
    const d = DICT[code];
    if (d) { out = out ? { ...d, ...out } : { ...d }; }
  }
  return out ? { ...EN, ...out } : EN;
}

export default kfTX;