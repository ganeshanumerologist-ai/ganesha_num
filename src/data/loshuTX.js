// Lo Shu Grid yog / upay / crystal / saal data — 13 bhasha.
//
// Har bhasha ka file: src/data/loshu/<lang>.js
// Chhoti bhasha ko langChain ke through apne parivaar ki bhasha milti hai.
//
// Chain ko END se iterate karna zaroori hai, warna English har bhasha ko
// overwrite kar deta hai.

import { langChain } from "../i18n/registry.js";
import EN from "./loshu/en.js";
import HI from "./loshu/hi.js";
import MR from "./loshu/mr.js";
import BN from "./loshu/bn.js";
import TE from "./loshu/te.js";
import TA from "./loshu/ta.js";
import GU from "./loshu/gu.js";
import UR from "./loshu/ur.js";
import KN from "./loshu/kn.js";
import ML from "./loshu/ml.js";
import PA from "./loshu/pa.js";
import OR from "./loshu/or.js";
import AS from "./loshu/as.js";

const ALL = { en: EN, hi: HI, mr: MR, bn: BN, te: TE, ta: TA, gu: GU, ur: UR, kn: KN, ml: ML, pa: PA, or: OR, as: AS };

// yogs ke keys — engine (src/utils/loshuYog.js) se exactly match hone chahiye.
export const YOG_KEYS = Object.keys(EN.yogs);

const cache = new Map();
function pick(lang) {
  if (cache.has(lang)) return cache.get(lang);
  let out = EN;
  const chain = langChain(lang);
  for (let i = chain.length - 1; i >= 0; i--) {
    const d = ALL[chain[i]];
    if (!d) continue;
    out = {
      yogs: d.yogs && Object.keys(d.yogs).length ? d.yogs : out.yogs,
      doList: d.doList || out.doList,
      dontList: d.dontList || out.dontList,
      gem: d.gem || out.gem,
      yearGood: d.yearGood || out.yearGood,
      yearCaution: d.yearCaution || out.yearCaution,
      yearOverall: d.yearOverall || out.yearOverall,
      monthsGood: d.monthsGood || out.monthsGood,
      monthsAvoid: d.monthsAvoid || out.monthsAvoid,
      missingHead: d.missingHead || out.missingHead,
      strongHead: d.strongHead || out.strongHead,
      yearHead: d.yearHead || out.yearHead,
      yogHead: d.yogHead || out.yogHead,
      gemHead: d.gemHead || out.gemHead,
    };
  }
  cache.set(lang, out);
  return out;
}

/** Poora loshu text. */
export function loshuTX(lang) { return pick(lang); }

/** Ek yog ka {name, desc}. */
export function loshuYog(key, lang) {
  const y = pick(lang).yogs[key];
  return y || { name: "", desc: "" };
}

/** Missing number ke liye — kya karein, kya na karein, kaunsa patthar. */
export function loshuUpay(num, lang) {
  const T = pick(lang);
  return {
    do: (T.doList && T.doList[num]) || [],
    dont: (T.dontList && T.dontList[num]) || [],
    gem: (T.gem && T.gem[num]) || "",
  };
}

export default loshuTX;