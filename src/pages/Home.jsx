import React from "react";
import { Link } from "react-router-dom";
import { NUMBER_MEANINGS } from "../data/meanings.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Home() {
  const { t } = useLanguage();
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
          <Link to="/kundli" className="btn">Kundli Kholo</Link>
          <Link to="/reports" className="btn secondary">Reports</Link>
          <Link to="/match" className="btn secondary">Milan</Link>
          <Link to="/daily" className="btn secondary">Daily Lucky</Link>
          <Link to="/experts" className="btn secondary">{t("hero_cta2")}</Link>
          <Link to="/chat" className="btn secondary">{t("nav_chat")}</Link>
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2 style={{ textAlign: "center" }}>Core Numbers We Compute</h2>
        <div className="grid grid-3">
          {[
            ["Life Path", "The core lesson and direction of your life."],
            ["Destiny", "Your natural talents and life purpose from your name."],
            ["Soul Urge", "Your inner desires and your heart's true calling."],
            ["Personality", "How the world sees you at first glance."],
            ["Birthday", "Special talents you bring into this life."],
            ["Attitude", "How you approach life and new situations."],
          ].map(([title, d]) => (
            <div key={title} className="card">
              <h3>{title}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 50 }}>
        <h2 style={{ textAlign: "center" }}>Explore Number Energies</h2>
        <div className="grid grid-3">
          {featured.map((n) => {
            const m = NUMBER_MEANINGS[n];
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
