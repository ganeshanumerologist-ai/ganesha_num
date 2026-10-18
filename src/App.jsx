import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Blog from "./pages/Blog.jsx";

// ─────────────────────────────────────────────────────────────
//  CODE SPLITTING
//
//  Pehle sab pages ek saath import hote the — kundli kholne par
//  reports + chat + admin + sab utils ek saath 3.2 MB download hote
//  the. Ab har page sirf tab load hota hai jab chahiye.
//
//  Home/About/Contact/Login/Blog turant load hote hain (landing page
//  + sitemap ke main URLs) taaki pehla paint fast rahe.
// ─────────────────────────────────────────────────────────────
const Calculator = lazy(() => import("./pages/Calculator.jsx"));
const Gallery = lazy(() => import("./pages/Gallery.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Experts = lazy(() => import("./pages/Experts.jsx"));
const AiChat = lazy(() => import("./pages/AiChat.jsx"));
const Forecast = lazy(() => import("./pages/Forecast.jsx"));
const Compatibility = lazy(() => import("./pages/Compatibility.jsx"));
const Daily = lazy(() => import("./pages/Daily.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const Calendar = lazy(() => import("./pages/Calendar.jsx"));
const Kundli = lazy(() => import("./pages/Kundli.jsx"));
const Panchang = lazy(() => import("./pages/Panchang.jsx"));
const Rashifal = lazy(() => import("./pages/Rashifal.jsx"));
const Gochar = lazy(() => import("./pages/Gochar.jsx"));
const Muhurat = lazy(() => import("./pages/Muhurat.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
const Shani = lazy(() => import("./pages/Shani.jsx"));
const Charts = lazy(() => import("./pages/Charts.jsx"));
const Loshu = lazy(() => import("./pages/Loshu.jsx"));
const Remedies = lazy(() => import("./pages/Remedies.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import Breadcrumb from "./components/Breadcrumb.jsx";
import { OnlyLoggedIn } from "./components/RequireAuth.jsx";
import { useLanguage } from "./i18n/LanguageContext.jsx";
import Seo from "./seo/Seo.jsx";
import { LANG_CODES, langPath } from "./seo/routes.js";

// ─────────────────────────────────────────────────────────────
//  PAGE TABLE
//
//  Ek hi list se do cheezein banti hain:
//    1. <Routes> — har page ke liye route
//    2. har page ke liye 22 bhasha wale route (/hi/kundli …)
//
//  Pehle sirf 25 route the, matlab Google ke paas 22 bhasha ka
//  content hi nahi tha. Ab 25 × 23 = 575 URL hain.
// ─────────────────────────────────────────────────────────────

// Bina login ye khulti hain
const OPEN = [
  { path: "/", el: <Home /> },
  { path: "/login", el: <Login /> },
  { path: "/about", el: <About /> },
  { path: "/contact", el: <Contact /> },
  { path: "/blog", el: <Blog /> },
  { path: "/blog/:id", el: <BlogPost /> },
];

// Login ke baad hi
const LOCKED = [
  { path: "/calculator", el: <Calculator /> },
  { path: "/gallery", el: <Gallery /> },
  { path: "/dashboard", el: <Dashboard /> },
  { path: "/experts", el: <Experts /> },
  { path: "/chat", el: <AiChat /> },
  { path: "/forecast", el: <Forecast /> },
  { path: "/match", el: <Compatibility /> },
  { path: "/daily", el: <Daily /> },
  { path: "/calendar", el: <Calendar /> },
  { path: "/kundli", el: <Kundli /> },
  { path: "/panchang", el: <Panchang /> },
  { path: "/rashifal", el: <Rashifal /> },
  { path: "/gochar", el: <Gochar /> },
  { path: "/muhurat", el: <Muhurat /> },
  { path: "/reports", el: <Reports /> },
  { path: "/shani", el: <Shani /> },
  { path: "/charts", el: <Charts /> },
  { path: "/loshu", el: <Loshu /> },
  { path: "/remedies", el: <Remedies /> },
  { path: "/admin", el: <Admin /> },
];

const ALL_PAGES = [...OPEN, ...LOCKED];

// English page ka path hi rehta hai; baaki 21 bhasha ke liye prefix lagta hai.
// `en` chhod diya hai kyunki uska prefix URL hi wahi rehta hai.
const OTHER_LANGS = LANG_CODES.filter((c) => c !== "en");

function ScrollHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = hash.slice(1);
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(timer);
      } else if (++tries > 10) {
        clearInterval(timer);
      }
    }, 300);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  return null;
}

/**
 * Lazy page ka skeleton.
 *
 * Code split karne ke baad pehli visit par page ka chunk download hota
 * hai — 100-300 ms ke liye kuch na dikhe to user ko lagta hai site
 * hang ho gayi. Ye halka placeholder us gap ko bhar deta hai.
 */
function PageLoading() {
  const { S } = useLanguage();
  return (
    <div
      className="card nv-skel"
      style={{ padding: 40, textAlign: "center", marginTop: 20 }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="spinner" aria-hidden="true" />
      <p style={{ marginTop: 14, color: "var(--muted)" }}>{S.nav_jyotish || "…"}</p>
    </div>
  );
}

function NotFound() {
  // React component hai, to hook seedha yahin call ho sakta hai
  const { S } = useLanguage();

  // 404 ko Google kabhi kabhi "soft 404" samajh kar index kar leta hai.
  // Usse rokne ke liye robots meta yahin inject karte hain — Seo
  // component is page par meta overwrite kar dega, isliye iska tag
  // alag data attribute rakha hai aur use baad me set hota hai.
  useEffect(() => {
    let el = document.head.querySelector('meta[name="robots"][data-404]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "robots");
      el.setAttribute("data-404", "1");
      document.head.appendChild(el);
    }
    el.setAttribute("content", "noindex, follow");
    return () => el.remove();
  }, []);

  return (
    <div className="card" style={{ padding: 40, textAlign: "center", marginTop: 20 }}>
      <h1 style={{ fontSize: "3rem", margin: 0 }}>404</h1>
      <p>{S.gate_notfound}</p>
      <a className="btn" href="/">{S.gate_home}</a>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      {/* Har page par title, description, OG, hreflang aur JSON-LD.
          URL se bhasha padhta hai — /hi/kundli par Hindi meta. */}
      <Seo />
      <ScrollHash />
      <Navbar />
      <main className="main">
        <div className="nv-crumb-wrap">
          <Breadcrumb />
        </div>
        {/* Lazy pages ka download ho raha ho — tab tak skeleton */}
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* ── Bina login: home, login, about, contact, blog ── */}
            {OPEN.map((p) => (
              <Route key={"o" + p.path} path={p.path} element={p.el} />
            ))}

            {/* ── Login ke baad hi kholti hain ── */}
            {LOCKED.map((p) => (
              <Route
                key={"l" + p.path}
                path={p.path}
                element={<OnlyLoggedIn>{p.el}</OnlyLoggedIn>}
              />
            ))}

            {/* ── 21 bhasha wale versions ──
                 element wahi hai, sirf path badla — isliye /hi/kundli
                 par bhi wahi Kundli component chalta hai aur bhasha URL
                 se padhi jati hai. */}
            {OTHER_LANGS.map((code) =>
              OPEN.map((p) => (
                <Route key={`${code}${p.path}`} path={langPath(p.path, code)} element={p.el} />
              ))
            )}
            {OTHER_LANGS.map((code) =>
              LOCKED.map((p) => (
                <Route
                  key={`${code}L${p.path}`}
                  path={langPath(p.path, code)}
                  element={<OnlyLoggedIn>{p.el}</OnlyLoggedIn>}
                />
              ))
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}