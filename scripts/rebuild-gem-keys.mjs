// RECOVERY: pichhle dedupe script ne firstSeen teeno blocks me share kiya
// tha, isliye EN ke baad HI aur MR ke SAARE gem/muhurt/why keys delete ho
// gaye the (56 bache = sirf EN ke). Ab:
//   1. teeno blocks me se ye key family hata do (per-block)
//   2. EN / HI / MR teeno dobara inject karo
import fs from "node:fs";

const TXT = "src/i18n/kundliFullTX.js";
let txt = fs.readFileSync(TXT, "utf8");

// ── 1. per-block removal ──
const TARGET = /^\s*(k_gem_[A-Za-z]+_(?:stone|metal|day|finger)|k_mu_[A-Za-z]+|k_why_[A-Za-z]+):/;

let removed = 0;
for (const name of ["EN", "HI", "MR"]) {
  const marker = `const ${name} = {`;
  const i = txt.indexOf(marker);
  if (i < 0) { console.log(`!! ${name} block nahi mila`); continue; }
  const end = txt.indexOf("\n};", i);
  if (end < 0) continue;

  const body = txt.slice(i, end);
  const kept = body.split("\n").filter((l) => {
    if (TARGET.test(l)) { removed++; return false; }
    return true;
  });
  txt = txt.slice(0, i) + kept.join("\n") + txt.slice(end);
}
console.log(`${removed} stale lines hataye (teeno blocks, ek-ek karke)`);

// ── 2. tables ──
const GEM_EN = {
  Sun: ["Manik (Ruby)", "Gold", "Sunday", "Little finger"],
  Moon: ["Pearl", "Silver", "Monday", "Ring finger"],
  Mars: ["Red Coral", "Gold/Copper", "Tuesday", "Little finger"],
  Mercury: ["Emerald", "Gold", "Wednesday", "Index finger"],
  Jupiter: ["Yellow Sapphire", "Gold", "Thursday", "Index finger"],
  Venus: ["Diamond/Opal", "Platinum/Silver", "Friday", "Ring finger"],
  Saturn: ["Blue Sapphire", "Five metals", "Saturday", "Middle finger"],
  Rahu: ["Hessonite", "Gold", "Saturday", "Little finger"],
  Ketu: ["Cat's Eye", "Gold", "Tuesday", "Ring finger"],
};
const GEM_HI = {
  Sun: ["माणिक (हीरा)", "सोना", "रविवार", "अनामिका"],
  Moon: ["मोती", "चांदी", "सोमवार", "कनिष्ठा"],
  Mars: ["मूंगा (मूंग मणि)", "सोना/तांबा", "मंगलवार", "अनामिका"],
  Mercury: ["पन्ना", "सोना/रूपा", "बुधवार", "तर्जनी"],
  Jupiter: ["पुखराज", "सोना", "गुरुवार", "तर्जनी"],
  Venus: ["हीरा/ओपल", "प्लैटिनम/चांदी", "शुक्रवार", "कनिष्ठा"],
  Saturn: ["नीलम", "पंचधातु", "शनिवार", "मध्यमा"],
  Rahu: ["गोमेद", "सोना", "शनिवार", "अनामिका"],
  Ketu: ["लेहसुनिया", "सोना", "मंगलवार", "कनिष्ठा"],
};
const GEM_MR = {
  Sun: ["माणिक", "सोना", "रविवार", "अनामिका"],
  Moon: ["मोती", "चांदी", "सोमवार", "कनिष्ठा"],
  Mars: ["मूंगा", "सोना/तांबा", "मंगळवार", "अनामिका"],
  Mercury: ["पन्ना", "सोना/रूप", "बुधवार", "तर्जनी"],
  Jupiter: ["पुखराज", "सोना", "गुरुवार", "तर्जनी"],
  Venus: ["हीरा/ओपल", "प्लॅटिनम/चांदी", "शुक्रवार", "कनिष्ठा"],
  Saturn: ["नीलम", "पंचधातू", "शनिवार", "मध्यमा"],
  Rahu: ["गोमेद", "सोना", "शनिवार", "अनामिका"],
  Ketu: ["लेहसुनिया", "सोना", "मंगळवार", "कनिष्ठा"],
};

const MU_EN = {
  abhijit: "Abhijit Muhurat", brahma: "Brahma Muhurt", vijay: "Vijay Muhurt",
  godhuli: "Godhuli (sundown)", amrit: "Amrit Kaal", rahu: "Rahu Kaal",
  yamaganda: "Yamaganda", gulika: "Gulika Kaal", bhadra: "Bhadra (no marriage)",
  panchak: "Panchak (five tithis)", noNote: "fire dosha",
};
const MU_HI = {
  abhijit: "अभिजित मुहूर्त", brahma: "ब्रह्म मुहूर्त", vijay: "विजय मुहूर्त",
  godhuli: "गोधूली (सूर्यास्त)", amrit: "अमृत काल", rahu: "राहु काल",
  yamaganda: "यमगंड", gulika: "गुलिका काल", bhadra: "भद्रा (विवाह नहीं)",
  panchak: "पंचक (पाँच तिथियाँ)", noNote: "अग्नि दोष",
};
const MU_MR = {
  abhijit: "अभिजित मुहूर्त", brahma: "ब्रह्म मुहूर्त", vijay: "विजय मुहूर्त",
  godhuli: "गोधूली", amrit: "अमृत काळ", rahu: "राहु काळ",
  yamaganda: "यमगंड", gulika: "गुलिका काळ", bhadra: "भद्रा (लग्न नाही)",
  panchak: "पंचक", noNote: "अग्नि दोष",
};

const WHY_EN = {
  best: "Best in-house strength ({p}/8) in house {h} — most benefit",
  good: "Fair strength ({p}/8) in house {h} — worth wearing",
  weak: "Low strength ({p}/8) — not needed, wear only if you wish",
  node: "shadow planet — the texts advise against wearing these",
  akru: "malefic, weak, difficult house — no gain, more harm",
  debil: "already debilitated — the stone would unsettle it further",
  badHouse: "in house {h} — the house of loss, disease or travel",
  maxThree: "(more than 3 at once is not advised)",
  fallback: "most suitable — ",
};
const WHY_HI = {
  best: "भाव {h} में सर्वोत्तम बल ({p}/8) — सबसे अधिक लाभ",
  good: "भाव {h} में अच्छा बल ({p}/8) — पहनना लाभदायक",
  weak: "बल कम ({p}/8) — ज़रूरी नहीं, चाहें तो पहनें",
  node: "छाया ग्रह — शास्त्र में इन्हें न पहनने की सलाह है",
  akru: "अक्रू, कम बल और कठिन भाव — लाभ नहीं, दोष बढ़ेगा",
  debil: "पहले से निकला हुआ — रत्न से और बेचैनी होगी",
  badHouse: "{h}वें भाव में — नुकसान, रोग या यात्रा का भाव",
  maxThree: "(एक साथ 3 से ज़्यादा नहीं)",
  fallback: "सबसे उपयुक्त — ",
};
const WHY_MR = {
  best: "भाव {h} मध्ये उत्तम बळ ({p}/8) — सर्वाधिक फायदा",
  good: "भाव {h} मध्ये चांगला बळ ({p}/8) — घालणे फायद्याचे",
  weak: "बळ कमी ({p}/8) — आवश्यक नाही",
  node: "छाया ग्रह — शास्त्राने घालू नये असा सांगितला आहे",
  akru: "अक्रू, कमी बळ आणि कठीण भाव — फायदा नाही, दोष वाढेल",
  debil: "आधीच निकाली — रत्नाने आणखी अडचण येईल",
  badHouse: "{h}व्या भावात — नुकसान, रोग किंवा प्रवास",
  maxThree: "(एकदम 3 पेक्षा जास्त नाही)",
  fallback: "सर्वात योग्य — ",
};

const FIELDS = ["stone", "metal", "day", "finger"];
function build(GEMT, MUT, WHYT) {
  const out = {};
  for (const [p, arr] of Object.entries(GEMT)) {
    FIELDS.forEach((f, i) => { out[`k_gem_${p}_${f}`] = arr[i]; });
  }
  for (const [s, v] of Object.entries(MUT)) out[`k_mu_${s}`] = v;
  for (const [c, v] of Object.entries(WHYT)) out[`k_why_${c}`] = v;
  return out;
}

function inject(dict, name) {
  const marker = `const ${name} = {`;
  const i = txt.indexOf(marker);
  if (i < 0) throw new Error(`${name} block nahi mila`);
  const nl = txt.indexOf("\n", i);
  const line = "\n  " + Object.entries(dict).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(",\n  ") + ",";
  txt = txt.slice(0, nl) + line + txt.slice(nl);
}

inject(build(GEM_EN, MU_EN, WHY_EN), "EN");
inject(build(GEM_HI, MU_HI, WHY_HI), "HI");
inject(build(GEM_MR, MU_MR, WHY_MR), "MR");

fs.writeFileSync(TXT, txt, "utf8");
console.log("EN/HI/MR — 56 keys each, sahi UTF-8 ke saath");
