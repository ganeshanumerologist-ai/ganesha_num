// varshphal_i18n.js — har bhasha me ROMAN (Latin) text to nahi rehna chahiye.
// Yeh Personal Year section ka data hai. Agar koi value Latin letters me hai,
// to user ko apni bhasha me Hinglish dikhega — jo bilkul galat hai.
import { ycat, yearMeaning, yearDetail } from "../src/data/varshphal_i18n.js";

const LANGS = ["hi", "en", "mr", "bn", "ta", "te", "gu", "kn", "ml", "pa", "ur", "sa",
  "mni", "ne", "mai", "doi", "brx", "ks", "sd", "sat"];

const latinWords = (s) => (String(s).match(/[A-Za-z]+/g) || []);
let bad = 0;

for (const l of LANGS) {
  if (l === "en") continue; // English me Latin sahi hai
  const problems = [];

  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    const ym = yearMeaning(n, l);
    const yd = yearDetail(n, l);

    for (const [where, obj, keys] of [
      ["YCAT", ycat(l), Object.keys(ycat(l))],
      ["meaning", ym, ["t", "d", "c", "love", "h", "col", "adv"]],
      ["detail", yd, ["edu", "mar", "share", "biz", "rep"]],
    ]) {
      for (const k of keys) {
        const w = latinWords(obj?.[k]);
        if (w.length) problems.push(`${where}.${n}.${k} = "${String(obj[k]).slice(0, 46)}"`);
      }
    }
  }

  if (problems.length) {
    bad += problems.length;
    console.log(`\n[${l}] ${problems.length} Latin value(s):`);
    for (const p of problems.slice(0, 6)) console.log("   " + p);
    if (problems.length > 6) console.log(`   ...aur ${problems.length - 6}`);
  }
}

console.log(bad
  ? `\n${bad} Latin values — sabko Devanagari/native script me badalna hoga`
  : "\nVARSHAPHAL: koi Latin leak nahi ✅");
process.exit(bad ? 1 : 0);