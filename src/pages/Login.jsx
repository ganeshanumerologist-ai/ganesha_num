import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { isFirebaseConfigured } from "../firebase.js";

function friendlyError(err, lang) {
  const code = err?.code || "";
  const T = {
    hi: {
      key: "Firebase setup adhura hai — .env file me sahi API key dalo (README me tarika hai). Bina Firebase ke login, gallery aur booking nahi chalenge; baaki pages chalenge.",
      cred: "Email ya password galat hai. Pehle Sign Up karo.",
      used: "Ye email pehle se registered hai — Sign In karo.",
      net: "Internet connection check karo.",
    },
    mr: {
      key: "Firebase setup अपूर्ण आहे — .env मध्ये योग्य API key टाका. त्याशिवाय login चालणार नाही.",
      cred: "Email किंवा password चूक आहे. आधी Sign Up करा.",
      used: "हा email आधीच नोंदणीकृत आहे — Sign In करा.",
      net: "Internet तपासा.",
    },
    en: {
      key: "Firebase setup is incomplete — put the real API key in .env (see README). Login/gallery/booking need it.",
      cred: "Wrong email or password. Sign up first.",
      used: "This email is already registered — please sign in.",
      net: "Check your internet connection.",
    },
  }[lang] || null;
  const d = T || {
    key: "Firebase setup incomplete.", cred: "Wrong credentials.", used: "Already registered.", net: "No internet.",
  };
  if (code.includes("api-key") || code.includes("invalid-api-key") || code.includes("app-no-app") || !isFirebaseConfigured) return d.key;
  if (code.includes("invalid-credential") || code.includes("user-not-found") || code.includes("wrong-password")) return d.cred;
  if (code.includes("email-already-in-use")) return d.used;
  if (code.includes("network")) return d.net;
  return err?.message;
}

export default function Login() {
  const { user, loading, login, signup, googleLogin } = useAuth();
  const { t, lang } = useLanguage();
  const nav = useNavigate();

  // Login ke baad /login khole to dashboard bhejo
  useEffect(() => {
    if (!loading && user) nav("/dashboard");
  }, [user, loading, nav]);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(name, email, password);
      nav("/dashboard");
    } catch (err) {
      setError(friendlyError(err, lang));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError("");
    try {
      await googleLogin();
      nav("/dashboard");
    } catch (err) {
      setError(friendlyError(err, lang));
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1 className="text-gradient">{t("login_title")}</h1>
      {!isFirebaseConfigured && (
        <div className="card" style={{ marginTop: 16, borderColor: "var(--gold)" }}>
          <p style={{ color: "var(--gold)" }}>{friendlyError({ code: "auth/api-key-not-valid" }, lang)}</p>
        </div>
      )}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button className={mode === "login" ? "btn" : "btn secondary"} onClick={() => setMode("login")}>{t("sign_in")}</button>
          <button className={mode === "signup" ? "btn" : "btn secondary"} onClick={() => setMode("signup")}>{t("sign_up")}</button>
        </div>
        <form onSubmit={submit} className="grid">
          {mode === "signup" && (
            <div>
              <label className="label">{t("contact_name")}</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="label">{t("email")}</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">{t("password")}</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button className="btn" disabled={busy}>{busy ? t("loading") : mode === "login" ? t("sign_in") : t("sign_up")}</button>
        </form>
        <div style={{ marginTop: 12 }}>
          <button className="btn secondary" style={{ width: "100%" }} onClick={google}>{t("google_signin")}</button>
        </div>
        {error && <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>}
        <p style={{ marginTop: 12, fontSize: ".85rem" }}>
          <Link to="/experts" style={{ color: "var(--accent-2)" }}>{t("hero_cta2")} →</Link>
        </p>
      </div>
    </div>
  );
}
