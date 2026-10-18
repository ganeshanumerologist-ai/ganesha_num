// पूरी कुंडली — ek hi heading ke niche sab hisse.
//
// User ki list: दशा/महादशा/अंतरदशा, फलादेश, केपी, शोडषवर्ग, लालकिताब,
// वर्षफल, लग्न, नवमांश, ग्रह स्थिति, चलित तालिका, जन्म विवरण, पंचांग,
// अष्टकवर्ग, कारकांश, स्वांश, गोचर, शड्बल, प्रस्तर अष्टकवर्ग, भावमध्य,
// पर दृष्टि, मैत्र चक्र, अवकहड़ा चक्र, अशुभ-शुभ, PDF, रिपोर्ट, एक्सपर्ट.
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { kundliFull } from "../utils/kundliFull.js";
import { kfTX } from "../i18n/kundliFullTX.js";
import { grahaName, nakName, rashiName, vaarName, tithiName, pakshaName } from "../i18n/names.js";
import { pgT } from "../i18n/jyotish_b.js";
import { sunTimes, fmtMin } from "../utils/panchang.js";
import CITIES from "../data/cities.js";
import { LALKITAB_UPAY } from "../data/jyotish.js";

const f = (d) => d.toISOString().slice(0, 10);

function Row({ k, v, color }) {
  return (
    <div className="kv">
      <span className="k">{k}</span>
      <span className="v" style={color ? { color } : undefined}>{v}</span>
    </div>
  );
}

function Sec({ id, title, icon, children, note }) {
  return (
    <section id={id} className="card" style={{ marginTop: 18, scrollMarginTop: 80 }}>
      <h3 style={{ marginTop: 0 }}>{icon} {title}</h3>
      {note && <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: -4 }}>{note}</p>}
      <div style={{ marginTop: 10 }}>{children}</div>
    </section>
  );
}

/* ── Sticky nav ──────────────────────────────────────────────────
   Section badalne par heading khud screen par chipki rahe, taaki
   user ko dobara upar scroll na karna pade. */
function StickyNav({ tab, nav, SECTIONS, X }) {
  return (
    <div className="kf-sticky">
      <div className="kf-nav">
        <button className={tab === "all" ? "kf-chip on" : "kf-chip"} onClick={() => nav("all")}>
          {X.kf_all}
        </button>
        {SECTIONS.map(([id, icon, label]) => (
          <button key={id} className={tab === id ? "kf-chip on" : "kf-chip"} onClick={() => nav(id)}>
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function KundliChart({ form }) {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const X = kfTX(lang);
  /* ── Section alag-alag ───────────────────────────────────────────
   User ne kaha: "जन्म विवरण, पंचांग, लग्न, ग्रह स्थिति ... ek ke
   niche ek aa rahe hain, wo alag alag page pe aane chahiye."

   Pehle default "all" tha — matlab 22 hisse EK ke niche EK, ek
   lambi page. Ab default PEHLA section hai. Upar chip bar se koi
   bhi hissa alag khol sakte hain, aur "सभी" chip se poora chart
   ek saath dekha ja sakta hai (purana view). */
const [tab, setTab] = useState("janm");

  const r = useMemo(() => {
    try {
      return kundliFull(form);
    } catch {
      return null;
    }
  }, [form.birthdate, form.time, form.place]);

  if (!r) return null;

  const G = (k) => grahaName(k, lang);
  const R = (i) => rashiName(i, lang);
  const N = (i) => nakName(i, lang);

  // gem ka "kyun" — ab translation key se, English/Hinglish text nahi
  const why = (g) => {
    let t = X[`k_why_${g.whyCode}`] ?? X.k_why_weak;
    for (const [k, v] of Object.entries(g.whyArgs || {})) t = t.replaceAll(`{${k}}`, v);
    if (g.extraNote && X[`k_why_${g.extraNote}`]) t += ` ${X[`k_why_${g.extraNote}`]}`;
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
    let label = slug ? (XX[`k_mu_${slug}`] ?? x.name) : x.name;
    if (bad && x.note && XX.k_mu_noNote) label += ` · ${XX.k_mu_noNote}`;
    return label;
  };

  // suryodaya/suryast — bhav-kundali me bhi dikhate hain
  let sun = null;
  try {
    const c = CITIES.find((x) => x[0] === form.place);
    sun = c ? sunTimes(form.birthdate, c[1], c[2]) : null;
  } catch { /* ignore */ }

  const shubh = [
    ["4–7", "12–16", "16–18"],
  ];
  void shubh;

  // ── Section registry (navigator + order) ──
  const SECTIONS = [
    ["janm", "✦", X.s_janm],
    ["panchang", "📅", X.s_panchang],
    ["lagna", "◈", X.s_lagna],
    ["graha", "☉", X.s_graha],
    ["chalit", "▦", X.s_chalit],
    ["navamsa", "⑂", X.s_navamsa],
    ["varga", "▩", X.s_varga],
    ["ashtaka", "⊞", X.s_ashtaka],
    ["shadbala", "⊕", X.s_shadbala],
    ["karaka", "✦", X.s_karaka],
    ["drishti", "◉", X.s_drishti],
    ["maitri", "☍", X.s_maitri],
    ["avakanda", "◐", X.s_avakanda],
    ["dasha", "⌛", X.s_dasha],
    ["phaladesh", "❋", X.s_phaladesh],
    ["varshphal", "📆", X.s_varshphal],
    ["kp", "⌘", X.s_kp],
    ["lalkitab", "📕", X.s_lalkitab],
    ["ratna", "💎", X.s_ratna],
    ["gochar", "🛰", X.s_gochar],
    ["shubh", "✓", X.s_shubh],
  ];

  const show = (id) => tab === "all" || tab === id;

  /* Section badlo to:
     1. URL me hash daal do — link share/reload karne par wahi
        section khule
     2. Upar scroll kar do — warna lamba page neeche bhi scroll
        karte rehne se naya hissa screen ke bahar chala jaata */
  const nav = (id) => {
    setTab(id);
    try {
      const u = new URL(window.location.href);
      u.hash = id === "all" ? "" : `#${id}`;
      window.history.replaceState({}, "", u.toString());
    } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // URL hash se shuru karna ho (koi #lalkitab link share kiya ho)
  useEffect(() => {
    const h = (window.location.hash || "").replace("#", "");
    if (h && (h === "all" || SECTIONS.some((s) => s[0] === h))) setTab(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const age = (() => {
    const b = new Date(form.birthdate + "T12:00:00");
    const n = new Date();
    let y = n.getFullYear() - b.getFullYear();
    if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) y--;
    return y;
  })();

  return (
    <div className="kf-wrap">
      {/* ══ EK HI HEADING ══ */}
      <div className="card" style={{ marginTop: 24, textAlign: "center" }}>
        <span className="badge">{X.kf_badge}</span>
        <h2 className="text-gradient" style={{ marginTop: 10 }}>{X.kf_title}</h2>
        <p style={{ fontSize: ".88rem", color: "var(--muted)" }}>{X.kf_sub}</p>
      </div>

      {/* ── Navigator ──────────────────────────────────────────
          Ek hi chip bar — wo bhi STICKY, taaki 22 hisse me se
          koi bhi ek tap me badal jaaye. Pehle ye heading card ke
          andar tha (scroll karte hi nikal jaata tha) aur saath
          me ek duplicate bhi tha. Ab ek hi hai, aur hamesha
          screen par dikhta hai. */}
      <StickyNav tab={tab} nav={nav} SECTIONS={SECTIONS} X={X} />

      {/* ══════════ 1. जन्म विवरण ══════════ */}
      {show("janm") && (
        <Sec id="janm" title={X.s_janm} icon="✦">
          <Row k={X.k_name} v={form.name} />
          <Row k={X.k_dob} v={fmtDob(form.birthdate)} />
          <Row k={X.k_time} v={form.time || X.k_notgiven} />
          <Row k={X.k_place} v={form.place || X.k_notgiven} />
          <Row k={X.k_gender} v={form.gender === "female" ? X.k_female : form.gender === "other" ? X.k_other : X.k_male} />
          <Row k={X.k_age} v={`${age} ${X.k_years}`} />
          <Row k={X.k_lagna} v={r.lagna} color="var(--gold)" />
          <Row k={X.k_d9lagna} v={r.d9Lagna} />
          <Row k={X.k_moon} v={`${r.moonRashi} · ${N(r.moonNak.index)}`} />
          <Row k={X.k_sun} v={r.sunRashi} />
          {sun && <Row k={X.k_sunrise} v={fmtMin(sun.sunrise)} />}
          {sun && <Row k={X.k_sunset} v={fmtMin(sun.sunset)} />}
        </Sec>
      )}

      {/* ══════════ 2. पंचांग ══════════ */}
      {show("panchang") && (
        <Sec id="panchang" title={X.s_panchang} icon="📅">
          <Row k={X.k_tithi} v={`${pakshaName(r.panchang.tithi.paksha, lang)} ${tithiName(r.panchang.tithi.n - 1, lang)}`} />
          <Row k={X.k_nak} v={`${N(r.panchang.nak.index)} ${X.k_pada} ${r.panchang.nak.pada}`} />
          <Row k={X.k_yoga} v={r.panchang.yoga} />
          <Row k={X.k_karana} v={r.panchang.karana} />
          <Row k={X.k_vaar} v={`${vaarName(r.panchang.vaar, lang)} · ${X.k_vaarlord} ${G(r.panchang.vaarLord)}`} />
        </Sec>
      )}

      {/* ══════════ 3. लग्न ══════════ */}
      {show("lagna") && (
        <Sec id="lagna" title={X.s_lagna} icon="◈" note={r.lagnaKnown ? undefined : X.note_nolagna}>
          <Row k={X.k_lagna} v={r.lagna} color="var(--gold)" />
          <Row k={X.k_navamsa_lagna} v={r.d9Lagna} />
          <Row k={X.k_drekkana} v={r.drekkana} />
          <Row k={X.k_bhavamadhya} v={r.bhavMadhya} />
          {r.shadbala.slice(0, 3).map((s) => (
            <Row key={s.planet} k={`${G(s.planet)} ${X.k_bal}`} v={`${s.total.toFixed(2)} / 6`} />
          ))}
        </Sec>
      )}

      {/* ══════════ 4. ग्रह स्थिति ══════════ */}
      {show("graha") && (
        <Sec id="graha" title={X.s_graha} icon="☉">
          <div style={{ overflowX: "auto" }}>
            <table className="kf-table">
              <thead>
                <tr>
                  <th>{X.k_graha}</th><th>{X.k_rashi}</th><th>{X.k_ang}</th>
                  <th>{X.k_nak}</th><th>{X.k_bhav}</th><th>{X.k_swami}</th><th>{X.k_sthiti}</th>
                </tr>
              </thead>
              <tbody>
                {r.grahas.map((g) => (
                  <tr key={g.key}>
                    <td><b>{G(g.key)}</b></td>
                    <td>{g.rashi}</td>
                    <td>{g.deg}</td>
                    <td>{N(g.nak.index)}</td>
                    <td>{g.bhav}</td>
                    <td>{G(g.lord)}</td>
                    <td style={{ color: g.retro ? "var(--danger)" : "var(--accent-2)" }}>
                      {g.retro ? X.k_vakri : X.k_anuch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>
      )}

      {/* ══════════ 5. चलित तालिका ══════════ */}
      {show("chalit") && (
        <Sec id="chalit" title={X.s_chalit} icon="▦">
          {r.chalit.map((c) => (
            <Row key={c.planet} k={G(c.planet)} v={`${c.rashi} · ${X.k_bhav} ${c.bhav} · ${X.k_swami} ${G(c.bhavLord)}`} />
          ))}
        </Sec>
      )}

      {/* ══════════ 6. नवमांश (D9) ══════════ */}
      {show("navamsa") && (
        <Sec id="navamsa" title={X.s_navamsa} icon="⑂" note={X.note_navamsa}>
          <Row k={X.k_navamsa_lagna} v={r.d9Lagna} color="var(--gold)" />
          {r.grahas.map((g) => (
            <Row key={g.key} k={G(g.key)} v={r.shodashvarga.rows.find((x) => x.planet === g.key)?.cells.D9.text || "-"} />
          ))}
        </Sec>
      )}

      {/* ══════════ 7. शोडषवर्ग (16 charts) ══════════ */}
      {show("varga") && (
        <Sec id="varga" title={X.s_varga} icon="▩" note={X.note_varga}>
          <div style={{ overflowX: "auto" }}>
            <table className="kf-table kf-table-sm">
              <thead>
                <tr>
                  <th>{X.k_graha}</th>
                  {r.shodashvarga.vargas.map((v) => <th key={v.d}>{v.d}</th>)}
                </tr>
              </thead>
              <tbody>
                {r.shodashvarga.rows.map((row) => (
                  <tr key={row.planet}>
                    <td><b>{G(row.planet)}</b></td>
                    {r.shodashvarga.vargas.map((v) => (
                      <td key={v.d} style={{ color: row.cells[v.d].idx >= 0 && row.cells[v.d].idx < 12 ? "var(--text)" : "var(--muted)" }}>
                        {row.cells[v.d].text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: ".74rem", color: "var(--muted)", marginTop: 8 }}>
            {r.shodashvarga.vargas.map((v) => `${v.d} ${v.n}`).join(" · ")}
          </p>
        </Sec>
      )}

      {/* ══════════ 8. अष्टकवर्ग ══════════ */}
      {show("ashtaka") && (
        <Sec id="ashtaka" title={X.s_ashtaka} icon="⊞"
          note={`${X.k_total} ${r.ashtakavarga.total} / 48 · ${X.k_lagna} ${rashiName(r.ashtakavarga.lagna, lang)}`}>
          {/* har graha ke points */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(96px,1fr))", gap: 8 }}>
            {Object.entries(r.ashtakavarga.graha || {}).map(([g, pts]) => (
              <div className="num-chip" key={g} style={{ padding: "9px 6px" }}>
                <b style={{ fontSize: "1.35rem" }}>{pts}</b>
                <span>{G(g)}</span>
              </div>
            ))}
          </div>

          {/* ghar-wise kaun kaun graha yog de rahe hain */}
          <h4 style={{ marginTop: 14 }}>{X.k_bhavwise}</h4>
          {(r.ashtakavarga.house || []).map((h) => {
            const who = (r.ashtakavarga.detail || {})[String(h)] || [];
            return (
              <Row
                key={h}
                k={`${X.k_bhav} ${h}`}
                v={who.length ? who.map((w) => G(w)).join(", ") : X.k_none}
                color={who.length ? "var(--accent-2)" : "var(--muted)"}
              />
            );
          })}
        </Sec>
      )}

      {/* ══════════ 9. शड्बल ══════════ */}
      {show("shadbala") && (
        <Sec id="shadbala" title={X.s_shadbala} icon="⊕" note={X.note_shadbala}>
          <div style={{ overflowX: "auto" }}>
            <table className="kf-table">
              <thead>
                <tr><th>{X.k_graha}</th><th>{X.k_rashi}</th><th>{X.k_bhav}</th><th>शो.</th><th>अ.</th><th>अशु.</th><th>दृ.</th><th>{X.k_total}</th></tr>
              </thead>
              <tbody>
                {r.shadbala.map((s) => (
                  <tr key={s.planet}>
                    <td><b>{G(s.planet)}</b></td>
                    <td>{s.rashi}</td><td>{s.house}</td>
                    <td>{s.shochet.toFixed(2)}</td>
                    <td>{s.achal.toFixed(2)}</td>
                    <td>{s.ashubh.toFixed(2)}</td>
                    <td>{s.drik.toFixed(2)}</td>
                    <td><b style={{ color: s.total >= 0.5 ? "var(--accent-2)" : "var(--danger)" }}>{s.total.toFixed(2)}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>
      )}

      {/* ══════════ 10. कारकांश / स्वांश ══════════ */}
      {show("karaka") && (
        <Sec id="karaka" title={X.s_karaka} icon="✦">
          <Row k={X.k_karakamsha} v={r.karakamshaName} color="var(--gold)" />
          <Row k={X.k_swaphala} v={r.swaphalaName} />
          <Row k={X.k_bhavamadhya} v={r.bhavMadhya} />
        </Sec>
      )}

      {/* ══════════ 11. पर दृष्टि ══════════ */}
      {show("drishti") && (
        <Sec id="drishti" title={X.s_drishti} icon="◉" note={X.note_drishti}>
          {r.paraDristi.map((d) => (
            <Row key={d.planet} k={G(d.planet)} v={d.houses.map((h) => R(h)).join(" · ")} />
          ))}
        </Sec>
      )}

      {/* ══════════ 12. मैत्र चक्र ══════════ */}
      {show("maitri") && (
        <Sec id="maitri" title={X.s_maitri} icon="☍" note={X.note_maitri}>
          <div style={{ overflowX: "auto" }}>
            <table className="kf-table kf-table-sm">
              <thead><tr><th>{X.k_graha}</th>{r.maitri.filter((_, i) => i % 8 === 0).map((_, j) => <th key={j}>—</th>)}<th>{X.k_kul}</th></tr></thead>
              <tbody>
                {r.grahas.map((g, gi) => (
                  <tr key={g.key}>
                    <td><b>{G(g.key)}</b></td>
                    {r.grahas.filter((_, i) => i !== gi).map((o) => {
                      const cell = r.maitri.find((x) => x.a === g.key && x.b === o.key);
                      const good = cell?.rel === "friend";
                      return (
                        <td key={o.key} style={{ color: good ? "var(--accent-2)" : "var(--danger)" }}>
                          {good ? "✓" : "✗"}
                        </td>
                      );
                    })}
                    <td>
                      {r.grahas.filter((o) => o.key !== g.key && r.maitri.find((x) => x.a === g.key && x.b === o.key)?.rel === "friend").length}
                      /8
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>
      )}

      {/* ══════════ 13. अवकहड़ा चक्र ══════════ */}
      {show("avakanda") && (
        <Sec id="avakanda" title={X.s_avakanda} icon="◐" note={X.note_avakanda}>
          <Row k={X.k_chandra} v={r.avakanda.start} />
          {r.avakanda.cells.map((c, i) => (
            <Row
              key={i}
              k={`${c.lord} · ${X.k_bhav} ${c.bhav}`}
              v={c.lordSign}
              color={c.friends ? "var(--accent-2)" : "var(--danger)"}
            />
          ))}
          <Row k={X.k_chandrabala} v={r.bhavMadhya} color="var(--gold)" />
        </Sec>
      )}

      {/* ══════════ 14. दशा / महादशा / अंतरदशा ══════════ */}
      {show("dasha") && r.dasha && (
        <Sec id="dasha" title={X.s_dasha} icon="⌛" note={X.note_dasha}>
          <p style={{ fontWeight: 700, color: "var(--gold)" }}>
            {X.k_chalu} {G(r.dasha.cur.lord)} {X.k_mahadasha} · {G(r.dasha.curAD.lord)} {X.k_antardasha}
          </p>
          <h4 style={{ marginTop: 14 }}>{X.k_mahadasha}</h4>
          {r.dasha.periods.map((p) => (
            <Row
              key={p.lord}
              k={G(p.lord)}
              v={`${f(p.start)} → ${f(p.end)}`}
              color={p.lord === r.dasha.cur.lord ? "var(--gold)" : undefined}
            />
          ))}
          <h4 style={{ marginTop: 14 }}>{X.k_antardasha} ({G(r.dasha.cur.lord)})</h4>
          {r.dasha.ads.map((a) => (
            <Row
              key={a.lord}
              k={G(a.lord)}
              v={`${f(a.start)} → ${f(a.end)}`}
              color={a.lord === r.dasha.curAD.lord ? "var(--gold)" : undefined}
            />
          ))}
        </Sec>
      )}

      {/* ══════════ 15. फलादेश ══════════ */}
      {show("phaladesh") && (
        <Sec id="phaladesh" title={X.s_phaladesh} icon="❋" note={X.note_phaladesh}>
          <Row k={X.k_sampoorna} v={`${X.k_shubh}: ${r.lagna} · ${X.k_asubh}: ${r.moonRashi} · ${X.k_rahi}: ${G("Rahu")} · ${X.k_keetu}: ${G("Ketu")}`} />
          <Row k={X.k_dashanath} v={G(r.dasha?.cur?.lord || "Sun")} color="var(--gold)" />
          <Row k={X.k_dasakalp} v={N(r.moonNak.index)} />
          <Row k={X.k_chandrabala} v={r.bhavMadhya} />
          <Row k={X.k_suryagraha} v={`${G("Sun")} (${r.sunRashi}) · ${G("Chandra")} (${r.moonRashi})`} />
          <Row k={X.k_ashtak} v={r.ashtakavarga.total} />
        </Sec>
      )}

      {/* ══════════ 16. वर्षफल ══════════ */}
      {show("varshphal") && (
        <Sec id="varshphal" title={X.s_varshphal} icon="📆" note={X.note_varshphal}>
          {/* ── PEHLE pata hi nahi chalta tha kaun sa SAAL ──
              Ab upar saaf: calendar year + niji saal (personal year). */}
          <div className="vyear-now">
            <div className="vyear-now-num">{r.varshphal?.personalYear ?? "—"}</div>
            <div>
              <div className="vyear-now-lbl">{X.k_niji_saal}</div>
              <div className="vyear-now-sub">{X.k_calendar_year} {r.varshphal?.calendarYear}</div>
            </div>
          </div>
          <YearRows running={r.varshphal?.personalYear} />
        </Sec>
      )}

      {/* ══════════ 17. केपी ══════════ */}
      {show("kp") && (
        <Sec id="kp" title={X.s_kp} icon="⌘" note={X.note_kp}>
          <Row k={X.k_kp_lagna} v={`${r.lagna} · ${G(RASHI_LORD_EN[r.lagna] || "")}`} />
          <Row k={X.k_kp_chandra} v={`${r.moonRashi} · ${N(r.moonNak.index)}`} />
          <Row k={X.k_kp_graha} v={r.grahas.map((g) => `${G(g.key)}:${g.nak.index + 1}`).join("  ")} />
          <Row k={X.k_kp_sanket} v={r.grahas.filter((g) => ["Ketu", "Venus", "Jupiter"].includes(g.key)).map((g) => G(g.key)).join(", ")} />
        </Sec>
      )}

      {/* ══════════ 18. लालकिताब — PURA upay ══════════ */}
      {show("lalkitab") && (
        <Sec id="lalkitab" title={X.s_lalkitab} icon="📕" note={X.note_lalkitab}>
          {/* Pehle sirf ek line ka upay tha. Ab har graha ke liye:
              bhav + uska fal, rog-lakshan, daan, puja, mantra, samay. */}
          {(r.lalKitab || []).map((l) => (
            <div key={l.planet} className={`lk-row${l.priority === "sabse pehle" ? " lk-top" : ""}`}>
              <div className="lk-head">
                <b>{G(l.planet)}</b>
                <span className="lk-house">{X.k_bhav} {l.house} · {rashiName(rIdx(l.rashi), lang)}</span>
                <span className={`lk-pri lk-pri-${l.priority === "sabse pehle" ? "1" : l.priority === "zor se" ? "2" : "3"}`}>
                  {l.priority === "sabse pehle" ? X.k_lk_first : l.priority === "zor se" ? X.k_lk_urgent : X.k_lk_normal}
                </span>
              </div>
              <div className="lk-grid">
                <div className="lk-k">{X.k_lk_bhavfal}</div><div className="lk-v">{l.bhavFal}</div>
                <div className="lk-k">{X.k_lk_rogi}</div><div className="lk-v">{l.rogi}</div>
                <div className="lk-k">{X.k_lk_daan}</div><div className="lk-v">{l.daan}</div>
                <div className="lk-k">{X.k_lk_puja}</div><div className="lk-v">{l.puja}</div>
                <div className="lk-k">{X.k_lk_mantra}</div>
                <div className="lk-v">
                  {l.mantra} <b>× {l.mantraCount}</b>
                </div>
                <div className="lk-k">{X.k_lk_time}</div><div className="lk-v">{l.time}</div>
              </div>
              {l.baseUpay && (
                <div className="lk-base">
                  <span>{X.k_lk_base}</span> {l.baseUpay}
                </div>
              )}
            </div>
          ))}
        </Sec>
      )}

      {/* ══════════ 19. रत्न — RECOMMENDATION ══════════ */}
      {show("ratna") && (
        <Sec id="ratna" title={X.s_ratna} icon="💎" note={X.note_ratna}>
          {(() => {
            const top = (r.gemAdvice || []).filter((g) => g.status === "pehli");
            return (
              <>
                {/* ── SAHI JAWAAB upar ── */}
                <div className="gem-rec">
                  <div className="gem-rec-lbl">{X.k_gem_recommend}</div>
                  {top.length === 0 ? (
                    <div className="gem-rec-none">{X.k_gem_none}</div>
                  ) : top.map((g) => (
                    <div key={g.planet} className="gem-rec-item">
                      <span className="gem-rec-num">{g.planet === "Jupiter" ? "1" : g.planet === "Venus" ? "2" : "3"}</span>
                      <div>
                        <b>{X[`k_gem_${g.planet}_stone`] ?? g.stone}</b>
                        <span className="gem-rec-gr">{G(g.planet)} · {X[`k_gem_${g.planet}_metal`] ?? g.metal} · {X[`k_gem_${g.planet}_finger`] ?? g.finger}</span>
                        <span className="gem-rec-why">{why(g)}</span>
                        <span className="gem-rec-day">{X.k_din}: {X[`k_gem_${g.planet}_day`] ?? g.day}</span>
                      </div>
                    </div>
                  ))}
                  <p className="gem-rec-note">{X.k_gem_max3}</p>
                </div>

                {/* ── BAAKI SAB GRAHA ── */}
                <div style={{ overflowX: "auto", marginTop: 14 }}>
                  <table className="kf-table">
                    <thead>
                      <tr>
                        <th>{X.k_graha}</th><th>{X.k_bhav}</th><th>{X.k_stone}</th>
                        <th>{X.k_metal}</th><th>{X.k_din}</th><th>{X.k_k_status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(r.gemAdvice || []).map((g) => (
                        <tr key={g.planet}>
                          <td><b>{G(g.planet)}</b></td>
                          <td>{g.house}</td>
                          <td>{X[`k_gem_${g.planet}_stone`] ?? g.stone}</td>
                          <td>{X[`k_gem_${g.planet}_metal`] ?? g.metal}</td>
                          <td>{X[`k_gem_${g.planet}_day`] ?? g.day}</td>
                          <td style={{ color: g.status === "pehli" ? "var(--accent-2)" : g.status === "mat" ? "var(--danger)" : "var(--muted)" }}>
                            {g.status === "pehli" ? X.k_gem_yes : g.status === "mat" ? X.k_gem_no : X.k_gem_maybe}
                            <br />
                            <small style={{ opacity: .8 }}>{why(g)}</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            );
          })()}
        </Sec>
      )}

      {/* ══════════ 20. गोचर ══════════ */}
      {show("gochar") && (
        <Sec id="gochar" title={X.s_gochar} icon="🛰" note={X.note_gochar}>
          {r.gochar.map((g) => (
            <Row
              key={g.key}
              k={G(g.key)}
              v={`${g.nowRashi} ${g.same ? "· " + X.k_samesign : ""}`}
              color={g.same ? "var(--accent-2)" : undefined}
            />
          ))}
        </Sec>
      )}

      {/* ══════════ 21. अशुभ व शुभ — ASLI TIME ══════════ */}
      {show("shubh") && (
        <Sec id="shubh" title={X.s_shubh} icon="✓" note={X.note_shubh}>
          {r.shubhAshubh ? (
            <>
              <div className="sa-sun">
                <span><b>{X.k_sunrise}</b> {r.shubhAshubh.sunrise}</span>
                <span><b>{X.k_sunset}</b> {r.shubhAshubh.sunset}</span>
              </div>

              <h4 className="sa-h sa-h-good">✓ {X.k_shubhkala}</h4>
              {r.shubhAshubh.shubh.map((x) => (
                <Row key={x.name} k={muLabel(x, X, false)} v={x.text} color="var(--accent-2)" />
              ))}

              <h4 className="sa-h sa-h-bad">✗ {X.k_ashubhkala}</h4>
              {r.shubhAshubh.ashubh.map((x) => (
                <Row key={x.name} k={muLabel(x, X, true)} v={x.text} color="var(--danger)" />
              ))}

              <p style={{ fontSize: ".74rem", color: "var(--muted)", marginTop: 10 }}>
                {X.note_shubh_src}
              </p>
            </>
          ) : (
            <>
              <p style={{ color: "var(--muted)" }}>{X.note_no_time}</p>
              {sun && <Row k={X.k_sunrise} v={fmtMin(sun.sunrise)} color="var(--accent-2)" />}
              {sun && <Row k={X.k_sunset} v={fmtMin(sun.sunset)} color="var(--danger)" />}
            </>
          )}
        </Sec>
      )}

      {/* ══════════ 22. कार्य: PDF / Reports / Expert ══════════ */}
      {show("actions") && (
        <Sec id="actions" title={X.s_actions} icon="⇩">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => window.print()}>{X.k_pdf}</button>
          <Link className="btn secondary" to="/reports">{X.k_reports}</Link>
          <Link className="btn secondary" to="/experts">{X.k_expert}</Link>
          <Link className="btn secondary" to="/muhurat">{X.k_muhurat}</Link>
          <Link className="btn secondary" to="/remedies">{X.k_remedies}</Link>
        </div>
        <p style={{ fontSize: ".74rem", color: "var(--muted)", marginTop: 10 }}>{X.note_pdf}</p>
      </Sec>
      )}
    </div>
  );
}

// varshphal alag module se aata hai
import { yearMeaning, yearDetail, ycat } from "../data/varshphal_i18n.js";
import { RASHIS } from "../utils/astro.js";
import { rIdx } from "../utils/rashiHelper.js";
const RASHI_LORD_EN = { Mesha: "Mangal", Vrishabha: "Venus", Mithuna: "Mercury", Karka: "Moon", Simha: "Sun", Kanya: "Mercury", Tula: "Venus", Vrishchika: "Mars", Dhanu: "Jupiter", Makara: "Saturn", Kumbha: "Saturn", Meena: "Jupiter" };

/**
 * 9 niji saal — saare dikhate hain, par CHALU saal pehle aur
 * saaf dikhta hai (pehle pata hi nahi chalta tha kaun sa chal raha hai).
 */
function YearRows({ running }) {
  const { lang } = useLanguage();
  const X = kfTX(lang);
  const ym = ycat(lang);

  // Chalu saal sabse upar
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const ordered = running
    ? [running, ...nums.filter((n) => n !== running)]
    : nums;

  return (
    <div>
      {ordered.map((n) => {
        const m = yearMeaning(n, lang);
        const d = yearDetail(n, lang);
        const on = n === running;
        return (
          <div
            key={n}
            className={`kv vy-row${on ? " vy-on" : ""}`}
            style={{ alignItems: "flex-start" }}
          >
            <span className="k">
              <b style={{ color: "var(--gold)", fontSize: "1.15rem" }}>{n}</b> {m.t}
              {on && <em className="vy-badge">{X.k_chalu_saal}</em>}
            </span>
            <span className="v" style={{ fontSize: ".84rem", textAlign: "right", maxWidth: "68%" }}>
              {m.d}
              <br />
              <span style={{ color: "var(--muted)" }}>
                {ym.edu}: {d.edu}
                <br />
                {ym.mar}: {d.mar}
                <br />
                {ym.biz}: {d.biz}
                <br />
                {ym.rep}: {d.rep}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function fmtDob(d) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || ""));
  return m ? `${m[3]} / ${m[2]} / ${m[1]}` : String(d || "");
}