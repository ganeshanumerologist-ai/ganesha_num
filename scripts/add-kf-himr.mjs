// kundliFullTX.js me 22 naye keys (varshphal scope, lal kitab,
// ratna recommendation, shubh/ashubh time) add karo — sirf EN/HI/MR me.
import fs from "node:fs";

const F = "src/i18n/kundliFullTX.js";
let src = fs.readFileSync(F, "utf8");

const EN = {
  k_niji_saal: "Your personal year", k_calendar_year: "Calendar year", k_chalu_saal: "running now",
  k_lk_bhavfal: "Result in this house", k_lk_rogi: "Trouble it may cause",
  k_lk_daan: "Donation (daan)", k_lk_puja: "Worship (puja)", k_lk_mantra: "Mantra",
  k_lk_time: "Best time", k_lk_base: "Base remedy:",
  k_lk_first: "do first", k_lk_urgent: "urgent", k_lk_normal: "normal",
  k_gem_recommend: "Recommended for you",
  k_gem_none: "No gemstone is strongly indicated for this chart. Remedies (mantra, daan, seva) work better than a stone here.",
  k_gem_max3: "Wear at most three stones, one at a time. Try each for 3 months before adding another. Stones for Rahu or Ketu (Gomed, Lehsunia) are not advised.",
  k_k_status: "Should you wear it?",
  k_gem_yes: "Yes", k_gem_no: "No", k_gem_maybe: "Optional",
  note_shubh_src: "All times are calculated from your birth city's sunrise and sunset, so they differ from the usual panchang times.",
  note_no_time: "Birth time and place are needed to calculate real timings. Please enter both.",
};

const HI = {
  k_niji_saal: "आपका निजी वर्ष", k_calendar_year: "कैलेंडर वर्ष", k_chalu_saal: "अभी चल रहा है",
  k_lk_bhavfal: "इस भाव में फल", k_lk_rogi: "किन कष्ट हो सकते हैं",
  k_lk_daan: "दान", k_lk_puja: "पूजा", k_lk_mantra: "मंत्र", k_lk_time: "उत्तम समय",
  k_lk_base: "मूल उपाय:", k_lk_first: "सबसे पहले", k_lk_urgent: "ज़रूरी", k_lk_normal: "सामान्य",
  k_gem_recommend: "आपके लिए सुझाया गया",
  k_gem_none: "इस कुंडली में कोई रत्न विशेष रूप से नहीं दिया गया। उपाय (मंत्र, दान, सेवा) यहाँ रत्न से अधिक लाभदायक हैं।",
  k_gem_max3: "अधिकतम 3 रत्न, एक बार में एक। हर को 3 महीने आज़माएँ, फिर अगला लें। राहु-केतु के रत्न (गोमेद, लेहसुनिया) न पहनें।",
  k_k_status: "पहनना चाहिए?",
  k_gem_yes: "हाँ", k_gem_no: "नहीं", k_gem_maybe: "वैकल्पिक",
  note_shubh_src: "सभी समय आपके जन्म स्थान की सूर्योदय-सूर्यास्त से निकाले गए हैं, इसलिए सामान्य पंचांग से अलग हैं।",
  note_no_time: "असली समय निकालने के लिए जन्म समय और स्थान दोनों चाहिए। कृपया दोनों भरें।",
};

const MR = {
  k_niji_saal: "तुमचा वैयक्तिक वर्ष", k_calendar_year: "कॅलेंडर वर्ष", k_chalu_saal: "सध्या चालू",
  k_lk_bhavfal: "या भावातील फळ", k_lk_rogi: "कोणते त्रास होऊ शकतात",
  k_lk_daan: "दान", k_lk_puja: "पूजा", k_lk_mantra: "मंत्र", k_lk_time: "उत्तम वेळ",
  k_lk_base: "मूळ उपाय:", k_lk_first: "सर्वात आधी", k_lk_urgent: "अत्यंत आवश्यक", k_lk_normal: "सामान्य",
  k_gem_recommend: "तुमच्यासाठी शिफारस",
  k_gem_none: "या कुंडलीत कोणताही रत्न विशेष दिलेले नाही. उपाय (मंत्र, दान, सेवा) येथे रत्नापेक्षा अधिक फायद्याचे आहेत.",
  k_gem_max3: "कमालीत 3 रत्न, एकदा एक. प्रत्येक 3 महिने वापरून पहा. राहु-केतूची रत्ने (गोमेद, लेहसुनिया) घालू नका.",
  k_k_status: "घालायचे का?",
  k_gem_yes: "होय", k_gem_no: "नाही", k_gem_maybe: "ऐच्छिक",
  note_shubh_src: "सर्व वेळ तुमच्या जन्मस्थानच्या सूर्योद्य-सूर्यास्तावरून काढल्या आहेत, म्हणून पंचांगातील वेळेपेक्षा वेगळ्या आहेत.",
  note_no_time: "खरी वेळ काढण्यासाठी जन्म वेळ आणि स्थान दोन्ही आवश्यक आहेत.",
};

function inject(dict, langName) {
  const marker = `const ${langName} = {`;
  const i = src.indexOf(marker);
  if (i < 0) throw new Error(`${langName} block nahi mila`);
  // block ke pehle line ke baad insert karo
  const nl = src.indexOf("\n", i);
  const line = "\n  " + Object.entries(dict).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(",\n  ") + ",";
  src = src.slice(0, nl) + line + src.slice(nl);
}

inject(EN, "EN");
inject(HI, "HI");
inject(MR, "MR");

fs.writeFileSync(F, src, "utf8");
console.log(`${Object.keys(EN).length} keys EN/HI/MR te teen me inject ho gaye`);
