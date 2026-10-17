// JyotishBackdrop me ek #22d3ee (cyan, hue 188°) bacha hai — shayad
// alag format me likha hua hai. Dhundh kar badal dete hain.
import fs from "node:fs";

const F = "src/components/JyotishBackdrop.jsx";
let s = fs.readFileSync(F, "utf8");
const lines = s.split("\n");

lines.forEach((l, i) => {
  if (/22d3ee|8b5cf6|5ee7f5|ffd45e|a78bfa/i.test(l)) {
    console.log(`L${i + 1}: ${l.trim().slice(0, 100)}`);
  }
});
