import React, {
  createContext, useContext, useState, useEffect, useCallback, useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations } from "./translations.js";
import { LANGUAGES, langChain, normalizeLang, fontFor } from "./registry.js";
import { siteTX } from "./siteTx.js";
import { langFromPath, pageFromPath, langPath, hasLangPrefix } from "../seo/routes.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const loc = useLocation();
  const navigate = useNavigate();

  // ── URL hi source of truth ──
  // Pehle bhasha sirf localStorage me thi, matlab Google har page par
  // sirf English dekhta tha. Ab /hi/kundli par kholne par bhasha wahin
  // se padhi jayegi — localStorage sirf tab jab URL me koi prefix nahi.
  const urlLang = hasLangPrefix(loc.pathname) ? langFromPath(loc.pathname) : null;
  const [lang, setLangState] = useState(() =>
    normalizeLang(urlLang || localStorage.getItem("nv-lang"))
  );

  // URL badli aur usme bhasha prefix aaya — bhasha badlo
  useEffect(() => {
    if (urlLang && urlLang !== lang) setLangState(normalizeLang(urlLang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlLang]);

  // ── URL ko bhasha ke hisaab se theek karo ──
  // URL me bhasha nahi hai par user ki pasand bhasha alag hai
  // (localStorage se) — to URL me prefix daal do. Warna `/` par Hindi
  // content dikhta par <title> English hota, aur Google ko wahi URL
  // English maanta. Do alag cheezein ek URL par = SEO ka nuksan.
  useEffect(() => {
    if (urlLang) return;           // pehle se prefix hai
    if (lang === "en") return;     // English ko chhod do, URL saaf rehta hai
    const page = pageFromPath(window.location.pathname) + window.location.hash;
    window.history.replaceState({}, "", langPath(page, lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlLang, lang]);

  useEffect(() => {
    localStorage.setItem("nv-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.style.setProperty("--app-font", fontFor(lang));
  }, [lang]);

  const setLang = useCallback(
    (code) => {
      const next = normalizeLang(code);
      setLangState(next);
      // URL me bhasha prefix daal do taaki page reload par bhi wahi bhasha rahe
      const page = pageFromPath(window.location.pathname) + window.location.hash;
      const target = langPath(page, next);
      if (target !== window.location.pathname) {
        window.history.replaceState({}, "", target);
      }
    },
    []
  );

  // ── internal links par bhasha prefix lagao ──
  // Poore codebase me <Link to="/kundli"> likha hai. Har ek me change
  // karne ke bajaye ek click interceptor — React Router ka <Link> bhi
  // finally ek <a href> hi banata hai, isliye yahin pakad lena sahi hai.
  // Bina iske Google /hi/kundli se /panchang par jaata aur wahan se
  // English copy index karta.
  useEffect(() => {
    function onClick(e) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;

      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (href.startsWith("/assets/") || href.startsWith("/sw.js")) return;
      if (hasLangPrefix(href)) return; // already prefixed

      // file:// ya hash-only link ko chhedna nahi
      if (href === "#" || href.startsWith("#")) return;

      e.preventDefault();
      navigate(langPath(href, lang), { replace: false });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lang, navigate]);

  // Lookup order: current bhasha -> usi script ki bhasha -> English.
  // Isliye Marathi select karne par Hindi aa sakta hai, par English nahi.
  const t = useCallback(
    (key) => {
      if (!key) return "";
      for (const code of langChain(lang)) {
        const dict = translations[code];
        const v = dict && dict[key];
        if (typeof v === "string" && v) return v;
      }
      return key;
    },
    [lang]
  );

  // Site-wide UI text (Panchang labels, Admin, Blog, Rashifal …).
  // Ye dict bhi langChain par chalti hai — koi key kabhi English par nahi giregi.
  const S = useMemo(() => siteTX(lang), [lang]);

  const value = { lang, setLang, t, LANGUAGES, S };
  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

// Sirf site dictionary chahiye to: const S = useSiteTx();
export function useSiteTx() {
  return useLanguage().S;
}

export default LanguageProvider;