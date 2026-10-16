// Rashifal deep topics — 13 bhasha, har ek apne native script me.
//
// Har bhasha ka file: src/data/rashiDeep/<lang>.js
// Chhoti bhasha (nepali, dogri, maithili, bodo, sanskrit…) ko langChain ke
// through apne parivaar ki bhasha milti hai — English nahi.
//
// Chain ko END se iterate karna zaroori hai, warna English (jo chain me
// aakhir me hota hai) har bhasha ko overwrite kar deta hai.

import { langChain } from "../i18n/registry.js";
import EN from "./rashiDeep/en.js";
import HI from "./rashiDeep/hi.js";
import MR from "./rashiDeep/mr.js";
import BN from "./rashiDeep/bn.js";
import TE from "./rashiDeep/te.js";
import TA from "./rashiDeep/ta.js";
import GU from "./rashiDeep/gu.js";
import UR from "./rashiDeep/ur.js";
import KN from "./rashiDeep/kn.js";
import ML from "./rashiDeep/ml.js";
import PA from "./rashiDeep/pa.js";
import OR from "./rashiDeep/or.js";
import AS from "./rashiDeep/as.js";

const ALL = { en: EN, hi: HI, mr: MR, bn: BN, te: TE, ta: TA, gu: GU, ur: UR, kn: KN, ml: ML, pa: PA, or: OR, as: AS };

export const DEEP_TOPICS = ["shubh", "ashubh", "naukri", "aarogya", "business", "prem", "arthik", "samajik"];

const cache = new Map();
function pick(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const out = {};
  for (const k of Object.keys(EN)) out[k] = EN[k];
  const chain = langChain(lang);
  for (let i = chain.length - 1; i >= 0; i--) {
    const d = ALL[chain[i]];
    if (!d) continue;
    for (const k of Object.keys(d)) {
      if (Array.isArray(d[k]) && d[k].length) out[k] = d[k];
    }
  }
  cache.set(lang, out);
  return out;
}

/** Saare topics ka native text. */
export function rashiDeepTX(lang) { return pick(lang); }

/** Sirf ek topic. */
export function deepTopic(lang, topic) { return pick(lang)[topic] || []; }

export default rashiDeepTX;