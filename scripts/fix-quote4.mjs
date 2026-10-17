import fs from "node:fs";

const F = "scripts/add-gem-keys-all.mjs";
let lines = fs.readFileSync(F, "utf8").split("\n");

// for-loop ka closing brace wapas daalo
const last = lines.filter((l) => l.trim() === "}").length;
lines.push("}");
fs.writeFileSync(F, lines.join("\n"), "utf8");
console.log(`closing brace add hua (pehle ${last} bare braces the)`);
