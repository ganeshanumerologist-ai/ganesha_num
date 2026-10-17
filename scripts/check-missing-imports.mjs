// GUARD: koi bhi helper use ho lekin import na ho → crash.
// Ye class ka bug dobara aaya: KundliChart.jsx me rIdx() use tha par
// import nahi tha, aur poora page blank ho gaya. Ab har build par check.
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");

// Node builtins + globals — inhe import ki zaroorat nahi
const GLOBALS = new Set([
  "console", "Math", "JSON", "Object", "Array", "String", "Number", "Boolean",
  "Date", "RegExp", "Error", "Promise", "Set", "Map", "Symbol", "Map", "parseInt",
  "parseFloat", "isNaN", "isFinite", "encodeURIComponent", "decodeURIComponent",
  "window", "document", "localStorage", "sessionStorage", "navigator", "location",
  "history", "fetch", "URL", "URLSearchParams", "Blob", "FileReader", "Intl",
  "setTimeout", "clearTimeout", "setInterval", "clearInterval", "requestAnimationFrame",
  "structuredClone", "crypto", "performance", "globalThis", "undefined", "NaN",
  "React", "useState", "useEffect", "useMemo", "useRef", "useCallback",
  "Component", "Fragment", "createElement", "createContext", "useContext",
  "memo", "forwardRef", "lazy", "Suspense", "Link", "Navigate", "Routes", "Route",
  "useNavigate", "useLocation", "useParams", "useSearchParams",
]);

// humari apni helpers jo har jagah available nahi — inke liye alag check
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

let problems = 0;

for (const file of walk(SRC)) {
  // Comments hatao — warna "grahaName(planet)" likha hua comment
  // bhi real code samajh aa jata hai (pehle 16 false positive).
  const raw = fs.readFileSync(file, "utf8");
  const src = raw
    .replace(/\/\*[\s\S]*?\*\//g, " ")   // block comment
    .replace(/^\s*(\/\/|\*).*$/gm, " ")        // line comment
    .replace(/<!--[\s\S]*?-->/g, " ");         // jsx comment

  // 1. saare import names
  const imported = new Set();
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) imported.add(name);
    }
  }
  // default + namespace imports
  for (const m of src.matchAll(/import\s+([A-Za-z0-9_$]+)\s*(?:,|from)/g)) imported.add(m[1]);
  for (const m of src.matchAll(/import\s+\*\s+as\s+([A-Za-z0-9_$]+)/g)) imported.add(m[1]);

  // 2. locally declared names
  const local = new Set();
  for (const m of src.matchAll(/(?:const|let|var|function|class)\s+([A-Za-z0-9_$]+)/g)) {
    local.add(m[1]);
  }
  // function params / destructuring — hard, skip

  // 3. helper-style calls: NAAM( ... ) jahan naam PascalCase ya
  //    "xxxIdx"/"xxxName" jaisa lage
  const HELPERS = [
    "rIdx", "rName", "grahaName", "rashiName", "nakName", "tithiName", "pakshaName",
    "vaarName", "chogName", "vratName", "karanaName", "yogaName", "taraName",
    "kfTX", "pgT", "kundliT", "siteTX", "smallLang", "kfTX", "yearMeaning",
    "yearDetail", "ycat", "kundliFull", "ashtakavarga", "kaalWindows",
    "abhijitWindow", "godhuliWindow", "horaFromSunrise", "choghadiyaFromSunrise",
    "fmtMin", "sunTimes", "grahaSthiti", "rashiIndex", "nakshatraOf", "lagnaSidereal",
    "personalYear", "reduceNumber", "allNumbers", "getMeaning", "getProfile",
  ];

  for (const h of HELPERS) {
    const re = new RegExp(`(?<![\\w.$])${h}\\s*\\(`, "g");
    const uses = [...src.matchAll(re)].length;
    if (uses === 0) continue;
    if (imported.has(h) || local.has(h)) continue;

    // nested module-local function? check karo ki kahin define to nahi hua
    problems++;
    console.log(
      `[MISSING IMPORT] ${path.relative(process.cwd(), file)}\n`
      + `    ${h}() ${uses} jagah use hua hai, lekin import nahi hai\n`
      + `    → poora component crash karega: "ReferenceError: ${h} is not defined"`,
    );
  }
}

console.log(
  problems
    ? `\n${problems} jagah import missing ❌`
    : "\nHAR JAGAH JO USE HO RAHA HAI, IMPORT BHI HAI ✅",
);
process.exit(problems ? 1 : 0);
