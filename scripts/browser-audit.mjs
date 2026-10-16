// Browser-side audit: har page × har bhasha.
//   - page khaali to nahi (React crash)
//   - console me error to nahi
//   - page ka text usi bhasha ke script me hai ya English leak hai
//
// Isse run karne ke liye site live honi chahiye.
// node scripts/browser-audit.mjs [baseUrl]

const BASE = process.argv[2] || "http://localhost:5199";

const PAGES = [
  "/calculator", "/kundli", "/charts", "/loshu", "/match", "/forecast",
  "/panchang", "/rashifal", "/gochar", "/shani", "/muhurat", "/reports",
  "/remedies", "/daily", "/calendar", "/blog", "/gallery", "/experts",
  "/chat", "/about", "/contact", "/dashboard", "/",
];
const LANGS = ["hi", "mr", "bn", "te", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as", "ne", "sa"];

const SCRIPT = {
  hi: [0x0900, 0x097F], mr: [0x0900, 0x097F], ne: [0x0900, 0x097F], sa: [0x0900, 0x097F],
  bn: [0x0980, 0x09FF], as: [0x0980, 0x09FF],
  te: [0x0C00, 0x0C7F], kn: [0x0C80, 0x0CFF],
  ta: [0x0B80, 0x0BFF],
  or: [0x0B00, 0x0B7F],
  ml: [0x0D00, 0x0D7F],
  gu: [0x0A80, 0x0AFF], pa: [0x0A00, 0x0A7F],
  ur: [0x0600, 0x06FF],
};

const res = await fetch(BASE + "/", { redirect: "manual" }).catch(() => null);
if (!res) { console.error(`Site ${BASE} par reachable nahi hai.`); process.exit(1); }
console.log(`Site reachable: ${BASE}\n`);

console.log("(Ye script browser ke andar chalana hai — opencode ke browser tool se.)");
console.log(`Pages: ${PAGES.length}  Languages: ${LANGS.length}  Total: ${PAGES.length * LANGS.length}`);
console.log(`Script ranges:\n${JSON.stringify(SCRIPT, null, 0)}`);