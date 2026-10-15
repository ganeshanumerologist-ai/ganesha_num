import React, { useState } from "react";
import { allNumbers } from "../utils/numerology.js";
import { getMeaning } from "../data/meanings_all.js";
import ShareButtons from "../components/ShareButtons.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import kundliT from "../i18n/kundli.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { loadProfile, saveProfile } from "../profile/profile.js";

const TX = {
  hi: {
    labels: { lifePath: "जीवन पथ", birthday: "जन्मांक", attitude: "मनोवृत्ति अंक", destiny: "भाग्यांक (नाम)", soulUrge: "अंतरात्मा", personality: "व्यक्तित्व", lucky: "लकी (मोबाइल)" },
    sub: "अपना विवरण दें — मूल अंक जानें।",
    errFill: "कृपया पूरा नाम और जन्मतिथि भरें।",
    needLogin: "सेव करने के लिए लॉगिन करें।",
    savedOk: "सेव हो गया! डैशबोर्ड में देखें।",
    kvStrength: "खूबियां",
    shareTitle: "अपने अंक शेयर करें",
    shareText: (n, lp, de) => `${n} — जीवन पथ ${lp}, भाग्यांक ${de}! अपने अंक निकालो`,
    exName: "जैसे राहुल शर्मा", exMob: "जैसे 9876543210",
  },
  mr: {
    labels: { lifePath: "जीवन मार्ग", birthday: "जन्मांक", attitude: "मनोवृत्ती अंक", destiny: "नामांक", soulUrge: "आत्म्याची हाक", personality: "व्यक्तिमत्त्व", lucky: "लकी (मोबाईल)" },
    sub: "तपशील द्या — मूळ अंक जाणून घ्या.",
    errFill: "कृपया पूर्ण नाव आणि जन्मतारीख भरा.",
    needLogin: "सेव्ह करण्यासाठी लॉगिन करा.",
    savedOk: "सेव्ह झाले! डॅशबोर्डमध्ये पहा.",
    kvStrength: "गुण",
    shareTitle: "तुमचे अंक शेअर करा",
    shareText: (n, lp, de) => `${n} — जीवन मार्ग ${lp}, नामांक ${de}! तुमचे अंक काढा`,
    exName: "जसे राहुल शर्मा", exMob: "जसे 9876543210",
  },
  en: {
    labels: { lifePath: "Life Path Number", birthday: "Birthday Number", attitude: "Attitude Number", destiny: "Destiny Number", soulUrge: "Soul Urge Number", personality: "Personality Number", lucky: "Lucky (Mobile) Number" },
    sub: "Enter your details to reveal your core numbers.",
    errFill: "Please enter your full name and date of birth.",
    needLogin: "Please login to save.",
    savedOk: "Saved! See it in Dashboard.",
    kvStrength: "Strengths",
    shareTitle: "Share your numbers",
    shareText: (n, lp, de) => `${n} — Life Path ${lp}, Destiny ${de}! Find your numbers`,
    exName: "e.g. Rahul Sharma", exMob: "e.g. 9876543210",
  },
};

export default function Calculator() {
  const { t, lang } = useLanguage();
  const L = kundliT(lang);
  const T = TX[lang] || TX.en;
  const { user } = useAuth();
  const [name, setName] = useState(() => loadProfile().name || "");
  const [birthdate, setBirthdate] = useState(() => loadProfile().birthdate || "");
  const [mobile, setMobile] = useState(() => loadProfile().mobile || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  const calculate = (e) => {
    e.preventDefault();
    setError(""); setSaved("");
    if (!name.trim() || !birthdate) {
      setError(T.errFill);
      return;
    }
    const nums = allNumbers({ name: name.trim(), birthdate, mobile: mobile.trim() });
    saveProfile({ name: name.trim(), birthdate, mobile: mobile.trim() });
    setResult(nums);
  };

  const reset = () => {
    setName(""); setBirthdate(""); setMobile(""); setResult(null); setError(""); setSaved("");
  };

  const saveReading = async () => {
    if (!user) { setSaved(T.needLogin); return; }
    try {
      await addDoc(collection(db, "readings"), {
        uid: user.uid, name: name.trim(), birthdate, mobile: mobile.trim(),
        numbers: result, createdAt: serverTimestamp(),
      });
      setSaved(T.savedOk);
    } catch (e) {
      setSaved(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-gradient">{t("calc_title")}</h1>
      <p>{T.sub}</p>

      <div style={{ marginTop: 24 }} className="card">
        <form onSubmit={calculate} className="grid grid-2">
          <div>
            <label className="label">{t("calc_name")}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={T.exName} />
          </div>
          <div>
            <label className="label">{t("calc_dob")}</label>
            <input className="input" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
          </div>
          <div>
            <label className="label">{t("calc_mobile")}</label>
            <input className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder={T.exMob} />
          </div>
          <div style={{ display: "flex", alignItems: "end", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" className="btn">{t("calc_button")}</button>
            <button type="button" className="btn secondary" onClick={reset}>{t("calc_reset")}</button>
            {result && <button type="button" className="btn secondary" onClick={saveReading}>{t("save_reading")}</button>}
          </div>
        </form>
        {error && <p style={{ color: "var(--danger)", marginTop: 12 }}>{error}</p>}
        {saved && <p style={{ color: "var(--accent-2)", marginTop: 12 }}>{saved}</p>}
      </div>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>{t("result_title")}</h2>
          <div className="grid grid-3">
            {Object.entries(result).map(([key, val]) => {
              if (val == null) return null;
              const meaning = getMeaning(val, lang);
              return (
                <div key={key} className="card number-card">
                  <div className="num"><span>{val}</span></div>
                  <h3>{T.labels[key]}</h3>
                  {meaning && <p style={{ fontSize: ".85rem", marginTop: 8 }}>{meaning.title} · {meaning.keywords}</p>}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 30 }} className="grid grid-2">
            {Object.entries(result).map(([key, val]) => {
              if (val == null) return null;
              const meaning = getMeaning(val, lang);
              if (!meaning || !meaning.title) return null;
              return (
                <div key={key + "-detail"} className="card">
                  <h3>{T.labels[key]}: {val} — {meaning.title}</h3>
                  <p style={{ marginTop: 8 }}>{meaning.desc}</p>
                  <div style={{ marginTop: 12 }}>
                    <div className="kv"><span className="k">{T.kvStrength}</span><span className="v">{meaning.strengths}</span></div>
                    <div className="kv"><span className="k">{L.k_career}</span><span className="v">{meaning.career}</span></div>
                    <div className="kv"><span className="k">{L.k_love}</span><span className="v">{meaning.love}</span></div>
                    <div className="kv"><span className="k">{L.k_upay}</span><span className="v">{meaning.upay}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          <ShareButtons title={T.shareTitle} text={T.shareText(name.trim(), result.lifePath, result.destiny)} />
        </div>
      )}
    </div>
  );
}
