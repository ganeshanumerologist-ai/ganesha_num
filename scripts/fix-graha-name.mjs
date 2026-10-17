// Kundli chart ka English-leak fix:
//  1. grahaName() — Sanskrit key vs English key mismatch
//  2. RATNA + muhurat names + gem reason — sab English me hardcoded the
import fs from "node:fs";

// ─────────────────────────────────────────────────────────────
// 1. names.js — grahaName
// ─────────────────────────────────────────────────────────────
{
  const F = "src/i18n/names.js";
  let s = fs.readFileSync(F, "utf8");

  const OLD = "export const grahaName = (g, lang) => namesTX(lang).graha[g] ?? g;";

  const NEW = [
    "// ── BAHUT IMPORTANT ─────────────────────────────────────────────",
    "// namesTX(...).graha ka key SANSKRIT naam hai (Surya, Chandra…) lekin",
    "// astro.js ka planetTropical() ENGLISH deta hai (Sun, Moon…).",
    "// Pehle seedha namesTX(lang).graha[g] lookup hota tha → English key par",
    "// undefined → \"Sun\" hi English me chala gaya, Hindi me \"सूर्य\" kabhi",
    "// nahi aaya. Ye ek line se har caller theek ho gaya.",
    "const GRAHA_KEY = {",
    '  Sun: "Surya", Moon: "Chandra", Mars: "Mangal", Mercury: "Budh",',
    '  Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu",',
    "};",
    "",
    "/** Planet ka naam apni bhasha me. English ya Sanskrit — dono key chalti hai. */",
    "export const grahaName = (g, lang) => {",
    "  const d = namesTX(lang).graha;",
    "  return d[g] ?? d[GRAHA_KEY[g]] ?? g;",
    "};",
  ].join("\n");

  if (s.includes(GRAHA_KEY_MARK())) {
    console.log("names.js: pehle se fix hai");
  } else if (s.includes(OLD)) {
    s = s.replace(OLD, NEW);
    fs.writeFileSync(F, s, "utf8");
    console.log("names.js: grahaName fix ho gaya");
  } else {
    console.log("!! names.js: grahaName wali line nahi mili");
  }
}

function GRAHA_KEY_MARK() {
  return "const GRAHA_KEY = {";
}
