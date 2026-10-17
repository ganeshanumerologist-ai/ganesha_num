// Janm jhalak strip ka CSS.
import fs from "node:fs";

const F = "src/styles.css";
let css = fs.readFileSync(F, "utf8");

if (css.includes(".bg-eyes")) {
  console.log("CSS pehle se hai");
  process.exit(0);
}

const CSS = `
/* ══════════════════════════════════════════════════════════════
   JANM JHALAK — result ke niche, ek nazar me poora birth chart.
   Pehle ye sab neeche scroll karne par milta tha, isliye page
   khaali lagta tha. Ab naam ke niche hi sab dikhta hai.
   ══════════════════════════════════════════════════════════════ */
.bg-eyes {
  margin-top: 20px;
  padding: 18px 16px;
  border-radius: 16px;
  background: linear-gradient(155deg, rgba(60, 68, 126, .78), rgba(38, 44, 88, .70));
  border: 1px solid rgba(255, 212, 94, .28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .07);
}
.bg-eyes-h {
  font-size: .74rem; font-weight: 800; letter-spacing: 2.2px;
  text-transform: uppercase; color: var(--gold);
  margin-bottom: 14px; text-align: center; opacity: .92;
}
.bg-eyes-grid {
  display: grid; gap: 9px;
  grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
}
.bg-eye {
  display: flex; flex-direction: column; gap: 3px;
  padding: 10px 12px; border-radius: 12px;
  background: rgba(20, 24, 56, .46);
  border: 1px solid rgba(255, 255, 255, .07);
  min-width: 0;
}
.bg-eye-k {
  font-size: .68rem; font-weight: 700; letter-spacing: .7px;
  color: var(--muted); text-transform: uppercase;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.bg-eye-v {
  font-size: .94rem; font-weight: 700; color: var(--text);
  line-height: 1.3;
  /* lambe naam (Purva Phalguni) bhi card se bahar na nikle */
  overflow-wrap: anywhere;
}
.bg-eye:first-child .bg-eye-v { color: var(--gold); }

@media (max-width: 640px) {
  .bg-eyes { padding: 14px 12px; }
  .bg-eyes-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .bg-eye { padding: 9px 10px; }
  .bg-eye-k { font-size: .7rem; }
  .bg-eye-v { font-size: .92rem; }
}
`;

fs.writeFileSync(F, css + CSS, "utf8");
console.log("bg-eyes CSS add ho gaya (" + CSS.split("\n").length + " lines)");
