import React from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { getMeaning } from "../data/meanings_all.js";

const TX = {
  hi: {
    sub: "अंक-शास्त्र नाम, जन्मतिथि और चयन के पीछे छिपे पैटर्न बताता है — पाइथागोरस से वैदिक परंपरा तक। हर अंक की अपनी ऊर्जा होती है।",
    how: "यह कैसे काम करता है",
    cards: [
      ["जीवन पथ", "जन्मतिथि से निकलता है — जीवन की दिशा और सीख।"],
      ["भाग्यांक", "पूरे नाम से — स्वाभाविक प्रतिभा और उद्देश्य।"],
      ["अंतरात्मा", "नाम के स्वरों से — मन की सच्ची इच्छाएं।"],
      ["व्यक्तित्व", "नाम के व्यंजनों से — पहली छाप।"],
    ],
    master: "मास्टर अंक", masterSub: "11, 22 और 33 मास्टर अंक हैं — घटाए नहीं जाते।",
  },
  mr: {
    sub: "अंकशास्त्र नाव, जन्मतारीख आणि निवडीमागील लपलेले आकृतिबंध सांगते — पायथागोरसपासून वैदिक परंपरेपर्यंत. प्रत्येक अंकाची स्वतःची ऊर्जा असते.",
    how: "हे कसे काम करते",
    cards: [
      ["जीवन मार्ग", "जन्मतारखेतून निघतो — जीवनाची दिशा आणि धडा."],
      ["नामांक", "पूर्ण नावातून — नैसर्गिक प्रतिभा आणि उद्देश."],
      ["आत्म्याची हाक", "नावातील स्वरांतून — मनाच्या खऱ्या इच्छा."],
      ["व्यक्तिमत्त्व", "नावातील व्यंजनांतून — पहिली छाप."],
    ],
    master: "मास्टर अंक", masterSub: "11, 22 आणि 33 मास्टर अंक आहेत — ते लहान केले जात नाहीत.",
  },
  en: {
    sub: "Numerology reveals hidden patterns in names, birthdates and choices — from Pythagoras to Vedic tradition. Every number carries its own energy.",
    how: "How It Works",
    cards: [
      ["Life Path", "From your birthdate — life direction and lessons."],
      ["Destiny", "From your full name — natural talents and purpose."],
      ["Soul Urge", "From name vowels — heart's true desires."],
      ["Personality", "From name consonants — first impression."],
    ],
    master: "Master Numbers", masterSub: "11, 22 and 33 are Master Numbers — never reduced.",
  },
};

export default function About() {
  const { t, lang } = useLanguage();
  const T = TX[lang] || TX.en;
  return (
    <div>
      <h1 className="text-gradient">{t("about_title")}</h1>
      <p style={{ marginTop: 8, maxWidth: 800 }}>{T.sub}</p>

      <section style={{ marginTop: 30 }}>
        <h2>{T.how}</h2>
        <div className="grid grid-2">
          {T.cards.map(([title, d]) => (
            <div key={title} className="card">
              <h3>{title}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>{T.master}</h2>
        <p>{T.masterSub}</p>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {[11, 22, 33].map((n) => {
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
