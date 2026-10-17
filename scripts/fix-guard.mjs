import fs from "node:fs";

const F = "scripts/check-missing-imports.mjs";
let s = fs.readFileSync(F, "utf8");

// ── comments hatao pehle ──
// pehla version comments me likhe "grahaName(...)" ko real code samajh raha
// tha — 16 me se saare 16 comment the. Ab comment strip karte hain.
const ANCHOR = "  const src = fs.readFileSync(file, \"utf8\");";

const NEW = [
  "  // Comments hatao — warna \"grahaName(planet)\" likha hua comment",
  "  // bhi real code samajh aa jata hai (pehle 16 false positive).",
  "  const raw = fs.readFileSync(file, \"utf8\");",
  "  const src = raw",
  "    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, \" \")   // block comment",
  "    .replace(/^\\s*(\\/\\/|\\*).*$/gm, \" \")        // line comment",
  "    .replace(/<!--[\\s\\S]*?-->/g, \" \");         // jsx comment",
].join("\n");

if (s.includes(ANCHOR)) {
  s = s.replace(ANCHOR, NEW);
  fs.writeFileSync(F, s, "utf8");
  console.log("guard: comment stripping add ho gayi");
} else {
  console.log("!! anchor nahi mila");
}
