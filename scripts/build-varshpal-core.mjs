// en/hi/mr ke varshphal data files banao.
// cat + meaning → abhi wale sahi module se (wo Devanagari me sahi hain)
// detail → naya Devanagari (pehle wala romanized tha)
import fs from "node:fs";
import path from "node:path";
import { yearMeaning, ycat } from "../src/data/varshphal_i18n.js";
import { HI_DETAIL, MR_DETAIL } from "./varshpal-detail-devanagari.mjs";

const OUT = path.join(process.cwd(), "src", "data", "varshpal");
fs.mkdirSync(OUT, { recursive: true });

const NAMES = { en: "English", hi: "Hindi", mr: "Marathi" };
const DETAIL = { en: null, hi: HI_DETAIL, mr: MR_DETAIL };
const ROMAN_EN = [
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
DETAIL.en = ROMAN_EN;

const j = (o) => JSON.stringify(o, null, 2);

for (const code of ["en", "hi", "mr"]) {
  const cat = ycat(code);
  const meaning = {};
  for (let n = 1; n <= 9; n++) meaning[n] = yearMeaning(n, code);
  const body = `// Varshphala (Personal Year) — ${NAMES[code]}.
// cat    : 8 section labels
// meaning: 1..9 → { t, d, c, love, h, col, adv }
// detail : [0..8] → index 0 = personal year 1 → { edu, mar, share, biz, rep }
export default {
  code: ${JSON.stringify(code)},
  cat: ${j(cat)},
  meaning: ${j(meaning)},
  detail: ${j(DETAIL[code])},
};
`;
  fs.writeFileSync(path.join(OUT, `${code}.js`), body, "utf8");
  console.log(`likha: src/data/varshpal/${code}.js`);
}
console.log("done");