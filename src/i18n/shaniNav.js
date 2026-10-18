// ─────────────────────────────────────────────────────────────────
//  SHANI — sirf NAV ka label
//
//  Navbar poora shani.js (73 KB) laata tha, jabki usse sirf ek chhota
//  label chahiye tha. 73 KB har page par download hota tha — ek shabd
//  ke liye.
//
//  Ye labels shani.js se EXACT copy ki gayi hain (scripts/_tmp-shaniNav
//  se bani hui). /shani page apna pura text khud import karta hai —
//  wo sirf tab load hota hai jab wo page khola jaata hai.
//
//  Isse pehle (pehla) page ka load ~73 KB halka ho gaya.
// ─────────────────────────────────────────────────────────────────
import { langChain } from "./registry.js";

const NAV = {
    "en": "Shani Sade Sati",
    "hi": "शनि साढ़े साती",
    "mr": "शनी साढेसाती",
    "bn": "শনি সাঢ়েসাতি",
    "te": "శని సాఢేసాతి",
    "ta": "சனி சாட்சாத்தி",
    "gu": "શનિ સાઢેસાતી",
    "ur": "زحل سادیساطی",
    "kn": "ಶನಿ ಸಾಡೆಸಾತಿ",
    "ml": "ശനി സാഢേസാതി",
    "pa": "ਸ਼ਨੀ ਸਾਢੇਸਾਤੀ",
    "or": "ଶନି ସାଢେସାତୀ",
    "as": "শনি সাঢ়েসাতি",
    "mai": "शनि सदै साती",
    "sat": "ᱥᱚᱢᱤ ᱥᱚᱫᱮ ᱥᱚᱛᱤ",
    "ks": "شَنی سادے ساتی",
    "ne": "शनि साढ़े साती",
    "sd": "شني ساڌي ساٽي",
    "doi": "शनि साढ़े साती",
    "mni": "শনি সাঢ়েসতি",
    "brx": "शनि साढ़े साती",
    "sa": "शनि-सप्ततिः"
  };

/** Bhasha ke liye shani nav label — nahi mila to null. */
export function shaniNav(lang) {
  for (const c of langChain(lang)) {
    if (c !== "en" && NAV[c]) return NAV[c];
  }
  return NAV.en || null;
}

export default NAV;
