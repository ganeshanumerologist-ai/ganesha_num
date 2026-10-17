// Naye Kundli-chart hisson ka CSS — styles.css ke ant me add karo.
import fs from "node:fs";

const CSS = `

/* ══════════════════════════════════════════════════════════════
   Naye hisse: वर्षफल scope · लालकिताब · रत्न recommendation · शुभ/अशुभ
   ══════════════════════════════════════════════════════════════ */

/* ── वर्षफल: kaun sa saal chal raha hai ── */
.vyear-now {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 18px; margin-bottom: 14px; border-radius: 16px;
  background: linear-gradient(120deg, rgba(255,212,94,.16), rgba(167,139,250,.14));
  border: 1px solid rgba(255,212,94,.40);
}
.vyear-now-num {
  font-size: 3rem; font-weight: 800; line-height: 1;
  color: var(--gold);
  text-shadow: 0 2px 14px rgba(255,212,94,.45);
  min-width: 62px; text-align: center;
}
.vyear-now-lbl { font-size: 1.02rem; font-weight: 700; color: var(--text); }
.vyear-now-sub { font-size: .82rem; color: var(--muted); }

.vy-row { padding: 10px 0; border-bottom: 1px solid var(--border); }
.vy-on {
  background: rgba(255,212,94,.08);
  border-radius: 12px; padding: 12px 10px;
  border: 1px solid rgba(255,212,94,.30);
}
.vy-badge {
  font-style: normal; font-size: .66rem; margin-left: 8px;
  padding: 2px 9px; border-radius: 999px; font-weight: 700;
  background: rgba(255,212,94,.22); color: var(--gold);
  border: 1px solid rgba(255,212,94,.42);
}

/* ── लालकिताब: har graha ka pura upay ── */
.lk-row {
  padding: 14px; margin-bottom: 12px; border-radius: 14px;
  background: linear-gradient(160deg, rgba(44,51,102,.55), rgba(30,35,76,.45));
  border: 1px solid var(--border);
}
.lk-top {
  border-color: rgba(255,212,94,.45);
  background: linear-gradient(160deg, rgba(58,64,120,.6), rgba(36,42,88,.5));
}
.lk-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 9px; }
.lk-head b { font-size: 1.08rem; color: var(--gold); }
.lk-house { font-size: .76rem; color: var(--muted); }
.lk-pri {
  margin-left: auto; font-size: .66rem; font-weight: 700;
  padding: 3px 10px; border-radius: 999px; letter-spacing: .4px;
}
.lk-pri-1 { background: rgba(255,212,94,.22); color: var(--gold); border: 1px solid rgba(255,212,94,.45); }
.lk-pri-2 { background: rgba(251,146,60,.20); color: #fb923c; border: 1px solid rgba(251,146,60,.42); }
.lk-pri-3 { background: rgba(255,255,255,.07); color: var(--muted); border: 1px solid var(--border); }

.lk-grid {
  display: grid; grid-template-columns: minmax(92px, 30%) 1fr;
  gap: 6px 12px; font-size: .84rem;
}
.lk-k { color: var(--muted); font-weight: 600; }
.lk-v { color: var(--text); }
.lk-v b { color: var(--gold); }
.lk-base {
  margin-top: 9px; padding-top: 9px; font-size: .78rem;
  border-top: 1px dashed var(--border); color: var(--muted);
}
.lk-base span { color: var(--gold); font-weight: 700; }

/* ── रत्न: saaf recommendation ── */
.gem-rec {
  padding: 16px; border-radius: 16px; margin-bottom: 14px;
  background: linear-gradient(135deg, rgba(94,231,245,.14), rgba(255,212,94,.12));
  border: 1px solid rgba(94,231,245,.36);
}
.gem-rec-lbl {
  font-size: .78rem; font-weight: 800; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--accent-2); margin-bottom: 11px;
}
.gem-rec-item { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
.gem-rec-num {
  flex: 0 0 30px; height: 30px; border-radius: 50%;
  display: grid; place-items: center; font-weight: 800; font-size: .9rem;
  background: linear-gradient(135deg, #ffd45e, #fbbf24); color: #1a1206;
}
.gem-rec-item b { display: block; font-size: 1.06rem; color: var(--gold); }
.gem-rec-gr { display: block; font-size: .8rem; color: var(--muted); }
.gem-rec-why { display: block; font-size: .8rem; color: var(--text); margin-top: 3px; }
.gem-rec-day { display: block; font-size: .76rem; color: var(--accent-2); margin-top: 2px; }
.gem-rec-none { font-size: .88rem; color: var(--text); }
.gem-rec-note {
  font-size: .74rem; color: var(--muted); margin-top: 10px;
  padding-top: 10px; border-top: 1px dashed var(--border);
}

/* ── शुभ / अशुभ: asli samay ── */
.sa-sun {
  display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 12px;
  font-size: .9rem; color: var(--text);
}
.sa-sun b { color: var(--muted); font-weight: 600; }
.sa-h { margin: 16px 0 8px; font-size: .95rem; }
.sa-h-good { color: var(--accent-2); }
.sa-h-bad { color: var(--danger); }

@media (max-width: 640px) {
  .vyear-now { flex-direction: column; text-align: center; gap: 6px; padding: 14px; }
  .vyear-now-num { font-size: 2.6rem; }
  .lk-grid { grid-template-columns: 1fr; gap: 2px 0; }
  .lk-k { margin-top: 7px; }
  .lk-pri { margin-left: 0; }
  .gem-rec { padding: 13px; }
}
`;

const F = "src/styles.css";
let s = fs.readFileSync(F, "utf8");
if (s.includes(".vyear-now")) {
  console.log("CSS pehle se maujood hai — kuch nahi kiya");
} else {
  s = s + CSS;
  fs.writeFileSync(F, s, "utf8");
  console.log("CSS add ho gaya — " + CSS.split("\n").length + " lines");
}
