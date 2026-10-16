// translations.js me nav dropdown labels (Kundli / Phaladesh / Jyotish) add karta hai
// + footer_powered se Latin "Hosting / Storage" hatata hai.
import { readFileSync, writeFileSync } from "node:fs";

const P = "src/i18n/translations.js";
const lines = readFileSync(P, "utf8").split(/\r?\n/);

const NAV = {
  hi: { nav_kundli: "कुंडली", nav_phaladesh: "फलदेश", nav_jyotish: "ज्योतिष", footer_powered: "React + Firebase द्वारा संचालित (होस्टिंग और स्टोरेज)" },
  mr: { nav_kundli: "कुंडली", nav_phaladesh: "फळदेश", nav_jyotish: "ज्योतिष", footer_powered: "React + Firebase द्वारे चालवले (होस्टिंग आणि स्टोरेज)" },
  bn: { nav_kundli: "কুণ্ডলী", nav_phaladesh: "ফলদেশ", nav_jyotish: "জ্যোতিষ", footer_powered: "React + Firebase দ্বারা চালিত (হোস্টিং ও স্টোরেজ)" },
  te: { nav_kundli: "కుండలి", nav_phaladesh: "ఫలదేశం", nav_jyotish: "జ్యోతిష్యం", footer_powered: "React + Firebase ద్వారా నిర్వహించబడింది (హోస్టింగ్ మరియు స్టోరేజ్)" },
  ta: { nav_kundli: "குண்டளி", nav_phaladesh: "பலதேசம்", nav_jyotish: "ஜ்யோதிஷம்", footer_powered: "React + Firebase மூலம் இயக்கப்படுகிறது (ஹோஸ்டிங் மற்றும் சேமிப்பு)" },
  gu: { nav_kundli: "કુંડલી", nav_phaladesh: "ફલદેશ", nav_jyotish: "જ્યોતિષ", footer_powered: "React + Firebase દ્વારા ચલાવવામાં આવે છે (હોસ્ટિંગ અને સ્ટોરેજ)" },
  ur: { nav_kundli: "کنڈلی", nav_phaladesh: "فال دیش", nav_jyotish: "جیوتیش", footer_powered: "React + Firebase کے ذریعے چلایا جاتا ہے (ہوسٹنگ اور اسٹوریج)" },
  kn: { nav_kundli: "ಕುಂಡಲಿ", nav_phaladesh: "ಫಲದೇಶ", nav_jyotish: "ಜ್ಯೋತಿಷ", footer_powered: "React + Firebase ಮೂಲಕ ನಡೆಸಲಾಗುತ್ತದೆ (ಹೋಸ್ಟಿಂಗ್ ಮತ್ತು ಸ್ಟೋರೇಜ್)" },
  ml: { nav_kundli: "കുണ്ഡളി", nav_phaladesh: "ഫലദേശം", nav_jyotish: "ജ്യോതിഷം", footer_powered: "React + Firebase വഴി പ്രവർത്തിക്കുന്നു (ഹോസ്റ്റിങ്, സ്റ്റോറേജ്)" },
  pa: { nav_kundli: "ਕੁੰਡਲੀ", nav_phaladesh: "ਫਲਦੇਸ਼", nav_jyotish: "ਜ੍ਯੋਤਿਸ਼", footer_powered: "React + Firebase ਰਾਹੀਂ ਚੱਲਾਇਆ ਜਾਂਦਾ ਹੈ (ਹੋਸਟਿੰਗ ਅਤੇ ਸਟੋਰੇਜ)" },
  or: { nav_kundli: "କୁଣ୍ଡଳୀ", nav_phaladesh: "ଫଲଦେଶ", nav_jyotish: "ଜ୍ୟୋତିଷ", footer_powered: "React + Firebase ଦ୍ୱାରା ଚାଳନାହିଁ (ହୋଷ୍ଟିଙ୍ଗ ଓ ଷ୍ଟୋରେଜ)" },
  as: { nav_kundli: "কুণ্ডলী", nav_phaladesh: "ফলদেশ", nav_jyotish: "জ্যোতিষ", footer_powered: "React + Firebase দ্বাৰা চালিত (হোষ্টিং আৰু ষ্টোৰেজ)" },
};

// Har bhasha block ka [start, end) nikalo
const blocks = {};
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^ {2}(en|hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as):\s*(mk\(\{|\{)/);
  if (!m) continue;
  const start = i;
  let depth = 0, end = i;
  for (let j = i; j < lines.length; j++) {
    for (const ch of lines[j]) { if (ch === "{") depth++; else if (ch === "}") depth--; }
    if (depth <= 0 && j > i) { end = j; break; }
    if (depth <= 0 && j === i) { end = j + 1; break; }
  }
  blocks[m[1]] = { start, end };
}

const out = [];
const report = [];
for (let i = 0; i < lines.length; i++) {
  const L = Object.keys(NAV).find((l) => blocks[l] && blocks[l].start === i);
  if (L) {
    // block ke andar footer_powered replace karo aur nav keys add karo
    const seg = lines.slice(i, blocks[L].end + 1).join("\n");
    const newSeg = seg
      .replace(/footer_powered:\s*"[^"]*"/, `footer_powered: "${NAV[L].footer_powered}"`)
      .replace(
        /( {4}nav_experts:[^\n]*\n)/,
        `$1    nav_kundli: "${NAV[L].nav_kundli}", nav_phaladesh: "${NAV[L].nav_phaladesh}", nav_jyotish: "${NAV[L].nav_jyotish}",\n`
      );
    if (newSeg === seg) report.push(`${L}: no change`);
    out.push(...newSeg.split("\n"));
    i = blocks[L].end;
    continue;
  }
  out.push(lines[i]);
}

let text = out.join("\n");

// English base me naye nav keys (sirf jab pehle nahi hain)
if (!/nav_kundli/.test(text.split("hi: mk({")[0])) {
  text = text.replace(
    '  nav_experts: "Experts",',
    '  nav_experts: "Experts",\n  nav_kundli: "Kundli",\n  nav_phaladesh: "Phaladesh",\n  nav_jyotish: "Jyotish",'
  );
}

writeFileSync(P, text);
console.log(`blocks found: ${Object.keys(blocks).length}/13`);
console.log(report.length ? report.join("\n") : "all 12 language blocks patched");