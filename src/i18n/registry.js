// Central language registry.
// Har bhasha ka apna script/family hai. Jab koi key kisi bhasha me na ho,
// to English par seedha nahi girenge — pehle usi bhasha parivaar ki bhasha
// dekhenge (jaise Marathi ke liye Hindi/Devanagari), phir English.

export const LANGUAGES = [
  { code: "en", name: "English", native: "English", family: "latin" },
  { code: "hi", name: "Hindi", native: "हिन्दी", family: "deva" },
  { code: "bn", name: "Bengali", native: "বাংলা", family: "beng" },
  { code: "te", name: "Telugu", native: "తెలుగు", family: "telu" },
  { code: "mr", name: "Marathi", native: "मराठी", family: "deva" },
  { code: "ta", name: "Tamil", native: "தமிழ்", family: "taml" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", family: "gujr" },
  { code: "ur", name: "Urdu", native: "اردو", family: "arab" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", family: "kann" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", family: "orya" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", family: "mlym" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", family: "gurm" },
  { code: "as", name: "Assamese", native: "অসমীয়া", family: "beng" },
  { code: "mai", name: "Maithili", native: "मैथिली", family: "deva" },
  { code: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ", family: "olc" },
  { code: "ks", name: "Kashmiri", native: "कॉशुर", family: "arab" },
  { code: "ne", name: "Nepali", native: "नेपाली", family: "deva" },
  { code: "sd", name: "Sindhi", native: "سنڌي", family: "arab" },
  { code: "doi", name: "Dogri", native: "डोगरी", family: "deva" },
  { code: "mni", name: "Manipuri", native: "ꯃꯤꯇꯩ ꯂꯣꯟ", family: "mtei" },
  { code: "brx", name: "Bodo", native: "बड़ो", family: "deva" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्", family: "deva" },
];

export const LANG_CODES = LANGUAGES.map((l) => l.code);

const FAMILY = Object.fromEntries(LANGUAGES.map((l) => [l.code, l.family]));

// Neeche order = lookup priority. Pehli bhasha jiska translation mil gaya, wahi dikhega.
const FAMILY_ORDER = {
  deva: ["hi", "mr", "ne", "doi", "mai", "brx", "sa"],
  beng: ["bn", "as"],
  arab: ["ur", "ks", "sd"],
  telu: ["te"],
  taml: ["ta"],
  gujr: ["gu"],
  kann: ["kn"],
  orya: ["or"],
  mlym: ["ml"],
  gurm: ["pa"],
  olc: ["bn", "hi"],
  mtei: ["hi", "bn"],
  latin: ["en"],
};

// Har bhasha ke liye full lookup chain, ending par hamesha English.
const CACHE = {};
export function langChain(code) {
  if (CACHE[code]) return CACHE[code];
  const chain = [];
  if (LANG_CODES.includes(code)) chain.push(code);
  const fam = FAMILY_ORDER[FAMILY[code]];
  if (fam) for (const c of fam) if (!chain.includes(c)) chain.push(c);
  if (!chain.includes("en")) chain.push("en");
  CACHE[code] = chain;
  return chain;
}

export function isValidLang(code) {
  return LANG_CODES.includes(code);
}
export function normalizeLang(code) {
  return isValidLang(code) ? code : "en";
}
export function langNative(code) {
  return (LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]).native;
}

// Font stack: jis bhasha ka script hai, uske liye sahi font force karte hain
// taaki Devanagari/Tamil/Telugu sab apne hi look me render ho.
const SCRIPT_FONTS = {
  deva: '"Noto Sans Devanagari", Poppins, sans-serif',
  beng: '"Noto Sans Bengali", Poppins, sans-serif',
  telu: '"Noto Sans Telugu", Poppins, sans-serif',
  taml: '"Noto Sans Tamil", Poppins, sans-serif',
  gujr: '"Noto Sans Gujarati", Poppins, sans-serif',
  arab: '"Noto Sans Arabic", Poppins, sans-serif',
  kann: '"Noto Sans Kannada", Poppins, sans-serif',
  orya: '"Noto Sans Oriya", Poppins, sans-serif',
  mlym: '"Noto Sans Malayalam", Poppins, sans-serif',
  gurm: '"Noto Sans Gurmukhi", Poppins, sans-serif',
  olc: '"Noto Sans Ol Chiki", Poppins, sans-serif',
  mtei: '"Noto Sans Meetei Mayek", Poppins, sans-serif',
  latin: "Poppins, sans-serif",
};

export function fontFor(code) {
  return SCRIPT_FONTS[FAMILY[code]] || SCRIPT_FONTS.latin;
}

export default LANGUAGES;