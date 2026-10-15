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

export default function App() {
  return (
    <div className="app">
      <ScrollHash />
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/chat" element={<AiChat />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/match" element={<Compatibility />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/kundli" element={<Kundli />} />
          <Route path="/panchang" element={<Panchang />} />
          <Route path="/rashifal" element={<Rashifal />} />
          <Route path="/gochar" element={<Gochar />} />
          <Route path="/muhurat" element={<Muhurat />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/shani" element={<Shani />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/loshu" element={<Loshu />} />
          <Route path="/remedies" element={<Remedies />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
