// Varshphala (Personal Year) — public API.
//
// andar se data ab `src/data/varshpal/<bhasha>.js` se aata hai (resolver:
// varshpalTX.js). Is file ka kaam sirf purana interface sahi rakhna hai —
// 4 pages (Kundli, Forecast, Reports, AiChat) yahin se import karti hain.
//
// Pehle sirf hi/mr/en ka data tha:
//   * hi/mr ka "detail" Hinglish/romanized tha  → ab Devanagari me hai
//   * baaki 17 bhashayein seedha ENGLISH par gir jaati thi → ab apni bhasha par
import { varshpal, varshpalSource } from "./varshpalTX.js";
import { LANGUAGES } from "../i18n/registry.js";

/** Personal year 1..9 ka matlab. */
export function yearMeaning(py, lang) {
  const D = varshpal(lang);
  return D.meaning[py] || D.meaning[1] || {};
}

/** Personal year 1..9 ka vistar (padhai, shaadi, share, business, samman). */
export function yearDetail(py, lang) {
  const D = varshpal(lang);
  return D.detail[py - 1] || D.detail[0] || {};
}

/** Section labels (padhai, vivah, share, ...). */
export function ycat(lang) {
  return varshpal(lang).cat;
}

/** Kaunsi bhasha ka file chala — debugging/QA ke liye. */
export function ycatSource(lang) {
  return varshpalSource(lang);
}

/** Saari bhashaon ke labels ek saath (purane YCAT export ki jagah). */
export const YCAT = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, varshpal(l.code).cat]),
);

export default { yearMeaning, yearDetail, ycat, YCAT };