// KundliChart.jsx ke 4 sections ab translation keys use karenge:
//  - ratna: k_gem_<planet>_<field>   (pehle RATNA.js ka English)
//  - muhurat: k_mu_<slug>           (pehle hardcoded English)
//  - gem "kyun": k_why_<code>        (pehle Hinglish)
//  - rashi: rashiName()             (pehle raw "Kumbha")
import fs from "node:fs";

const F = "src/components/KundliChart.jsx";
let s = fs.readFileSync(F, "utf8");

// ── 1. lal kitab: rashi localize karo ──
const LK_OLD = `<span className="lk-house">{X.k_bhav} {l.house} · {l.rashi}</span>`;
const LK_NEW = `<span className="lk-house">{X.k_bhav} {l.house} · {rashiName(rIdx(l.rashi), lang)}</span>`;

// ── 2. lal kitab: priority badge localize karo ──
const LK_P_OLD = `{l.priority === "sabse pehle" ? X.k_lk_first : l.priority === "zor se" ? X.k_lk_urgent : X.k_lk_normal}`;
const LK_P_NEW = `{l.priority === "sabse pehle" ? X.k_lk_first : l.priority === "zor se" ? X.k_lk_urgent : X.k_lk_normal}`;

// ── 3. ratna recommendation: stone/metal/day/finger localize ──
const GEM_OLD = `<b>{g.stone}</b>
                      <span className="gem-rec-gr">{G(g.planet)} · {g.metal} · {g.finger}</span>
                      <span className="gem-rec-why">{g.reason}</span>
                      <span className="gem-rec-day">{X.k_din}: {g.day}</span>`;
const GEM_NEW = `<b>{X[\`k_gem_\${g.planet}_stone\`] ?? g.stone}</b>
                      <span className="gem-rec-gr">{G(g.planet)} · {X[\`k_gem_\${g.planet}_metal\`] ?? g.metal} · {X[\`k_gem_\${g.planet}_finger\`] ?? g.finger}</span>
                      <span className="gem-rec-why">{why(g)}</span>
                      <span className="gem-rec-day">{X.k_din}: {X[\`k_gem_\${g.planet}_day\`] ?? g.day}</span>`;

// ── 4. ratna table: stone/metal/day localize ──
const TBL_OLD = `                          <td>{g.stone}</td>
                          <td>{g.metal}</td>
                          <td>{g.day}</td>`;
const TBL_NEW = `                          <td>{X[\`k_gem_\${g.planet}_stone\`] ?? g.stone}</td>
                          <td>{X[\`k_gem_\${g.planet}_metal\`] ?? g.metal}</td>
                          <td>{X[\`k_gem_\${g.planet}_day\`] ?? g.day}</td>`;

// ── 5. ratna table: reason localize ──
const TBLW_OLD = `                            <small style={{ opacity: .8 }}>{g.reason}</small>`;
const TBLW_NEW = `                            <small style={{ opacity: .8 }}>{why(g)}</small>`;

// ── 6. shubh/ashubh: muhurat names localize ──
const MU_OLD = `<Row key={x.name} k={x.name} v={x.text} color="var(--accent-2)" />`;
const MU_NEW = `<Row key={x.name} k={muLabel(x, X, false)} v={x.text} color="var(--accent-2)" />`;
const AU_OLD = `<Row key={x.name} k={x.name} v={x.text} color="var(--danger)" />`;
const AU_NEW = `<Row key={x.name} k={muLabel(x, X, true)} v={x.text} color="var(--danger)" />`;

// ── 7. helpers add karo (component ke andar, G/R ke paas) ──
const HELP_OLD = `  const G = (k) => grahaName(k, lang);
  const R = (i) => rashiName(i, lang);
  const N = (i) => nakName(i, lang);`;

const HELP_NEW = `  const G = (k) => grahaName(k, lang);
  const R = (i) => rashiName(i, lang);
  const N = (i) => nakName(i, lang);

  // gem ka "kyun" — ab translation key se, English/Hinglish text nahi
  const why = (g) => {
    let t = X[\`k_why_\${g.whyCode}\`] ?? X.k_why_weak;
    for (const [k, v] of Object.entries(g.whyArgs || {})) t = t.replaceAll(\`{\${k}}\`, v);
    if (g.extraNote && X[\`k_why_\${g.extraNote}\`]) t += \` \${X[\`k_why_\${g.extraNote}\`]}\`;
    return t;
  };

  // muhurat ka naam — kundliFull.js ab slug deta hai, text nahi
  const muLabel = (x, XX, bad) => {
    const slug =
      x.name.startsWith("Abhijit") ? "abhijit"
      : x.name.startsWith("Brahma") ? "brahma"
      : x.name.startsWith("Vijay") ? "vijay"
      : x.name.startsWith("Godhuli") ? "godhuli"
      : x.name.startsWith("Amrit") ? "amrit"
      : x.name.startsWith("Rahu") ? "rahu"
      : x.name.startsWith("Yama") ? "yamaganda"
      : x.name.startsWith("Gulika") ? "gulika"
      : x.name.startsWith("Bhadra") ? "bhadra"
      : x.name.startsWith("Panchak") ? "panchak"
      : null;
    let label = slug ? (XX[\`k_mu_\${slug}\`] ?? x.name) : x.name;
    if (bad && x.note && XX.k_mu_noNote) label += \` · \${XX.k_mu_noNote}\`;
    return label;
  };`;

const REPL = [
  [LK_OLD, LK_NEW],
  [GEM_OLD, GEM_NEW],
  [TBL_OLD, TBL_NEW],
  [TBLW_OLD, TBLW_NEW],
  [MU_OLD, MU_NEW],
  [AU_OLD, AU_NEW],
  [HELP_OLD, HELP_NEW],
];

let n = 0;
for (const [from, to] of REPL) {
  if (s.includes(from)) { s = s.replace(from, to); n++; }
  else console.log("  SKIP: " + from.trim().slice(0, 55));
}

// rIdx import bhi chahiye
if (!s.includes("rIdx")) {
  s = s.replace(
    'import { grahaName, nakName, rashiName, vaarName, tithiName, pakshaName } from "../i18n/names.js";',
    'import { grahaName, nakName, rashiName, vaarName, tithiName, pakshaName } from "../i18n/names.js";\nimport { rIdx } from "../utils/rashiHelper.js";',
  );
}

fs.writeFileSync(F, s, "utf8");
console.log(`${n}/${REPL.length} replacements hue`);
