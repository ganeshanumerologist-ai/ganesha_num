import fs from "node:fs";

const F = "scripts/theme-check.mjs";
let s = fs.readFileSync(F, "utf8");

// Pehle `hue >= 330 || hue <= 70` tha — jo 315–330° (magenta/rose) ko
// "COOL" keh raha tha. Blue asal me 180–280° hai; magenta/rose 300–360°.
// Threshold theek karo.
const OLD = "  const warm = (hue >= 330 || hue <= 70) || sat < 0.12;";
const NEW = [
  "// Blue/cyan = 180–280 deg. Uske bahar sab warm hai:",
  "// magenta/rose 300–360, red 355–20, orange/gold 20–90.",
  "  const inBlue = hue > 170 && hue < 285;",
  "  const warm = !inBlue || sat < 0.10;",
].join("\n");

if (s.includes(OLD)) {
  s = s.replace(OLD, NEW);
  fs.writeFileSync(F, s, "utf8");
  console.log("hue threshold fix: blue = 170–285 deg");
} else {
  console.log("!! line nahi mili");
}
