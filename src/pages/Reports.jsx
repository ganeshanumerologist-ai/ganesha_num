import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import { pgX } from "../i18n/jyotish_c.js";
import kundliT from "../i18n/kundli.js";
import {
  jdFromDateStr, moonTropical, sunTropical, planetTropical, rahuTropical,
  lahiriAyanamsa, rev, nakshatraOf, rashiOf, rashiIndex, grahaSthiti,
  lagnaSidereal, horaSign, drekkanaSign, saptamshaSign,
  navamshaSign, dashamshaSign, dwadasamshaSign, RASHIS,
} from "../utils/astro.js";
import { allNumbers, reduceNumber } from "../utils/numerology.js";
import { personalYear, PERSONAL_YEARS } from "../data/forecast.js";
import { universalDay } from "../data/daily.js";
import { dayInfo } from "../data/day_i18n.js";
import { yearMeaning } from "../data/varshphal_i18n.js";
import { grahaName, rashiName } from "../i18n/charts.js";
import { rashiLang } from "../data/rashi_i18n.js";
const lagnaTraits = (en, lang) => {
  const i = RASHI_DATA.findIndex((x) => x.name === en);
  if (i < 0) return "";
  return rashiLang(i, lang, RASHI_DATA[i]).traits;
};
import {
  NAK_LORD, DASHA_SEQ, RATNA, NUM_PLANET, RASHI_LORD, RASHI_LETTERS, RASHI_DATA,
  EXALT, OWN, LALKITAB_UPAY, LALKITAB_UPAY_MR, LALKITAB_UPAY_EN, SAMIDHA, RUDRAKSHA, YANTRA, RASHI_TATTVA, RASHI_VARNA,
  PLANET_MANTRA,
} from "../data/jyotish.js";
import CITIES, { STATES } from "../data/cities.js";
import ShareButtons from "../components/ShareButtons.jsx";

const GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

// Ratna dhatu/vaar/ungli — Hindi se Marathi/English
const RATNA_TX = {
  mr: {
    "Sona": "सोने", "Chandi": "चांदी", "Sona/Tamba": "सोने/तांबे", "Panchdhatu": "पंचधातू", "Platinum/Chandi": "प्लॅटिनम/चांदी",
    "Ravivaar": "रविवार", "Somvaar": "सोमवार", "Mangalvaar": "मंगळवार", "Budhvaar": "बुधवार",
    "Guruvaar": "गुरुवार", "Shukravaar": "शुक्रवार", "Shanivaar": "शनिवार",
    "Anamika": "अनामिका", "Kanishtha": "करंगळी", "Tarjani": "तर्जनी", "Madhyama": "मधले बोट",
  },
  en: {
    "Sona": "Gold", "Chandi": "Silver", "Sona/Tamba": "Gold/Copper", "Panchdhatu": "Five-metal", "Platinum/Chandi": "Platinum/Silver",
    "Ravivaar": "Sunday", "Somvaar": "Monday", "Mangalvaar": "Tuesday", "Budhvaar": "Wednesday",
    "Guruvaar": "Thursday", "Shukravaar": "Friday", "Shanivaar": "Saturday",
    "Anamika": "Ring finger", "Kanishtha": "Little finger", "Tarjani": "Index finger", "Madhyama": "Middle finger",
  },
};
const rx = (v, lang) => (RATNA_TX[lang] && RATNA_TX[lang][v]) || v;
const lalUpay = (k, lang) => lang === "mr" ? LALKITAB_UPAY_MR[k] : lang === "en" ? LALKITAB_UPAY_EN[k] : LALKITAB_UPAY[k];
const GRAHA_KEY = { Surya: "Sun", Chandra: "Moon", Mangal: "Mars", Budh: "Mercury", Guru: "Jupiter", Shukra: "Venus", Shani: "Saturn", Rahu: "Rahu", Ketu: "Ketu" };
const gName = (hindiPlanet, lang) => grahaName(GRAHA_KEY[hindiPlanet] || hindiPlanet, lang);
const TX = {
  hi: {
    title: "Phaladesh Reports", sub: "Jivan, Dasha, KP, Shodashvarga, Lalkitab, Ratna, Rudraksha, Mahadasha.",
    sampoorna: "Sampoorna Phaladesh", chandraR: "Chandra Rashi", naksh: "Nakshatra", dashanath: "Dashanath", letters: "Naam-akshar",
    sade: { peak: ["Sadesati prabhav me", "Shani chandra-rashi me (peak)"], first: ["Sadesati prabhav me", "Pratham charan"], last: ["Sadesati prabhav me", "Antim charan"], dhaiya: ["Shani Dhaiya", "Shani 4the/8ve — savdhani rakhein"], none: ["Sadesati nahi", "Samay anukool"] },
    mangalYes: ["Mangal Dosh ke sanket", "Chandra/Shukra se Mangal ashwi-sthan me. Vivah se pehle Lagna se poorna Milan expert se karayein."],
    mangalNo: ["Mangal Dosh nahi", "Mangal shubh sthan me."],
    kaalYes: ["Kaalsarp Yog ke sanket", "Sapt grah Rahu-Ketu dhuri ke ek or. Upay labhdayak."],
    kaalNo: ["Kaalsarp Yog nahi", "Grah sthiti santulit."],
    rinYes: "Pitri-rin sanket (Rahu 9ve bhav me) — Peepal-seva, amavasya daan labhdayak.",
    rinNo: "Koi vishesh Rin-sanket nahi — nitya daan-seva banaye rakhein.",
    baseLag: "Janm-Lagna se", baseMoon: "Chandra-lagna se (samay dein to exact)",
    lagnaPrompt: "Janm-samay + sheher dein to exact Lagna aur uska phal yahan aayega.",
    gocharYes: "apni hi rashi me — swakshetra prabhav, balwaan din.",
    gocharNo: "Aaj koi grah apni janm-rashi me nahi — samanya din.",
    jivan: (lp, md) => `Moolank-Destiny sanyog se jeevan me ${lp} ki urja pradhan. Chal rahi Mahadasha ${md} — dasha-nath mantra-jaap se vishesh labh.`,
    ratnaNote: "Neelam/Gomed se pehle pariksha + expert salah zaroori.",
    kpT: "KP Ruling Grah (aaj)", adNow: "(chal rahi)", tRunning: "Chal rahi", tIn: "me", adT: "ki Antar Dashayein", mdT: "Sabhi Maha Dashayein",
    secVarga: "Shodashvarga (7 Varga)", secLagna: "Lagna Bhavishya + Graha Vichar", secLal: "Lal Kitab — Upay + Rin",
    secRatna: "Ratna, Rudraksha, Jadi, Yantra", gocharT: "Aaj ka Gochar (janm-grahon se)", balaT: "Graha Bala (Uchcha/Neecha/Swa/Asta)", rinT: "Rin vichar",
    graha: "Graha", dhatu: "Dhatu", vaar: "Vaar", ungli: "Ungli", rudra: "Rudraksha", jadi: "Jadi (samidha)", yantra: "Yantra",
    rudraHow: "Somvaar ko Gangajal se shuddh karke dharan karein.",
    yantraHow: "Bhojpatra/dhatu par banwakar pooja-sthan me sthapit karein.",
    jadiHow: "Jad ko chandi me jadwakar dharan karein ya havan me prayog karein.",
    kpNeed: "— samay dein",
  },
  mr: {
    title: "फलादेश रिपोर्ट्स", sub: "जीवन, दशा, KP, षोडशवर्ग, लाल किताब, रत्न, रुद्राक्ष, महादशा.",
    sampoorna: "संपूर्ण फलादेश", chandraR: "चंद्र राशी", naksh: "नक्षत्र", dashanath: "दशानाथ", letters: "नाव-अक्षरे",
    sade: { peak: ["साडेसाती प्रभावात", "शनी चंद्र-राशीत (शिखर)"], first: ["साडेसाती प्रभावात", "पहिला टप्पा"], last: ["साडेसाती प्रभावात", "शेवटचा टप्पा"], dhaiya: ["शनी धैया", "शनी 4थ्या/8व्या स्थानी — सावधगिरी बाळगा"], none: ["साडेसाती नाही", "वेळ अनुकूल आहे"] },
    mangalYes: ["मंगळ दोषाची चिन्हे", "चंद्र/शुक्रापासून मंगळ अशुभ स्थानी. लग्नाआधी लग्नाकडून पूर्ण मिलन expert कडून करून घ्या."],
    mangalNo: ["मंगळ दोष नाही", "मंगळ शुभ स्थानी."],
    kaalYes: ["कालसर्प योगाची चिन्हे", "सप्त ग्रह राहू-केतू धुरीच्या एका बाजूला. उपाय लाभदायक."],
    kaalNo: ["कालसर्प योग नाही", "ग्रह स्थिती संतुलित."],
    rinYes: "पितृ-ऋण संकेत (राहू 9व्या भावात) — पिंपळ-सेवा, अमावास्या दान लाभदायक.",
    rinNo: "विशेष ऋण-संकेत नाही — नित्य दान-सेवा ठेवा.",
    baseLag: "जन्म-लग्नापासून", baseMoon: "चंद्र-लग्नापासून (वेळ दिल्यास exact)",
    lagnaPrompt: "जन्म-वेळ + शहर दिल्यास exact लग्न आणि त्याचे फळ येथे येईल.",
    gocharYes: "स्वतःच्याच राशीत — स्वक्षेत्र प्रभाव, बलवान दिवस.",
    gocharNo: "आज कोणताही ग्रह स्वतःच्या जन्म-राशीत नाही — सामान्य दिवस.",
    jivan: (lp, md) => `मूलांक-Destiny संयोगामुळे जीवनात ${lp} ची ऊर्जा प्रधान. चालू महादशा ${md} — दशा-नाथ मंत्र-जपाने विशेष लाभ.`,
    ratnaNote: "नीलम/गोमेद आधी परीक्षा + expert सल्ला आवश्यक.",
    kpT: "KP रूलिंग ग्रह (आज)", adNow: "(चालू)", tRunning: "चालू", tIn: "मध्ये", adT: "च्या अंतर्दशा", mdT: "सर्व महादशा",
    secVarga: "षोडशवर्ग (7 वर्ग)", secLagna: "लग्न भविष्य + ग्रह विचार", secLal: "लाल किताब — उपाय + ऋण",
    secRatna: "रत्न, रुद्राक्ष, जडी, यंत्र", gocharT: "आजचा गोचर (जन्म-ग्रहांपासून)", balaT: "ग्रह बल (उच्च/नीच/स्व/अस्त)", rinT: "ऋण विचार",
    graha: "ग्रह", dhatu: "धातू", vaar: "वार", ungli: "बोट", rudra: "रुद्राक्ष", jadi: "जडी (समिधा)", yantra: "यंत्र",
    rudraHow: "सोमवारी गंगाजलाने शुद्ध करून धारण करा.",
    yantraHow: "भोजपत्र/धातूवर बनवून पूजा-स्थानी स्थापित करा.",
    jadiHow: "मूळ चांदीत बसवून धारण करा किंवा हवनात वापरा.",
    kpNeed: "— वेळ द्या",
  },
  en: {
    title: "Phaladesh Reports", sub: "Life, Dasha, KP, Shodashvarga, Lal Kitab, Gemstone, Rudraksha, Mahadasha.",
    sampoorna: "Complete Phaladesh", chandraR: "Moon Sign", naksh: "Nakshatra", dashanath: "Dasha Lord", letters: "Name Letters",
    sade: { peak: ["Sadesati Active", "Saturn in Moon sign (peak)"], first: ["Sadesati Active", "First phase"], last: ["Sadesati Active", "Final phase"], dhaiya: ["Saturn Dhaiya", "Saturn 4th/8th — stay careful"], none: ["No Sadesati", "Time is favourable"] },
    mangalYes: ["Mangal Dosh signs", "Mars badly placed from Moon/Venus. Get full Lagna matching by expert before marriage."],
    mangalNo: ["No Mangal Dosh", "Mars well placed."],
    kaalYes: ["Kaalsarp signs", "Seven planets one side of Rahu-Ketu axis. Remedies help."],
    kaalNo: ["No Kaalsarp", "Planets balanced."],
    rinYes: "Pitri-rin sign (Rahu in 9th) — Peepal seva and amavasya daan help.",
    rinNo: "No special Rin sign — keep daily daan-seva.",
    baseLag: "From Janm-Lagna", baseMoon: "From Moon-Lagna (give time for exact)",
    lagnaPrompt: "Give birth time + city for exact Lagna and its reading here.",
    gocharYes: "in own sign — strong, favourable day.",
    gocharNo: "No planet in its natal sign today — an average day.",
    jivan: (lp, md) => `Moolank-Destiny blend gives ${lp} energy to life. Running Mahadasha ${md} — chanting the dasha lord's mantra helps.`,
    ratnaNote: "Test Neelam/Gomed before wearing + expert advice needed.",
    kpT: "KP Ruling Planets (today)", adNow: "(running)", tRunning: "Running", tIn: "in", adT: "Antardashas", mdT: "All Mahadashas",
    secVarga: "Shodashvarga (7 Vargas)", secLagna: "Lagna Reading + Planet Strength", secLal: "Lal Kitab — Remedies + Rin",
    secRatna: "Gemstone, Rudraksha, Herb, Yantra", gocharT: "Today's Transit (vs natal)", balaT: "Planet Strength", rinT: "Rin Analysis",
    graha: "Planet", dhatu: "Metal", vaar: "Day", ungli: "Finger", rudra: "Rudraksha", jadi: "Herb (samidha)", yantra: "Yantra",
    rudraHow: "Purify with Gangajal on Monday and wear.",
    yantraHow: "Install in prayer space on bhojpatra/metal.",
    jadiHow: "Wear root set in silver or use in havan.",
    kpNeed: "— give time",
  },
};
const HINAME = { Sun: "Surya", Moon: "Chandra", Mars: "Mangal", Mercury: "Budh", Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani", Rahu: "Rahu", Ketu: "Ketu" };
const VAAR_LORD = ["Surya", "Chandra", "Mangal", "Budh", "Guru", "Shukra", "Shani"];

const addYears = (date, y) => new Date(date.getTime() + y * 365.25 * 86400000);
const fmt = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function vimshottari(birthdate, nak) {
  const lord = NAK_LORD[nak.name];
  const startIdx = DASHA_SEQ.findIndex((d) => d.lord === lord);
  const balance = (1 - nak.frac) * DASHA_SEQ[startIdx].years;
  const [by, bm, bd] = birthdate.split("-").map(Number);
  let cursor = new Date(by, bm - 1, bd);
  const periods = [{ lord, years: balance, start: new Date(cursor), end: addYears(cursor, balance) }];
  cursor = addYears(cursor, balance);
  for (let i = 1; i <= 10; i++) {
    const d = DASHA_SEQ[(startIdx + i) % 9];
    periods.push({ lord: d.lord, years: d.years, start: new Date(cursor), end: addYears(cursor, d.years) });
    cursor = addYears(cursor, d.years);
  }
  const now = new Date();
  const cur = periods.find((p) => now >= p.start && now < p.end) || periods[0];
  const ci = DASHA_SEQ.findIndex((d) => d.lord === cur.lord);
  let c2 = new Date(cur.start);
  const ads = [];
  for (let i = 0; i < 9; i++) {
    const sub = DASHA_SEQ[(ci + i) % 9];
    const yrs = (cur.years * sub.years) / 120;
    ads.push({ lord: sub.lord, start: new Date(c2), end: addYears(c2, yrs) });
    c2 = addYears(c2, yrs);
  }
  const curAD = ads.find((a) => now >= a.start && now < a.end) || ads[0];
  return { periods: periods.slice(0, 9), cur, curAD, ads };
}

export default function Reports() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const X = pgX(lang);
  const L = kundliT(lang);
  const T = TX[lang] || TX.en;
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");
  const [r, setR] = useState(null);

  const calc = (e) => {
    e.preventDefault();
    if (!name.trim() || !dob) return;
    const nums = allNumbers({ name: name.trim(), birthdate: dob });
    const jd = jdFromDateStr(dob, 12);
    const aya = lahiriAyanamsa(jd);
    const moonS = rev(moonTropical(jd) - aya);
    const sunS = rev(sunTropical(jd) - aya);
    const nak = nakshatraOf(moonS);
    const moonR = rashiOf(moonS);
    const moonIdx = rashiIndex(moonS);
    const g = grahaSthiti(dob);
    const dasha = vimshottari(dob, nak);

    // Lagna (samay + sheher mile to)
    let lagIdx = null;
    if (time) {
      try {
        const c = CITIES.find((x) => x[0] === city) || null;
        if (c) lagIdx = rashiIndex(lagnaSidereal(dob, time, c[1], c[2]));
      } catch { /* ignore */ }
    }
    const baseIdx = lagIdx !== null ? lagIdx : moonIdx;
    const baseNote = lagIdx !== null ? T.baseLag : T.baseMoon;

    const tIso = todayISO();
    const uDay = universalDay(tIso);
    const now = new Date();
    const py = personalYear(dob, now.getFullYear());
    const pm = reduceNumber(py + (now.getMonth() + 1), false);

    // Sadesati
    const gNow = grahaSthiti(tIso);
    const rel = (gNow.Saturn.rashiIdx - moonIdx + 12) % 12;
    const sade = rel === 11 || rel === 0 || rel === 1
      ? { t: T.sade[rel === 0 ? "peak" : rel === 11 ? "first" : "last"][0], d: T.sade[rel === 0 ? "peak" : rel === 11 ? "first" : "last"][1] }
      : rel === 3 || rel === 7
      ? { t: T.sade.dhaiya[0], d: T.sade.dhaiya[1] }
      : { t: T.sade.none[0], d: T.sade.none[1] };

    // Mangal dosh
    const mDiff = (g.Mars.rashiIdx - moonIdx + 12) % 12;
    const vDiff = (g.Mars.rashiIdx - g.Venus.rashiIdx + 12) % 12;
    const doshPos = [0, 1, 3, 6, 7, 11];
    const mangal = doshPos.includes(mDiff) || doshPos.includes(vDiff)
      ? { t: T.mangalYes[0], d: T.mangalYes[1] }
      : { t: T.mangalNo[0], d: T.mangalNo[1] };

    // Kaalsarp
    const rahu = g.Rahu.lon;
    const rels = GRAHAS.map((k) => rev(g[k].lon - rahu));
    const spread = Math.max(...rels) - Math.min(...rels);
    const kaal = spread <= 180
      ? { t: T.kaalYes[0], d: T.kaalYes[1] }
      : { t: T.kaalNo[0], d: T.kaalNo[1] };

    // Graha vichar (bala)
    const sunT = sunTropical(jd);
    const vichar = GRAHAS.map((k) => {
      const rashi = g[k].rashi;
      let bala = "Sama";
      if (rashi === EXALT[k][0]) bala = "Uchcha";
      else if (rashi === EXALT[k][1]) bala = "Neecha";
      else if ((OWN[k] || []).includes(rashi)) bala = "Swa";
      const trop = k === "Sun" ? sunT : k === "Moon" ? moonTropical(jd) : planetTropical(k, jd);
      let elong = Math.abs(rev(trop - sunT));
      if (elong > 180) elong = 360 - elong;
      const asta = k !== "Sun" && elong < (k === "Moon" ? 12 : 8);
      return { key: k, rashi, bala, asta };
    });

    // Aaj ka gochar vs janm-grah (keys rakho, bhasha render par)
    const gocharSame = GRAHAS.filter((k) => gNow[k] && gNow[k].rashiIdx === g[k].rashiIdx);

    // KP sanket (ruling grah)
    const wd = now.getDay();
    const pNow = panchToday();
    const kp = [
      { k: "Vaar-swami", v: VAAR_LORD[wd] },
      { k: "Chandra-rashi swami (aaj)", v: RASHI_LORD[pNow.moonR] || "-" },
      { k: "Chandra-nakshatra swami (aaj)", v: NAK_LORD[pNow.nak] || "-" },
      { k: "Janm-Lagna swami", v: lagIdx !== null ? RASHI_LORD[RASHIS[lagIdx]] || "-" : null },
    ];

    // Shodashvarga (7 varga)
    const vargas = GRAHAS.map((k) => {
      const sid = k === "Sun" ? sunS : k === "Moon" ? moonS : rev(planetTropical(k, jd) - aya);
      return {
        key: k,
        D1: rashiOf(sid), D2: horaSign(sid), D3: drekkanaSign(sid), D7: saptamshaSign(sid),
        D9: navamshaSign(sid), D10: dashamshaSign(sid), D12: dwadasamshaSign(sid),
      };
    });

    // Lalkitab (bhav = lagna/chandra-lagna se)
    const lal = GRAHAS.map((k) => {
      const house = ((g[k].rashiIdx - baseIdx + 12) % 12) + 1;
      return { key: k, house };
    });
    const rahuHouse = ((g.Rahu.rashiIdx - baseIdx + 12) % 12) + 1;
    const rin = rahuHouse === 9 ? T.rinYes : T.rinNo;

    const p1 = NUM_PLANET[nums.lifePath] || "Guru";
    const p2 = RASHI_LORD[moonR];

    setR({
      nums, nak, moonR, moonIdx, dasha, uDay, py, pm, sade, mangal, kaal,
      ratna1: { planet: p1, ...RATNA[p1] }, ratna2: { planet: p2, ...RATNA[p2] },
      letters: RASHI_LETTERS[moonR], vichar, gocharSame, kp, vargas, lal, rin, baseNote,
      lagna: lagIdx !== null ? RASHIS[lagIdx] : null,
      rudra1: RUDRAKSHA[p1], rudra2: RUDRAKSHA[p2],
      jadi1: SAMIDHA[p1], jadi2: SAMIDHA[p2],
      yantra1: YANTRA[p1], yantra2: YANTRA[p2],
      tattva: RASHI_TATTVA[moonR], varna: RASHI_VARNA[moonR],
    });
  };

  return (
    <div>
      <h1 className="text-gradient">{T.title}</h1>
      <p>{T.sub}</p>

      <div className="card" style={{ marginTop: 16 }}>
        <form onSubmit={calc} className="grid grid-2">
          <div>
            <label className="label">{L.k_name} *</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">{L.k_dob} *</label>
            <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>
          <div>
            <label className="label">{L.k_time}</label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <label className="label">{X.pg_city}</label>
            <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">— Chunein —</option>
              {STATES.map((g) => (
                <optgroup key={g.state} label={g.state}>
                  {g.cities.map((c) => <option key={g.state + c[0]} value={c[0]}>{c[0]}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <button className="btn" type="submit">{P.pg_make}</button>
          </div>
        </form>
      </div>

      {r && (
        <div style={{ marginTop: 20 }}>
          <div className="card number-card">
            <h2>{name.trim()} — {T.sampoorna}</h2>
            <p style={{ marginTop: 6 }}>{T.chandraR}: <b>{rashiName(r.moonR, lang)}</b> · {T.naksh}: <b>{r.nak.name} (Charan {r.nak.pada})</b></p>
            <p>Life Path {r.nums.lifePath} · Destiny {r.nums.destiny}{r.lagna ? <> · {P.pg_lagna} <b>{rashiName(r.lagna, lang)}</b></> : null}</p>
          </div>

          <h2 id="paramparik" style={{ marginTop: 24 }}>{T.chandraR} ({P.pg_paramparik})</h2>
          <div className="card">
            <div className="kv"><span className="k">{T.chandraR}</span><span className="v">{r.moonR} — {r.tattva} tattva, {r.varna} varna</span></div>
            <div className="kv"><span className="k">{T.naksh}</span><span className="v">{r.nak.name} (Charan {r.nak.pada}) · {T.dashanath} {NAK_LORD[r.nak.name]}</span></div>
            <div className="kv"><span className="k">{T.letters}</span><span className="v">{r.letters}</span></div>
          </div>

          <h2 id="jivan" style={{ marginTop: 24 }}>{P.pg_jivan} / {P.pg_masik} / {P.pg_dainik} / {P.pg_varshik}</h2>
          <div className="card">
            <p><b>{P.pg_jivan}:</b> {T.jivan(r.nums.lifePath, r.dasha.cur.lord)}</p>
          </div>
          <div className="grid grid-3" style={{ marginTop: 12 }}>
            <div className="card"><h3>{P.pg_dainik} (Universal {r.uDay})</h3><p style={{ marginTop: 8 }}>{dayInfo(r.uDay, lang).vibe}</p></div>
            <div className="card"><h3>{P.pg_masik} (Personal {r.pm})</h3><p style={{ marginTop: 8 }}>{yearMeaning(r.pm, lang).t}</p></div>
            <div className="card"><h3>{P.pg_varshik} (Personal {r.py})</h3><p style={{ marginTop: 8 }}>{yearMeaning(r.py, lang).t} — <Link to="/forecast" style={{ color: "var(--accent-2)" }}>{P.pg_view}</Link></p></div>
          </div>

          <h2 id="dasha" style={{ marginTop: 24 }}>{P.pg_dasha} + KP</h2>
          <div className="card">
            <p>{T.tRunning}: <b>{gName(r.dasha.cur.lord, lang)} Mahadasha</b> {T.tIn} <b>{gName(r.dasha.curAD.lord, lang)} Antardasha</b> ({fmt(r.dasha.curAD.start)} – {fmt(r.dasha.curAD.end)})</p>
            <h3 style={{ marginTop: 12 }}>{T.kpT}</h3>
            <div style={{ marginTop: 6 }}>
              {r.kp.map((x) => <div key={x.k} className="kv"><span className="k">{x.k}</span><span className="v">{x.v ? gName(x.v, lang) : T.kpNeed}</span></div>)}
            </div>
            <h3 style={{ marginTop: 12 }}>{T.tRunning} {r.dasha.cur.lord} {T.adT}</h3>
            <div style={{ marginTop: 6 }}>
              {r.dasha.ads.map((a) => (
                <div key={a.lord + a.start} className="kv">
                  <span className="k">{gName(a.lord, lang)} {a.lord === r.dasha.curAD.lord ? `← ${T.adNow}` : ""}</span>
                  <span className="v">{fmt(a.start)} – {fmt(a.end)}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 id="varga" style={{ marginTop: 24 }}>{T.secVarga}</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 560 }}>
              <div className="kv" style={{ fontWeight: 700 }}><span className="k">{T.graha}</span><span className="v">D1 · D2 · D3 · D7 · D9 · D10 · D12</span></div>
              {r.vargas.map((v) => (
                <div key={v.key} className="kv"><span className="k">{grahaName(v.key, lang)}</span><span className="v">{[v.D1, v.D2, v.D3, v.D7, v.D9, v.D10, v.D12].map((s) => rashiName(s, lang)).join(" · ")}</span></div>
              ))}
            </div>
          </div>

          <h2 id="lagna" style={{ marginTop: 24 }}>{T.secLagna}</h2>
          <div className="grid grid-2" style={{ marginTop: 12 }}>
            <div className="card">
              <h3>{P.pg_lagna}</h3>
              {r.lagna
                ? <p style={{ marginTop: 8 }}>{P.pg_lagna} <b>{rashiName(r.lagna, lang)}</b> — {lagnaTraits(r.lagna, lang)}</p>
                : <p style={{ marginTop: 8 }}>{T.lagnaPrompt}</p>}
            </div>
            <div className="card">
              <h3>{T.gocharT}</h3>
              <p style={{ marginTop: 8 }}>{r.gocharSame.length ? r.gocharSame.map((k) => grahaName(k, lang)).join(", ") + " " + T.gocharYes : T.gocharNo}</p>
            </div>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3>{T.balaT}</h3>
            <div style={{ marginTop: 8 }}>
              {r.vichar.map((v) => (
                <div key={v.key} className="kv">
                  <span className="k">{grahaName(v.key, lang)} ({rashiName(v.rashi, lang)})</span>
                  <span className="v">{v.bala}{v.asta ? " · Asta" : ""}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 id="dosh" style={{ marginTop: 24 }}>{P.pg_dosh}</h2>
          <div className="grid grid-3" style={{ marginTop: 12 }}>
            <div className="card"><h3>{r.sade.t}</h3><p style={{ marginTop: 8 }}>{r.sade.d}</p></div>
            <div className="card"><h3>{r.mangal.t}</h3><p style={{ marginTop: 8 }}>{r.mangal.d}</p></div>
            <div className="card"><h3>{r.kaal.t}</h3><p style={{ marginTop: 8 }}>{r.kaal.d}</p></div>
          </div>

          <h2 id="lalkitab" style={{ marginTop: 24 }}>{T.secLal} ({r.baseNote})</h2>
          <div className="card">
            <div style={{ marginTop: 8 }}>
              {r.lal.map((x) => (
                <div key={x.key} className="kv"><span className="k">{grahaName(x.key, lang)} (bhav {x.house})</span><span className="v">{lalUpay(x.key, lang)}</span></div>
              ))}
            </div>
            <p style={{ marginTop: 10 }}><b>{T.rinT}:</b> {r.rin}</p>
          </div>

          <h2 id="ratna" style={{ marginTop: 24 }}>{T.secRatna}</h2>
          <div className="grid grid-2" style={{ marginTop: 12 }}>
            <div className="card">
              <h3>{P.pg_ratna}</h3>
              <div className="kv"><span className="k">{P.pg_moolank} ({gName(r.ratna1.planet, lang)})</span><span className="v">{r.ratna1.stone} · {rx(r.ratna1.metal, lang)} · {rx(r.ratna1.day, lang)} · {rx(r.ratna1.finger, lang)}</span></div>
              <div className="kv"><span className="k">{T.chandraR} ({gName(r.ratna2.planet, lang)})</span><span className="v">{r.ratna2.stone} · {rx(r.ratna2.metal, lang)} · {rx(r.ratna2.day, lang)} · {rx(r.ratna2.finger, lang)}</span></div>
              <p style={{ fontSize: ".8rem", marginTop: 6 }}>{T.ratnaNote}</p>
            </div>
            <div className="card">
              <h3>{P.pg_mantra}</h3>
              <div className="kv"><span className="k">{gName(r.ratna1.planet, lang)}</span><span className="v">{PLANET_MANTRA[GRAHA_KEY[r.ratna1.planet]]}</span></div>
              <div className="kv"><span className="k">{gName(r.ratna2.planet, lang)}</span><span className="v">{PLANET_MANTRA[GRAHA_KEY[r.ratna2.planet]]}</span></div>
            </div>
          </div>
          <div className="grid grid-2" style={{ marginTop: 12 }}>
            {[{ p: r.ratna1.planet, rudra: r.rudra1, jadi: r.jadi1, yantra: r.yantra1 }, { p: r.ratna2.planet, rudra: r.rudra2, jadi: r.jadi2, yantra: r.yantra2 }].map((m, i) => (
              <div key={i} className="card">
                <h3>{gName(m.p, lang)} — {P.pg_upay}</h3>
                <div style={{ fontSize: "2rem" }}>📿</div>
                <p style={{ fontWeight: 700, marginTop: 4 }}>{T.rudra}: {m.rudra}</p>
                <p style={{ fontSize: ".85rem" }}>{T.rudraHow}</p>
                <div style={{ fontSize: "2rem", marginTop: 8 }}>🔯</div>
                <p style={{ fontWeight: 700, marginTop: 4 }}>{T.yantra}: {m.yantra}</p>
                <p style={{ fontSize: ".85rem" }}>{T.yantraHow}</p>
                <div style={{ fontSize: "2rem", marginTop: 8 }}>🌿</div>
                <p style={{ fontWeight: 700, marginTop: 4 }}>{T.jadi}: {m.jadi}</p>
                <p style={{ fontSize: ".85rem" }}>{T.jadiHow}</p>
              </div>
            ))}
          </div>

          <ShareButtons title="Report share karein" text={`${name.trim()} — Chandra ${r.moonR}, ${r.nak.name}! Apni report banao — Numerology VIP`} />
        </div>
      )}
    </div>
  );
}

function panchToday() {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const jd = jdFromDateStr(iso, 12);
  const aya = lahiriAyanamsa(jd);
  const moonS = rev(moonTropical(jd) - aya);
  return { moonR: rashiOf(moonS), nak: nakshatraOf(moonS).name };
}
