// Lo Shu Grid ka extra content — share-market yog, property yog aur
// personal-year ka bada breakdown. 13 bhasha.
//
// Har bhasha ka file: src/data/loshuX/<lang>.js
// Chain ko END se iterate karna zaroori hai.

import { langChain } from "../i18n/registry.js";
import EN from "./loshuX/en.js";
import HI from "./loshuX/hi.js";
import MR from "./loshuX/mr.js";
import BN from "./loshuX/bn.js";
import TE from "./loshuX/te.js";
import TA from "./loshuX/ta.js";
import GU from "./loshuX/gu.js";
import UR from "./loshuX/ur.js";
import KN from "./loshuX/kn.js";
import ML from "./loshuX/ml.js";
import PA from "./loshuX/pa.js";
import OR from "./loshuX/or.js";
import AS from "./loshuX/as.js";

const ALL = { en: EN, hi: HI, mr: MR, bn: BN, te: TE, ta: TA, gu: GU, ur: UR, kn: KN, ml: ML, pa: PA, or: OR, as: AS };

const cache = new Map();
function pick(lang) {
  if (cache.has(lang)) return cache.get(lang);
  let out = EN;
  const chain = langChain(lang);
  for (let i = chain.length - 1; i >= 0; i--) {
    const d = ALL[chain[i]];
    if (!d) continue;
    out = {
      bazaar: d.bazaar || out.bazaar,
      property: d.property || out.property,
      year: d.year || out.year,
    };
  }
  cache.set(lang, out);
  return out;
}

export function loshuXTX(lang) { return pick(lang); }
export default loshuXTX;