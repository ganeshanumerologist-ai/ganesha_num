// REPAIR: PowerShell ka Get-Content/Set-Content round-trip ne is script ke
// Devanagari literals ko double-encode kar diya tha (पु → à¤ª).
// Is script ko write-tool se likha gaya hai, isliye bytes sahi hain.
// Ye HI/MR ke k_gem_/k_mu_/k_why_ blocks ko theek se dobara inject karta hai.
import fs from "node:fs";

const TXT = "src/i18n/kundliFullTX.js";
let txt = fs.readFileSync(TXT, "utf8");

// ── 1. corrupt keys hatao (EN ke ASCII wale theek hain, woh rahte hain) ──
const PREFIX = /^(k_gem_[A-Za-z]+_(?:stone|metal|day|finger)|k_mu_[a-zA-Z]+|k_why_[a-zA-Z]+):.*$/gm;
let removed = 0;
for (const name of ["EN", "HI", "MR"]) {
  const marker = `const ${name} = {`;
  const i = txt.indexOf(marker);
  if (i < 0) continue;
  // block khatam: agla "\n};" ya agla "const XXX = {"
  const end = txt.indexOf("\n};", i);
  if (end < 0) continue;
  const body = txt.slice(i, end);
  const cleaned = body.replace(PREFIX, (m) => { removed++; return "__DROP__"; })
    .split("\n")
    .filter((l) => l.trim() !== "__DROP__")
    .join("\n");
  txt = txt.slice(0, i) + cleaned + txt.slice(end);
}
console.log(`${removed} purane (corrupt) lines hataye`);

// ── 2. sahi values dobara inject ──
const GEM = {
  Sun: ["माणिक (हीरा)", "सोना", "रविवार", "अनामिका"],
  Moon: ["मोती", "चांदी", "सोमवार", "कनिष्ठा"],
  Mars: ["मूंगा (मूंग मणि)", "सोना/तांबा", "मंगलवार", "अनामिका"],
  Mercury: ["पन्ना", "सोना/रूपा", "बुधवार", "तर्जनी"],
  Jupiter: ["पुखराज", "सोना", "गुरुवार", "तर्जनी"],
  Venus: ["हीरा/ओपल", "सोना/चांदी", "शुक्रवार", "कनिष्ठा"],
  Saturn: ["नीलम", "पंचधातु", "शनिवार", "मध्यमा"],
  Rahu: ["गोमेद", "सोना", "शनिवार", "अनामिका"],
  Ketu: ["लेहसुनिया", "सोना", "मंगलवार", "कनिष्ठा"],
};
const MU_HI = {
  abhijit: "अभिजित मुहूर्त", brahma: "ब्रह्म मुहूर्त", vijay: "विजय मुहूर्त",
  godhuli: "गोधूली (सूर्यास्त)", amrit: "अमृत काल", rahu: "राहु काल",
  yamaganda: "यमगंड", gulika: "गुलिका काल", bhadra: "भद्रा (विवाह नहीं)",
  panchak: "पंचक (पाँच तिथियाँ)", noNote: "अग्नि दोष",
};
const WHY_HI = {
  best: "भाव {h} में सर्वोत्तम बल ({p}/8) — सबसे अधिक लाभ",
  good: "भाव {h} में अच्छा बल ({p}/8) — पहनना लाभदायक",
  weak: "बल कम ({p}/8) — ज़रूरी नहीं, चाहें तो पहनें",
  node: "छाया ग्रह — शास्त्र में इन्हें न पहनने की सलाह है",
  akru: "अक्रू + कम बल + कठिन भाव — लाभ नहीं, दोष बढ़ेगा",
  debil: "पहले से निकला हुआ — रत्न से और बेचैनी होगी",
  badHouse: "{h}वें भाव में — नुकसान, रोग या यात्रा का भाव",
  maxThree: "(एक साथ 3 से ज़्यादा नहीं)",
  fallback: "सबसे उपयुक्त — ",
};

const GEM_MR = {
  Sun: ["माणिक", "सोना", "रविवार", "अनामिका"],
  Moon: ["मोती", "चांदी", "सोमवार", "कनिष्ठा"],
  Mars: ["मूंगा", "सोना/तांबा", "मंगळवार", "अनामिका"],
  Mercury: ["पन्ना", "सोना/रूप", "बुधवार", "तर्जनी"],
  Jupiter: ["पुखराज", "सोना", "गुरुवार", "तर्जनी"],
  Venus: ["हीरा/ओपल", "सोना/चांदी", "शुक्रवार", "कनिष्ठा"],
  Saturn: ["नीलम", "पंचधातू", "शनिवार", "मध्यमा"],
  Rahu: ["गोमेद", "सोना", "शनिवार", "अनामिका"],
  Ketu: ["लेहसुनिया", "सोना", "मंगळवार", "कनिष्ठा"],
};
const MU_MR = {
  abhijit: "अभिजित मुहूर्त", brahma: "ब्रह्म मुहूर्त", vijay: "विजय मुहूर्त",
  godhuli: "गोधूली", amrit: "अमृत काळ", rahu: "राहु काळ",
  yamaganda: "यमगंड", gulika: "गुलिका काळ", bhadra: "भद्रा (लग्न नाही)",
  panchak: "पंचक", noNote: "अग्नि दोष",
};
const WHY_MR = {
  best: "भाव {h} मध्ये उत्तम बळ ({p}/8) — सर्वाधिक फायदा",
  good: "भाव {h} मध्ये चांगला बळ ({p}/8) — घालणे फायद्याचे",
  weak: "बळ कमी ({p}/8) — आवश्यक नाही",
  node: "छाया ग्रह — शास्त्राने घालू नये असा सांगितला आहे",
  akru: "अक्रू + कमी बळ + कठीण भाव — फायदा नाही, दोष वाढेल",
  debil: "आधीच निकाली — रत्नाने आणखी अडचण येईल",
  badHouse: "{h}व्या भावात — नुकसान, रोग किंवा प्रवास",
  maxThree: "(एकदम 3 पेक्षा जास्त नाही)",
  fallback: "सर्वात योग्य — ",
};

const FIELDS = ["stone", "metal", "day", "finger"];
function block(GEMT, MUT, WHY) {
  const out = {};
  for (const [p, arr] of Object.entries(GEMT)) {
    FIELDS.forEach((f, i) => { out[`k_gem_${p}_${f}`] = arr[i]; });
  }
  for (const [s, v] of Object.entries(MUT)) out[`k_mu_${s}`] = v;
  for (const [c, v] of Object.entries(WHY)) out[`k_why_${c}`] = v;
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

inject(block(GEM, MU_HI, WHY_HI), "HI");
inject(block(GEM_MR, MU_MR, WHY_MR), "MR");

fs.writeFileSync(TXT, txt, "utf8");
console.log("HI/MR ke ratna + muhurat + why keys sahi bytes ke saath inject");
