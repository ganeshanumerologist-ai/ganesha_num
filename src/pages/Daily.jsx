import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import kundliT from "../i18n/kundli.js";
import { DAY_INFO, VAAR, universalDay, personalDay } from "../data/daily.js";
import { dayInfo } from "../data/day_i18n.js";
import { loadProfile, saveProfile } from "../profile/profile.js";
import ShareButtons from "../components/ShareButtons.jsx";

const VAAR_TX = {
  hi: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  mr: ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function Daily() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const L = kundliT(lang);
  const V = VAAR_TX[lang] || VAAR;
  const [birthdate, setBirthdate] = useState(() => loadProfile().birthdate || "");
  const [date, setDate] = useState(todayISO());
  const [result, setResult] = useState(null);

  const calc = (e) => {
    e.preventDefault();
    const u = universalDay(date);
    const p = birthdate ? personalDay(birthdate, date) : null;
    const main = p || u;
    saveProfile({ birthdate });
    const d = new Date(date + "T00:00:00");
    setResult({ u, p, main, info: dayInfo(main, lang), vaar: V[d.getDay()] });
  };

  return (
    <div>
      <h1 className="text-gradient">{P.pg_dainik} {P.pg_lucky}</h1>

      <div className="card" style={{ marginTop: 20 }}>
        <form onSubmit={calc} className="grid grid-2">
          <div>
            <label className="label">{P.pg_dainik}</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="label">{L.k_dob}</label>
            <input className="input" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
          </div>
          <div>
            <button className="btn" type="submit">{P.pg_view}</button>
          </div>
        </form>
      </div>

      {result && (
        <div style={{ marginTop: 24 }}>
          <div className="card number-card">
            <p>{result.vaar}</p>
            <div className="num"><span>{result.main}</span></div>
            <h2>{result.info.vibe}</h2>
            <p>Universal {result.u}{result.p ? ` · Personal ${result.p}` : ""}</p>
          </div>
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            <div className="card"><h3>{P.pg_luckycolor}</h3><p style={{ marginTop: 8 }}>{result.info.color}</p></div>
            <div className="card"><h3>{P.pg_day}</h3><p style={{ marginTop: 8 }}>{result.info.dir}</p></div>
            <div className="card"><h3>{L.k_upay}</h3><p style={{ marginTop: 8 }}>{result.info.upay}</p></div>
            <div className="card"><h3>{P.pg_nature}</h3><p style={{ marginTop: 8 }}>{result.info.vibe}</p></div>
          </div>
          <ShareButtons title={P.pg_dainik} text={`${result.main} · ${result.info.color} (${result.vaar})`} />
        </div>
      )}
    </div>
  );
}
