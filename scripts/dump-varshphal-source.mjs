// EN + HI ka poora data ek JSON me nikaalta hai — taaki translation
// karne wale (ya main) ko source truth mile, copy-paste guess na karna pade.
import fs from "node:fs";
import { yearMeaning, yearDetail, ycat } from "../src/data/varshphal_i18n.js";

const out = { cat: {}, meaning: {}, detail: [] };
for (const l of ["en", "hi", "mr"]) out.cat[l] = ycat(l);
for (const l of ["en", "hi", "mr"]) {
  out.meaning[l] = {};
  for (let n = 1; n <= 9; n++) out.meaning[l][n] = yearMeaning(n, l);
}
for (const l of ["en", "hi", "mr"]) {
  out.detail[l] = [];
  for (let n = 1; n <= 9; n++) out.detail[l].push(yearDetail(n, l));
}
fs.writeFileSync(new URL("./varshphal-source.json", import.meta.url),
  JSON.stringify(out, null, 2), "utf8");
console.log("reference likha: scripts/varshpal-source.json");
console.log("cat keys :", Object.keys(out.cat.en).join(", "));
console.log("meaning  :", Object.keys(out.meaning.en["1"]).join(", "));
console.log("detail   :", Object.keys(out.detail.en[0]).join(", "));