import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import kundliT from "../i18n/kundli.js";
import { jdFromDateStr, sunTropical, moonTropical, lahiriAyanamsa, rev, nakshatraOf, tithiOf, karanaOf, taraBala } from "../utils/astro.js";
import { MUHURAT_RULES } from "../data/jyotish.js";
import { loadProfile, saveProfile } from "../profile/profile.js";
import { VAAR } from "../data/daily.js";

const KARYAS = Object.keys(MUHURAT_RULES);

const TX = {
  hi: {
    title: "शुभ मुहूर्त", sub: "विवाह, अन्नप्राशन, कर्णवेध, विद्यारंभ — तारीख जांचकर गणना से।",
    dobL: "जातक की जन्मतिथि (तारा-बल हेतु)", dateL: "कार्य की तारीख",
    note: {
      vivah: "रिक्त तिथि (4,9,14), भद्रा/विष्टि करण और मंगल-शनिवार वर्जित। गुरु-शुक्र अस्त काल में विवाह नहीं।",
      annaprashan: "पुत्र हेतु जन्म से सम मास (6,8,10), पुत्री हेतु विषम मास (5,7,9) में संस्कार श्रेष्ठ।",
      karnavedh: "जन्म से 6-8वें मास में संस्कार। शनिवार-मंगलवार वर्जित।",
      vidyarambh: "वसंत पंचमी और अक्षय तृतीया को बिना मुहूर्त शुभ। मंगल-शनिवार वर्जित।",
    },
    name: { vivah: "विवाह मुहूर्त", annaprashan: "अन्नप्राशन मुहूर्त", karnavedh: "कर्णवेध मुहूर्त", vidyarambh: "विद्यारंभ मुहूर्त" },
  },
  mr: {
    title: "शुभ मुहूर्त", sub: "विवाह, अन्नप्राशन, कर्णवेध, विद्यारंभ — तारीख तपासून गणनेतून.",
    dobL: "जातकाची जन्मतारीख (तारा-बलासाठी)", dateL: "कार्याची तारीख",
    note: {
      vivah: "रिक्त तिथी (4,9,14), भद्रा/विष्टी करण आणि मंगळ-शनिवार वर्जित. गुरु-शुक्र अस्त काळात विवाह नाही.",
      annaprashan: "मुलासाठी सम महिन्यात (6,8,10), मुलीसाठी विषम महिन्यात (5,7,9) संस्कार श्रेष्ठ.",
      karnavedh: "जन्मापासून 6-8व्या महिन्यात संस्कार. शनिवार-मंगळवार वर्जित.",
      vidyarambh: "वसंत पंचमी आणि अक्षय्य तृतीया मुहूर्ताशिवाय शुभ. मंगळ-शनिवार वर्जित.",
    },
    name: { vivah: "विवाह मुहूर्त", annaprashan: "अन्नप्राशन मुहूर्त", karnavedh: "कर्णवेध मुहूर्त", vidyarambh: "विद्यारंभ मुहूर्त" },
  },
  en: {
    title: "Auspicious Muhurat", sub: "Marriage, Annaprashan, Karnavedh, Vidyarambh — checked by calculation.",
    dobL: "Native's birthdate (for Tara-bala)", dateL: "Ceremony date",
    note: {
      vivah: "Avoid Rikta tithi (4,9,14), Bhadra/Vishti karana and Tue-Sat. No vivah when Guru/Shukra combust.",
      annaprashan: "Boys: even months (6,8,10); girls: odd months (5,7,9) from birth.",
      karnavedh: "Sanskar in 6th-8th month from birth. Avoid Sat-Tue.",
      vidyarambh: "Vasant Panchami and Akshaya Tritiya auspicious without muhurat. Avoid Tue-Sat.",
    },
    name: { vivah: "Vivah Muhurat", annaprashan: "Annaprashan Muhurat", karnavedh: "Karnavedh Muhurat", vidyarambh: "Vidyarambh Muhurat" },
  },
};

export default function Muhurat() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const L = kundliT(lang);
  const T = TX[lang] || TX.en;
  const [karya, setKarya] = useState("vivah");
  const [dob, setDob] = useState(() => loadProfile().birthdate || "");
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);

  const check = (e) => {
    e.preventDefault();
    if (!dob || !date) return;
    saveProfile({ birthdate: dob });
    const R = MUHURAT_RULES[karya];
    const jdE = jdFromDateStr(date, 12);
    const sun = sunTropical(jdE);
    const moon = moonTropical(jdE);
    const aya = lahiriAyanamsa(jdE);
    const moonS = rev(moon - aya);
    const nak = nakshatraOf(moonS);
    const ti = tithiOf(sun, moon);
    const kar = karanaOf(sun, moon);
    const wd = new Date(date + "T12:00:00").getDay();

    const jdB = jdFromDateStr(dob, 12);
    const moonB = moonTropical(jdB);
    const nakB = nakshatraOf(rev(moonB - lahiriAyanamsa(jdB)));
    const tara = taraBala(nakB.index, nak.index);

    const tithiDay = ti.n <= 15 ? ti.n : ti.n - 15;
    const checks = [
      { label: `Tithi (${ti.paksha} ${ti.name})`, ok: R.shubhTithi.includes(tithiDay) && !R.varjitTithi.includes(tithiDay) },
      { label: `Vaar (${VAAR[wd]})`, ok: R.shubhVaar.includes(wd) },
      { label: `Nakshatra (${nak.name})`, ok: R.shubhNak.includes(nak.name) },
      { label: `Karana (${kar})`, ok: kar !== "Vishti" },
      { label: `Tara Bal (${tara.name})`, ok: tara.shubh },
    ];
    const passed = checks.filter((c) => c.ok).length;
    const verdict = passed === 5 ? P.pg_uttam : passed >= 3 ? P.pg_madhyam : P.pg_varjit;
    setResult({ checks, passed, verdict, tara, nakB });
  };

  return (
    <div>
      <h1 className="text-gradient">{T.title}</h1>
      <p>{T.sub}</p>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {KARYAS.map((k) => (
            <button key={k} type="button" className={karya === k ? "btn" : "btn secondary"} onClick={() => { setKarya(k); setResult(null); }}>
              {T.name[k]}
            </button>
          ))}
        </div>
        <p style={{ marginTop: 12, fontSize: ".9rem" }}>{T.note[karya]}</p>
        <form onSubmit={check} className="grid grid-2" style={{ marginTop: 12 }}>
          <div>
            <label className="label">{T.dobL}</label>
            <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>
          <div>
            <label className="label">{T.dateL}</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <button className="btn" type="submit">{P.pg_check}</button>
          </div>
        </form>
      </div>

      {result && (
        <div className="card" style={{ marginTop: 20 }}>
          <h2>{result.verdict} ({result.passed}/5)</h2>
          <div style={{ marginTop: 10 }}>
            {result.checks.map((c) => (
              <div key={c.label} className="kv">
                <span className="k">{c.ok ? "✅" : "❌"} {c.label}</span>
                <span className="v">{c.ok ? P.pg_shubh : P.pg_ashubh}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
