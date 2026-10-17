import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Calculator from "./pages/Calculator.jsx";
import Gallery from "./pages/Gallery.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Experts from "./pages/Experts.jsx";
import AiChat from "./pages/AiChat.jsx";
import Forecast from "./pages/Forecast.jsx";
import Compatibility from "./pages/Compatibility.jsx";
import Daily from "./pages/Daily.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Calendar from "./pages/Calendar.jsx";
import Kundli from "./pages/Kundli.jsx";
import Panchang from "./pages/Panchang.jsx";
import Rashifal from "./pages/Rashifal.jsx";
import Gochar from "./pages/Gochar.jsx";
import Muhurat from "./pages/Muhurat.jsx";
import Reports from "./pages/Reports.jsx";
import Shani from "./pages/Shani.jsx";
import Charts from "./pages/Charts.jsx";
import Loshu from "./pages/Loshu.jsx";
import Remedies from "./pages/Remedies.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import { OnlyLoggedIn } from "./components/RequireAuth.jsx";
import { useLanguage } from "./i18n/LanguageContext.jsx";

import Admin from "./pages/Admin.jsx";

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

function NotFound() {
  // React component hai, to hook seedha yahin call ho sakta hai
  const { S } = useLanguage();
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
      <ScrollHash />
      <Navbar />
      <main className="main">
        <Routes>
          {/* ── Bina login sirf ye teen: home, login, 404 ── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* ── Login ke baad hi kholti hain ── */}
          <Route path="/calculator" element={<OnlyLoggedIn><Calculator /></OnlyLoggedIn>} />
          <Route path="/gallery" element={<OnlyLoggedIn><Gallery /></OnlyLoggedIn>} />
          <Route path="/dashboard" element={<OnlyLoggedIn><Dashboard /></OnlyLoggedIn>} />
          <Route path="/experts" element={<OnlyLoggedIn><Experts /></OnlyLoggedIn>} />
          <Route path="/chat" element={<OnlyLoggedIn><AiChat /></OnlyLoggedIn>} />
          <Route path="/forecast" element={<OnlyLoggedIn><Forecast /></OnlyLoggedIn>} />
          <Route path="/match" element={<OnlyLoggedIn><Compatibility /></OnlyLoggedIn>} />
          <Route path="/daily" element={<OnlyLoggedIn><Daily /></OnlyLoggedIn>} />
          <Route path="/calendar" element={<OnlyLoggedIn><Calendar /></OnlyLoggedIn>} />
          <Route path="/kundli" element={<OnlyLoggedIn><Kundli /></OnlyLoggedIn>} />
          <Route path="/panchang" element={<OnlyLoggedIn><Panchang /></OnlyLoggedIn>} />
          <Route path="/rashifal" element={<OnlyLoggedIn><Rashifal /></OnlyLoggedIn>} />
          <Route path="/gochar" element={<OnlyLoggedIn><Gochar /></OnlyLoggedIn>} />
          <Route path="/muhurat" element={<OnlyLoggedIn><Muhurat /></OnlyLoggedIn>} />
          <Route path="/reports" element={<OnlyLoggedIn><Reports /></OnlyLoggedIn>} />
          <Route path="/shani" element={<OnlyLoggedIn><Shani /></OnlyLoggedIn>} />
          <Route path="/charts" element={<OnlyLoggedIn><Charts /></OnlyLoggedIn>} />
          <Route path="/loshu" element={<OnlyLoggedIn><Loshu /></OnlyLoggedIn>} />
          <Route path="/remedies" element={<OnlyLoggedIn><Remedies /></OnlyLoggedIn>} />
          <Route path="/admin" element={<OnlyLoggedIn><Admin /></OnlyLoggedIn>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
