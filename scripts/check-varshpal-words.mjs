// Script sahi hai, lekin KHAAS shabd galat matlab de rahe hain.
//
// Pehle version bhool gaya tha: usne poore bhasha me ek shabd dhoondha.
// Par wahi shabd ALAG field me sahi hota hai:
//   te "గుర్తింపు" — rep (identity) me SAHI, love (engagement) me GALAT
//   ur "تقریبات"   — "family events" me SAHI, "yog" me GALAT
// Isliye ab English source se compare karte hain — sahi field me sahi shabd.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = path.join(process.cwd(), "src", "data", "varshpal");

/**
 * [bhasha, galatShabd, englishIsi, sahiShabd]
 *  englishIsi = wo shabd English source me jo hone se samajh aata hai ki
 *               yahan "engagement" ya "diet" wala matlab chahiye.
 */
const SUSPECT = [
  // te: gurthimpu = "identification". "engagement" ke liye "ankeekaram" chahiye.
  ["te", "గుర్తింపు", /engagement/i, "అంగీకారం"],
  ["te", "గుర్తింపు", /engagement yog/i, "అంగీకార యోగం"],
  // ur: siyasat = politics. engagement = mangni.
  ["ur", "سیاستِ شادی", /engagement/i, "منگنی"],
  // ur: taqrib = proximity/approach (singular). "taqribat" = celebrations (plural) — wo SAHI hai.
  // sirf singular form pakdo, aur wahi jahan English "yog" bol raha ho.
  ["ur", "تقریب(?![ات])(?![\u0600-\u06FF])", /yog/i, "یوگ"],
  // kn: asphshata = unclarity. "diet" ke liye "kshaiyot" chahiye.
  ["kn", "ಅಸ್ಪಷ್ಟತೆ", /diet/i, "ಕ್ಷೈಯೋಟವನ್ನು"],
];

const en = (await import(pathToFileURL(path.join(DIR, "en.js")).href)).default;
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".js")).sort();

const CAT = ["edu", "mar", "share", "biz", "rep", "health", "color", "adv"];
const MEAN = ["t", "d", "c", "love", "h", "col", "adv"];
const DET = ["edu", "mar", "share", "biz", "rep"];

let hits = 0;
for (const f of files) {
  const code = f.replace(/\.js$/, "");
  const T = (await import(pathToFileURL(path.join(DIR, f)).href)).default;

  // [fieldKey, translation, englishSource]
  const pairs = [];
  CAT.forEach((k) => pairs.push([`cat.${k}`, T.cat[k], en.cat[k]]));
  Object.keys(en.meaning).forEach((n) =>
    MEAN.forEach((k) => pairs.push([`meaning.${n}.${k}`, T.meaning[n][k], en.meaning[n][k]])));
  en.detail.forEach((e, i) =>
    DET.forEach((k) => pairs.push([`detail[${i}].${k}`, T.detail[i][k], e[k]])));

  for (const [where, tv, ev] of pairs) {
    for (const [lang, word, engTest, right] of SUSPECT) {
      if (lang !== code) continue;
      // word ek regex ho sakta hai (plural/singular alag karna hai)
      if (!new RegExp(word).test(String(tv))) continue;
      // sirf tab pakdo jab English me wahi matlab ho
      if (!engTest.test(String(ev))) continue;
      hits++;
      console.log(`[${code}] ${where}  (English: "${ev}")`);
      console.log(`   galat : ${tv}`);
      console.log(`   sahi  : ${String(tv).replace(new RegExp(word, "g"), right)}`);
    }
  }
}

console.log(hits ? `\n${hits} galat shabd` : "\nkoi galat shabd nahi ✅");
process.exit(hits ? 1 : 0);