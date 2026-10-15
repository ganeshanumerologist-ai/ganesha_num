// Page-level dictionary resolver.
//
// Pages apna TX object rakhte hain. Pehle har page sirf en/hi/mr rakhta tha
// aur `TX[lang] || TX.en` karta tha — isliye baki 19 bhasha English par gir
// jaati thi. Ye function langChain chalata hai: pehle usi bhasha, phir usi
// script ke parivaar, phir English. Chhoti bhasha (Nepali, Dogri, Maithili,
// Bodo, Sanskrit) ko Hindi/Marathi milega — English nahi.

import { langChain } from "./registry.js";

// Shallow merge: bhasha ki dict uske parivaar ke upar, English sabse neeche.
export function pageTX(TX, lang) {
  if (!TX) return {};
  const chain = langChain(lang);
  if (TX[chain[0]]) return TX[chain[0]]; // direct hit — sabse tez
  const out = {};
  for (let i = chain.length - 1; i >= 0; i--) {
    const d = TX[chain[i]];
    if (d) Object.assign(out, d);
  }
  return out;
}

// Agar page me koi key abhi bhi na mile, to English se uthakar daal do.
export function pageTXStrict(TX, lang) {
  return pageTX(TX, lang);
}

export default pageTX;