import { kfTX } from "../src/i18n/kundliFullTX.js";
import fs from "node:fs";

const hi = kfTX("hi");
const en = kfTX("en");

const KEYS = [
  "k_gem_Jupiter_stone", "k_gem_Jupiter_metal", "k_gem_Jupiter_day", "k_gem_Jupiter_finger",
  "k_gem_Moon_stone", "k_gem_Saturn_stone", "k_gem_Ketu_stone",
  "k_mu_abhijit", "k_mu_brahma", "k_mu_vijay", "k_mu_godhuli", "k_mu_amrit",
  "k_mu_rahu", "k_mu_yamaganda", "k_mu_gulika", "k_mu_bhadra", "k_mu_panchak", "k_mu_noNote",
  "k_why_best", "k_why_good", "k_why_weak", "k_why_node", "k_why_akru",
  "k_why_debil", "k_why_badHouse", "k_why_maxThree", "k_why_fallback",
];

const lines = [];
for (const k of KEYS) {
  const v = hi[k];
  // mojibake check: koi '?' ya replacement char ya latin-garbage
  const bad = v === undefined ? "MISSING"
    : /[\uFFFD]/.test(v) ? "REPLACEMENT-CHAR"
    : v.split("").filter((c) => c.charCodeAt(0) > 0xFFFD).length ? "SUSPECT"
    : "ok";
  lines.push(`${k.padEnd(24)} [${bad.padEnd(17)}] ${v}`);
}

const miss = Object.keys(en).filter((k) => !(k in hi));
lines.push("", `total en keys : ${Object.keys(en).length}`, `hi missing    : ${miss.length ? miss.join(", ") : "NONE"}`);

fs.writeFileSync("scripts/_gem-check.txt", lines.join("\n"), "utf8");
console.log("scripts/_gem-check.txt likha");
