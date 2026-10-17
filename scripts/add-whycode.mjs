// gemAdvice ab ENGLISH text nahi banata — sirf CODE + parameters deta hai.
// Text rendering time par apni bhasha me aayega, warna Hindi view me
// "theek adhaara (2/8) + 9va bhav" English leak hota tha.
import fs from "node:fs";

const F = "src/utils/kundliFull.js";
let s = fs.readFileSync(F, "utf8");

// ── status/why ab code pair hai ──
const REPL = [
  // node
  [`      reason = "chhaya graha — shastra me inhe peene ki salah nahi";`,
   `      reason = "chhaya graha — shastra me inhe peene ki salah nahi";
      whyCode = "node";`],
  // akru + weak
  [`      reason = "akru + kam adhaara + dursthan — labh nahi, dosh badhega";`,
   `      reason = "akru + kam adhaara + dursthan — labh nahi, dosh badhega";
      whyCode = "akru";`],
  // debilitated
  [`      reason = "nikla hua hai — gem se usse aur dikkat; upakarna behtar hai";`,
   `      reason = "nikla hua hai — gem se usse aur dikkat; upakarna behtar hai";
      whyCode = "debil";`],
  // bad house
  [`      reason = \`\${house}va bhav me hai — rashtrari/rog/bhrishti ka bhav\`;`,
   `      reason = \`\${house}va bhav me hai — rashtrari/rog/bhrishti ka bhav\`;
      whyCode = "badHouse";`],
  // strong
  [`        reason = \`acha adhaara (\${pts}/8) + \${house}va bhav — sabse zyada faida\`;`,
   `        reason = \`acha adhaara (\${pts}/8) + \${house}va bhav — sabse zyada faida\`;
        whyCode = "best";`],
  // fair
  [`        reason = \`theek adhaara (\${pts}/8) + \${house}va bhav — peena laabhdaay\`;`,
   `        reason = \`theek adhaara (\${pts}/8) + \${house}va bhav — peena laabhdaay\`;
        whyCode = "good";`],
  // weak
  [`        reason = \`kam adhaara (\${pts}/8) — zaroorat nahi, mann ki marzi\`;`,
   `        reason = \`kam adhaara (\${pts}/8) — zaroorat nahi, mann ki marzi\`;
        whyCode = "weak";`],
  // let status, whyCode
  [`    let status, reason, score = 0;`,
   `    let status, reason, score = 0;
    let whyCode = "weak";   // rendering time par bhasha me badlega`],
  // output me whyCode daalo
  [`      status,
      reason,
      score,`,
   `      status,
      reason,
      // rendering ke liye: kaunsa translation key + uske parameters
      whyCode,
      whyArgs: { p: pts, h: house },
      score,`],
  // fallback promote me code bhi update karo
  [`      top.reason = \`sabse yogya — \${top.reason}\`;`,
   `      top.reason = \`sabse yogya — \${top.reason}\`;
      top.whyCode = "fallback";`],
  // maxThree note
  [`      if (promoted > 3) { r.status = "optional"; r.reason += " (saath me 3 se zyada mat)"; }`,
   `      if (promoted > 3) {
        r.status = "optional";
        r.reason += " (saath me 3 se zyada mat)";
        r.extraNote = "maxThree";
      }`],
];

let n = 0;
for (const [from, to] of REPL) {
  if (s.includes(from)) { s = s.replace(from, to); n++; }
  else console.log("  (skip) " + from.trim().slice(0, 60));
}
fs.writeFileSync(F, s, "utf8");
console.log(`${n}/${REPL.length} replacements hue`);
