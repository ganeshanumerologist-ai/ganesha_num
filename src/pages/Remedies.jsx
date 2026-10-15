import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { RUDRAKSHA_GUIDE, JADI_GUIDE, YANTRA_GUIDE } from "../data/remedies.js";

const TX = {
  hi: { title: "Rudraksha · Jadi-booti · Yantra Guide", sub: "Kaun-sa pehne, kyun pehne — poori jaankari. Apne liye sahi chunav Reports me DOB se janen.",
    t1: "Rudraksha (1-14 मुखी)", t2: "Jadi-booti (Navagraha)", t3: "Yantra (Navagraha)",
    planet: "Grah", devta: "Devta", fayda: "Labh", mantra: "Mantra", upyog: "Upyog", dharan: "Dharan", sthapana: "Sthapana",
    personal: "Mere liye kaun-sa? Reports me DOB dalo →", btn: "Meri Report Banayein" },
  mr: { title: "रुद्राक्ष · जडी-बुटी · यंत्र मार्गदर्शक", sub: "कोणते घालावे, का घालावे — संपूर्ण माहिती. तुमच्यासाठी योग्य निवड Reports मध्ये DOB ने जाणून घ्या.",
    t1: "रुद्राक्ष (1-14 मुखी)", t2: "जडी-बुटी (नवग्रह)", t3: "यंत्र (नवग्रह)",
    planet: "ग्रह", devta: "देवता", fayda: "लाभ", mantra: "मंत्र", upyog: "उपयोग", dharan: "धारण", sthapana: "स्थापना",
    personal: "माझ्यासाठी कोणते? Reports मध्ये DOB टाका →", btn: "माझी रिपोर्ट बनवा" },
  en: { title: "Rudraksha · Herbs · Yantra Guide", sub: "Which to wear and why — full guide. Find yours via DOB in Reports.",
    t1: "Rudraksha (1-14 Mukhi)", t2: "Herbs (Navagraha)", t3: "Yantras (Navagraha)",
    planet: "Planet", devta: "Deity", fayda: "Benefit", mantra: "Mantra", upyog: "Use", dharan: "How to wear", sthapana: "Installation",
    personal: "Which one for me? Enter DOB in Reports →", btn: "Make My Report" },
};

export default function Remedies() {
  const { lang } = useLanguage();
  const T = TX[lang] || TX.en;
  const [tab, setTab] = useState("r");

  return (
    <div>
      <h1 className="text-gradient">{T.title}</h1>
      <p>{T.sub}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        {[["r", T.t1], ["j", T.t2], ["y", T.t3]].map(([k, l]) => (
          <button key={k} className={tab === k ? "btn" : "btn secondary"} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "r" && (
        <div className="grid grid-2" style={{ marginTop: 20 }}>
          {RUDRAKSHA_GUIDE.map((x) => (
            <div key={x.m} className="card">
              <h3>📿 {x.m} — {x.planet}</h3>
              <div style={{ marginTop: 8 }}>
                <div className="kv"><span className="k">{T.devta}</span><span className="v">{x.devta}</span></div>
                <div className="kv"><span className="k">{T.fayda}</span><span className="v">{x.fayda}</span></div>
                <div className="kv"><span className="k">{T.mantra}</span><span className="v">{x.mantra}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "j" && (
        <div className="grid grid-2" style={{ marginTop: 20 }}>
          {JADI_GUIDE.map((x) => (
            <div key={x.herb} className="card">
              <h3>🌿 {x.herb} — {x.planet}</h3>
              <div style={{ marginTop: 8 }}>
                <div className="kv"><span className="k">{T.upyog}</span><span className="v">{x.upyog}</span></div>
                <div className="kv"><span className="k">{T.dharan}</span><span className="v">{x.dharan}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "y" && (
        <div className="grid grid-2" style={{ marginTop: 20 }}>
          {YANTRA_GUIDE.map((x) => (
            <div key={x.yantra} className="card">
              <h3>🔯 {x.yantra} — {x.planet}</h3>
              <div style={{ marginTop: 8 }}>
                <div className="kv"><span className="k">{T.fayda}</span><span className="v">{x.fayda}</span></div>
                <div className="kv"><span className="k">{T.sthapana}</span><span className="v">{x.sthapana}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginTop: 20, textAlign: "center" }}>
        <p>{T.personal}</p>
        <Link to="/reports" className="btn" style={{ marginTop: 10 }}>{T.btn}</Link>
      </div>
    </div>
  );
}
