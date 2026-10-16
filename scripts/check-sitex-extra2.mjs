// siteTx ke naye 23 Rashifal/Lo Shu keys — script purity + Latin check.
import { siteTX } from "../src/i18n/siteTx.js";

const KEYS = [
  "rf_shubh", "rf_ashubh", "rf_shubh_dates", "rf_ashubh_dates",
  "rf_lucky_nums", "rf_avoid_nums", "rf_birth_ask",
  "lo_tag_raj", "lo_tag_dhan", "lo_tag_property", "lo_tag_bazaar",
  "lo_tag_vyapar", "lo_tag_labh",
  "lo_do_head", "lo_dont_head",
  "lo_bazaar_head", "lo_property_head", "lo_year_head", "lo_grid_head",
  "lo_level_high", "lo_level_mid", "lo_level_low", "lo_repeat_note",
];

const SCRIPT = {
  hi: /[\u0900-\u097F]/, mr: /[\u0900-\u097F]/,
  bn: /[\u0980-\u09FF]/, as: /[\u0980-\u09FF]/,
  te: /[\u0C00-\u0C7F]/, ta: /[\u0B80-\u0BFF]/,
  gu: /[\u0A80-\u0AFF]/, ur: /[\u0600-\u06FF]/,
  kn: /[\u0C80-\u0CFF]/, ml: /[\u0D00-\u0D7F]/,
  pa: /[\u0A00-\u0A7F]/, or: /[\u0B00-\u0B7F]/,
  en: /[A-Za-z]/,
};

// Har bhasha me BANNED ranges (apne block ke alawa).
const BANNED = {
  hi: ["\u0980-\u09FF", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  mr: ["\u0980-\u09FF", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  bn: ["\u0900-\u097F", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  as: ["\u0900-\u097F", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  te: ["\u0900-\u097F", "\u0980-\u09FF", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  ta: ["\u0900-\u097F", "\u0980-\u09FF", "\u0C00-\u0C7F", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  gu: ["\u0900-\u097F", "\u0980-\u09FF", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  ur: ["\u0900-\u097F", "\u0980-\u09FF", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F"],
  kn: ["\u0900-\u097F", "\u0980-\u09FF", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  ml: ["\u0900-\u097F", "\u0980-\u09FF", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0A00-\u0A7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  // NOTE: pa ka apna block \u0A00-\u0A7F BANNED me nahi hona chahiye.
  pa: ["\u0900-\u097F", "\u0980-\u09FF", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0B00-\u0B7F", "\u0600-\u06FF"],
  or: ["\u0900-\u097F", "\u0980-\u09FF", "\u0C00-\u0C7F", "\u0B80-\u0BFF", "\u0A80-\u0AFF", "\u0C80-\u0CFF", "\u0D00-\u0D7F", "\u0A00-\u0A7F", "\u0600-\u06FF"],
};

const problems = [];
const LANGS = ["hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"];

for (const lang of LANGS) {
  const S = siteTX(lang);
  for (const k of KEYS) {
    const v = S[k];
    if (typeof v !== "string" || !v.trim()) { problems.push(`${lang}/${k}: missing`); continue; }
    const lat = v.match(/[A-Za-z]{2,}/g);
    if (lat) problems.push(`${lang}/${k}: Latin "${lat.join(",")}"`);
    if (!SCRIPT[lang].test(v)) problems.push(`${lang}/${k}: apni script nahi — "${v}"`);
    // Danda (U+0964) har Indic script me chalta hai — use whitelist kar do.
    const v2 = v.replace(/[\u0964\u0965\u0966]/g, "");
    for (const range of BANNED[lang]) {
      const re = new RegExp("[" + range + "]");
      if (re.test(v2)) { problems.push(`${lang}/${k}: banned range ${range} — "${v}"`); break; }
    }
  }
}

console.log(problems.length ? problems.join("\n") : "SITETX-EXTRA2 OK");
console.log("TOTAL PROBLEMS:", problems.length);