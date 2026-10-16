import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import shaniTX from "../i18n/shani.js";
import { langChain } from "../i18n/registry.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { useAdmin } from "../auth/useAdmin.js";
import Logo3D from "./Logo3D.jsx";

export default function Navbar() {
  const loc = useLocation();
  const nav = useNavigate();
  const { lang, setLang, t, LANGUAGES } = useLanguage();
  const P = pgT(lang);
  const shTitle = (() => {
    for (const c of langChain(lang)) {
      const d = shaniTX[c];
      if (d && d.sh_nav && d !== shaniTX.en) return d.sh_nav;
    }
    return t("nav_shani_title");
  })();
  const { user, logout, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);

  const kundliLinks = [
    { to: "/calculator", label: t("nav_calculator") },
    { to: "/kundli", label: t("nav_kundli_page") },
    { to: "/charts", label: t("nav_charts") },
    { to: "/loshu", label: t("nav_loshu") },
    { to: "/match", label: t("nav_match") },
    { to: "/forecast", label: t("nav_varshphal") },
  ];
  const jyotishLinks = [
    { to: "/panchang", label: t("nav_panchang") },
    { to: "/rashifal", label: t("nav_rashifal") },
    { to: "/gochar", label: t("nav_gochar") },
    { to: "/shani", label: shTitle },
    { to: "/muhurat", label: t("nav_muhurat") },
    { to: "/reports", label: t("nav_reports") },
    { to: "/remedies", label: t("nav_remedies") },
    { to: "/daily", label: t("nav_daily") },
    { to: "/calendar", label: t("nav_calendar") },
    { to: "/blog", label: t("nav_blog") },
  ];
  const sevaLinks = [
    { to: "/experts", label: t("nav_experts") },
    { to: "/chat", label: t("nav_chat") },
    { to: "/gallery", label: t("nav_gallery") },
  ];
  const pageLinks = [
    { to: "/loshu", label: t("nav_grid") },
    { to: "/panchang", label: t("nav_panchang") },
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
  if (isAdmin) pageLinks.push({ to: "/admin", label: t("nav_admin") });

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
          <Logo3D size={34} />
          <span className="text-gradient" style={{ marginLeft: 8 }}>{t("app_name")}</span>
        </Link>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          <Link to="/" className={active("/")} onClick={close}>{t("nav_home")}</Link>
          <Drop label={t("nav_kundli")} links={kundliLinks} />
          <Drop label={t("nav_phaladesh")} links={phalLinks} />
          <Drop label={t("nav_jyotish")} links={jyotishLinks} />
          <Drop label={t("nav_experts")} links={sevaLinks} />
          {pageLinks.map((l) => (
            <Link key={l.to} to={l.to} className={active(l.to)} onClick={close}>
              {l.label}
            </Link>
          ))}
          <span className="lang-wrap" title={t("language")}>
            🌐 {t("language")}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="lang-select"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.native}</option>
              ))}
            </select>
          </span>
          {user ? (
            <button className="btn secondary" style={{ padding: "8px 14px" }} onClick={onLogout}>
              {t("nav_logout")}
            </button>
          ) : loading ? (
            <span style={{ padding: "8px 14px", color: "var(--muted)" }}>…</span>
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
