// Varshik (2026) vistrit rashifal — ab src/data/rashi/<lang>.js se.
// Pehle is file me HI/MR/EN teeno Hinglish (Latin) likhe the, isliye har bhasha
// me same Hinglish dikhta tha.

import { varshikTX } from "./rashi_i18n.js";

export function varshikLang(i, lang) {
  const T = varshikTX(lang);
  return T[i] || {};
}

export default varshikLang;