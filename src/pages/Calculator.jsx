import React, { useState } from "react";
import { allNumbers } from "../utils/numerology.js";
import { NUMBER_MEANINGS } from "../data/meanings.js";
import ShareButtons from "../components/ShareButtons.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { loadProfile, saveProfile } from "../profile/profile.js";

const LABELS = {
  lifePath: "Life Path Number",
  birthday: "Birthday Number",
  attitude: "Attitude Number",
  destiny: "Destiny / Expression Number",
  soulUrge: "Soul Urge Number",
  personality: "Personality Number",
  lucky: "Lucky (Mobile) Number",
};

export default function Calculator() {
  const { t } = useLanguage();
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
      setError("Please enter your full name and date of birth.");
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
    if (!user) { setSaved("Login karke save karein."); return; }
    try {
      await addDoc(collection(db, "readings"), {
        uid: user.uid, name: name.trim(), birthdate, mobile: mobile.trim(),
        numbers: result, createdAt: serverTimestamp(),
      });
      setSaved("Saved to Dashboard!");
    } catch (e) {
      setSaved(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-gradient">{t("calc_title")}</h1>
      <p>Enter your details to reveal your core numbers.</p>

      <div style={{ marginTop: 24 }} className="card">
        <form onSubmit={calculate} className="grid grid-2">
          <div>
            <label className="label">{t("calc_name")}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Sharma" />
          </div>
          <div>
            <label className="label">{t("calc_dob")}</label>
            <input className="input" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
          </div>
          <div>
            <label className="label">{t("calc_mobile")}</label>
            <input className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. 9876543210" />
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
              const meaning = NUMBER_MEANINGS[val];
              return (
                <div key={key} className="card number-card">
                  <div className="num"><span>{val}</span></div>
                  <h3>{LABELS[key]}</h3>
                  {meaning && <p style={{ fontSize: ".85rem", marginTop: 8 }}>{meaning.title} · {meaning.keywords}</p>}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 30 }} className="grid grid-2">
            {Object.entries(result).map(([key, val]) => {
              if (val == null) return null;
              const meaning = NUMBER_MEANINGS[val];
              if (!meaning) return null;
              return (
                <div key={key + "-detail"} className="card">
                  <h3>{LABELS[key]}: {val} — {meaning.title}</h3>
                  <p style={{ marginTop: 8 }}>{meaning.description}</p>
                  <div style={{ marginTop: 12 }}>
                    <div className="kv"><span className="k">Strengths</span><span className="v">{meaning.strengths}</span></div>
                    <div className="kv"><span className="k">Challenges</span><span className="v">{meaning.challenges}</span></div>
                    <div className="kv"><span className="k">Careers</span><span className="v">{meaning.careers}</span></div>
                    <div className="kv"><span className="k">Love</span><span className="v">{meaning.love}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          <ShareButtons title="Apne ank share karein" text={`${name.trim()} — Life Path ${result.lifePath}, Destiny ${result.destiny}! Apne ank nikalo — Numerology VIP`} />
        </div>
      )}
    </div>
  );
}
