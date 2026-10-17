// Varg functions (navamshaSign, dashamshaSign …) astro.js me RASHI KA
// NAAM (string) return karti hain, index nahi. Yahan har jagah string
// ko index me badla ja raha hai taaki bhav/ghar ki sankhya nikal sake.
//
// Pehle ye galat tha: rashiIndex(navamshaSign(x)) → "Tula".length = 4
// jaisa garbage, isliye D9 lagna aur karakamsha undefined aa rahe the.
import { RASHIS } from "../utils/astro.js";

/** Rashi naam → index. "Tula" → 6. Unknown → -1. */
export function rIdx(name) {
  return RASHIS.indexOf(name);
}

/** index → naam */
export function rName(i) {
  return RASHIS[i] ?? "-";
}

export default { rIdx, rName };