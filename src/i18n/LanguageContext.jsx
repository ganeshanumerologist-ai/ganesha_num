import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "./translations.js";
import { LANGUAGES, langChain, normalizeLang, fontFor } from "./registry.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => normalizeLang(localStorage.getItem("nv-lang")));

  useEffect(() => {
    localStorage.setItem("nv-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.style.setProperty("--app-font", fontFor(lang));
  }, [lang]);

  const setLang = useCallback((code) => {
    setLangState(normalizeLang(code));
  }, []);

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

  const value = { lang, setLang, t, LANGUAGES };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export default LanguageProvider;