// BUG: grahaName(SANSK[g.lagnaLord]) — par lagnaLord PEHLE SE Sanskrit
// hai (RASHI_LORD se aata hai: "Mangal"). Uspar SANSK map dobara laga
// to SANSK["Mangal"] = undefined. Seedha value use karo.
import fs from "node:fs";

const F = "src/pages/Kundli.jsx";
let s = fs.readFileSync(F, "utf8");

const REPL = [
  ["grahaName(SANSK[g.lagnaLord], lang)", "grahaName(g.lagnaLord, lang)"],
  ["grahaName(SANSK[g.rashiLord], lang)", "grahaName(g.rashiLord, lang)"],
];

for (const [from, to] of REPL) {
  if (s.includes(from)) { s = s.replace(from, to); console.log("fix: " + from); }
  else console.log("!! nahi mila: " + from);
}

// ab SANSK ka koi use nahi — hata do
if (!s.includes("SANSK[")) {
  s = s.replace(/\nconst SANSK = \{[\s\S]*?\};\n/, "\n");
  console.log("SANSK map hata diya (ab use nahi)");
}

fs.writeFileSync(F, s, "utf8");
