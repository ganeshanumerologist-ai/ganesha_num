import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { isFirebaseConfigured } from "../firebase.js";

const ERR_TX = {
  en: {
    key: "Firebase setup is incomplete — put the real API key in .env (see README). Login/gallery/booking need it.",
    cred: "Wrong email or password. Sign up first.",
    used: "This email is already registered — please sign in.",
    net: "Check your internet connection.",
  },
  hi: {
    key: "Firebase सेटअप अधूरा है — .env फ़ाइल में सही API key डालें (README में तरीका है)। इसके बिना लॉगिन, गैलरी और बुकिंग नहीं चलेंगी; बाकी पेज चलेंगे।",
    cred: "ईमेल या पासवर्ड गलत है। पहले साइन अप करें।",
    used: "यह ईमेल पहले से रजिस्टर्ड है — साइन इन करें।",
    net: "इंटरनेट कनेक्शन जाँचें।",
  },
  mr: {
    key: "Firebase सेटअप अपूर्ण आहे — .env फाइलमध्ये योग्य API key टाका (README मध्ये पद्धत आहे). त्याशिवाय लॉगिन, गॅलरी आणि बुकिंग चालणार नाहीत; इतर पाने चालतील.",
    cred: "ईमेल किंवा पासवर्ड चूक आहे. आधी साइन अप करा.",
    used: "हा ईमेल आधीच नोंदणीकृत आहे — साइन इन करा.",
    net: "इंटरनेट कनेक्शन तपासा.",
  },
  bn: {
    key: "Firebase সেটআপ অসম্পূর্ণ — .env ফাইলে সঠিক API key দিন (README-এ পদ্ধতি আছে)। এটি ছাড়া লগইন, গ্যালারি ও বুকিং কাজ করবে না; বাকি পেজ চলবে।",
    cred: "ইমেইল বা পাসওয়ার্ড ভুল। আগে সাইন আপ করুন।",
    used: "এই ইমেইল আগেই নিবন্ধিত — সাইন ইন করুন।",
    net: "ইন্টারনেট সংযোগ পরীক্ষা করুন।",
  },
  te: {
    key: "Firebase సెటప్ అసంపూర్ణం — .env ఫైల్‌లో సరైన API key పెట్టండి (README‌లో విధానం ఉంది). దీని లేకుండా లాగిన్, గ్యాలరీ, బుకింగ్ పనిచేయవు; మిగిలిన పేజీలు పనిచేస్తాయి.",
    cred: "ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు. ముందుగా సైన్ అప్ చేయండి.",
    used: "ఈ ఇమెయిల్ ఇప్పటికే నమోదు చేసబడింది — సైన్ ఇన్ చేయండి.",
    net: "ఇంటర్‌నెట్ కనెక్షన్ పరిశీలించండి.",
  },
  ta: {
    key: "Firebase அமைப்பு முழுமையாக இல்லை — .env கோப்பில் சரியான API key இடவும் (README-இல் முறை உள்ளது). இது இல்லாமல் லொகின், கேலரி, பதிவு ஆகியவை இயங்காது; மற்ற பக்கங்கள் இயங்கும்.",
    cred: "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறு. முதலில் பதிவு செய்யுங்கள்.",
    used: "இந்த மின்னஞ்சல் ஏற்கனவே பதிவானது — உள்நுழையுங்கள்.",
    net: "இணைய இணைப்பை சரிபார்க்கவும்.",
  },
  gu: {
    key: "Firebase સેટઅપ અપૂર્ણ છે — .env ફાઇલમાં સાચી API key મૂકો (README માં રીત છે). વગર લોગિન, ગેલરી અને બુકિંગ ચલશે નહીં; બાકીના પાના ચલશે.",
    cred: "ઈમેલ કે પાસવર્ડ ખોટો છે. પહેલા સાઇન અપ કરો.",
    used: "આ ઈમેલ પહેલેથી નોંધાયેલો છે — સાઇન ઇન કરો.",
    net: "ઇન્ટરનેટ કનેક્શન તપાસો.",
  },
  ur: {
    key: "Firebase سیٹ اپ مکمل نہیں — .env فائل میں درست API key رکھیں (README میں طریقہ ہے)۔ اس کے بغیر لاگ ان، گیلری اور بکنگ نہیں چلے گی؛ باقی صفحات چلیں گے۔",
    cred: "ای میل یا پاس ورڈ غلط ہے۔ پہلے سائن اَپ کریں۔",
    used: "یہ ای میل پہلے سے رجسٹرڈ ہے — سائن اِن کریں۔",
    net: "انٹرنیٹ کنکشن چیک کریں۔",
  },
  kn: {
    key: "Firebase ಸೆಟಪ್ ಅಪೂರ್ಣವಾಗಿದೆ — .env ಫೈಲ್‌ನಲ್ಲಿ ಸರಿಯಾದ API key ಇಡಿ (README ನಲ್ಲಿ ವಿಧಾನವಿದೆ). ಇದಿಲ್ಲದೆ ಲಾಗಿನ್, ಗ್ಯಾಲರಿ ಮತ್ತು ಬುಕಿಂಗ್ ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ; ಉಳಿದ ಪುಟಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ.",
    cred: "ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ. ಮೊದಲು ಸೈನ್ ಅಪ್ ಮಾಡಿ.",
    used: "ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿತು — ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    net: "ಇಂಟರ್ನೆಟ್ ಕನೆಕ್ಷನ್ ಪರಿಶೀಲಿಸಿ.",
  },
  ml: {
    key: "Firebase സജ്ജിമൻ പൂർത്തിയല്ല — .env ഫയലിൽ ശരിയായ API key ഇടുക (README-ൽ മാർഗം ഉണ്ട്). ഇതില്ലാതെ ലോഗിൻ, ഗാളറി, ബുക്കിംഗ് പ്രവർത്തിക്കില്ല; ബാക്കി പേജുകൾ പ്രവർത്തിക്കും.",
    cred: "ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ് തെറ്റാണ്. ആദ്യം സൈൻ അപ്പ് ചെയ്യുക.",
    used: "ഈ ഇമെയിൽ മുമ്പ് തന്നെ രജിസ്റ്റർ ചെയ്തിരിക്കുന്നു — ലോഗിൻ ചെയ്യുക.",
    net: "ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.",
  },
  pa: {
    key: "Firebase ਸੈਟਅੱਪ ਅਧੂਰਾ ਹੈ — .env ਫਾਈਲ ਵਿੱਚ ਸਹੀ API key ਪਾਓ (README ਵਿੱਚ ਤਰੀਕਾ ਹੈ)। ਇਸ ਬਿਨਾਂ ਲੌਗਿਨ, ਗੈਲਰੀ ਅਤੇ ਬੁਕਿੰਗ ਨਹੀਂ ਚੱਲੇਗੀ; ਬਾਕੀ ਪੰਨੇ ਚੱਲਣਗੇ।",
    cred: "ਈਮੇਲ ਜਾਂ ਪਾਸਵਰਡ ਗਲਤ ਹੈ। ਪਹਿਲਾਂ ਸਾਈਨ ਅੱਪ ਕਰੋ।",
    used: "ਇਹ ਈਮੇਲ ਪਹਿਲਾਂ ਤੋਂ ਰਜਿਸਟਰਡ ਹੈ — ਸਾਈਨ ਇਨ ਕਰੋ।",
    net: "ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ।",
  },
  or: {
    key: "Firebase ସେଟଅପ ଅସମ୍ପୂର୍ଣ୍ଣ — .env ଫାଇଲରେ ସଠିକ୍ API key ରଖନ୍ତୁ (READMEରେ ପଦ୍ଧତି ଅଛି)। ଏହା ବିନା ଲଗଇନ, ଗେଲରୀ ଓ ବୁକିଂ ଚଲିବ ନାହିଁ; ବାକୀ ପୃଷ୍ଠା ଚଲିବ।",
    cred: "ଇମେଲ କିମ୍ବା ପାସୱାର୍ଡ ଭୁଲ। ପ୍ରଥମେ ସାଇନ ଅପ୍ କରନ୍ତୁ।",
    used: "ଏହି ଇମେଲ ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ — ସାଇନ ଇନ୍ କରନ୍ତୁ।",
    net: "ଇଣ୍ଟରନେଟ୍ ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ।",
  },
  as: {
    key: "Firebase ছেটআপ অসম্পূৰ্ণ — .env ফাইলত সঠিক API key দিয়ক (READMEত পথ দেখুওঁ)। এইখন নহ’লে লগইন, গেলাৰী আৰু বুকিং চলিব না; বাকী পৃষ্ঠাবোৰ চলিব।",
    cred: "ইমেইল বা পাছৱৰ্ড ভুল। প্ৰথমে ছাইন আপ কৰক।",
    used: "এই ইমেইল আগৰে পঞ্জীয়ন কৰা আছে — ছাইন ইন কৰক।",
    net: "ইণ্টাৰনেট সংযোগ পৰীক্ষা কৰক।",
  },
};

function friendlyError(err, lang) {
  const code = err?.code || "";
  const d = pageTX(ERR_TX, lang);
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
