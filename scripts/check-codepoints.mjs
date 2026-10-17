import { kfTX } from "../src/i18n/kundliFullTX.js";
import fs from "node:fs";

const hi = kfTX("hi");
const v = hi.k_gem_Jupiter_stone;

const cps = [...v].map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0"));
const lines = [];
lines.push(`value     : ${v}`);
lines.push(`length    : ${v.length}`);
lines.push(`codepoints: ${cps.join(" ")}`);
lines.push("");
lines.push(`U+092A (pa) hai?   ${cps.includes("U+092A")}`);
lines.push(`U+00C2 (mangled)?  ${cps.includes("U+00C2")}`);

// sabhi gem keys ek hi test se
const bad = [];
for (const [k, val] of Object.entries(hi)) {
  if (!/^k_gem_|^k_mu_|^k_why_/.test(k)) continue;
  const s = String(val);
  if (/[\u00C2\u00C3\uFFFD]/.test(s)) bad.push(`${k} = MANGLED`);
  if (/[A-Za-z]{2,}/.test(s) && !/^(k_why_)/.test(k)) bad.push(`${k} = LATIN: ${s.slice(0, 30)}`);
}
lines.push("");
lines.push(`gem/muhurt/why keys me problem: ${bad.length ? bad.join(" | ") : "NONE ✅"}`);

// puri hi dictionary ka latin scan
const lat = Object.entries(hi).filter(([, x]) => /[A-Za-z]{2,}/.test(String(x)));
lines.push(`poori hi dictionary me latin wale keys: ${lat.length ? lat.map(([k]) => k).join(", ") : "NONE"}`);

fs.writeFileSync("scripts/_codepoint.txt", lines.join("\n"), "utf8");
console.log("likha");
