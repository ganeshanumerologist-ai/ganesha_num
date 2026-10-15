import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import kundliT from "../i18n/kundli.js";
import { personalYear, universalYear } from "../data/forecast.js";
import { yearMeaning } from "../data/varshphal_i18n.js";

export default function Forecast() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const L = kundliT(lang);
  const [birthdate, setBirthdate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [result, setResult] = useState(null);

  const calc = (e) => {
    e.preventDefault();
    const py = personalYear(birthdate, Number(year));
    if (!py) return;
    setResult({ py, meaning: yearMeaning(py, lang), uy: universalYear(Number(year)) });
  };

  return (
    <div>
      <h1 className="text-gradient">{P.pg_varshik} ({P.pg_year})</h1>
      <p>{L.k_dob} + {P.pg_year}.</p>

      <div className="card" style={{ marginTop: 20 }}>
        <form onSubmit={calc} className="grid grid-2">
          <div>
            <label className="label">{L.k_dob}</label>
            <input className="input" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
          </div>
          <div>
            <label className="label">{P.pg_year}</label>
            <input className="input" type="number" min={2000} max={2100} value={year} onChange={(e) => setYear(e.target.value)} required />
          </div>
          <div>
            <button className="btn" type="submit">{P.pg_view}</button>
          </div>
        </form>
      </div>

      {result && (
        <div style={{ marginTop: 24 }}>
          <div className="card number-card">
            <div className="num"><span>{result.py}</span></div>
            <h2>{result.meaning.t}</h2>
            <p style={{ color: "var(--muted)" }}>Universal Year {result.uy}</p>
          </div>
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            <div className="card"><h3>{P.pg_varshik}</h3><p style={{ marginTop: 8 }}>{result.meaning.d}</p></div>
            <div className="card"><h3>{P.pg_career}</h3><p style={{ marginTop: 8 }}>{result.meaning.c}</p></div>
            <div className="card"><h3>{L.k_love}</h3><p style={{ marginTop: 8 }}>{result.meaning.love}</p></div>
            <div className="card"><h3>{L.k_upay}</h3><p style={{ marginTop: 8 }}>{result.meaning.adv}</p></div>
          </div>
          <div className="card" style={{ marginTop: 20 }}>
            <h3>{P.pg_year} 1–9</h3>
            <div className="grid grid-3" style={{ marginTop: 10 }}>
              {[1,2,3,4,5,6,7,8,9].map((n) => (
                <div key={n} className="kv" style={{ border: n === result.py ? "1px solid var(--accent)" : undefined, borderRadius: 10, padding: "8px 12px" }}>
                  <span className="k">{P.pg_year} {n}</span><span className="v">{yearMeaning(n, lang).t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
