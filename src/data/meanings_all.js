import { NUMBER_MEANINGS } from "./meanings.js";
import HI from "./meanings_hi.js";
import { MR, GU, PA, UR } from "./meanings_west.js";
import { TE, TA, KN, ML } from "./meanings_south.js";
import { BN, OR, AS } from "./meanings_east.js";

const TABLES = { hi: HI, mr: MR, gu: GU, pa: PA, ur: UR, te: TE, ta: TA, kn: KN, ml: ML, bn: BN, or: OR, as: AS };

// Jin bhashaon ka poora anuvaad nahi hai, ve sabse najdeeki bhasha me dekhein.
// (sat/mni ke liye Ol Chiki/Meitei lipi me lekhan uplabdh nahi — English dikhega)
const FALLBACK = {
  mai: "hi", ne: "hi", doi: "hi", brx: "hi", sa: "hi",
  ks: "ur", sd: "ur",
};

export function meaningLang(lang) {
  if (TABLES[lang]) return lang;
  return FALLBACK[lang] || "en";
}

// number + bhasha ke anusaar poora ank-phal. English fields hamesha maujood.
export function getMeaning(n, lang) {
  const base = NUMBER_MEANINGS[n] || {};
  const code = meaningLang(lang);
  if (code === "en") {
    return {
      title: base.title || "",
      keywords: base.keywords || "",
      desc: base.description || "",
      career: base.careers || "",
      love: base.love || "",
      upay: base.challenges ? `Dhyaan rakhein: ${base.challenges}` : "",
      strengths: base.strengths || "",
    };
  }
  const t = (TABLES[code] || {})[n] || {};
  return {
    title: t.t || base.title || "",
    keywords: t.k || base.keywords || "",
    desc: t.s || base.description || "",
    career: t.c || base.careers || "",
    love: t.l || base.love || "",
    upay: t.u || "",
    strengths: base.strengths || "",
  };
}

export default getMeaning;
