import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { useAdmin } from "../auth/useAdmin.js";

export default function Navbar() {
  const loc = useLocation();
  const nav = useNavigate();
  const { lang, setLang, t, LANGUAGES } = useLanguage();
  const P = pgT(lang);
  const { user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);

  const kundliLinks = [
    { to: "/calculator", label: t("nav_calculator") },
    { to: "/kundli", label: "Kundli" },
    { to: "/charts", label: "Kundli Charts" },
    { to: "/loshu", label: "Lo Shu Grid" },
    { to: "/match", label: "Milan" },
    { to: "/forecast", label: "Varshphal" },
  ];
  const jyotishLinks = [
    { to: "/panchang", label: "Panchang" },
    { to: "/rashifal", label: "Rashifal" },
    { to: "/gochar", label: "Gochar" },
    { to: "/muhurat", label: "Muhurat" },
    { to: "/reports", label: "Reports" },
    { to: "/daily", label: "Daily Lucky" },
    { to: "/calendar", label: "Calendar" },
    { to: "/blog", label: "Blog" },
  ];
  const sevaLinks = [
    { to: "/experts", label: t("nav_experts") },
    { to: "/chat", label: t("nav_chat") },
    { to: "/gallery", label: t("nav_gallery") },
  ];
  const pageLinks = [
    { to: "/about", label: t("nav_about") },
    { to: "/contact", label: t("nav_contact") },
  ];
  const phalLinks = [
    { to: "/reports#paramparik", label: P.pg_paramparik },
    { to: "/reports#jivan", label: `${P.pg_jivan}/${P.pg_masik}/${P.pg_dainik}` },
    { to: "/reports#dasha", label: `${P.pg_dasha} + KP` },
    { to: "/reports#varga", label: P.pg_varga },
    { to: "/reports#lagna", label: P.pg_lagna },
    { to: "/reports#dosh", label: P.pg_dosh },
    { to: "/reports#lalkitab", label: P.pg_lalkitab },
    { to: "/reports#ratna", label: P.pg_ratna },
    { to: "/reports", label: P.pg_nakshatra },
  ];
  if (user) pageLinks.push({ to: "/dashboard", label: t("nav_dashboard") });
  if (isAdmin) pageLinks.push({ to: "/admin", label: "Admin" });

  const active = (to) => (loc.pathname === to ? "active" : "");
  const groupActive = (arr) => (arr.some((l) => loc.pathname === l.to) ? "active" : "");
  const close = () => setOpen(false);

  const onLogout = async () => {
    await logout();
    close();
    nav("/");
  };

  const Drop = ({ label, links }) => (
    <div className={`nav-item ${groupActive(links)}`}>
      <span className="nav-label">{label} ▾</span>
      <div className="dropdown">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={active(l.to)} onClick={close}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="inner">
        <Link to="/" className="brand" onClick={close}>
          <img src="/logo.svg" alt="logo" style={{ width: 34, height: 34, verticalAlign: "middle" }} />
          <span className="text-gradient" style={{ marginLeft: 8 }}>{t("app_name")}</span>
        </Link>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          <Link to="/" className={active("/")} onClick={close}>{t("nav_home")}</Link>
          <Drop label="Kundli" links={kundliLinks} />
          <Drop label="Phaladesh" links={phalLinks} />
          <Drop label="Jyotish" links={jyotishLinks} />
          <Drop label={t("nav_experts")} links={sevaLinks} />
          {pageLinks.map((l) => (
            <Link key={l.to} to={l.to} className={active(l.to)} onClick={close}>
              {l.label}
            </Link>
          ))}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="lang-select"
            title={t("language")}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.native}</option>
            ))}
          </select>
          {user ? (
            <button className="btn secondary" style={{ padding: "8px 14px" }} onClick={onLogout}>
              {t("nav_logout")}
            </button>
          ) : (
            <Link to="/login" className={active("/login")} onClick={close}>
              {t("nav_login")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
