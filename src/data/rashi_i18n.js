// Rashi rashifal content — 13 bhasha, har ek apne native script me.
//
// Pehle yahan sirf MR + EN the aur baaki 11 bhasha ko RASHI_DATA ka
// Hinglish text mil raha tha (`rashiLang` me `hi` ke liye `T = null` return
// hota tha). Ab har bhasha ka apna file hai: src/data/rashi/<lang>.js
//
// Chhoti bhasha (nepali, dogri, maithili, bodo, sanskrit…) ko langChain ke
// through apne parivaar ki bhasha milti hai — English nahi.

import { langChain } from "../i18n/registry.js";
import EN from "./rashi/en.js";
import HI from "./rashi/hi.js";
import MR from "./rashi/mr.js";
import BN from "./rashi/bn.js";
import TE from "./rashi/te.js";
import TA from "./rashi/ta.js";
import GU from "./rashi/gu.js";
import UR from "./rashi/ur.js";
import KN from "./rashi/kn.js";
import ML from "./rashi/ml.js";
import PA from "./rashi/pa.js";
import OR from "./rashi/or.js";
import AS from "./rashi/as.js";

const ALL = { en: EN, hi: HI, mr: MR, bn: BN, te: TE, ta: TA, gu: GU, ur: UR, kn: KN, ml: ML, pa: PA, or: OR, as: AS };

const cache = new Map();
function pick(lang) {
  if (cache.has(lang)) return cache.get(lang);
  let out = EN;
  // English sabse neeche: chain ko END se shuru karna zaroori hai, warna
  // English (jo chain me aakhir me hota hai) har bhasha ko overwrite kar deta hai.
  const chain = langChain(lang);
  for (let i = chain.length - 1; i >= 0; i--) {
    const d = ALL[chain[i]];
    if (!d) continue;
    out = {
      rashi: d.rashi || out.rashi,
      varshik: d.varshik || out.varshik,
      daily: d.daily || out.daily,
    };
  }
  cache.set(lang, out);
  return out;
}

export function rashiTX(lang) { return pick(lang); }
export function varshikTX(lang) { return pick(lang).varshik; }
export function dailyTX(lang) { return pick(lang).daily; }

// RASHI_DATA se ek rashi ka full object (native text + luckyNum/dates).
export function rashiLang(i, lang, base) {
  const T = pick(lang).rashi;
  return { ...base, ...(T[i] || {}) };
}

// Purana export — Rashifal.jsx ise use karta hai.
export const DAILY_TX = new Proxy({}, {
  get: (_, lang) => pick(String(lang)).daily,
});

export default rashiTX;