import React, { createContext, useContext, useState, useEffect } from "react";
import { LANGUAGES, translations } from "./translations.js";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("nv-lang") || "en");

  useEffect(() => {
    localStorage.setItem("nv-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
