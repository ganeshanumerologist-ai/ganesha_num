// Chhoti bhashaon (nepali, dogri, maithili, sanskrit, bodo, kashmiri,
// sindhi, manipuri, santali) ke liye resolver.
//
// PEHLE: ye 9 bhasha apna content na hone ki wajah se langChain ke
//       through apni parivarik bhasha par gir jaati thi —
//       नेपाली chunne par हिन्दी dikhta tha, इसलिए user ko lagta tha
//       "bhasha badli hi nahi".
//
// AB: har bhasha ka apna file hai (src/i18n/small/<lang>.js).
//     File na ho to bhi langChain fallback chalta hai (English par nahi).
import { langChain } from "./registry.js";

import ne from "./small/ne.js";
import doi from "./small/doi.js";
import mai from "./small/mai.js";
import sa from "./small/sa.js";
import brx from "./small/brx.js";
import ks from "./small/ks.js";
import sd from "./small/sd.js";
import sat from "./small/sat.js";
import mni from "./small/mni.js";

const DICT = { ne, doi, mai, sa, brx, ks, sd, sat, mni };

/** Jin bhashaon ka apna content file hai. */
export const SMALL_LANGS = Object.keys(DICT);

/**
 * Is bhasha ka apna content, ya null.
 * @returns {{translations:object, site:object, kundli:object, pg:object}|null}
 */
export function smallLang(lang) {
  const d = DICT[lang];
  if (!d) return null;
  return d;
}

/** Kaunsi bhasha ka file chala — debugging ke liye. */
export function smallLangSource(lang) {
  if (DICT[lang]) return lang;
  for (const code of langChain(lang)) if (DICT[code]) return code;
  return null;
}

/**
 * Ek group ka content pakdo — pehle apni bhasha, phir family fallback.
 * @param {"translations"|"site"|"kundli"|"pg"} group
 * @param {object} fallback woh dict jo translations.js/siteTx.js use kar raha hai
 */
export function pick(group, lang, fallback) {
  const mine = smallLang(lang);
  if (mine && mine[group] && Object.keys(mine[group]).length) return mine[group];
  // family fallback — English pe NAHI jaana chahiye jab tak wo dict na hai
  for (const code of langChain(lang)) {
    if (code === "en") break;
    const d = DICT[code];
    if (d && d[group] && Object.keys(d[group]).length) return d[group];
  }
  return fallback;
}

export default { smallLang, smallLangSource, pick };