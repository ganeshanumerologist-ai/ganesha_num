import React, { useState } from "react";
import { allNumbers } from "../utils/numerology.js";
import { getMeaning } from "../data/meanings_all.js";
import ShareButtons from "../components/ShareButtons.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { loadProfile, saveProfile } from "../profile/profile.js";

// Label ka bhasha-aware anukram: lifePath -> "lb_lifepath".
const LABEL_KEYS = {
  lifePath: "lb_lifepath",
  birthday: "lb_birthday",
  attitude: "lb_attitude",
  destiny: "lb_destiny",
  soulUrge: "lb_soulurge",
  personality: "lb_personality",
  lucky: "lb_lucky",
};

// Share text bhi bhasha me — isliye har bhasha ka apna template.
const SHARE = {
  en: (n, lp, de) => `${n} — Life Path ${lp}, Destiny ${de}! Find your numbers`,
  hi: (n, lp, de) => `${n} — जीवन पथ ${lp}, भाग्यांक ${de}! अपने अंक निकालो`,
  mr: (n, lp, de) => `${n} — जीवन मार्ग ${lp}, नामांक ${de}! तुमचे अंक काढा`,
  bn: (n, lp, de) => `${n} — জীবনপথ ${lp}, ভাগ্যাঙ্ক ${de}! আপনার সংখ্যা বের করুন`,
  te: (n, lp, de) => `${n} — జీవితపథ ${lp}, భాగ్యాంకం ${de}! మీ సంఖ్యలు తెలుసుకోండి`,
  ta: (n, lp, de) => `${n} — வாழ்க்கைப் பாதை ${lp}, நாக்கிய எண் ${de}! உங்கள் எண்களைக் கணக்கிடுங்கள்`,
  gu: (n, lp, de) => `${n} — જીવનમાર્ગ ${lp}, નામાંક ${de}! તમારા અંક શોધો`,
  ur: (n, lp, de) => `${n} — زندگی کا راستہ ${lp}, نام نمبر ${de}! اپنے اعداد نکالیں`,
  kn: (n, lp, de) => `${n} — ಜೀವನ ಮಾರ್ಗ ${lp}, ನಾಮಾಂಕ ${de}! ನಿಮ್ಮ ಸಂಖ್ಯೆಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ`,
  ml: (n, lp, de) => `${n} — ജീവിത വഴി ${lp}, നാമാംകം ${de}! നിങ്ങളുടെ സംഖ്യകൾ കണക്കാക്കുക`,
  pa: (n, lp, de) => `${n} — ਜੀਵਨ ਮਾਰਗ ${lp}, ਨਾਮਾਂਕ ${de}! ਆਪਣੇ ਅੰਕ ਨਿਕਾਲੋ`,
  or: (n, lp, de) => `${n} — ଜୀବନ ମାର୍ଗ ${lp}, ନାମାଙ୍କ ${de}! ଆପଣଙ୍କ ସଂଖ୍ୟା ବାହାର କରନ୍ତୁ`,
  as: (n, lp, de) => `${n} — জীৱনপথ ${lp}, ভাগ্যসংখ্যা ${de}! আপোনাৰ সংখ্যা উলিচাওক`,
};

export default function Calculator() {
  const { t, lang } = useLanguage();
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
      setError(t("calc_err_fill"));
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
    if (!user) { setSaved(t("calc_need_login")); return; }
    try {
      await addDoc(collection(db, "readings"), {
        uid: user.uid, name: name.trim(), birthdate, mobile: mobile.trim(),
        numbers: result, createdAt: serverTimestamp(),
      });
      setSaved(t("calc_saved_ok"));
    } catch (e) {
      setSaved(e.message);
    }
  };

  const shareText = (SHARE[lang] || SHARE.en)(name.trim(), result?.lifePath, result?.destiny);

  return (
    <div>
      <h1 className="text-gradient">{t("calc_title")}</h1>
      <p>{t("calc_sub")}</p>

      <div style={{ marginTop: 24 }} className="card">
        <form onSubmit={calculate} className="grid grid-2">
          <div>
            <label className="label">{t("calc_name")}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("calc_ex_name")} />
          </div>
          <div>
            <label className="label">{t("calc_dob")}</label>
            <input className="input" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
          </div>
          <div>
            <label className="label">{t("calc_mobile")}</label>
            <input className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder={t("calc_ex_mob")} />
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
          <h2>{t("calc_result_title")}</h2>
          <div className="grid grid-3">
            {Object.entries(result).map(([key, val]) => {
              if (val == null) return null;
              const meaning = getMeaning(val, lang);
              return (
                <div key={key} className="card number-card">
                  <div className="num"><span>{val}</span></div>
                  <h3>{t(LABEL_KEYS[key])}</h3>
                  {meaning && meaning.title && (
                    <p style={{ fontSize: ".85rem", marginTop: 8 }}>{meaning.title} · {meaning.keywords}</p>
                  )}
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
                  <h3>{t(LABEL_KEYS[key])}: {val} — {meaning.title}</h3>
                  <p style={{ marginTop: 8 }}>{meaning.desc}</p>
                  <div style={{ marginTop: 12 }}>
                    <div className="kv"><span className="k">{t("calc_kv_strengths")}</span><span className="v">{meaning.strengths}</span></div>
                    <div className="kv"><span className="k">{t("k_career")}</span><span className="v">{meaning.career}</span></div>
                    <div className="kv"><span className="k">{t("k_love")}</span><span className="v">{meaning.love}</span></div>
                    <div className="kv"><span className="k">{t("k_upay")}</span><span className="v">{meaning.upay}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          <ShareButtons title={t("calc_share_title")} text={shareText} />
        </div>
      )}
    </div>
  );
}