// पूरी कुंडली — ek hi heading ke niche sab hisse.
//
// User ki list: दशा/महादशा/अंतरदशा, फलादेश, केपी, शोडषवर्ग, लालकिताब,
// वर्षफल, लग्न, नवमांश, ग्रह स्थिति, चलित तालिका, जन्म विवरण, पंचांग,
// अष्टकवर्ग, कारकांश, स्वांश, गोचर, शड्बल, प्रस्तर अष्टकवर्ग, भावमध्य,
// पर दृष्टि, मैत्र चक्र, अवकहड़ा चक्र, अशुभ-शुभ, PDF, रिपोर्ट, एक्सपर्ट.
import React, { useMemo, useState } from "react";
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

export default function KundliChart({ form }) {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const X = kfTX(lang);
  const [tab, setTab] = useState("all");

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
  const nav = (id) => { setTab(id); };

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

        {/* navigator */}
        <div className="kf-nav" style={{ marginTop: 16 }}>
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
          <YearRows />
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

      {/* ══════════ 18. लालकिताब ══════════ */}
      {show("lalkitab") && (
        <Sec id="lalkitab" title={X.s_lalkitab} icon="📕" note={X.note_lalkitab}>
          {r.grahas.map((g) => {
            const up = LALKITAB_UPAY[g.key] || LALKITAB_UPAY[g.key === "Sun" ? "Surya" : g.key];
            return (
              <Row
                key={g.key}
                k={`${G(g.key)} · ${X.k_bhav} ${g.bhav}`}
                v={up ? `${up.upay || up.text || "-"}` : "-"}
              />
            );
          })}
        </Sec>
      )}

      {/* ══════════ 19. रत्न ══════════ */}
      {show("ratna") && (
        <Sec id="ratna" title={X.s_ratna} icon="💎" note={X.note_ratna}>
          {r.grahas.map((g) => (
            <Row
              key={g.key}
              k={G(g.key)}
              v={`${r.ratna[g.key]?.stone || "-"} · ${r.ratna[g.key]?.metal || "-"} · ${X.k_din} ${r.ratna[g.key]?.day || "-"}`}
            />
          ))}
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

      {/* ══════════ 21. अशुभ व शुभ ══════════ */}
      {show("shubh") && (
        <Sec id="shubh" title={X.s_shubh} icon="✓" note={X.note_shubh}>
          {sun && <Row k={X.k_sunrise} v={fmtMin(sun.sunrise)} color="var(--accent-2)" />}
          {sun && <Row k={X.k_sunset} v={fmtMin(sun.sunset)} color="var(--danger)" />}
          <Row k={X.k_shubhkala} v={X.time_shubh} />
          <Row k={X.k_ashubhkala} v={X.time_ashubh} />
          <Row k={X.k_rahukaal} v={X.note_rahu} />
        </Sec>
      )}

      {/* ══════════ 22. कार्य: PDF / Reports / Expert ══════════ */}
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
    </div>
  );
}

// varshphal alag module se aata hai
import { yearMeaning, yearDetail, ycat } from "../data/varshphal_i18n.js";
import { RASHIS } from "../utils/astro.js";
const RASHI_LORD_EN = { Mesha: "Mangal", Vrishabha: "Venus", Mithuna: "Mercury", Karka: "Moon", Simha: "Sun", Kanya: "Mercury", Tula: "Venus", Vrishchika: "Mars", Dhanu: "Jupiter", Makara: "Saturn", Kumbha: "Saturn", Meena: "Jupiter" };

function YearRows() {
  const { lang } = useLanguage();
  const X = kfTX(lang);
  const ym = ycat(lang);
  return (
    <div>
      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
        const m = yearMeaning(n, lang);
        const d = yearDetail(n, lang);
        return (
          <div key={n} className="kv" style={{ alignItems: "flex-start" }}>
            <span className="k"><b style={{ color: "var(--gold)", fontSize: "1.1rem" }}>{n}</b> {m.t}</span>
            <span className="v" style={{ fontSize: ".82rem", textAlign: "right", maxWidth: "68%" }}>
              {m.d}<br />
              <span style={{ color: "var(--muted)" }}>
                {ym.edu}: {d.edu}<br />
                {ym.mar}: {d.mar}<br />
                {ym.biz}: {d.biz}<br />
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