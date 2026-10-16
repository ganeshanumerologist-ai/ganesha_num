// translations.js ke har bhasha block me nav_kundli / nav_phaladesh / nav_jyotish
// add karta hai. Block kholne wali line ke turant baad insert karta hai, isliye
// formatting (ek line me kayi keys) se safe hai.
import { readFileSync, writeFileSync } from "node:fs";

const NAV = {
  hi: ["कुंडली", "फलदेश", "ज्योतिष"],
  mr: ["कुंडली", "फळदेश", "ज्योतिष"],
  bn: ["কুণ্ডলী", "ফলদেশ", "জ্যোতিষ"],
  te: ["కుండలి", "ఫలదేశం", "జ్యోతిష్యం"],
  ta: ["குண்டளி", "பலதேசம்", "ஜ்யோதிஷம்"],
  gu: ["કુંડલી", "ફલદેશ", "જ્યોતિષ"],
  ur: ["کنڈلی", "فال دیش", "جیوتیش"],
  kn: ["ಕುಂಡಲಿ", "ಫಲದೇಶ", "ಜ್ಯೋತಿಷ"],
  ml: ["കുണ്ഡളി", "ഫലദേശം", "ജ്യോതിഷം"],
  pa: ["ਕੁੰਡਲੀ", "ਫਲਦੇਸ਼", "ਜ੍ਯੋਤਿਸ਼"],
  or: ["କୁଣ୍ଡଳୀ", "ଫଲଦେଶ", "ଜ୍ୟୋତିଷ"],
  as: ["কুণ্ডলী", "ফলদেশ", "জ্যোতিষ"],
};

const P = "src/i18n/translations.js";
const lines = readFileSync(P, "utf8").split(/\r?\n/);
const out = [];
let done = 0;

for (const ln of lines) {
  out.push(ln);
  const m = ln.match(/^ {2}(hi|mr|bn|te|ta|gu|ur|kn|ml|pa|or|as):\s*mk\(\{/);
  if (!m) continue;
  const [k, p, j] = NAV[m[1]];
  out.push(`    nav_kundli: "${k}", nav_phaladesh: "${p}", nav_jyotish: "${j}",`);
  done++;
}

writeFileSync(P, out.join("\n"));
console.log(`nav keys inserted into ${done}/12 blocks`);