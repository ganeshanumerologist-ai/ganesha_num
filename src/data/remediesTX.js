// Remedies data (Rudraksha / Jadi / Yantra) — 13 bhasha, native script me.
//
// Pehle src/data/remedies.js sab Hinglish tha, isliye Remedies page Hindi
// select karne par bhi "1 मुखी — Surya" aur "Netritva, dil-mastishk…" dikhta tha.
//
// `planet` lookup key hai — use render par grahaName() se translate karo.
// `mantra` Sanskrit hai, har script me waisa hi likha jaata hai.
//
// Chhoti bhasha ko langChain ke through apne parivaar ki bhasha milti hai.

import { langChain } from "../i18n/registry.js";
import EN from "./remedies/en.js";
import HI from "./remedies/hi.js";
import MR from "./remedies/mr.js";
import BN from "./remedies/bn.js";
import TE from "./remedies/te.js";
import TA from "./remedies/ta.js";
import GU from "./remedies/gu.js";
import UR from "./remedies/ur.js";
import KN from "./remedies/kn.js";
import ML from "./remedies/ml.js";
import PA from "./remedies/pa.js";
import OR from "./remedies/or.js";
import AS from "./remedies/as.js";

const ALL = { en: EN, hi: HI, mr: MR, bn: BN, te: TE, ta: TA, gu: GU, ur: UR, kn: KN, ml: ML, pa: PA, or: OR, as: AS };

const cache = new Map();
export function remTX(lang) {
  if (cache.has(lang)) return cache.get(lang);
  let out = EN;
  const chain = langChain(lang);
  for (let i = chain.length - 1; i >= 0; i--) {
    const d = ALL[chain[i]];
    if (!d) continue;
    out = { rudraksha: d.rudraksha || out.rudraksha, jadi: d.jadi || out.jadi, yantra: d.yantra || out.yantra };
  }
  cache.set(lang, out);
  return out;
}

export default remTX;