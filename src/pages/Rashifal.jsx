import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { pgT } from "../i18n/jyotish_b.js";
import { RASHI_DATA, DAILY_POOL } from "../data/jyotish.js";
import { rashiLang, DAILY_TX } from "../data/rashi_i18n.js";
import { varshikLang } from "../data/varshik_detail.js";
import { rashiName } from "../i18n/charts.js";

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
const todayLabel = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
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

const monthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
};

const ALL_RASHI_LBL = {
  en: "All 12 Signs", hi: "सभी 12 राशि", mr: "सर्व 12 राशी", bn: "সব ১২ রাশি",
  te: "మొత్తం 12 రాశులు", ta: "அனைத்து 12 ராசிகள்", gu: "બધી 12 રાશિ",
  ur: "تمام 12 برج", kn: "ಎಲ್ಲಾ 12 ರಾಶಿ", ml: "എല്ലാ 12 രാശികളും",
  pa: "ਸਾਰੇ 12 ਰਾਸ਼ੀ", or: "ସମସ୍ତ 12 ରାଶି", as: "সকলো ১২ ৰাশি",
};
const ALL_TITLE = {
  en: "Today's Rashifal — All Signs", hi: "आज का राशिफल — सभी राशि", mr: "आजचा राशिफल — सर्व राशी",
  bn: "আজকের রাশিফল — সকল রাশি", te: "ఈ రోజు రాశిఫల్ — అన్ని రాశులు", ta: "இன்றைய ராசிபல் — அனைத்து ராசிகள்",
  gu: "આજનું રાશિફલ — બધી રાશિ", ur: "آج کا راشی فال — تمام برج", kn: "ಇಂದಿನ ರಾಶಿಫಲ — ಎಲ್ಲಾ ರಾಶಿ",
  ml: "ഇന്നത്തെ രാശിഫലം — എല്ലാ രാശികളും", pa: "ਅੱਜ ਦਾ ਰਾਸ਼ੀਫਲ — ਸਾਰੀਆਂ ਰਾਸ਼ੀਆਂ", or: "ଆଜିକା ରାଶିଫଲ — ସମସ୍ତ ରାଶି", as: "আজিৰ ৰাশিফল — সকলো ৰাশি",
};
const ALL_DATE = {
  en: "Date:", hi: "दिनांक:", mr: "दिनांक:", bn: "তারিখ:", te: "తేదీ:", ta: "தேதி:",
  gu: "તારીખ:", ur: "تاریخ:", kn: "ದಿನಾಂಕ:", ml: "തീയതി:", pa: "ਮਿਤੀ:", or: "ତାରିଖ:", as: "তাৰিখ:",
};
const ALL_LUCKY = {
  en: "Lucky", hi: "शुभ अंक", mr: "शुभ अंक", bn: "শুভ সংখ্যা", te: "శుభ సంఖ్య", ta: "நல்ல எண்",
  gu: "શુભ અંક", ur: " lucky نمبر", kn: "ಶುಭ ಸಂಖ್ಯೆ", ml: "നല്ല സംഖ്യ", pa: "ਸ਼ੁਭ ਅੰਕ", or: "ଶୁଭ ସଂଖ୍ୟା", as: "শুভ সংখ্যা",
};

export default function Rashifal() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const TABL = { dainik: P.pg_dainik, saptahik: P.pg_saptahik, masik: P.pg_masik, prem: P.pg_prem, arthik: P.pg_arthik, career: P.pg_career, varshik: P.pg_varshik };
  const [ri, setRi] = useState(0);
  const [allMode, setAllMode] = useState(false);
  const [tab, setTab] = useState("dainik");
  const base = RASHI_DATA[ri];
  const r = rashiLang(ri, lang, base);
  const POOL = pageTX(DAILY_TX, lang);
  const VC = pageTX(VCAT, lang);
  const SX = pageTX(SW, lang);
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
      <p>{lang === "hi" ? "अपनी चंद्र राशि चुनें, या सभी 12 राशि एक साथ देखें" : lang === "mr" ? "तुमची चंद्र राशी निवडा, किंवा सर्व 12 राशी एकत्र पहा" : "Choose your Moon sign, or view all 12 at once"}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        <button className={allMode ? "btn" : "btn secondary"} style={{ padding: "8px 14px" }} onClick={() => setAllMode(true)}>
          {ALL_RASHI_LBL[lang] || ALL_RASHI_LBL.en}
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
            <h3>{ALL_TITLE[lang] || ALL_TITLE.en}</h3>
            <p style={{ marginTop: 4, fontSize: ".85rem" }}>{ALL_DATE[lang] || ALL_DATE.en} {todayLabel()}</p>
          </div>
          <div className="grid grid-3">
            {RASHI_DATA.map((x, i) => {
              const rl = rashiLang(i, lang, x);
              const line = POOL[seed(todayKey() + x.name) % POOL.length];
              return (
                <div key={x.name} className="card">
                  <h3 style={{ color: "var(--gold)" }}>{rashiName(x.name, lang)}</h3>
                  <p style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                    {SX.swami}: {rl.lord} · {ALL_LUCKY[lang] || ALL_LUCKY.en} {rl.luckyNum}
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
        <ShareButtons title="Rashifal" text={`${RN} — ${TABL[tab]}`} />
      </div>
      )}
    </div>
  );
}
