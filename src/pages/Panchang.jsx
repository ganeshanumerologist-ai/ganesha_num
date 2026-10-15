import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import {
  panchang, jdFromDateStr, sunTropical, moonTropical, karanaOf, lagnaSidereal,
} from "../utils/astro.js";
import {
  RAHUKAAL, YAMAGANDA, GULIKA, ABHIJIT, HORA_ORDER, HORA_START, HORA_HI,
  CHOG_CYCLE, CHOG_START, CHOG_SHUBH,
} from "../data/jyotish.js";
import { STATES } from "../data/cities.js";
import CITIES_FLAT from "../data/cities.js";
import { VAAR } from "../data/daily.js";
import { FESTIVALS_2026, MONTHS } from "../data/calendar.js";

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const TABS = ["Dainik", "Mahina", "Hora", "Panchak-Bhadra", "Lagna"];

// Panchak: Dhanishta uttarardh + Shatabhisha + Bhadrapadadwaya + Revati
function isPanchak(nak) {
  if (nak.index >= 23) return true;
  if (nak.index === 22 && nak.frac > 0.5) return true;
  return false;
}

// Din me Bhadra (Vishti karana) kab-kab — 2-2 ghante sampling
function bhadraWindows(dateStr) {
  const wins = [];
  let cur = null;
  for (let h = 0; h < 24; h += 2) {
    const jd = jdFromDateStr(dateStr, h);
    const k = karanaOf(sunTropical(jd), moonTropical(jd));
    if (k === "Vishti") {
      if (!cur) cur = { from: h };
      cur.to = h + 2;
    } else if (cur) { wins.push(cur); cur = null; }
  }
  if (cur) wins.push(cur);
  return wins;
}

function fmtH(h) {
  const hh = ((Math.floor(h) % 24) + 24) % 24;
  const mm = Math.round((h - Math.floor(h)) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export default function Panchang() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const TABL = { Dainik: P.pg_dainik, Mahina: P.pg_masik, Hora: "Hora", "Panchak-Bhadra": "Panchak-Bhadra", Lagna: P.pg_lagna };
  const [tab, setTab] = useState("Dainik");
  const [date, setDate] = useState(todayISO());
  const [p, setP] = useState(() => panchang(todayISO()));
  const [myear, setMyear] = useState(new Date().getFullYear());
  const [mmonth, setMmonth] = useState(new Date().getMonth() + 1);
  const [city, setCity] = useState("Delhi");

  const show = (e) => {
    e?.preventDefault();
    if (date) setP(panchang(date));
  };

  const weekday = new Date(date + "T12:00:00").getDay();
  const [dy, dm] = date.split("-").map(Number);
  const samvat = { vs: dm >= 4 ? dy + 57 : dy + 56, sh: dm >= 4 ? dy - 78 : dy - 79 };

  // Hora: 6:00 se 1-1 ghante, vaar-swami se shuru
  const horas = [];
  for (let i = 0; i < 24; i++) {
    horas.push({ time: `${fmtH(6 + i)}–${fmtH(7 + i)}`, lord: HORA_ORDER[(HORA_START[weekday] + i) % 7] });
  }
  // Choghadiya: 6:00–18:00, 1.5h each
  const chogs = [];
  for (let i = 0; i < 8; i++) {
    const name = CHOG_CYCLE[(CHOG_START[weekday] + i) % 7];
    chogs.push({ time: `${fmtH(6 + i * 1.5)}–${fmtH(7.5 + i * 1.5)}`, name, shubh: CHOG_SHUBH.includes(name) });
  }

  const bhadra = bhadraWindows(date);

  // Lagna talika (chune sheher ke liye, prati ghanta)
  const c = CITIES_FLAT.find((x) => x[0] === city) || CITIES_FLAT[0];
  const lagnaRows = [];
  {
    let prev = null;
    for (let h = 0; h < 24; h++) {
      try {
        const ls = lagnaSidereal(date, `${String(h).padStart(2, "0")}:00`, c[1], c[2]);
        const rashi = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"][Math.floor(((ls % 360) + 360) % 360 / 30)];
        if (rashi !== prev) {
          lagnaRows.push({ from: h, rashi });
          prev = rashi;
        }
      } catch { /* ignore */ }
    }
  }

  // Mahina calendar
  const daysInMonth = new Date(myear, mmonth, 0).getDate();
  const firstWd = new Date(myear, mmonth - 1, 1).getDay();
  const monthCells = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${myear}-${String(mmonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const pp = panchang(iso);
    const fest = FESTIVALS_2026.find((f) => f.month === mmonth && f.day === d);
    const tn = pp.tithi.n;
    let vrat = "";
    if (tn === 11 || tn === 26) vrat = "Ekadashi";
    else if (tn === 15) vrat = "Purnima";
    else if (tn === 30) vrat = "Amavasya";
    else if (tn === 13 || tn === 28) vrat = "Pradosh";
    else if (tn === 19) vrat = "Sankashti";
    monthCells.push({ d, tithi: pp.tithi.name, vrat, fest: fest?.name });
  }

  return (
    <div>
      <h1 className="text-gradient">Panchang</h1>
      <p>Dainik, Mahina-calendar, Hora, Choghadiya, Panchak-Bhadra, Lagna — ganana se.</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        {TABS.map((tb) => (
          <button key={tb} className={tab === tb ? "btn" : "btn secondary"} onClick={() => setTab(tb)}>{TABL[tb]}</button>
        ))}
      </div>

      {tab === "Dainik" && (
        <div style={{ marginTop: 16 }}>
          <div className="card">
            <form onSubmit={show} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input className="input" style={{ maxWidth: 260 }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <button className="btn" type="submit">{P.pg_view}</button>
            </form>
          </div>
          {p && (
            <div style={{ marginTop: 16 }}>
              <div className="card number-card">
                <p>{VAAR[weekday]} · {date}</p>
                <h2 style={{ marginTop: 6 }}>{p.tithi.paksha} {p.tithi.name}</h2>
                <p>{p.nakshatra.name} · Charan {p.nakshatra.pada}</p>
                <p style={{ fontSize: ".85rem", marginTop: 8 }}>Vikram Samvat {samvat.vs} · Shaka Samvat {samvat.sh} (lagbhag)</p>
              </div>
              <div className="grid grid-2" style={{ marginTop: 16 }}>
                <div className="card"><h3>{P.pg_tithi}</h3><p style={{ marginTop: 8 }}>{p.tithi.paksha} Paksha — {p.tithi.name}</p></div>
                <div className="card"><h3>{P.pg_naks}</h3><p style={{ marginTop: 8 }}>{p.nakshatra.name} (Charan {p.nakshatra.pada})</p></div>
                <div className="card"><h3>{P.pg_yoga}</h3><p style={{ marginTop: 8 }}>{p.yoga}</p></div>
                <div className="card"><h3>{P.pg_karana}</h3><p style={{ marginTop: 8 }}>{p.karana}</p></div>
                <div className="card"><h3>{P.pg_chandra}</h3><p style={{ marginTop: 8 }}>{p.chandraRashi}</p></div>
                <div className="card"><h3>{P.pg_surya}</h3><p style={{ marginTop: 8 }}>{p.suryaRashi}</p></div>
                <div className="card"><h3>{P.pg_rahu}</h3><p style={{ marginTop: 8 }}>{RAHUKAAL[weekday]}</p></div>
                <div className="card"><h3>{P.pg_abhijit}</h3><p style={{ marginTop: 8 }}>{ABHIJIT}</p></div>
                <div className="card"><h3>Godhuli ({P.pg_shubh})</h3><p style={{ marginTop: 8 }}>17:12 – 18:00 (maanak suryast)</p></div>
                <div className="card"><h3>Yamaganda</h3><p style={{ marginTop: 8 }}>{YAMAGANDA[weekday]}</p></div>
                <div className="card"><h3>Gulika Kaal</h3><p style={{ marginTop: 8 }}>{GULIKA[weekday]}</p></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "Mahina" && (
        <div style={{ marginTop: 16 }}>
          <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select className="input" style={{ maxWidth: 160 }} value={mmonth} onChange={(e) => setMmonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <input className="input" style={{ maxWidth: 140 }} type="number" value={myear} onChange={(e) => setMyear(Number(e.target.value))} />
          </div>
          <p style={{ fontSize: ".8rem", marginTop: 8 }}>Hindu tithi (dopahar-sthiti) + Vrat-Tyohar. Varshik vrat: Ekadashi, Purnima, Amavasya, Pradosh, Sankashti auto-chinhit.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 12 }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => (
              <div key={w} style={{ textAlign: "center", fontWeight: 700, color: "var(--gold)" }}>{w}</div>
            ))}
            {Array.from({ length: firstWd }).map((_, i) => <div key={"e" + i} />)}
            {monthCells.map((c) => (
              <div key={c.d} className="card" style={{ padding: 8, textAlign: "center", borderColor: c.fest ? "var(--gold)" : undefined }}>
                <div style={{ fontWeight: 800 }}>{c.d}</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>{c.tithi}</div>
                {c.vrat && <div className="badge" style={{ fontSize: ".65rem", marginTop: 4 }}>{c.vrat}</div>}
                {c.fest && <div style={{ fontSize: ".7rem", color: "var(--gold)", marginTop: 4 }}>{c.fest}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Hora" && (
        <div style={{ marginTop: 16 }}>
          <div className="card">
            <h3>Hora ({VAAR[weekday]}) — 6:00 se, maanak samay</h3>
            <div style={{ marginTop: 10 }}>
              {horas.map((h) => (
                <div key={h.time} className="kv"><span className="k">{h.time}</span><span className="v">{HORA_HI[h.lord]} Hora</span></div>
              ))}
            </div>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <h3>Din-Choghadiya ({VAAR[weekday]}) — 6:00–18:00</h3>
            <div style={{ marginTop: 10 }}>
              {chogs.map((c) => (
                <div key={c.time} className="kv">
                  <span className="k">{c.time} — {c.name}</span>
                  <span className="v" style={{ color: c.shubh ? "var(--accent-2)" : "var(--danger)" }}>{c.shubh ? "Shubh" : "Varjit"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Panchak-Bhadra" && (
        <div style={{ marginTop: 16 }}>
          <div className="card">
            <form onSubmit={show} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input className="input" style={{ maxWidth: 260 }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <button className="btn" type="submit">Jaanchein</button>
            </form>
          </div>
          {p && (
            <div className="grid grid-2" style={{ marginTop: 16 }}>
              <div className="card">
                <h3>Panchak</h3>
                <p style={{ marginTop: 8 }}>{isPanchak(p.nakshatra) ? `HAAN — ${p.nakshatra.name} me Panchak hai. Lakdi-jalav, ghar-chhat, dakshin-yatra varjit.` : `Nahi — ${p.nakshatra.name} me Panchak nahi hai.`}</p>
              </div>
              <div className="card">
                <h3>Bhadra (Vishti Karana)</h3>
                {bhadra.length === 0
                  ? <p style={{ marginTop: 8 }}>Is din Bhadra nahi hai — shubh karya hetu uttam.</p>
                  : <div style={{ marginTop: 8 }}>{bhadra.map((b, i) => (
                    <div key={i} className="kv"><span className="k">Bhadra-kaal</span><span className="v">{fmtH(b.from)} – {fmtH(b.to)}</span></div>
                  ))}<p style={{ fontSize: ".8rem" }}>Bhadra me shubh karya varjit.</p></div>}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "Lagna" && (
        <div style={{ marginTop: 16 }}>
          <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input className="input" style={{ maxWidth: 260 }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <select className="input" style={{ maxWidth: 260 }} value={city} onChange={(e) => setCity(e.target.value)}>
              {STATES.map((g) => (
                <optgroup key={g.state} label={g.state}>
                  {g.cities.map((c) => <option key={g.state + c[0]} value={c[0]}>{c[0]}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <h3>Lagna Talika — {city} ({date})</h3>
            <div style={{ marginTop: 10 }}>
              {lagnaRows.map((r, i) => (
                <div key={i} className="kv">
                  <span className="k">{fmtH(r.from)} se</span>
                  <span className="v">{r.rashi} Lagna</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: ".8rem", marginTop: 8 }}>Maanak ganana — sthaniya suryodaya anusaar ±15 min antar sambhav.</p>
          </div>
        </div>
      )}
    </div>
  );
}
