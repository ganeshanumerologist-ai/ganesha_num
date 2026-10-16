// Admin.jsx ke 4 "empty state" messages + social helper text siteTx se jodta hai.
import { readFileSync, writeFileSync } from "node:fs";

const P = "src/pages/Admin.jsx";
let s = readFileSync(P, "utf8");
const before = s;

const R = [
  ["Koi booking nahi hai.", "{S.adm_none_booking}"],
  ["Koi inquiry nahi hai.", "{S.adm_none_inquiry}"],
  ["Koi pending photo nahi hai.", "{S.adm_none_photo}"],
  ["Koi pending review nahi hai.", "{S.adm_none_review}"],
];
for (const [a, b] of R) {
  s = s.split(`>${a}<`).join(`>{b}<`);
}

s = s.replace(
  /Apne page\/profile ka poora link dalein\. Khali chhoda to icon nah[^\n]*/,
  "{S.adm_social_help}"
);

writeFileSync(P, s);
console.log(`Admin.jsx empty states wired: ${s !== before}`);
const left = s.match(/Koi (booking|inquiry|pending)/g);
console.log(left ? `remaining Hinglish: ${left.join(", ")}` : "no Hinglish left in empty states");