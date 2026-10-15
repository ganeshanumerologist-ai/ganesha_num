import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { chartT, rashiName, grahaName } from "../i18n/charts.js";
import {
  julianDay, sunTropical, moonTropical, planetTropical, rahuTropical,
  rev, lahiriAyanamsa, rashiIndex, lagnaSidereal,
  navamshaSign, dashamshaSign, dwadasamshaSign, RASHIS,
} from "../utils/astro.js";
import CITIES, { STATES } from "../data/cities.js";
import NorthChart from "../components/NorthChart.jsx";

const GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

function positions(dateStr, timeStr) {
  const [hh, mm] = (timeStr || "12:00").split(":").map(Number);
  const [y, m, d] = dateStr.split("-").map(Number);
  const jd = julianDay(y, m, d, hh + mm / 60 - 5.5);
  const aya = lahiriAyanamsa(jd);
  const out = {};
  for (const g of GRAHAS) {
    let sid;
    if (g === "Rahu") sid = rev(rahuTropical(jd) - aya);
    else if (g === "Ketu") sid = rev(rahuTropical(jd) + 180 - aya);
    else {
      const trop = g === "Sun" ? sunTropical(jd) : g === "Moon" ? moonTropical(jd) : planetTropical(g, jd);
      sid = rev(trop - aya);
    }
    out[g] = { sid, idx: rashiIndex(sid) };
  }
  return out;
}

function toHouses(lagnaIdx, mapIdxToAbbr, abbr) {
  const houses = {};
  for (let h = 1; h <= 12; h++) houses[h] = [];
  for (const [g, idx] of Object.entries(mapIdxToAbbr)) {
    const h = ((idx - lagnaIdx + 12) % 12) + 1;
    houses[h].push(abbr[g] || g);
  }
  houses[1] = [abbr.La, ...houses[1]];
  return houses;
}

export default function Charts() {
  const { lang } = useLanguage();
  const T = chartT(lang);
  const abbr = {};
  for (const g of GRAHAS) abbr[g] = (T.graha[g] || g).slice(0, 2);
  abbr.La = T.c_lagna.slice(0, 1);

  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("Delhi");
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [cityQ, setCityQ] = useState("");
  const [r, setR] = useState(null);

  const calc = (e) => {
    e.preventDefault();
    if (!dob || !time) return;
    let lat, lon;
    if (city === "OTHER") {
      lat = Number(manualLat); lon = Number(manualLon);
      if (!lat || !lon) return;
    } else {
      const c = CITIES.find((x) => x[0] === city) || CITIES[0];
      lat = c[1]; lon = c[2];
    }
    const lagSid = lagnaSidereal(dob, time, lat, lon);
    const lagIdx = rashiIndex(lagSid);
    const pos = positions(dob, time);
    const d1 = {}, d9 = {}, d10 = {}, d12 = {};
    for (const [g, p] of Object.entries(pos)) {
      d1[g] = p.idx;
      d9[g] = RASHIS.indexOf(navamshaSign(p.sid));
      d10[g] = RASHIS.indexOf(dashamshaSign(p.sid));
      d12[g] = RASHIS.indexOf(dwadasamshaSign(p.sid));
    }
    const lag9 = RASHIS.indexOf(navamshaSign(lagSid));
    const lag10 = RASHIS.indexOf(dashamshaSign(lagSid));
    const lag12 = RASHIS.indexOf(dwadasamshaSign(lagSid));
    setR({ lagIdx, lag9, lag10, lag12, pos, d1, d9, d10, d12 });
  };

  const RN = (en) => rashiName(en, lang);
  const GN = (en) => grahaName(en, lang);

  return (
    <div>
      <h1 className="text-gradient">{T.c_title}</h1>
      <p>{T.c_sub}</p>

      <div className="card" style={{ marginTop: 16 }}>
        <form onSubmit={calc} className="grid grid-2">
          <div>
            <label className="label">{T.c_dob} *</label>
            <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>
          <div>
            <label className="label">{T.c_time} *</label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div>
            <label className="label">{T.c_city} *</label>
            <input className="input" style={{ marginBottom: 8 }} value={cityQ} onChange={(e) => setCityQ(e.target.value)} placeholder="Naam likhkar dhoondhein..." />
            <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="OTHER">{T.c_other}</option>
              {STATES.map((g) => {
                const q = cityQ.trim().toLowerCase();
                const list = [...g.cities].sort((a, b) => a[0].localeCompare(b[0])).filter((c) => !q || c[0].toLowerCase().includes(q));
                if (!list.length) return null;
                return (
                  <optgroup key={g.state} label={g.state}>
                    {list.map((c) => (
                      <option key={g.state + c[0]} value={c[0]}>{c[0]}</option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>
          {city === "OTHER" && (
            <>
              <div>
                <label className="label">{T.c_lat}</label>
                <input className="input" type="number" step="0.01" value={manualLat} onChange={(e) => setManualLat(e.target.value)} required />
              </div>
              <div>
                <label className="label">{T.c_lon}</label>
                <input className="input" type="number" step="0.01" value={manualLon} onChange={(e) => setManualLon(e.target.value)} required />
              </div>
            </>
          )}
          <div style={{ display: "flex", alignItems: "end" }}>
            <button className="btn" type="submit">{T.c_btn}</button>
          </div>
        </form>
      </div>

      {r && (
        <div style={{ marginTop: 20 }}>
          <p>{T.c_lagna} (D1): <b>{RN(RASHIS[r.lagIdx])}</b> · {T.c_navlagna}: <b>{RN(RASHIS[r.lag9])}</b></p>
          <div className="grid grid-2" style={{ marginTop: 12 }}>
            <NorthChart title={T.c_d1} lagnaIdx={r.lagIdx} houses={toHouses(r.lagIdx, r.d1, abbr)} />
            <NorthChart title={T.c_d9} lagnaIdx={r.lag9} houses={toHouses(r.lag9, r.d9, abbr)} />
            <NorthChart title={T.c_d10} lagnaIdx={r.lag10} houses={toHouses(r.lag10, r.d10, abbr)} />
            <NorthChart title={T.c_d12} lagnaIdx={r.lag12} houses={toHouses(r.lag12, r.d12, abbr)} />
          </div>
          <div className="card" style={{ marginTop: 20 }}>
            <h3>{T.c_table}</h3>
            <div style={{ marginTop: 8 }}>
              {GRAHAS.map((g) => (
                <div key={g} className="kv">
                  <span className="k">{GN(g)}</span>
                  <span className="v">D1 {RN(RASHIS[r.d1[g]])} · D9 {RN(RASHIS[r.d9[g]])} · D10 {RN(RASHIS[r.d10[g]])}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: ".8rem", marginTop: 10 }}>{T.c_note}</p>
        </div>
      )}
    </div>
  );
}
