import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import {
  panchang, jdFromDateStr, sunTropical, moonTropical, karanaOf, lagnaSidereal,
} from "../utils/astro.js";
import {
  sunTimes, fmtMin, shakaSamvat, samvatsaraName, vikramSamvat,
  tithiAt, nakshatraAt, amritKaal, sthanikSamay, grihaPravishTime, vivahMuhur,
} from "../utils/panchang.js";
import {
  RAHUKAAL, YAMAGANDA, GULIKA, ABHIJIT, HORA_ORDER, HORA_START, HORA_HI,
  CHOG_CYCLE, CHOG_START, CHOG_SHUBH,
} from "../data/jyotish.js";
import { STATES } from "../data/cities.js";
import CITIES_FLAT from "../data/cities.js";
import { VAAR } from "../data/daily.js";
import { calTX } from "../data/calendarTX.js";
import { loadProfile } from "../profile/profile.js";
import { jdFromDateStr as jdDOB, moonTropical as moonTrop, lahiriAyanamsa as ayaD, rev as revD, nakshatraOf as nakOf } from "../utils/astro.js";
import { LP, vaarName, grahaName, chogName, nakName, tithiName, vratName, sthanikL, rashiName, pakshaName, samvatsaraNameI18n } from "../i18n/names.js";
import { siteTX } from "../i18n/siteTx.js";

const L_RASHI = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Tab ids English me rehte hain (state ke liye), label dictionary se aata hai.
const TABS = ["Dainik", "Mahina", "Hora", "Panchak-Bhadra", "Lagna", "Muhurat"];

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

// ABHIJIT constant me "(maanak samay)" Hinglish hai — bhasha se replace karo.
const abhijitTime = (lang) => {
  const i = lang === "en" ? ABHIJIT : ABHIJIT.replace(/\s*\(.*\)\s*$/, "");
  return `${i} (${siteTX(lang).pan_approx_time})`;
};

export default function Panchang() {
  const { lang, S } = useLanguage();
  const P = pgT(lang);
  const CAL = calTX(lang);
  const TABL = {
    Dainik: S.pan_tab_daily, Mahina: S.pan_tab_monthly, Hora: S.pan_tab_hora,
    "Panchak-Bhadra": S.pan_tab_panchak, Lagna: S.pan_tab_lagna, Muhurat: S.pan_tab_muhurat,
  };
  const [tab, setTab] = useState("Dainik");
  const [date, setDate] = useState(todayISO());
  const [myear, setMyear] = useState(new Date().getFullYear());
  const [mmonth, setMmonth] = useState(new Date().getMonth() + 1);
  const [city, setCity] = useState("Delhi");

  // P alias: jyotish_b ke labels (pg_tithi, pg_naks …) + siteTx ke pan_* labels.
  const p = LP(panchang(date), lang);

  const show = (e) => { e?.preventDefault(); };

  const weekday = new Date(date + "T12:00:00").getDay();
  const [dy, dm] = date.split("-").map(Number);
  const samvat = { vs: vikramSamvat(date), sh: shakaSamvat(dy), samvatsara: samvatsaraName(dy) };

  // Chune sheher ka data (suryodaya/suyast ke liye)
  const cityData = CITIES_FLAT.find((x) => x[0] === city) || CITIES_FLAT[0];
  const sun = sunTimes(date, cityData[1], cityData[2]);

  // Amrit Kaal — user ke janma-nakshatra se
  const prof = loadProfile();
  let janmaNakIdx = null;
  if (prof.birthdate) {
    try {
      const jdB = jdDOB(prof.birthdate, 12);
      janmaNakIdx = nakOf(revD(moonTrop(jdB) - ayaD(jdB))).index;
    } catch { /* ignore */ }
  }
  const amrit = amritKaal(date, janmaNakIdx, null);
  const sthanik = sthanikSamay(weekday);

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
  const c = CITIES_FLAT.find((x) => x[0] === city) || CITIES_FLAT[0];
  const lagnaRows = [];
  {
    let prev = null;
    for (let h = 0; h < 24; h++) {
      try {
        const ls = lagnaSidereal(date, `${String(h).padStart(2, "0")}:00`, c[1], c[2]);
        const rashi = L_RASHI[Math.floor(((ls % 360) + 360) % 360 / 30)];
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
    const pp = LP(panchang(iso), lang);
    const fest = CAL.festivals.find((f) => f.month === mmonth && f.day === d);
    const tn = pp.tithi.n;
    let vrat = "";
    if (tn === 11 || tn === 26) vrat = tithiName(10, lang);           // Ekadashi
    else if (tn === 15) vrat = tithiName(14, lang);                   // Purnima
    else if (tn === 30) vrat = vratName("amavasya", lang);
    else if (tn === 13 || tn === 28) vrat = vratName("pradosh", lang);
    else if (tn === 19) vrat = vratName("sankashti", lang);
    monthCells.push({ d, tithi: pp.tithi.name, vrat, fest: fest?.name });
  }

  const WD = vaarName(weekday, lang);
  const ABHIJIT_T = abhijitTime(lang);

  return (
    <div>
      <h1 className="text-gradient">{S.pan_title}</h1>
      <p>{S.pan_sub}</p>

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
                <p>{WD} · {date}</p>
                <h2 style={{ marginTop: 6 }}>{p.tithi.paksha} {p.tithi.name}</h2>
                <p>{p.nakshatra.name} · {S.pan_charan} {p.nakshatra.pada}</p>
                <p style={{ fontSize: ".85rem", marginTop: 8 }}>
                  {S.pan_samvatsara}: {samvatsaraNameI18n(dy, lang)}
                </p>
              </div>
              <div className="grid grid-2" style={{ marginTop: 16 }}>
                <div className="card"><h3>{P.pg_tithi}</h3><p style={{ marginTop: 8 }}>{p.tithi.paksha} — {p.tithi.name}</p></div>
                <div className="card"><h3>{P.pg_naks}</h3><p style={{ marginTop: 8 }}>{p.nakshatra.name} ({S.pan_charan} {p.nakshatra.pada})</p></div>
                <div className="card"><h3>{P.pg_yoga}</h3><p style={{ marginTop: 8 }}>{p.yoga}</p></div>
                <div className="card"><h3>{P.pg_karana}</h3><p style={{ marginTop: 8 }}>{p.karana}</p></div>
                <div className="card"><h3>{P.pg_chandra}</h3><p style={{ marginTop: 8 }}>{p.chandraRashi}</p></div>
                <div className="card"><h3>{P.pg_surya}</h3><p style={{ marginTop: 8 }}>{p.suryaRashi}</p></div>
                <div className="card"><h3>{P.pg_rahu}</h3><p style={{ marginTop: 8 }}>{S.pan_rahu_kaal}: {RAHUKAAL[weekday]}</p></div>
                <div className="card"><h3>{P.pg_abhijit}</h3><p style={{ marginTop: 8 }}>{ABHIJIT_T}</p></div>
                <div className="card"><h3>{S.pan_godhuli} ({P.pg_shubh})</h3><p style={{ marginTop: 8 }}>{S.pan_godhuli_time}</p></div>
                <div className="card"><h3>{S.pan_yamaganda}</h3><p style={{ marginTop: 8 }}>{YAMAGANDA[weekday]}</p></div>
                <div className="card"><h3>{S.pan_gulika}</h3><p style={{ marginTop: 8 }}>{GULIKA[weekday]}</p></div>
                <div className="card"><h3>{S.pan_sunrise} — {city}</h3><p style={{ marginTop: 8 }}>{fmtMin(sun.sunrise)}</p></div>
                <div className="card"><h3>{S.pan_sunset}</h3><p style={{ marginTop: 8 }}>{fmtMin(sun.sunset)}</p></div>
                <div className="card"><h3>{S.pan_day_length}</h3><p style={{ marginTop: 8 }}>{Math.floor(sun.dayLength / 60)} {S.pan_hours} {Math.round(sun.dayLength % 60)} {S.pan_minutes}</p></div>
                <div className="card"><h3>{S.pan_amrit}</h3><p style={{ marginTop: 8 }}>
                    {janmaNakIdx == null
                      ? S.pan_amrit_need_dob
                      : amrit.exists
                        ? `${fmtMin(amrit.from)} – ${fmtMin(amrit.to)}`
                        : S.pan_amrit_none}
                  </p></div>
                <div className="card"><h3>{S.pan_sthanik}</h3><p style={{ marginTop: 8, fontSize: ".82rem" }}>
                    {sthanikL(sthanik, lang).map((s, i) => `${i + 1}. ${s}`).join(" · ")}
                  </p></div>
              </div>
              <p style={{ fontSize: ".78rem", marginTop: 10, color: "var(--muted)" }}>{S.pan_kala_note}</p>
            </div>
          )}
        </div>
      )}

      {tab === "Mahina" && (
        <div style={{ marginTop: 16 }}>
          <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select className="input" style={{ maxWidth: 160 }} value={mmonth} onChange={(e) => setMmonth(Number(e.target.value))}>
              {CAL.months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <input className="input" style={{ maxWidth: 140 }} type="number" value={myear} onChange={(e) => setMyear(Number(e.target.value))} />
          </div>
          <p style={{ fontSize: ".8rem", marginTop: 8 }}>{S.pan_months_note}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 12 }}>
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} style={{ textAlign: "center", fontWeight: 700, color: "var(--gold)", fontSize: ".62rem", lineHeight: 1.15 }}>
                {vaarName(i, lang)}
              </div>
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
            <h3>{S.pan_tab_hora} ({WD}) — {S.pan_hora_note}</h3>
            <div style={{ marginTop: 10 }}>
              {horas.map((h) => (
                <div key={h.time} className="kv"><span className="k">{h.time}</span><span className="v">{grahaName(h.lord, lang)} {S.pan_hora}</span></div>
              ))}
            </div>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <h3>{S.pan_choghadiya} ({WD}) — 6:00–18:00</h3>
            <div style={{ marginTop: 10 }}>
              {chogs.map((c) => (
                <div key={c.time} className="kv">
                  <span className="k">{c.time} — {chogName(c.name, lang)}</span>
                  <span className="v" style={{ color: c.shubh ? "var(--accent-2)" : "var(--danger)" }}>{c.shubh ? S.pan_shubh_hai : S.pan_nahi}</span>
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
              <button className="btn" type="submit">{P.pg_view}</button>
            </form>
          </div>
          {p && (
            <div className="grid grid-2" style={{ marginTop: 16 }}>
              <div className="card">
                <h3>{S.pan_panchak_h}</h3>
                <p style={{ marginTop: 8 }}>
                  {isPanchak(p.nakshatra)
                    ? `${S.pan_panchak_yes} ${p.nakshatra.name}`
                    : `${S.pan_panchak_no} ${p.nakshatra.name}`}
                </p>
                <p style={{ fontSize: ".8rem", marginTop: 6 }}>{S.pan_panchak_note}</p>
              </div>
              <div className="card">
                <h3>{S.pan_bhadra_vishti}</h3>
                {bhadra.length === 0
                  ? <p style={{ marginTop: 8 }}>{S.pan_bhadra_none}</p>
                  : <div style={{ marginTop: 8 }}>{bhadra.map((b, i) => (
                    <div key={i} className="kv"><span className="k">{S.pan_bhadra_kaal}</span><span className="v">{fmtH(b.from)} – {fmtH(b.to)}</span></div>
                  ))}<p style={{ fontSize: ".8rem" }}>{S.pan_bhadra_note}</p></div>}
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
            <h3>{S.pan_lagna_talika} — {city} ({date})</h3>
            <div style={{ marginTop: 10 }}>
              {lagnaRows.map((r, i) => (
                <div key={i} className="kv">
                  <span className="k">{fmtH(r.from)} {S.pan_lagna_se}</span>
                  <span className="v">{rashiName(L_RASHI.indexOf(r.rashi), lang)} {S.pan_lagna_word}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: ".8rem", marginTop: 8 }}>{S.pan_lagna_note}</p>
          </div>
        </div>
      )}

      {tab === "Muhurat" && (
        <div style={{ marginTop: 16 }}>
          <div className="card">
            <form onSubmit={show} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input className="input" style={{ maxWidth: 260 }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <button className="btn" type="submit">{P.pg_view}</button>
            </form>
          </div>
          {p && (() => {
            const ti = tithiAt(date, 12);
            const nak = nakshatraAt(date, 12);
            const hasPanchak = isPanchak(p.nakshatra);
            const hasBhadra = bhadra.length > 0;
            const griha = grihaPravishTime(ti, weekday, nak.index);
            const vivah = vivahMuhur(ti, weekday, nak.index, hasPanchak, hasBhadra);
            const tiName = tithiName((ti.n - 1) % 15, lang);
            const tiPak = pakshaName(ti.paksha, lang);
            const Y = (b, label, desc) => (
              <div className="card">
                <h3>{label}</h3>
                <p style={{ marginTop: 8, color: b.ok ? "var(--accent-2)" : "var(--danger)" }}>
                  {b.ok ? S.pan_muh_yes : S.pan_muh_no}
                </p>
                <div style={{ marginTop: 10 }}>
                  <div className="kv"><span className="k">{S.pan_check}</span><span className="v" style={{ color: b.tithiOk ? "var(--accent-2)" : "var(--danger)" }}>{b.tithiOk ? "✓" : "✗"} {tiPak} {tiName}</span></div>
                  <div className="kv"><span className="k">{S.pan_check_vaar}</span><span className="v" style={{ color: b.vaarOk ? "var(--accent-2)" : "var(--danger)" }}>{b.vaarOk ? "✓" : "✗"} {WD}</span></div>
                  <div className="kv"><span className="k">{S.pan_check_nak}</span><span className="v" style={{ color: b.nakOk ? "var(--accent-2)" : "var(--danger)" }}>{b.nakOk ? "✓" : "✗"} {nakName(nak.index, lang)}</span></div>
                </div>
                <p style={{ fontSize: ".8rem", marginTop: 8 }}>{desc}</p>
              </div>
            );
            return (
              <>
                <div className="card" style={{ marginTop: 16 }}>
                  <h3>{S.pan_samvatsara_chakra}</h3>
                  <div className="kv"><span className="k">{S.pan_samvatsara_short}</span><span className="v">{samvatsaraNameI18n(dy, lang)}</span></div>
                  <div className="kv"><span className="k">{S.pan_vikram}</span><span className="v">{samvat.vs}</span></div>
                  <div className="kv"><span className="k">{S.pan_shaka}</span><span className="v">{samvat.sh}</span></div>
                  <p style={{ fontSize: ".8rem", marginTop: 8 }}>{S.pan_samvatsara_note}</p>
                </div>
                <div className="grid grid-2" style={{ marginTop: 16 }}>
                  {Y(griha, S.pan_griha, S.pan_griha_desc)}
                  {Y(vivah, S.pan_vivah, S.pan_vivah_desc)}
                </div>
                <div className="grid grid-2" style={{ marginTop: 16 }}>
                  <div className="card">
                    <h3>{S.pan_sunrise} / {S.pan_sunset} — {city}</h3>
                    <div className="kv"><span className="k">{S.pan_sunrise}</span><span className="v">{fmtMin(sun.sunrise)}</span></div>
                    <div className="kv"><span className="k">{S.pan_sunset}</span><span className="v">{fmtMin(sun.sunset)}</span></div>
                    <div className="kv"><span className="k">{S.pan_sthanik_short}</span><span className="v" style={{ fontSize: ".8rem" }}>{sthanikL(sthanik, lang).join(" · ")}</span></div>
                  </div>
                  <div className="card">
                    <h3>{S.pan_amrit}</h3>
                    <p style={{ marginTop: 8 }}>
                      {janmaNakIdx == null
                        ? S.pan_amrit_need_dob
                        : amrit.exists
                          ? `${fmtMin(amrit.from)} – ${fmtMin(amrit.to)}`
                          : S.pan_amrit_none}
                    </p>
                    {janmaNakIdx != null && <p style={{ fontSize: ".8rem", marginTop: 8 }}>{S.pan_amrit_note}</p>}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
