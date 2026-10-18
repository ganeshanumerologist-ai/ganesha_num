// ─────────────────────────────────────────────────────────────────
//  NAV keReports labels — jyotish_b.js se EXACT copy
//
//  Navbar poora jyotish_b.js (13 KB) laata tha sirf 9-11 chhote label
//  ke liye. Wo labels yahan nikaal diye gaye hain.
//
//  /reports aur /panchang apna pura text khud import karte hain —
//  sirf tab load hota hai jab wo page khola jaata hai.
//
//  Isse har page ka pehla load ~13 KB halka ho gaya.
// ─────────────────────────────────────────────────────────────────
import { langChain } from "./registry.js";

const NAV = {"en":{"pg_paramparik":"Traditional","pg_jivan":"Life","pg_masik":"Monthly","pg_dainik":"Daily","pg_dasha":"Dasha","pg_varga":"Shodashvarga","pg_lagna":"Lagna","pg_dosh":"Dosh & Sadesati","pg_lalkitab":"Lal Kitab","pg_ratna":"Gemstone","pg_nakshatra":"Nakshatra"},"hi":{"pg_paramparik":"पारंपरिक","pg_jivan":"जीवन","pg_masik":"मासिक","pg_dainik":"दैनिक","pg_dasha":"दशा","pg_varga":"षोडशवर्ग","pg_lagna":"लग्न","pg_dosh":"दोष व साढ़ेसाती","pg_lalkitab":"लाल किताब","pg_ratna":"रत्न","pg_nakshatra":"नक्षत्र"},"mr":{"pg_paramparik":"पारंपरिक","pg_jivan":"जीवन","pg_masik":"मासिक","pg_dainik":"दैनिक","pg_dasha":"दशा","pg_varga":"षोडशवर्ग","pg_lagna":"लग्न","pg_dosh":"दोष व साडेसाती","pg_lalkitab":"लाल किताब","pg_ratna":"रत्न","pg_nakshatra":"नक्षत्र"},"bn":{"pg_paramparik":"ঐতিহ্যবাহী","pg_jivan":"জীবন","pg_masik":"মাসিক","pg_dainik":"দৈনিক","pg_dasha":"দশা","pg_varga":"ষোড়শবর্গ","pg_lagna":"লগ্ন","pg_dosh":"দোষ ও সাড়েসাতি","pg_lalkitab":"লাল কিতাব","pg_ratna":"রত্ন","pg_nakshatra":"নক্ষত্র"},"te":{"pg_paramparik":"సంప్రదాయ","pg_jivan":"జీవితం","pg_masik":"నెల","pg_dainik":"దైనిక","pg_dasha":"దశ","pg_varga":"షోడశవర్గ","pg_lagna":"లగ్నం","pg_dosh":"దోషం & ఏలినాటి","pg_lalkitab":"లాల్ కితాబ్","pg_ratna":"రత్నం","pg_nakshatra":"నక్షత్రం"},"ta":{"pg_paramparik":"பாரம்பரிய","pg_jivan":"வாழ்க்கை","pg_masik":"மாத","pg_dainik":"தினசரி","pg_dasha":"தசை","pg_varga":"ஷோடசவர்க்கம்","pg_lagna":"லக்னம்","pg_dosh":"தோஷம் & ஏழரை","pg_lalkitab":"லால் கிதாப்","pg_ratna":"ரத்தினம்","pg_nakshatra":"நட்சத்திரம்"},"gu":{"pg_paramparik":"પરંપરાગત","pg_jivan":"જીવન","pg_masik":"માસિક","pg_dainik":"દૈનિક","pg_dasha":"દશા","pg_varga":"ષોડશવર્ગ","pg_lagna":"લગ્ન","pg_dosh":"દોષ અને સાડેસાતી","pg_lalkitab":"લાલ કિતાબ","pg_ratna":"રત્ન","pg_nakshatra":"નક્ષત્ર"},"ur":{"pg_paramparik":"روایتی","pg_jivan":"جیون","pg_masik":"ماہانہ","pg_dainik":"روزانہ","pg_dasha":"دشا","pg_varga":"شوڈش ورگ","pg_lagna":"لگن","pg_dosh":"دوش و ساڑھے ساتی","pg_lalkitab":"لال کتاب","pg_ratna":"رتن","pg_nakshatra":"نچھتر"},"kn":{"pg_paramparik":"ಸಂಪ್ರದಾಯ","pg_jivan":"ಜೀವನ","pg_masik":"ಮಾಸಿಕ","pg_dainik":"ದೈನಿಕ","pg_dasha":"ದಶಾ","pg_varga":"ಷೋಡಶವರ್ಗ","pg_lagna":"ಲಗ್ನ","pg_dosh":"ದೋಷ & ಸಾಡೇಸಾತಿ","pg_lalkitab":"ಲಾಲ್ ಕಿತಾಬ್","pg_ratna":"ರತ್ನ","pg_nakshatra":"ನಕ್ಷತ್ರ"},"ml":{"pg_paramparik":"പരമ്പരാഗത","pg_jivan":"ജീവിതം","pg_masik":"മാസ","pg_dainik":"ദിന","pg_dasha":"ദശ","pg_varga":"ഷോഡശവർഗം","pg_lagna":"ലഗ്നം","pg_dosh":"ദോഷം & ഏഴര","pg_lalkitab":"ലാൽ കിതാബ്","pg_ratna":"രത്നം","pg_nakshatra":"നക്ഷത്രം"},"pa":{"pg_paramparik":"ਰਵਾਇਤੀ","pg_jivan":"ਜੀਵਨ","pg_masik":"ਮਹੀਨਾਵਾਰ","pg_dainik":"ਰੋਜ਼ਾਨਾ","pg_dasha":"ਦਸ਼ਾ","pg_varga":"ਸ਼ੋਡਸ਼ਵਰਗ","pg_lagna":"ਲਗਨ","pg_dosh":"ਦੋਸ਼ ਤੇ ਸਾਢੇਸਾਤੀ","pg_lalkitab":"ਲਾਲ ਕਿਤਾਬ","pg_ratna":"ਰਤਨ","pg_nakshatra":"ਨਛੱਤਰ"},"or":{"pg_paramparik":"ପାରମ୍ପରିକ","pg_jivan":"ଜୀବନ","pg_masik":"ମାସିକ","pg_dainik":"ଦୈନିକ","pg_dasha":"ଦଶା","pg_varga":"ଷୋଡଶବର୍ଗ","pg_lagna":"ଲଗ୍ନ","pg_dosh":"ଦୋଷ ଓ ସାଢେସାତି","pg_lalkitab":"ଲାଲ କିତାବ","pg_ratna":"ରତ୍ନ","pg_nakshatra":"ନକ୍ଷତ୍ର"},"as":{"pg_paramparik":"পৰম্পৰাগত","pg_jivan":"জীৱন","pg_masik":"মাহেকীয়া","pg_dainik":"দৈনিক","pg_dasha":"দশা","pg_varga":"ষোড়শবৰ্গ","pg_lagna":"লগ্ন","pg_dosh":"দোষ আৰু সাড়েসাতি","pg_lalkitab":"লাল কিতাপ","pg_ratna":"ৰত্ন","pg_nakshatra":"নক্ষত্ৰ"}};

/** Bhasha ke liye nav labels (parivaar bhasha -> English). */
export function pgNav(lang) {
  let out = NAV.en || {};
  for (const c of langChain(lang)) {
    if (c !== "en" && NAV[c]) out = { ...out, ...NAV[c] };
  }
  return out;
}

export default pgNav;
