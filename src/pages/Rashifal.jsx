import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import { RASHI_DATA, DAILY_POOL } from "../data/jyotish.js";
import { rashiLang, DAILY_TX } from "../data/rashi_i18n.js";
import { varshikLang } from "../data/varshik_detail.js";
import { rashiName } from "../i18n/charts.js";

const SW = {
  hi: { swami: "स्वामी", prakar: "प्रकार चुनें" },
  mr: { swami: "स्वामी", prakar: "प्रकार निवडा" },
  en: { swami: "Lord", prakar: "Choose type" },
};
import { reduceNumber } from "../utils/numerology.js";
import ShareButtons from "../components/ShareButtons.jsx";

function seed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000;
  return h;
}

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};
const weekKey = () => {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-W${Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7)}`;
};

const TABS = ["dainik", "saptahik", "masik", "prem", "arthik", "career", "varshik"];

const VCAT = {
  hi: { padhai: "पढ़ाई", vivah: "विवाह", arogya: "स्वास्थ्य", dhan: "धन", share: "शेयर बाज़ार", vyapar: "व्यापार", samman: "सम्मान" },
  mr: { padhai: "अभ्यास", vivah: "विवाह", arogya: "आरोग्य", dhan: "धन", share: "शेअर बाजार", vyapar: "व्यापार", samman: "सन्मान" },
  en: { padhai: "Studies", vivah: "Marriage", arogya: "Health", dhan: "Wealth", share: "Stock Market", vyapar: "Business", samman: "Prestige" },
};

const monthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
};

export default function Rashifal() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const TABL = { dainik: P.pg_dainik, saptahik: P.pg_saptahik, masik: P.pg_masik, prem: P.pg_prem, arthik: P.pg_arthik, career: P.pg_career, varshik: P.pg_varshik };
  const [ri, setRi] = useState(0);
  const [tab, setTab] = useState("dainik");
  const base = RASHI_DATA[ri];
  const r = rashiLang(ri, lang, base);
  const POOL = DAILY_TX[lang] || DAILY_POOL;
  const VC = VCAT[lang] || VCAT.en;
  const SX = SW[lang] || SW.en;
  const RN = rashiName(base.name, lang);
  const VD = varshikLang(ri, lang);

  const dailyLine = POOL[seed(todayKey() + base.name) % POOL.length];
  const weeklyLine = POOL[seed(weekKey() + base.name + "w") % POOL.length];
  const weeklyLine2 = POOL[seed(weekKey() + base.name + "w2") % POOL.length];
  const masik1 = POOL[seed(monthKey() + base.name + "m1") % POOL.length];
  const masik2 = POOL[seed(monthKey() + base.name + "m2") % POOL.length];
  const shubhDates = [];
  for (let d = 1; d <= 31; d++) {
    if (reduceNumber(d, false) === r.luckyNum) shubhDates.push(d);
  }

  const body =
    tab === "dainik" ? dailyLine :
    tab === "saptahik" ? `${weeklyLine} ${weeklyLine2}` :
    tab === "masik" ? `${masik1} ${masik2} ${lang === "hi" ? "इस माह की शुभ तारीखें" : lang === "mr" ? "या महिन्याच्या शुभ तारखा" : "Lucky dates this month"}: ${shubhDates.join(", ")}.` :
    tab === "prem" ? r.prem :
    tab === "arthik" ? r.arthik :
    tab === "career" ? r.career : r.varshik;

  return (
    <div>
      <h1 className="text-gradient">Rashifal</h1>
      <p>{lang === "hi" ? "अपनी चंद्र राशि चुनें" : lang === "mr" ? "तुमची चंद्र रास निवडा" : "Choose your Moon sign"}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        {RASHI_DATA.map((x, i) => (
          <button key={x.name} className={ri === i ? "btn" : "btn secondary"} style={{ padding: "8px 14px" }} onClick={() => setRi(i)}>
            {rashiName(x.name, lang)}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>{RN} · {SX.swami}: {r.lord}</h2>
        <p style={{ marginTop: 4 }}>{r.traits}</p>
        <div style={{ marginTop: 14, maxWidth: 320 }}>
          <label className="label">{SX.prakar}</label>
          <select className="input" value={tab} onChange={(e) => setTab(e.target.value)}>
            {TABS.map((tb) => <option key={tb} value={tb}>{TABL[tb]}</option>)}
          </select>
        </div>
        {tab === "varshik" ? (
          <div style={{ marginTop: 16 }}>
            <div className="kv"><span className="k">{VC.padhai}</span><span className="v">{VD.padhai}</span></div>
            <div className="kv"><span className="k">{VC.vivah}</span><span className="v">{VD.vivah}</span></div>
            <div className="kv"><span className="k">{P.pg_prem}</span><span className="v">{VD.prem}</span></div>
            <div className="kv"><span className="k">{VC.arogya}</span><span className="v">{VD.arogya}</span></div>
            <div className="kv"><span className="k">{VC.dhan}</span><span className="v">{VD.dhan}</span></div>
            <div className="kv"><span className="k">{VC.share}</span><span className="v">{VD.share}</span></div>
            <div className="kv"><span className="k">{VC.vyapar}</span><span className="v">{VD.vyapar}</span></div>
            <div className="kv"><span className="k">{VC.samman}</span><span className="v">{VD.samman}</span></div>
            <div className="kv"><span className="k">{P.pg_career}</span><span className="v">{VD.career}</span></div>
            <div className="kv"><span className="k">{P.pg_upay}</span><span className="v">{VD.upay}</span></div>
          </div>
        ) : (
          <p style={{ marginTop: 16, fontSize: "1.05rem" }}>{body}</p>
        )}
        <div style={{ marginTop: 14 }}>
          <div className="kv"><span className="k">{P.pg_luckynum}</span><span className="v">{r.luckyNum}</span></div>
          <div className="kv"><span className="k">{P.pg_luckycolor}</span><span className="v">{r.luckyColor}</span></div>
          <div className="kv"><span className="k">{P.pg_day}</span><span className="v">{r.day}</span></div>
          <div className="kv"><span className="k">{P.pg_mantra}</span><span className="v">{r.mantra}</span></div>
        </div>
      </div>

      <ShareButtons title="Rashifal" text={`${RN} — ${TABL[tab]}`} />
    </div>
  );
}
