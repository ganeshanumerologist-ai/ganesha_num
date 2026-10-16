// siteTx.js me pan_approx_time add karta hai (ABHIJIT ka "(maanak samay)" hatane ke liye).
import { readFileSync, writeFileSync } from "node:fs";

const T = {
  hi: "अनुमानित समय", mr: "अंदाजे वेळ", bn: "আনুমানিক সময়", te: "సుమారు సమయం",
  ta: "சுமார் நேரம்", gu: "અણમાનિત સમય", ur: "تخمینی وقت", kn: "ಸುಮಾರು ಸಮಯ",
  ml: "ഏകദേശ സമയം", pa: "ਅਣਮਾਨਾ ਸਮਾਂ", or: "ଅନୁମାନିତ ସମୟ", as: "আনুমানিক সময়",
};

const P = "src/i18n/siteTx.js";
let s = readFileSync(P, "utf8");

if (!/pan_approx_time/.test(s)) {
  s = s.replace('  pan_godhuli_time:', '  pan_approx_time: "approximate time",\n  pan_godhuli_time:');
}

let n = 0;
for (const [L, v] of Object.entries(T)) {
  const needle = `    kundli_word:`;
  if (!s.includes(needle)) { console.log("MISS", L); continue; }
  s = s.replace(needle, `    pan_approx_time: "${v}", ${needle.slice(4)}`);
  n++;
}
writeFileSync(P, s);
console.log(`pan_approx_time added to ${n}/12`);