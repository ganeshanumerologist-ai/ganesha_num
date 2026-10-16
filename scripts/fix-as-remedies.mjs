// Assamese remedies me Odia chars (U+0B5F ୟ, U+0B28 ନ) aa gaye the —
// "যন্ত্ৰ" ki jagah "ୟନ্ত্ৰ" likha gaya. Unhe Assamese "য"/"ন" se badalta hai.
import { readFileSync, writeFileSync } from "node:fs";

const P = "src/data/remedies/as.js";
let s = readFileSync(P, "utf8");

// Assamese "যন্ত্ৰ" me: ୟ -> য, ନ -> ন
s = s.replace(/ୟ/g, "য");   // Odia YYA -> Assamese YA
s = s.replace(/ନ/g, "ন");   // Odia NA -> Assamese NA

writeFileSync(P, s);

const left = [...s].filter((c) => {
  const cp = c.codePointAt(0);
  return (cp >= 0x0B00 && cp <= 0x0B7F);
});
console.log(`as.js odia chars left: ${left.length}`);
const sample = s.split("\n").filter((l) => /যন্ত্ৰ/.test(l)).slice(0, 3);
console.log("sample:", sample.map((x) => x.trim().slice(0, 60)).join("\n        "));