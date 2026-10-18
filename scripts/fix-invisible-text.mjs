import fs from "node:fs";
const F = "src/styles.css";
let s = fs.readFileSync(F, "utf8");
let n = 0;
const rep = (from, to, why) => {
  const c = s.split(from).length - 1;
  if (!c) { console.log(`  MISS  ${why}`); return; }
  s = s.split(from).join(to); n += c;
  console.log(`  ${String(c).padStart(3)}x  ${why}`);
};

console.log("═══ INVISIBLE TEXT FIX ═══");

// 1. hero p — stale light pink (#e6d4da). Ye pehle #e2e6ff (stale indigo)
//    tha jo light theme me bhi pale hai. var(--muted) sahi hai (7.7:1).
rep(`.hero p {
  max-width: 760px; margin: 20px auto 34px;
  font-size: clamp(1rem, 1.9vw, 1.22rem);
  color: #e6d4da;
}`,
`.hero p {
  max-width: 760px; margin: 20px auto 34px;
  font-size: clamp(1rem, 1.9vw, 1.22rem);
  /* #e6d4da cream par 1.32:1 — bilkul invisible. Ye stale indigo
     (#e2e6ff) ka leftover tha. var(--muted) = 7.7:1 */
  color: var(--muted);
}`, "hero p → var(--muted)");

// 2. mobile block — light theme me ye rules DARK theme ke liye likhe gaye
//    the. Cream par ye text gayab ho jaata hai.
rep(".num-chip span { color: #f6e8d9; }",
    ".num-chip span { color: var(--text); }", "mobile: num-chip span → var(--text)");
rep(".kv .k, .label { color: #f6e8d9; }",
    ".kv .k, .label { color: var(--muted); }", "mobile: kv key/label → var(--muted)");

// 3. lal-kitab priority-2 orange — 2.11:1
rep(".lk-pri-2 { background: rgba(251,146,60,.20); color: #fb923c; border: 1px solid rgba(251,146,60,.42); }",
    ".lk-pri-2 { background: rgba(176,80,10,.16); color: #8f4008; border: 1px solid rgba(176,80,10,.42); }",
    "lk-pri-2 orange → deep (5.9:1)");

fs.writeFileSync(F, s, "utf8");
console.log(`\n${n} fix`);