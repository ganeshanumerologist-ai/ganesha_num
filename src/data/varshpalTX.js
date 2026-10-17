// Varshphala (Personal Year) ka bhasha resolver.
//
// Pehle sirf hi/mr/en the — baaki 17 bhashayein seedha ENGLISH par girti thi.
// Ab har bhasha ka apna file hai. Jo bhasha file nahi hai (as, ne, mai, doi,
// brx, sa, ks, sd, sat, mni) wo apni PARIVARIK bhasha par giregi —
// English par KABHI nahi. (langChain me English sabse aakhir me aata hai.)
import { langChain } from "../i18n/registry.js";

import en from "./varshpal/en.js";
import hi from "./varshpal/hi.js";
import mr from "./varshpal/mr.js";
import bn from "./varshpal/bn.js";
import ta from "./varshpal/ta.js";
import te from "./varshpal/te.js";
import gu from "./varshpal/gu.js";
import kn from "./varshpal/kn.js";
import ml from "./varshpal/ml.js";
import pa from "./varshpal/pa.js";
import ur from "./varshpal/ur.js";
import or_ from "./varshpal/or.js";

const DICT = {
  en, hi, mr, bn, ta, te, gu, kn, ml, pa, ur,
  or: or_,
};

const FALLBACK = DICT.en;

/**
 * Is bhasha ka poora varshphala bundle.
 * @returns {{code:string, cat:object, meaning:object, detail:Array}}
 */
export function varshpal(lang) {
  for (const code of langChain(lang)) {
    const d = DICT[code];
    if (d) return d;
  }
  return FALLBACK;
}

/** Kis file se data aaya — debugging ke liye. */
export function varshpalSource(lang) {
  for (const code of langChain(lang)) {
    if (DICT[code]) return code;
  }
  return "en";
}

export default varshpal;