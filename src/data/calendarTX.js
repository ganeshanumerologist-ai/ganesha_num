// Calendar data (months, festivals, month guides) — 13 bhasha, har ek native script me.
//
// Pehle src/data/calendar.js me sab English/Hinglish tha, isliye Calendar page
// Hindi select karne par bhi "Jan Feb Mar" aur Hinglish notes dikhte the.
// Ab har bhasha ka apna file hai: src/data/calendar/<lang>.js
//
// Chhoti bhasha ko langChain ke through apne parivaar ki bhasha milti hai.

import { langChain } from "../i18n/registry.js";
import EN from "./calendar/en.js";
import HI from "./calendar/hi.js";
import MR from "./calendar/mr.js";
import BN from "./calendar/bn.js";
import TE from "./calendar/te.js";
import TA from "./calendar/ta.js";
import GU from "./calendar/gu.js";
import UR from "./calendar/ur.js";
import KN from "./calendar/kn.js";
import ML from "./calendar/ml.js";
import PA from "./calendar/pa.js";
import OR from "./calendar/or.js";
import AS from "./calendar/as.js";

const ALL = { en: EN, hi: HI, mr: MR, bn: BN, te: TE, ta: TA, gu: GU, ur: UR, kn: KN, ml: ML, pa: PA, or: OR, as: AS };

const cache = new Map();
export function calTX(lang) {
  if (cache.has(lang)) return cache.get(lang);
  let out = EN;
  const chain = langChain(lang);
  for (let i = chain.length - 1; i >= 0; i--) {
    const d = ALL[chain[i]];
    if (!d) continue;
    out = {
      months: d.months || out.months,
      festivals: d.festivals || out.festivals,
      guide: { ...out.guide, ...(d.guide || {}) },
    };
  }
  cache.set(lang, out);
  return out;
}

export default calTX;