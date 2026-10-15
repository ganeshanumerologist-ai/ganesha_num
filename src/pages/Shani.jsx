import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import shaniTX from "../i18n/shani.js";
import { langChain } from "../i18n/registry.js";
import { pageTX } from "../i18n/pageTx.js";
import {
  jdFromDateStr, moonTropical, sunTropical, planetTropical, rahuTropical,
  lahiriAyanamsa, rev, rashiOf, rashiIndex, grahaSthiti, lagnaSidereal, RASHIS,
} from "../utils/astro.js";
import {
  ashtakavarga, shaniBaakut, shaniShantiScore, sadeSatiPhase,
  shaniHelpfulBhavas, AV_GRAHAS,
} from "../utils/ashtakavarga.js";
import { CITIES } from "../data/cities.js";
import { loadProfile, saveProfile } from "../profile/profile.js";

// Graha ka naam bhasha me (jahan tak translations me hai)
const GRAHA_I18N = {
  hi: { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु" },
  mr: { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरू", Venus: "शुक्र", Saturn: "शनी", Rahu: "राहू" },
  bn: { Sun: "সূর্য", Moon: "চন্দ্র", Mars: "মঙ্গল", Mercury: "বুধ", Jupiter: "গুরু", Venus: "শুক্র", Saturn: "শনি", Rahu: "রাহু" },
  te: { Sun: "సూర్యుడు", Moon: "చంద్రుడు", Mars: "మంగళుడు", Mercury: "బుధుడు", Jupiter: "గురుడు", Venus: "శుక్రుడు", Saturn: "శని", Rahu: "రాహు" },
  ta: { Sun: "சூரியன்", Moon: "சந்திரன்", Mars: "செவ்வாய்", Mercury: "புதன்", Jupiter: "குரு", Venus: "வெள்ளி", Saturn: "சனி", Rahu: "ராகு" },
  gu: { Sun: "સૂર્ય", Moon: "ચંદ્ર", Mars: "મંગળ", Mercury: "બુધ", Jupiter: "ગુરુ", Venus: "શુક્ર", Saturn: "શનિ", Rahu: "રાહુ" },
  ur: { Sun: "سورج", Moon: "چاند", Mars: "مریخ", Mercury: "بدھ", Jupiter: "مشتری", Venus: "زہرہ", Saturn: "زحل", Rahu: "رہو" },
  kn: { Sun: "ಸೂರ್ಯ", Moon: "ಚಂದ್ರ", Mars: "ಮಂಗಳ", Mercury: "ಬುಧ", Jupiter: "ಗುರು", Venus: "ಶುಕ್ರ", Saturn: "ಶನಿ", Rahu: "ರಾಹು" },
  ml: { Sun: "സൂര്യൻ", Moon: "ചന്ദ്രൻ", Mars: "ചുവടൻ", Mercury: "ബുധൻ", Jupiter: "വ്യാഴം", Venus: "ശുക്രൻ", Saturn: "ശനി", Rahu: "രാഹു" },
  pa: { Sun: "ਸੂਰਜ", Moon: "ਚੰਦ", Mars: "ਲੰਗ", Mercury: "ਬੁਧ", Jupiter: "ਗੁਰੂ", Venus: "ਸ਼ੁਕਰਾਨ", Saturn: "ਸ਼ਨੀ", Rahu: "ਰਾਹੂ" },
  or: { Sun: "ସୂର୍ୟ", Moon: "ଚନ୍ଦ୍ର", Mars: "ମଙ୍ଗଳ", Mercury: "ବୁଧ", Jupiter: "ଗୁରୁ", Venus: "ଶୁକ୍ର", Saturn: "ଶନି", Rahu: "ରାହୁ" },
  as: { Sun: "সূৰ্য", Moon: "চন্দ্ৰ", Mars: "মঙ্গল", Mercury: "বুধ", Jupiter: "গুৰু", Venus: "শুক্ৰ", Saturn: "শনি", Rahu: "ৰাহু" },
};

const RASHI_I18N = {
  hi: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
  mr: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
  bn: ["মেষ", "বৃষ", "মিথুন", "কর্ক", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"],
  te: ["మేష", "వృషభ", "మిథున", "కర్క", "సింహ", "కన్య", "తుల", "వృశ్చిక", "ధను", "మకర", "కుంభ", "మీన"],
  ta: ["மேஷ", "விருஷ", "மிதுன", "கர்க்", "சிங்கம்", "கன்னி", "துலம்", "விருச்சிகம்", "தனு", "மகரம்", "கும்பம்", "மீனம்"],
  gu: ["મેષ", "વૃષભ", "મિથુન", "કર્ક", "સિંહ", "કન્યા", "તુલા", "વૃશ્ચિક", "ધનુ", "મકર", "કુંભ", "મીન"],
  ur: ["مشیر", "ثور", "جوزا", "سرطان", "اسد", "سنبلہ", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"],
  kn: ["ಮೇಷ", "ವೃಷಭ", "ಮಿಥುನ", "ಕರ್ಕ", "ಸಿಂಹ", "ಕನ್ಯೆ", "ತುಲ", "ವೃಶ್ಚಿಕ", "ಧನು", "ಮಕರ", "ಕುಂಭ", "ಮೀನ"],
  ml: ["മേഷം", "വൃഷം", "മിഥുനം", "കർക്കം", "സിംഹം", "കന്യ", "തുലം", "വൃശ്ചികം", "ധനു", "മകരം", "കുംഭം", "മീനം"],
  pa: ["ਮੇਸ਼", "ਵਿਸ਼ਮਭ", "ਮਿਥੁਨ", "ਕਰਕ", "ਸਿੰਹ", "ਕੰਨਾ", "ਤੁਲਾ", "ਵ੍ਰਿਸਚਿਕ", "ਧਨੂ", "ਮਕਰ", "ਕੁੰਭ", "ਮੀਨ"],
  or: ["ମେଷ", "ବୃଷ", "ମିଥୁନ", "କର୍କ", "ସିଂହ", "କନ୍ୟା", "ତୁଲା", "ବୃଶ୍ଚିକ", "ଧନୁ", "ମକର", "କୁମ୍ଭ", "ମୀନ"],
  as: ["মেষ", "বৃষ", "মিথুন", "কৰ্ক", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকৰ", "কুম্ভ", "মীন"],
};

// Bhasha fallback — chhoti bhasha apne parivaar ki bhasha se
function pickLang(lang) {
  return langChain(lang).find((c) => GRAHA_I18N[c] && RASHI_I18N[c]) || "en";
}
function txFor(lang) {
  return pageTX(shaniTX, lang);
}

const BHAVA = ["sh_h1", "sh_h2", "sh_h3", "sh_h4", "sh_h5", "sh_h6", "sh_h7", "sh_h8"];

export default function Shani() {
  const { lang } = useLanguage();
  const T = txFor(lang);
  const L = pickLang(lang);
  const G = GRAHA_I18N[L] || {};
  const R = RASHI_I18N[L] || RASHIS;

  const [name, setName] = useState(() => loadProfile().name || "");
  const [dob, setDob] = useState(() => loadProfile().birthdate || "");
  const [time, setTime] = useState(() => loadProfile().time || "");
  const [place, setPlace] = useState(() => loadProfile().place || "");
  const [r, setR] = useState(null);
  const [err, setErr] = useState("");

  // Bhasha badalne par poora hisaab usi bhasha me dobara
  useEffect(() => { if (r) run(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [lang]);

  function run(e) {
    if (e) e.preventDefault();
    setErr("");
    if (!name.trim() || !dob) { setErr(T.sh_need_detail); setR(null); return; }
    saveProfile({ name: name.trim(), birthdate: dob, time, place });

    // --- Janam kundli ke graha (sidereal) ---
    const jd = jdFromDateStr(dob, 12);
    const aya = lahiriAyanamsa(jd);
    const pos = {};
    pos.Sun = rev(sunTropical(jd) - aya);
    pos.Moon = rev(moonTropical(jd) - aya);
    for (const n of ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"]) {
      pos[n] = rev(planetTropical(n, jd) - aya);
    }
    const rahuSid = rev(rahuTropical(jd) - aya);
    pos.Rahu = rahuSid;
    pos.Ketu = rev(rahuSid + 180);

    // --- Lagna ---
    let lagIdx = null;
    if (time) {
      try {
        const c = CITIES.find((x) => x[0] === place);
        if (c) lagIdx = rashiIndex(lagnaSidereal(dob, time, c[1], c[2]));
      } catch { /* ignore */ }
    }
    const moonIdx = rashiIndex(pos.Moon);
    const usedLagna = lagIdx !== null;

    // --- Ashtakavarga (janam kundli) ---
    const av = ashtakavarga(pos, lagIdx !== null ? lagIdx : moonIdx);
    const baakut = shaniBaakut(av);
    const score = shaniShantiScore(av);

    // --- Aaj ka Shani (transit) ---
    const now = new Date();
    const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const gNow = grahaSthiti(todayISO);
    const satNow = gNow.Saturn;

    const phase = sadeSatiPhase(satNow.rashiIdx, moonIdx);

    // --- Har graha ka apna bindu ---
    const grahaPts = AV_GRAHAS.map((g) => ({ g, n: av.graha[g] || 0, sign: rashiIndex(pos[g]) }));

    setR({
      usedLagna, lagIdx, moonIdx, av, baakut, score, phase,
      satSign: satNow.rashiIdx, moonSign: moonIdx,
      helpful: shaniHelpfulBhavas(av), grahaPts,
    });
  }

  const phaseTitle = r ? {
    peak: T.sh_phase_peak, first: T.sh_phase_first, last: T.sh_phase_last,
    dhaiya: T.sh_phase_dhaiya, none: T.sh_phase_none,
  }[r.phase] : "";
  const phaseDesc = r ? {
    peak: T.sh_phase_peak_d, first: T.sh_phase_first_d, last: T.sh_phase_last_d,
    dhaiya: T.sh_phase_dhaiya_d, none: T.sh_phase_none_d,
  }[r.phase] : "";

  const advice = r ? (r.score >= 70 ? T.sh_advice_high : r.score >= 40 ? T.sh_advice_mid : T.sh_advice_low) : "";

  return (
    <div>
      <h1 className="text-gradient">{T.sh_title}</h1>
      <p>{T.sh_sub}</p>

      <div style={{ marginTop: 24 }} className="card">
        <form onSubmit={run} className="grid grid-2">
          <div>
            <label className="label">{T.sh_name}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={T.calc_ex_name || "e.g. Rahul Sharma"} />
          </div>
          <div>
            <label className="label">{T.sh_dob}</label>
            <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div>
            <label className="label">{T.sh_time} <small>({T.sh_optional})</small></label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <label className="label">{T.sh_place}</label>
            <select className="input" value={place} onChange={(e) => setPlace(e.target.value)}>
              <option value="">—</option>
              {CITIES.map((c) => <option key={c[0]} value={c[0]}>{c[0]}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "end", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" className="btn">{T.sh_submit}</button>
            {r && <button type="button" className="btn secondary" onClick={run}>{T.sh_recalc}</button>}
          </div>
        </form>
        {err && <p style={{ color: "var(--danger)", marginTop: 12 }}>{err}</p>}
        {r && !r.usedLagna && (
          <p style={{ color: "var(--muted)", marginTop: 12, fontSize: ".9rem" }}>{T.sh_no_lagna}</p>
        )}
      </div>

      {r && (
        <>
          {/* Aapke Shani Points */}
          <div style={{ marginTop: 30 }}>
            <h2>{T.sh_your_points}</h2>
            <div className="grid grid-2" style={{ marginTop: 16 }}>
              <div className="card number-card">
                <div className="num"><span>{r.baakut}</span></div>
                <h3>{T.sh_baakut}</h3>
                <p style={{ fontSize: ".85rem", marginTop: 8 }}>{T.sh_out_of}</p>
              </div>
              <div className="card number-card">
                <div className="num"><span>{r.score}</span></div>
                <h3>{T.sh_shanti}</h3>
                <p style={{ fontSize: ".85rem", marginTop: 8 }}>{T.sh_score_out}</p>
              </div>
            </div>
          </div>

          {/* Sade Sati abhi */}
          <div style={{ marginTop: 30 }} className="card">
            <h2 style={{ marginBottom: 12 }}>{T.sh_phase_title}</h2>
            <div className="kv"><span className="k">{T.sh_saturn_now}</span><span className="v">{R[r.satSign]}</span></div>
            <div className="kv"><span className="k">{T.sh_moon_sign}</span><span className="v">{R[r.moonSign]}</span></div>
            <div className="kv"><span className="k">{T.sh_phase_now}</span><span className="v">{phaseTitle}</span></div>
            <p style={{ marginTop: 14 }}>{phaseDesc}</p>
          </div>

          {/* Ashtakavarga table — har graha */}
          <div style={{ marginTop: 30 }}>
            <h2>{T.sh_table_title}</h2>
            <div className="card" style={{ marginTop: 16, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: 10 }}>{T.sh_bhava}</th>
                    <th style={{ padding: 10 }}>{R[r.lagIdx]}</th>
                    <th style={{ padding: 10 }}>{T.sh_bindus}</th>
                    <th style={{ padding: 10 }}>{T.sh_graha_from}</th>
                  </tr>
                </thead>
                <tbody>
                  {BHAVA.map((k, i) => (
                    <tr key={k} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: 10 }}>{T[k]}</td>
                      <td style={{ padding: 10 }}>{R[(r.lagIdx + i) % 12]}</td>
                      <td style={{ padding: 10, fontWeight: 700 }}>{r.av.house[i]}</td>
                      <td style={{ padding: 10, fontSize: ".85rem" }}>
                        {(r.av.detail[i + 1] || []).map((g) => G[g] || g).join(", ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Har graha ke bindu */}
          <div style={{ marginTop: 30 }}>
            <div className="grid grid-3">
              {r.grahaPts.map((g) => (
                <div key={g.g} className="card">
                  <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{G[g.g] || g.g}</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent)", margin: "6px 0" }}>{g.n}</div>
                  <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>{R[g.sign]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Kya karein */}
          <div style={{ marginTop: 30 }} className="card">
            <h2 style={{ marginBottom: 12 }}>{T.sh_advice_title}</h2>
            <p>{advice}</p>
            {r.phase.active && (
              <>
                <div className="kv" style={{ marginTop: 14 }}><span className="k">{T.sh_mantra}</span><span className="v">{T.sh_mantra_text}</span></div>
                <div className="kv"><span className="k">{T.sh_day}</span><span className="v">{T.sh_day_val}</span></div>
                <div className="kv"><span className="k">{T.sh_stone}</span><span className="v">{T.sh_stone_val}</span></div>
                <div className="kv"><span className="k">{T.sh_donation}</span><span className="v">{T.sh_donation_val}</span></div>
                <p style={{ marginTop: 12 }}>{T.sh_service}</p>
              </>
            )}
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/reports" className="btn secondary">{T.sh_full_report}</Link>
            <Link to="/remedies" className="btn secondary">{T.sh_full_report}</Link>
          </div>

          <p style={{ marginTop: 24, fontSize: ".82rem", color: "var(--muted)" }}>{T.sh_disclaimer}</p>
        </>
      )}
    </div>
  );
}