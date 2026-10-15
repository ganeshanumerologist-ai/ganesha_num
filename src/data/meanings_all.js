import { NUMBER_MEANINGS } from "./meanings.js";
import HI from "./meanings_hi.js";
import { MR, GU, PA, UR } from "./meanings_west.js";
import { TE, TA, KN, ML } from "./meanings_south.js";
import { BN, OR, AS } from "./meanings_east.js";
import { getStrengths } from "./strengths_i18n.js";

const TABLES = { hi: HI, mr: MR, gu: GU, pa: PA, ur: UR, te: TE, ta: TA, kn: KN, ml: ML, bn: BN, or: OR, as: AS };

// Chhoti bhashayein (Maithili, Nepali, Dogri, Bodo, Sanskrit, Kashmiri, Sindhi,
// Santali, Manipuri) apne parivaar ki bhasha se text lete hain — English seedha nahi.
const FALLBACK = {
  mai: "hi", ne: "hi", doi: "hi", brx: "hi", sa: "hi",
  ks: "ur", sd: "ur",
  sat: "bn",
  mni: "hi",
};

export function meaningLang(lang) {
  if (TABLES[lang]) return lang;
  return FALLBACK[lang] || "en";
}

const pick = (v, fb) => (typeof v === "string" && v.trim() ? v : fb);

// number + bhasha ke anusaar poora ank-phal.
// Har field ke liye: bhasha ka text -> wahi number ki English value.
// Isse koi field khaali ya English dikhakar nahi chhootegi.
export function getMeaning(n, lang) {
  const base = NUMBER_MEANINGS[n] || {};
  const code = meaningLang(lang);
  const en = {
    title: base.title || "",
    keywords: base.keywords || "",
    desc: base.description || "",
    career: base.careers || "",
    love: base.love || "",
    upay: base.challenges ? `Dhyaan rakhein: ${base.challenges}` : "",
    strengths: base.strengths || "",
  };

  if (code === "en") return en;

  const t = (TABLES[code] || {})[n] || {};
  return {
    title: pick(t.t, en.title),
    keywords: pick(t.k, en.keywords),
    desc: pick(t.s, en.desc),
    career: pick(t.c, en.career),
    love: pick(t.l, en.love),
    upay: pick(t.u, en.upay),
    // Pehle yahan 'st' padha hi nahi jaata tha, isliye Strengths hamesha English dikhta tha.
    strengths: getStrengths(n, lang) || t.st || en.strengths,
  };
}

export default getMeaning;