import React from "react";
import { Link } from "react-router-dom";
import { getMeaning } from "../data/meanings_all.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const TX = {
  hi: {
    coreTitle: "हम किन अंकों की गणना करते हैं",
    core: [
      ["जीवन पथ", "आपके जीवन का मूल पाठ और दिशा।"],
      ["भाग्यांक", "नाम से मिली स्वाभाविक प्रतिभा और उद्देश्य।"],
      ["अंतरात्मा", "आपके मन की गहरी इच्छाएं।"],
      ["व्यक्तित्व", "पहली नजर में दुनिया आपको कैसा देखती है।"],
      ["जन्मांक", "जन्म से मिली विशेष प्रतिभा।"],
      ["मनोवृत्ति", "जीवन और नई स्थितियों के प्रति दृष्टिकोण।"],
    ],
    explore: "अंक ऊर्जा जानें",
    bKundli: "कुंडली खोलें", bReports: "रिपोर्ट्स", bMilan: "मिलन", bDaily: "डेली लकी",
  },
  mr: {
    coreTitle: "आम्ही कोणत्या अंकांची गणना करतो",
    core: [
      ["जीवन मार्ग", "तुमच्या जीवनाचा मूल धडा आणि दिशा."],
      ["नामांक", "नावातून मिळालेली प्रतिभा आणि उद्देश."],
      ["आत्म्याची हाक", "मनाच्या खोल इच्छा."],
      ["व्यक्तिमत्त्व", "पहिल्या नजरेत जग तुम्हाला कसे पाहते."],
      ["जन्मांक", "जन्मतः मिळालेली विशेष प्रतिभा."],
      ["मनोवृत्ती", "जीवनाकडे पाहण्याचा दृष्टिकोन."],
    ],
    explore: "अंक ऊर्जा पहा",
    bKundli: "कुंडली उघडा", bReports: "रिपोर्ट्स", bMilan: "मिलन", bDaily: "डेली लकी",
  },
  en: {
    coreTitle: "Core Numbers We Compute",
    core: [
      ["Life Path", "The core lesson and direction of your life."],
      ["Destiny", "Your natural talents and life purpose from your name."],
      ["Soul Urge", "Your inner desires and your heart's true calling."],
      ["Personality", "How the world sees you at first glance."],
      ["Birthday", "Special talents you bring into this life."],
      ["Attitude", "How you approach life and new situations."],
    ],
    explore: "Explore Number Energies",
    bKundli: "Open Kundli", bReports: "Reports", bMilan: "Milan", bDaily: "Daily Lucky",
  },
};

export default function Home() {
  const { t, lang } = useLanguage();
  const T = TX[lang] || TX.en;
  const featured = [1, 2, 3, 7, 8, 9];
  return (
    <div>
      <section className="hero">
        <img src="/logo.svg" alt="Numerology VIP logo" style={{ width: 84, height: 84 }} />
        <div style={{ marginTop: 10 }}><span className="badge">✨ {t("app_name")}</span></div>
        <h1 style={{ marginTop: 14 }}>
          <span className="text-gradient">{t("hero_title")}</span>
        </h1>
        <p>{t("hero_sub")}</p>
        <div className="hero-actions">
          <Link to="/calculator" className="btn">{t("hero_cta")}</Link>
          <Link to="/kundli" className="btn">{T.bKundli}</Link>
          <Link to="/reports" className="btn secondary">{T.bReports}</Link>
          <Link to="/match" className="btn secondary">{T.bMilan}</Link>
          <Link to="/daily" className="btn secondary">{T.bDaily}</Link>
          <Link to="/experts" className="btn secondary">{t("hero_cta2")}</Link>
          <Link to="/chat" className="btn secondary">{t("nav_chat")}</Link>
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2 style={{ textAlign: "center" }}>{T.coreTitle}</h2>
        <div className="grid grid-3">
          {T.core.map(([title, d]) => (
            <div key={title} className="card">
              <h3>{title}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 50 }}>
        <h2 style={{ textAlign: "center" }}>{T.explore}</h2>
        <div className="grid grid-3">
          {featured.map((n) => {
            const m = getMeaning(n, lang);
            return (
              <div key={n} className="card number-card">
                <div className="num"><span>{n}</span></div>
                <h3>{m.title}</h3>
                <p style={{ fontSize: ".85rem" }}>{m.keywords}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
