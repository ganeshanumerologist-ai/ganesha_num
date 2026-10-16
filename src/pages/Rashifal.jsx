import React, { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { pgT } from "../i18n/jyotish_b.js";
import { RASHI_DATA } from "../data/jyotish.js";
import { rashiLang, dailyTX } from "../data/rashi_i18n.js";
import { varshikLang } from "../data/varshik_detail.js";
import { rashiDeepTX, DEEP_TOPICS } from "../data/rashiDeepTX.js";
import { rashiName, grahaName } from "../i18n/charts.js";
import {
  buildPlan, luckyNumbers, personalDayNum, numLuck, seed,
} from "../utils/rashifalPredict.js";
import { loadProfile } from "../profile/profile.js";
import ShareButtons from "../components/ShareButtons.jsx";

const SW = {
  hi: { swami: "स्वामी", prakar: "प्रकार चुनें" },
  mr: { swami: "स्वामी", prakar: "प्रकार निवडा" },
  bn: { swami: "স্বামী", prakar: "ধরন বেছে নিন" },
  te: { swami: "స్వామి", prakar: "రకాన్ని ఎంచుకోండి" },
  ta: { swami: "சுவாமி", prakar: "வகையைத் தேர்ந்தெடுக்கவும்" },
  gu: { swami: "સ્વામી", prakar: "પ્રકાર પસંદ કરો" },
  ur: { swami: "سرب", prakar: "قسم منتخب کریں" },
  kn: { swami: "ಸ್ವಾಮಿ", prakar: "ಬಗೆ ಆಯ್ಕೆಮಾಡಿ" },
  ml: { swami: "സ്വാമി", prakar: "തരം തിരഞ്ഞെടുക്കുക" },
  pa: { swami: "ਸਵਾਮੀ", prakar: "ਕਿਸਮ ਚੁਣੋ" },
  or: { swami: "ସ୍ୱାମୀ", prakar: "ପ୍ରକାର ବାଛନ୍ତୁ" },
  as: { swami: "স্বামী", prakar: "ধৰন বাছনি কৰক" },
  en: { swami: "Lord", prakar: "Choose type" },
};

const VCAT = {
  hi: { padhai: "पढ़ाई", vivah: "विवाह", arogya: "स्वास्थ्य", dhan: "धन", share: "शेयर बाज़ार", vyapar: "व्यापार", samman: "सम्मान" },
  mr: { padhai: "अभ्यास", vivah: "विवाह", arogya: "आरोग्य", dhan: "धन", share: "शेअर बाजार", vyapar: "व्यापार", samman: "सन्मान" },
  bn: { padhai: "পড়াশোনা", vivah: "বিবাহ", arogya: "স্বাস্থ্য", dhan: "সম্পদ", share: "শেয়ার বাজার", vyapar: "ব্যবসা", samman: "সম্মান" },
  te: { padhai: "విద్యాభ్యాసం", vivah: "వివాహం", arogya: "ఆరోగ్యం", dhan: "సంపద", share: "షేర్ మార్కెట్", vyapar: "వ్యాపారం", samman: "గౌరవం" },
  ta: { padhai: "கல்வி", vivah: "திருமணம்", arogya: "ஆரோக்கியம்", dhan: "செல்வம்", share: "பங்கு சந்தை", vyapar: "வர்த்தகம்", samman: "மரியாதை" },
  gu: { padhai: "અભ્યાસ", vivah: "લગ્ન", arogya: "આરોગ્ય", dhan: "ધન", share: "શેર બજાર", vyapar: "વ્યાપાર", samman: "સન્માન" },
  ur: { padhai: "تعلیم", vivah: "شادی", arogya: "صحت", dhan: "دولت", share: "شیئرز مارکیٹ", vyapar: "کاروبار", samman: "عزت" },
  kn: { padhai: "ಅಧ್ಯಯನ", vivah: "ವಿವಾಹ", arogya: "ಆರೋಗ್ಯ", dhan: "ಸಂಪತ್ತು", share: "ಶೇರ್ ಮಾರುಕೆಟ್ಟೆ", vyapar: "ವ್ಯಾಪಾರ", samman: "ಗೌರವ" },
  ml: { padhai: "പഠനം", vivah: "വിവാഹം", arogya: "ആരോഗ്യം", dhan: "സമ്പത്ത്", share: "ഓഹരുമാർക്കറ്റ്", vyapar: "വ്യാപാരം", samman: "പ്രതിഷ്ഠ" },
  pa: { padhai: "ਪੜ੍ਹਾਈ", vivah: "ਵਿਆਹ", arogya: "ਸਿਹਤ", dhan: "ਧਨ", share: "ਸ਼ੇਅਰ ਬਾਜ਼ਾਰ", vyapar: "ਕਾਰੋਬਾਰ", samman: "ਸਨਮਾਨ" },
  or: { padhai: "ଶିକ୍ଷା", vivah: "ବିବାହ", arogya: "ସ୍ୱାସ୍ଥ୍ୟ", dhan: "ଧନ", share: "ଶେୟାର ବଜାର", vyapar: "ବ୍ୟାପାର", samman: "ସମ୍ମାନ" },
  as: { padhai: "পঢ়া-পাঁহা", vivah: "বিয়াল", arogya: "স্বাস্থ্য", dhan: "সম্পদ", share: "শেয়াৰ বজাৰ", vyapar: "ব্যৱসায়", samman: "সম্মান" },
  en: { padhai: "Studies", vivah: "Marriage", arogya: "Health", dhan: "Wealth", share: "Stock Market", vyapar: "Business", samman: "Prestige" },
};

const PERIODS = ["dainik", "saptahik", "masik", "varshik"];

const pad2 = (n) => String(n).padStart(2, "0");
const todayLabel = (d = new Date()) =>
  `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
const chipDate = (d) => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;

export default function Rashifal() {
  const { lang, S } = useLanguage();
  const P = pgT(lang);
  const TABL = {
    dainik: P.pg_dainik,
    saptahik: P.pg_saptahik,
    masik: P.pg_masik,
    varshik: P.pg_varshik,
  };
  const [ri, setRi] = useState(0);
  const [allMode, setAllMode] = useState(false);
  const [period, setPeriod] = useState("dainik");

  const base = RASHI_DATA[ri];
  const r = rashiLang(ri, lang, base);
  const POOL = dailyTX(lang);
  const DEEP = rashiDeepTX(lang);
  const VC = pageTX(VCAT, lang);
  const SX = pageTX(SW, lang);
  const RN = rashiName(base.name, lang);
  const VD = varshikLang(ri, lang);

  // ---- Topic labels (pehle se hi poori tarah translated chahiye) ----
  const TOPIC_LBL = {
    shubh: S.rf_shubh,
    ashubh: S.rf_ashubh,
    naukri: P.pg_career,
    aarogya: VC.arogya,
    business: VC.vyapar,
    prem: P.pg_prem,
    arthik: VC.dhan,
    samajik: VC.samman,
  };

  // ---- Janm तिथि (birth date) se din-level shubh/ashubh banता hai ----
  const prof = loadProfile();
  const bdob = prof.birthdate || "";
  const bd = bdob ? Number(bdob.split("-")[2]) : 0;
  const bm = bdob ? Number(bdob.split("-")[1]) : 1;

  const NUM = luckyNumbers(ri);
  const plan = useMemo(
    () => buildPlan({ deep: DEEP, ri, birthDay: bd, birthMonth: bm, period, now: new Date() }),
    [DEEP, ri, bd, bm, period],
  );

  const today = new Date();
  const todayNum = bdob ? personalDayNum(today, bd, bm) : 0;
  const todayLuck = bdob ? numLuck(todayNum, ri) : "neutral";

  const dailyLine = POOL[seed(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${base.name}`) % POOL.length];

  const fmtList = (arr) => arr.map(chipDate).join(", ");

  return (
    <div>
      <h1 className="text-gradient">{S.rashifal_title}</h1>
      <p>{S.rashifal_pick}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        <button className={allMode ? "btn" : "btn secondary"} style={{ padding: "8px 14px" }} onClick={() => setAllMode(true)}>
          {S.rashifal_all_btn}
        </button>
        {RASHI_DATA.map((x, i) => (
          <button key={x.name} className={!allMode && ri === i ? "btn" : "btn secondary"} style={{ padding: "8px 14px" }} onClick={() => { setRi(i); setAllMode(false); }}>
            {rashiName(x.name, lang)}
          </button>
        ))}
      </div>

      {allMode && (
        <div style={{ marginTop: 20 }}>
          <div className="card" style={{ marginBottom: 14 }}>
            <h3>{S.rashifal_all_title}</h3>
            <p style={{ marginTop: 4, fontSize: ".85rem" }}>{S.rashifal_date} {todayLabel()}</p>
          </div>
          <div className="grid grid-3">
            {RASHI_DATA.map((x, i) => {
              const rl = rashiLang(i, lang, x);
              const line = POOL[seed(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${x.name}`) % POOL.length];
              return (
                <div key={x.name} className="card">
                  <h3 style={{ color: "var(--gold)" }}>{rashiName(x.name, lang)}</h3>
                  <p style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                    {SX.swami}: {grahaName(rl.lord, lang)} · {S.rashifal_lucky} {rl.luckyNum}
                  </p>
                  <p style={{ marginTop: 8 }}>{line}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!allMode && (
        <div className="card" style={{ marginTop: 20 }}>
          <h2>{RN} · {SX.swami}: {grahaName(r.lord, lang)}</h2>
          <p style={{ marginTop: 4 }}>{r.traits}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            {PERIODS.map((pb) => (
              <button key={pb} className={period === pb ? "btn" : "btn secondary"} style={{ padding: "8px 14px" }} onClick={() => setPeriod(pb)}>
                {TABL[pb]}
              </button>
            ))}
          </div>

          {period === "varshik" ? (
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
            <>
              {/* ---------- Aaj / saptahik / masik ka mukhya fal ---------- */}
              <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(139,92,246,.10)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{S.rashifal_date} {todayLabel()}</div>
                <p style={{ marginTop: 6, fontSize: "1.05rem" }}>{plan.topics.shubh?.[0] || dailyLine}</p>
              </div>

              {/* ---------- Shubh / Ashubh ---------- */}
              <div style={{ marginTop: 16 }}>
                <h3 style={{ color: "#34d399", fontSize: "1rem" }}>{S.rf_shubh}</h3>
                <p style={{ marginTop: 4, fontSize: ".92rem" }}>{(plan.topics.shubh || []).join(" ")}</p>
              </div>
              <div style={{ marginTop: 12 }}>
                <h3 style={{ color: "#f87171", fontSize: "1rem" }}>{S.rf_ashubh}</h3>
                <p style={{ marginTop: 4, fontSize: ".92rem" }}>{(plan.topics.ashubh || []).join(" ")}</p>
              </div>

              {/* ---------- Shubh / Ashubh तारीखें (saptahik + masik) ---------- */}
              <div style={{ marginTop: 16 }}>
                {period !== "dainik" && (
                  <>
                    <div className="kv">
                      <span className="k">{S.rf_shubh_dates}</span>
                      <span className="v">{bdob && plan.shubh.length ? fmtList(plan.shubh) : "—"}</span>
                    </div>
                    <div className="kv">
                      <span className="k">{S.rf_ashubh_dates}</span>
                      <span className="v">{bdob && plan.ashubh.length ? fmtList(plan.ashubh) : "—"}</span>
                    </div>
                  </>
                )}
                <div className="kv"><span className="k">{S.rf_lucky_nums}</span><span className="v">{NUM.good.join(", ")}</span></div>
                <div className="kv"><span className="k">{S.rf_avoid_nums}</span><span className="v">{NUM.bad.join(", ")}</span></div>
                {!bdob && (
                  <p style={{ marginTop: 8, fontSize: ".8rem", color: "var(--muted)" }}>{S.rf_birth_ask}</p>
                )}
              </div>

              {/* ---------- Baaki saare vishay ---------- */}
              <div className="grid grid-2" style={{ marginTop: 18 }}>
                {DEEP_TOPICS.filter((t) => t !== "shubh" && t !== "ashubh").map((t) => (
                  <div key={t} className="card" style={{ background: "rgba(255,255,255,.025)" }}>
                    <h3 style={{ color: "var(--gold)", fontSize: ".95rem" }}>{TOPIC_LBL[t] || t}</h3>
                    <p style={{ marginTop: 6, fontSize: ".9rem" }}>{(plan.topics[t] || []).join(" ")}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ---------- Lucky number / colour / day / mantra ---------- */}
          <div style={{ marginTop: 14 }}>
            <div className="kv"><span className="k">{P.pg_luckynum}</span><span className="v">{r.luckyNum}</span></div>
            <div className="kv"><span className="k">{P.pg_luckycolor}</span><span className="v">{r.luckyColor}</span></div>
            <div className="kv"><span className="k">{P.pg_day}</span><span className="v">{r.day}</span></div>
            <div className="kv"><span className="k">{P.pg_mantra}</span><span className="v">{r.mantra}</span></div>
          </div>

          <ShareButtons title={S.rashifal_title} text={`${RN} — ${TABL[period]}`} />
        </div>
      )}
    </div>
  );
}