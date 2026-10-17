import React, { useEffect, useState , useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import kundliT from "../i18n/kundli.js";
import pgT from "../i18n/jyotish_b.js";
import { getMeaning } from "../data/meanings_all.js";
import { yearMeaning, yearDetail, ycat } from "../data/varshphal_i18n.js";
import { allNumbers, reduceNumber } from "../utils/numerology.js";
import { personalYear } from "../data/forecast.js";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import ShareButtons from "../components/ShareButtons.jsx";
import { kundliFull } from "../utils/kundliFull.js";
import { RASHIS } from "../utils/astro.js";
import { siteTX } from "../i18n/siteTx.js";
import { grahaName, rashiName, nakName, vaarName, tithiName, pakshaName, yogaName, karanaName } from "../i18n/names.js";
import KundliChart from "../components/KundliChart.jsx";
import CitySelect from "../components/CitySelect.jsx";
import { loadProfile, saveProfile } from "../profile/profile.js";

// 1972-02-18 → "18 / 02 / 1972"  (har bhasha me samajh aane wala format)
const fmtDob = (d) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || ""));
  return m ? `${m[3]} / ${m[2]} / ${m[1]}` : String(d || "");
};

function YearSection({ py, year, lang, L }) {
  if (!py) return null;
  const m = yearMeaning(py, lang);
  const d = yearDetail(py, lang);
  const Y = ycat(lang);
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="num" style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1 }}>
          <span className="text-gradient">{py}</span>
        </div>
        <div>
          <h3>{L.k_year} ({year})</h3>
          <p style={{ fontWeight: 700 }}>{m.t}</p>
        </div>
      </div>
      <p style={{ marginTop: 10 }}>{m.d}</p>
      <div style={{ marginTop: 10 }}>
        <div className="kv"><span className="k">{Y.edu}</span><span className="v">{d.edu}</span></div>
        <div className="kv"><span className="k">{Y.mar}</span><span className="v">{d.mar}</span></div>
        <div className="kv"><span className="k">{L.k_career}</span><span className="v">{m.c}</span></div>
        <div className="kv"><span className="k">{L.k_love}</span><span className="v">{m.love}</span></div>
        <div className="kv"><span className="k">{Y.health}</span><span className="v">{m.h}</span></div>
        <div className="kv"><span className="k">{Y.share}</span><span className="v">{d.share}</span></div>
        <div className="kv"><span className="k">{Y.biz}</span><span className="v">{d.biz}</span></div>
        <div className="kv"><span className="k">{Y.rep}</span><span className="v">{d.rep}</span></div>
        <div className="kv"><span className="k">{Y.color}</span><span className="v">{m.col}</span></div>
        <div className="kv"><span className="k">{Y.adv}</span><span className="v">{m.adv}</span></div>
      </div>
    </div>
  );
}

function Section({ num, label, meaning, L }) {
  if (num == null || !meaning) return null;
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="num" style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1 }}>
          <span className="text-gradient">{num}</span>
        </div>
        <div>
          <h3>{label}</h3>
          <p style={{ fontWeight: 700 }}>{meaning.title}</p>
          <p style={{ fontSize: ".85rem" }}>{meaning.keywords}</p>
        </div>
      </div>
      <p style={{ marginTop: 10 }}>{meaning.desc}</p>
      <div style={{ marginTop: 10 }}>
        <div className="kv"><span className="k">{L.k_career}</span><span className="v">{meaning.career}</span></div>
        <div className="kv"><span className="k">{L.k_love}</span><span className="v">{meaning.love}</span></div>
        <div className="kv"><span className="k">{L.k_upay}</span><span className="v">{meaning.upay}</span></div>
      </div>
    </div>
  );
}

export default function Kundli() {
  const { lang, t, S } = useLanguage();
  const { user } = useAuth();
  const L = kundliT(lang);
  const P = pgT(lang);
  const [form, setForm] = useState(() => ({
    name: "", birthdate: "", time: "", place: "", gender: "male", ...loadProfile(),
  }));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState([]);
  const [msg, setMsg] = useState("");
  const [restored, setRestored] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Pichhli baar bhara data wapas lao — dobara bharna na pade
  useEffect(() => {
    const f = loadProfile();
    if (f && (f.name || f.birthdate)) {
      setForm((p) => ({ ...p, ...f }));
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!user) { setSaved([]); return; }
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "readings"), where("uid", "==", user.uid)));
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSaved(all.filter((r) => r.kind === "kundli"));
      } catch { /* ignore */ }
    })();
  }, [user]);

  const open = (e) => {
    e.preventDefault();
    runOpen();
  };

  const runOpen = () => {
    setError(""); setMsg("");
    if (!form.name.trim() || !form.birthdate) { setError(L.k_fill); return; }
    const nums = allNumbers({ name: form.name.trim(), birthdate: form.birthdate });
    const day = Number(form.birthdate.split("-")[2]);
    const moolank = reduceNumber(day, false);
    const py = personalYear(form.birthdate, new Date().getFullYear());
    saveProfile(form);
    setRestored(false);
    setResult({ ...form, name: form.name.trim(), nums, moolank, py });
  };

  // Bhasha badalne par khuli kundli usi bhasha me dobara banao
  useEffect(() => {
    if (result && form.name.trim() && form.birthdate) runOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const reset = () => {
    setForm({ name: "", birthdate: "", time: "", place: "", gender: "male" });
    setRestored(false);
    setResult(null); setError(""); setMsg("");
  };

  const save = async () => {
    if (!user) { setMsg(L.k_need_login); return; }
    try {
      const ref = await addDoc(collection(db, "readings"), {
        uid: user.uid, kind: "kundli",
        name: result.name, birthdate: result.birthdate,
        time: result.time, place: result.place, gender: result.gender,
        numbers: { moolank: result.moolank, ...result.nums, personalYear: result.py },
        createdAt: serverTimestamp(),
      });
      setSaved((p) => [{ id: ref.id, name: result.name, birthdate: result.birthdate, time: result.time, place: result.place, gender: result.gender, kind: "kundli" }, ...p]);
      setMsg(L.k_saved);
    } catch (e) {
      setMsg(e.message);
    }
  };

  const openSaved = (s) => {
    const nums = allNumbers({ name: s.name, birthdate: s.birthdate });
    const day = Number((s.birthdate || "").split("-")[2]);
    setResult({
      name: s.name, birthdate: s.birthdate, time: s.time || "", place: s.place || "", gender: s.gender || "male",
      nums, moolank: reduceNumber(day || 0, false) || null, py: personalYear(s.birthdate, new Date().getFullYear()),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const genderLabel = result
    ? result.gender === "female" ? L.k_female : result.gender === "other" ? L.k_other : L.k_male
    : "";

  // Saare ek saath dikhane wale numbers — user ko saaf dikhe ki kya kya nikaala.
  // (pehle sirf 5 dikhte the, Life Path / Janmank / MannoVritti chhoot jaati thi)
  const glance = result ? [
    [L.k_moolank, result.moolank],
    [L.k_bhagyank, result.nums.bhagyank],
    [P.pg_lifepath, result.nums.lifePath],
    [t("lb_birthday"), result.nums.birthday],
    [t("lb_attitude"), result.nums.attitude],
    [L.k_naamank, result.nums.destiny],
    [L.k_soul, result.nums.soulUrge],
    [L.k_persona, result.nums.personality],
  ].filter(([, n]) => n != null) : [];

  return (
    <div>
      {!result ? (
        <>
          <h1 className="text-gradient">{L.k_title}</h1>
          <p>{L.k_sub}</p>
          {user && saved.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <label className="label">{L.k_open_saved}</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {saved.map((s) => (
                  <button key={s.id} className="btn secondary" style={{ padding: "8px 14px" }} onClick={() => openSaved(s)}>
                    {s.name} · {fmtDob(s.birthdate)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="card" style={{ marginTop: 16 }}>
            <form onSubmit={open} className="grid grid-2">
              <div>
                <label className="label">{L.k_name} *</label>
                <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label className="label">{L.k_dob} *</label>
                <input className="input" type="date" value={form.birthdate} onChange={(e) => set("birthdate", e.target.value)} />
              </div>
              <div>
                <label className="label">{L.k_time}</label>
                <input className="input" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} />
              </div>
              <div>
                <label className="label">{L.k_place}</label>
                <CitySelect value={form.place} onChange={(v) => set("place", v)} placeholder={S.city_search} />
              </div>
              <div>
                <label className="label">{L.k_gender}</label>
                <select className="input" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="male">{L.k_male}</option>
                  <option value="female">{L.k_female}</option>
                  <option value="other">{L.k_other}</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "end" }}>
                <button className="btn" type="submit">{L.k_open}</button>
              </div>
            </form>
            {restored && <p style={{ color: "var(--accent-2)", marginTop: 10, fontSize: ".85rem" }}>{S.kundli_prefill}</p>}
            {error && <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>}
          </div>
        </>
      ) : (
        <>
          <div className="card number-card">
            <span className="badge">{L.k_title}</span>
            <h1 style={{ marginTop: 10 }}>{result.name}</h1>
            <p style={{ marginTop: 6 }}>
              {fmtDob(result.birthdate)}
              {result.time ? ` · ${result.time}` : ""}
              {result.place ? ` · ${result.place}` : ""}
              {` · ${genderLabel}`}
            </p>

            {/* ══════════════════════════════════════════════════
                JANM KI JHALAK — rashi, nakshatra, gana, vara, tithi.
                User ne kaha ye "abhibhi nahi dikh rahi". Pehle ye sab
                sirf neeche scroll karne par milte the, isliye page khaali
                lagta tha. Ab seedha naam ke niche. */}
            <BirthEyes form={result} />

            {glance.length > 0 && (
              <div className="num-strip">
                {glance.map(([label, n]) => (
                  <div className="num-chip" key={label}>
                    <b>{n}</b>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
              <Link className="btn secondary" to="/reports">{t("nav_reports")}</Link>
              <button className="btn secondary" onClick={reset}>{L.k_new}</button>
              <button className="btn secondary" onClick={save}>{L.k_save}</button>
            </div>
            {msg && <p style={{ color: "var(--accent-2)", marginTop: 10 }}>{msg}</p>}
          </div>

          <div className="grid grid-2" style={{ marginTop: 20 }}>
            <Section num={result.moolank} label={L.k_moolank} meaning={getMeaning(result.moolank, lang)} L={L} />
            <Section num={result.nums.bhagyank} label={L.k_bhagyank} meaning={getMeaning(result.nums.bhagyank, lang)} L={L} />
            <Section num={result.nums.lifePath} label={P.pg_lifepath} meaning={getMeaning(result.nums.lifePath, lang)} L={L} />
            <Section num={result.nums.birthday} label={t("lb_birthday")} meaning={getMeaning(result.nums.birthday, lang)} L={L} />
            <Section num={result.nums.attitude} label={t("lb_attitude")} meaning={getMeaning(result.nums.attitude, lang)} L={L} />
            <Section num={result.nums.destiny} label={L.k_naamank} meaning={getMeaning(result.nums.destiny, lang)} L={L} />
            <Section num={result.nums.soulUrge} label={L.k_soul} meaning={getMeaning(result.nums.soulUrge, lang)} L={L} />
            <Section num={result.nums.personality} label={L.k_persona} meaning={getMeaning(result.nums.personality, lang)} L={L} />
            <YearSection py={result.py} year={new Date().getFullYear()} lang={lang} L={L} />
          </div>

          <ShareButtons title={L.k_title} text={`${result.name} — ${L.k_moolank} ${result.moolank}, ${L.k_bhagyank} ${result.nums.bhagyank}, ${P.pg_lifepath} ${result.nums.lifePath}`} />

          {/* ══════ पूरी कुंडली — एक ही heading के नीचे सारे हिस्से ══════ */}
          <KundliChart form={result} />
        </>
      )}
    </div>
  );
}


/** Rashi naam → index. RASHIS array astro.js se. */
const RASHI_IDX = (name) => RASHIS.indexOf(name);

/**
 * Janm ki jhalak — ek nazar me poora birth chart.
 * Lagna, sun/moon rashi, nakshatra (pada + gana + nadi), vara (svami),
 * tithi, paksha, yoga, karana.
 */
function BirthEyes({ form }) {
  const { lang } = useLanguage();
  const S = siteTX(lang);
  const r = useMemo(() => {
    try { return kundliFull(form); } catch { return null; }
  }, [form.birthdate, form.time, form.place]);

  const g = r?.glance;
  if (!g) return null;

  const NAK = { Ashwini: 0, Bharani: 1, Krittika: 2, Rohini: 3, Mrigashira: 4, "Mrigashira": 4,
    Ardra: 5, Punarvasu: 6, Pushya: 7, Ashlesha: 8, Magha: 9, "Purva Phalguni": 10,
    "Uttara Phalguni": 11, Hasta: 12, Chitra: 13, Swati: 14, Vishakha: 15,
    Anuradha: 16, Jyeshtha: 17, Mula: 18, "Purva Ashadha": 19, "Uttara Ashadha": 20,
    Shravana: 21, Dhanishta: 22, Shatabhisha: 23, "Purva Bhadrapada": 24,
    "Uttara Bhadrapada": 25, Revati: 26 };
  void NAK;

  const GANA_HI = { Deva: "देव", Manushya: "मानव", Rakshasa: "राक्षस" };
  const GANA_MR = { Deva: "देव", Manushya: "माणूस", Rakshasa: "राक्षस" };
  const NADI_HI = { Adya: "आद्य", Madhya: "मध्य", Antya: "अंत्य" };

  const isMr = lang === "mr";
  const ganaTxt = isMr ? (GANA_MR[g.gana] || g.gana) : (GANA_HI[g.gana] || g.gana);
  const nadiTxt = isMr
    ? { Adya: "आद्य", Madhya: "मध्य", Antya: "अंत्य" }[g.nadi] || g.nadi
    : NADI_HI[g.nadi] || g.nadi;

  const cells = [
    { k: S.pg_lagna_full || "लग्न", v: g.lagna
        ? `${rashiName(RASHI_IDX(g.lagna), lang)} · ${grahaName(g.lagnaLord, lang)}`
        : S.pg_no_time || "समय नहीं" },
    { k: "सूर्य राशि", v: rashiName(RASHI_IDX(g.sunRashi), lang) },
    { k: "चंद्र राशि", v: `${rashiName(RASHI_IDX(g.moonRashi), lang)} ${g.moonDegree}` },
    { k: "नक्षत्र", v: `${nakName(g.nakshatraIndex, lang)} · पाद ${g.nakPada}` },
    { k: "गण", v: ganaTxt },
    { k: "नाडी", v: nadiTxt },
    { k: "राशि स्वामी", v: grahaName(g.rashiLord, lang) },
    { k: "वार", v: `${vaarName(g.vara === "Ravivaar" ? 0 : g.vara === "Somvaar" ? 1 : g.vara === "Mangalvaar" ? 2 : g.vara === "Budhvaar" ? 3 : g.vara === "Guruvaar" ? 4 : g.vara === "Shukravaar" ? 5 : 6, lang)}` },
    { k: "तिथि", v: `${tithiName(g.tithiNum - 1, lang)} · ${pakshaName(g.paksha, lang)}` },
    { k: "योग", v: yogaName(g.yoga, lang) },
    { k: "करण", v: karanaName(g.karana, lang) },
  ];

  return (
    <div className="bg-eyes">
      <div className="bg-eyes-h">{S.pg_janm || "जन्म की झलक"}</div>
      <div className="bg-eyes-grid">
        {cells.map((c) => (
          <div className="bg-eye" key={c.k}>
            <span className="bg-eye-k">{c.k}</span>
            <span className="bg-eye-v">{c.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

