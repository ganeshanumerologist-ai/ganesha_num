// RATNA (stone/metal/day/finger) aur muhurat ke naam abhi bhi English me
// hardcoded the â€” Hindi view me "Pukhraj", "Abhijit Muhurat", "Sona"
// dikh raha tha. Inhe translation keys banate hain.
//
// Nayi key family:  k_gem_<planet>_<field>   (ratna)
//                   k_mu_<slug>              (muhurat)
//                   k_why_<code>             (gem ka "kyun")
import fs from "node:fs";

const SRC = "scripts/kf-source.json";
const TXT = "src/i18n/kundliFullTX.js";
const json = JSON.parse(fs.readFileSync(SRC, "utf8"));

// â”€â”€ 1. RATNA table â€” English source of truth â”€â”€
const GEM = {
  Sun: { stone: "Manik (Ruby)", metal: "Sona", day: "Ravivaar", finger: "Anamika" },
  Moon: { stone: "Moti (Pearl)", metal: "Chandi", day: "Somvaar", finger: "Kanishtha" },
  Mars: { stone: "Moonga (Red Coral)", metal: "Sona/Tamba", day: "Mangalvaar", finger: "Anamika" },
  Mercury: { stone: "Panna (Emerald)", metal: "Sona/Rupa", day: "Budhvaar", finger: "Tarjani" },
  Jupiter: { stone: "Pukhraj (Yellow Sapphire)", metal: "Sona", day: "Guruvaar", finger: "Tarjani" },
  Venus: { stone: "Heera/Opal", metal: "Sona/Chandi", day: "Shukravaar", finger: "Kanishtha" },
  Saturn: { stone: "Neelam (Blue Sapphire)", metal: "Panchdhatu", day: "Shanivaar", finger: "Madhyama" },
  Rahu: { stone: "Gomed (Hessonite)", metal: "Sona", day: "Shanivaar", finger: "Anamika" },
  Ketu: { stone: "Lehsunia (Cat's Eye)", metal: "Sona", day: "Mangalvaar", finger: "Kanishtha" },
};

// â”€â”€ 2. Muhurat / kaal ke naam â”€â”€
const MUHURT = {
  abhijit: "Abhijit Muhurat",
  brahma: "Brahma Muhurt",
  vijay: "Vijay Muhurt",
  godhuli: "Godhuli (sundown)",
  amrit: "Amrit Kaal",
  rahu: "Rahu Kaal",
  yamaganda: "Yamaganda",
  gulika: "Gulika Kaal",
  bhadra: "Bhadra (no marriage)",
  panchak: "Panchak (five tithis)",
  noNote: "fire dosha",
};

// â”€â”€ 3. Gem "kyun" â€” reason codes, text kundliFull.js me Hinglish tha â”€â”€
const WHY = {
  best: "Best in-house strength ({p}/8) + house {h} â€” most benefit",
  good: "Fair strength ({p}/8) + house {h} â€” worth wearing",
  weak: "Low strength ({p}/8) â€” not needed, wear only if you wish",
  node: "shadow planet â€” the texts advise against wearing these",
  akru: "malefic + weak + difficult house â€” no gain, more harm",
  debil: "already debilitated â€” the stone would unsettle it further",
  badHouse: "in house {h} â€” the house of loss, disease or travel",
  maxThree: "(more than 3 at once is not advised)",
  fallback: "most suitable â€” ",
};

// â”€â”€ key banao aur English source me daalo â”€â”€
let added = 0;
for (const [p, v] of Object.entries(GEM)) {
  for (const [field, val] of Object.entries(v)) {
    const k = `k_gem_${p}_${field}`;
    if (!(k in json.source)) { json.source[k] = val; json.keys.push(k); added++; }
  }
}
for (const [slug, val] of Object.entries(MUHURT)) {
  const k = `k_mu_${slug}`;
  if (!(k in json.source)) { json.source[k] = val; json.keys.push(k); added++; }
}
for (const [code, val] of Object.entries(WHY)) {
  const k = `k_why_${code}`;
  if (!(k in json.source)) { json.source[k] = val; json.keys.push(k); added++; }
}

fs.writeFileSync(SRC, JSON.stringify(json, null, 2), "utf8");
console.log(`kf-source.json: +${added} keys (total ${json.keys.length})`);

// â”€â”€ EN/HI/MR me inject â”€â”€
const HI_GEM = {
  Sun: ["à¤®à¤¾à¤£à¤¿à¤• (à¤¹à¥€à¤°à¤¾)", "à¤¸à¥‹à¤¨à¤¾", "à¤°à¤µà¤¿à¤µà¤¾à¤°", "à¤…à¤¨à¤¾à¤®à¤¿à¤•à¤¾"],
  Moon: ["à¤®à¥‹à¤¤à¥€", "à¤šà¤¾à¤‚à¤¦à¥€", "à¤¸à¥‹à¤®à¤µà¤¾à¤°", "à¤•à¤¨à¤¿à¤·à¥à¤ à¤¾"],
  Mars: ["à¤®à¥‚à¤‚à¤—à¤¾ (à¤®à¥‹à¤¤à¥€ à¤®à¥‚à¤‚à¤—)", "à¤¸à¥‹à¤¨à¤¾/à¤¤à¤¾à¤‚à¤¬à¤¾", "à¤®à¤‚à¤—à¤²à¤µà¤¾à¤°", "à¤…à¤¨à¤¾à¤®à¤¿à¤•à¤¾"],
  Mercury: ["à¤ªà¤¨à¥à¤¨à¤¾", "à¤¸à¥‹à¤¨à¤¾/à¤°à¥‚à¤ªà¤¾", "à¤¬à¥à¤§à¤µà¤¾à¤°", "à¤¤à¤°à¥à¤œà¤¨à¥€"],
  Jupiter: ["à¤ªà¥à¤–à¤°à¤¾à¤œ", "à¤¸à¥‹à¤¨à¤¾", "à¤—à¥à¤°à¥à¤µà¤¾à¤°", "à¤¤à¤°à¥à¤œà¤¨à¥€"],
  Venus: ["à¤¹à¥€à¤°à¤¾/à¤“à¤ªà¤²", "à¤¸à¥‹à¤¨à¤¾/à¤šà¤¾à¤‚à¤¦à¥€", "à¤¶à¥à¤•à¥à¤°à¤µà¤¾à¤°", "à¤•à¤¨à¤¿à¤·à¥à¤ à¤¾"],
  Saturn: ["à¤¨à¥€à¤²à¤®", "à¤ªà¤‚à¤šà¤§à¤¾à¤¤à¥", "à¤¶à¤¨à¤¿à¤µà¤¾à¤°", "à¤®à¤§à¥à¤¯à¤®à¤¾"],
  Rahu: ["à¤—à¥‹à¤®à¥‡à¤¦", "à¤¸à¥‹à¤¨à¤¾", "à¤¶à¤¨à¤¿à¤µà¤¾à¤°", "à¤…à¤¨à¤¾à¤®à¤¿à¤•à¤¾"],
  Ketu: ["à¤²à¥‡à¤¹à¤¸à¥à¤¨à¤¿à¤¯à¤¾", "à¤¸à¥‹à¤¨à¤¾", "à¤®à¤‚à¤—à¤²à¤µà¤¾à¤°", "à¤•à¤¨à¤¿à¤·à¥à¤ à¤¾"],
};
const HI_MU = {
  abhijit: "à¤…à¤­à¤¿à¤œà¤¿à¤¤ à¤®à¥à¤¹à¥‚à¤°à¥à¤¤", brahma: "à¤¬à¥à¤°à¤¹à¥à¤® à¤®à¥à¤¹à¥‚à¤°à¥à¤¤", vijay: "à¤µà¤¿à¤œà¤¯ à¤®à¥à¤¹à¥‚à¤°à¥à¤¤",
  godhuli: "à¤—à¥‹à¤§à¥‚à¤²à¥€ (à¤¸à¥‚à¤°à¥à¤¯à¤¾à¤¸à¥à¤¤)", amrit: "à¤…à¤®à¥ƒà¤¤ à¤•à¤¾à¤²", rahu: "à¤°à¤¾à¤¹à¥ à¤•à¤¾à¤²",
  yamaganda: "à¤¯à¤®à¤—à¤‚à¤¡", gulika: "à¤—à¥à¤²à¤¿à¤•à¤¾ à¤•à¤¾à¤²", bhadra: "à¤­à¤¦à¥à¤°à¤¾ (à¤µà¤¿à¤µà¤¾à¤¹ à¤¨à¤¹à¥€à¤‚)",
  panchak: "à¤ªà¤‚à¤šà¤• (à¤ªà¤¾à¤à¤š à¤¤à¤¿à¤¥à¤¿à¤¯à¤¾à¤)", noNote: "à¤…à¤—à¥à¤¨à¤¿ à¤¦à¥‹à¤·",
};
const HI_WHY = {
  best: "à¤­à¤¾à¤µ {h} à¤®à¥‡à¤‚ à¤¸à¤°à¥à¤µà¥‹à¤¤à¥à¤¤à¤® à¤¬à¤² ({p}/8) â€” à¤¸à¤¬à¤¸à¥‡ à¤…à¤§à¤¿à¤• à¤²à¤¾à¤­",
  good: "à¤­à¤¾à¤µ {h} à¤®à¥‡à¤‚ à¤…à¤šà¥à¤›à¤¾ à¤¬à¤² ({p}/8) â€” à¤ªà¤¹à¤¨à¤¨à¤¾ à¤²à¤¾à¤­à¤¦à¤¾à¤¯à¤•",
  weak: "à¤¬à¤² à¤•à¤® ({p}/8) â€” à¤œà¤¼à¤°à¥‚à¤°à¥€ à¤¨à¤¹à¥€à¤‚, à¤šà¤¾à¤¹à¥‡à¤‚ à¤¤à¥‹ à¤ªà¤¹à¤¨à¥‡à¤‚",
  node: "à¤›à¤¾à¤¯à¤¾ à¤—à¥à¤°à¤¹ â€” à¤¶à¤¾à¤¸à¥à¤¤à¥à¤° à¤®à¥‡à¤‚ à¤‡à¤¨à¥à¤¹à¥‡à¤‚ à¤¨ à¤ªà¤¹à¤¨à¤¨à¥‡ à¤•à¥€ à¤¸à¤²à¤¾à¤¹ à¤¹à¥ˆ",
  akru: "à¤…à¤•à¥à¤°à¥‚ + à¤•à¤® à¤¬à¤² + à¤•à¤ à¤¿à¤¨ à¤­à¤¾à¤µ â€” à¤²à¤¾à¤­ à¤¨à¤¹à¥€à¤‚, à¤¦à¥‹à¤· à¤¬à¤¢à¤¼à¥‡à¤—à¤¾",
  debil: "à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤¨à¤¿à¤•à¤²à¤¾ à¤¹à¥à¤† â€” à¤°à¤¤à¥à¤¨ à¤¸à¥‡ à¤”à¤° à¤¬à¥‡à¤šà¥ˆà¤¨à¥€ à¤¹à¥‹à¤—à¥€",
  badHouse: "{h}à¤µà¥‡à¤‚ à¤­à¤¾à¤µ à¤®à¥‡à¤‚ â€” à¤¨à¥à¤•à¤¸à¤¾à¤¨, à¤°à¥‹à¤— à¤¯à¤¾ à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤•à¤¾ à¤­à¤¾à¤µ",
  maxThree: "(à¤à¤• à¤¸à¤¾à¤¥ 3 à¤¸à¥‡ à¤œà¤¼à¥à¤¯à¤¾à¤¦à¤¾ à¤¨à¤¹à¥€à¤‚)",
  fallback: "à¤¸à¤¬à¤¸à¥‡ à¤‰à¤ªà¤¯à¥à¤•à¥à¤¤ â€” ",
};

const MR_GEM = {
  Sun: ["à¤®à¤¾à¤£à¤¿à¤•", "à¤¸à¥‹à¤¨à¤¾", "à¤°à¤µà¤¿à¤µà¤¾à¤°", "à¤…à¤¨à¤¾à¤®à¤¿à¤•à¤¾"],
  Moon: ["à¤®à¥‹à¤¤à¥€", "à¤šà¤¾à¤‚à¤¦à¥€", "à¤¸à¥‹à¤®à¤µà¤¾à¤°", "à¤•à¤¨à¤¿à¤·à¥à¤ à¤¾"],
  Mars: ["à¤®à¥‚à¤‚à¤—à¤¾", "à¤¸à¥‹à¤¨à¤¾/à¤¤à¤¾à¤‚à¤¬à¤¾", "à¤®à¤‚à¤—à¤³à¤µà¤¾à¤°", "à¤…à¤¨à¤¾à¤®à¤¿à¤•à¤¾"],
  Mercury: ["à¤ªà¤¨à¥à¤¨à¤¾", "à¤¸à¥‹à¤¨à¤¾/à¤°à¥‚à¤ª", "à¤¬à¥à¤§à¤µà¤¾à¤°", "à¤¤à¤°à¥à¤œà¤¨à¥€"],
  Jupiter: ["à¤ªà¥à¤–à¤°à¤¾à¤œ", "à¤¸à¥‹à¤¨à¤¾", "à¤—à¥à¤°à¥à¤µà¤¾à¤°", "à¤¤à¤°à¥à¤œà¤¨à¥€"],
  Venus: ["à¤¹à¥€à¤°à¤¾/à¤“à¤ªà¤²", "à¤¸à¥‹à¤¨à¤¾/à¤šà¤¾à¤‚à¤¦à¥€", "à¤¶à¥à¤•à¥à¤°à¤µà¤¾à¤°", "à¤•à¤¨à¤¿à¤·à¥à¤ à¤¾"],
  Saturn: ["à¤¨à¥€à¤²à¤®", "à¤ªà¤‚à¤šà¤§à¤¾à¤¤à¥‚", "à¤¶à¤¨à¤¿à¤µà¤¾à¤°", "à¤®à¤§à¥à¤¯à¤®à¤¾"],
  Rahu: ["à¤—à¥‹à¤®à¥‡à¤¦", "à¤¸à¥‹à¤¨à¤¾", "à¤¶à¤¨à¤¿à¤µà¤¾à¤°", "à¤…à¤¨à¤¾à¤®à¤¿à¤•à¤¾"],
  Ketu: ["à¤²à¥‡à¤¹à¤¸à¥à¤¨à¤¿à¤¯à¤¾", "à¤¸à¥‹à¤¨à¤¾", "à¤®à¤‚à¤—à¤³à¤µà¤¾à¤°", "à¤•à¤¨à¤¿à¤·à¥à¤ à¤¾"],
};
const MR_MU = {
  abhijit: "à¤…à¤­à¤¿à¤œà¤¿à¤¤ à¤®à¥à¤¹à¥‚à¤°à¥à¤¤", brahma: "à¤¬à¥à¤°à¤¹à¥à¤® à¤®à¥à¤¹à¥‚à¤°à¥à¤¤", vijay: "à¤µà¤¿à¤œà¤¯ à¤®à¥à¤¹à¥‚à¤°à¥à¤¤",
  godhuli: "à¤—à¥‹à¤§à¥‚à¤²à¥€", amrit: "à¤…à¤®à¥ƒà¤¤ à¤•à¤¾à¤³", rahu: "à¤°à¤¾à¤¹à¥ à¤•à¤¾à¤³",
  yamaganda: "à¤¯à¤®à¤—à¤‚à¤¡", gulika: "à¤—à¥à¤²à¤¿à¤•à¤¾ à¤•à¤¾à¤³", bhadra: "à¤­à¤¦à¥à¤°à¤¾ (à¤²à¤—à¥à¤¨ à¤¨à¤¾à¤¹à¥€)",
  panchak: "à¤ªà¤‚à¤šà¤•", noNote: "à¤…à¤—à¥à¤¨à¤¿ à¤¦à¥‹à¤·",
};
const MR_WHY = {
  best: "à¤­à¤¾à¤µ {h} à¤®à¤§à¥à¤¯à¥‡ à¤‰à¤¤à¥à¤¤à¤® à¤¬à¤³ ({p}/8) â€” à¤¸à¤°à¥à¤µà¤¾à¤§à¤¿à¤• à¤«à¤¾à¤¯à¤¦à¤¾",
  good: "à¤­à¤¾à¤µ {h} à¤®à¤§à¥à¤¯à¥‡ à¤šà¤¾à¤‚à¤—à¤²à¤¾ à¤¬à¤³ ({p}/8) â€” à¤˜à¤¾à¤²à¤£à¥‡ à¤«à¤¾à¤¯à¤¦à¥à¤¯à¤¾à¤šà¥‡",
  weak: "à¤¬à¤³ à¤•à¤®à¥€ ({p}/8) â€” à¤†à¤µà¤¶à¥à¤¯à¤• à¤¨à¤¾à¤¹à¥€, à¤‡à¤šà¥à¤›à¥‡à¤¨à¥à¤¸à¤¾à¤°",
  node: "à¤›à¤¾à¤¯à¤¾ à¤—à¥à¤°à¤¹ â€” à¤¶à¤¾à¤¸à¥à¤¤à¥à¤°à¤¾à¤¨à¥‡ à¤˜à¤¾à¤²à¥‚ à¤¨à¤¯à¥‡ à¤…à¤¸à¤¾ à¤¸à¤¾à¤‚à¤—à¤¿à¤¤à¤²à¤¾ à¤†à¤¹à¥‡",
  akru: "à¤…à¤•à¥à¤°à¥‚ + à¤•à¤®à¥€ à¤¬à¤³ + à¤•à¤ à¥€à¤£ à¤­à¤¾à¤µ â€” à¤«à¤¾à¤¯à¤¦à¤¾ à¤¨à¤¾à¤¹à¥€, à¤¦à¥‹à¤· à¤µà¤¾à¤¢à¥‡à¤²",
  debil: "à¤†à¤§à¥€à¤š à¤¨à¤¿à¤•à¤¾à¤²à¥€ â€” à¤°à¤¤à¥à¤¨à¤¾à¤¨à¥‡ à¤†à¤£à¤–à¥€ à¤…à¤¡à¤šà¤£ à¤¯à¥‡à¤ˆà¤²",
  badHouse: "{h}à¤µà¥à¤¯à¤¾ à¤­à¤¾à¤µà¤¾à¤¤ â€” à¤¨à¥à¤•à¤¸à¤¾à¤¨, à¤°à¥‹à¤— à¤•à¤¿à¤‚à¤µà¤¾ à¤ªà¥à¤°à¤µà¤¾à¤¸à¤¾à¤šà¤¾ à¤­à¤¾à¤µ",
  maxThree: "(à¤à¤•à¤¦à¤® 3 à¤ªà¥‡à¤•à¥à¤·à¤¾ à¤œà¤¾à¤¸à¥à¤¤ à¤¨à¤¾à¤¹à¥€)",
  fallback: "à¤¸à¤°à¥à¤µà¤¾à¤¤ à¤¯à¥‹à¤—à¥à¤¯ â€” ",
};

let txt = fs.readFileSync(TXT, "utf8");

function build(GEMT, MUT, WHY, fallbackStone) {
  const out = {};
  const fields = ["stone", "metal", "day", "finger"];
  for (const [p, arr] of Object.entries(GEMT)) {
    fields.forEach((f, i) => { out[`k_gem_${p}_${f}`] = arr[i]; });
  }
  for (const [slug, v] of Object.entries(MUT)) out[`k_mu_${slug}`] = v;
  for (const [code, v] of Object.entries(WHY)) out[`k_why_${code}`] = v;
  void fallbackStone;
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

inject(build(GEM, MUHURT, WHY), "EN");
inject(build(HI_GEM, HI_MU, HI_WHY), "HI");
inject(build(MR_GEM, MR_MU, MR_WHY), "MR");

fs.writeFileSync(TXT, txt, "utf8");
console.log("kundliFullTX.js: EN/HI/MR me ratna + muhurat + why keys inject");
