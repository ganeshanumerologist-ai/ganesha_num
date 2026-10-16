// siteTx.js ke EXTRA blocks me "kundli_word" aur "rashifal_date" add karta hai.
// (PowerShell quoting se bachne ke liye script file me likha gaya hai.)
import { readFileSync, writeFileSync } from "node:fs";

const P = "src/i18n/siteTx.js";
const MAP = {
  mr: ["कुंडली", "तारीख:"],
  bn: ["কুণ্ডলী", "তাৰিখ:"],
  te: ["కుండలి", "తేదీ:"],
  ta: ["குண்டளி", "தேதி:"],
  gu: ["કુંડલી", "તારીખ:"],
  ur: ["کنڈلی", "تاریخ:"],
  kn: ["ಕುಂಡಲಿ", "ದಿನಾಂಕ:"],
  ml: ["കുണ്ഡളി", "തീയതി:"],
  pa: ["ਕੁੰਡਲੀ", "ਮਿਤੀ:"],
  or: ["କୁଣ୍ଡଳୀ", "ତାରିଖ:"],
  as: ["ಕುಣ್ಡಲೀ", "তাৰিখ:"],
};
// Assamese fix: কুণ্ডলী
MAP.as = ["কুণ্ডলী", "তাৰিখ:"];

let s = readFileSync(P, "utf8");
let ok = 0, miss = [];
for (const [L, [k, d]] of Object.entries(MAP)) {
  const needle = `  ${L}: {\n    pan_bhadra_vishti:`;
  if (!s.includes(needle)) { miss.push(L); continue; }
  s = s.replace(needle, `  ${L}: {\n    kundli_word: "${k}", rashifal_date: "${d}",\n    pan_bhadra_vishti:`);
  ok++;
}
writeFileSync(P, s);
console.log(`patched ${ok}/11`, miss.length ? "missing: " + miss.join(",") : "");