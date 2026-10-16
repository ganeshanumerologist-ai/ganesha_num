import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { loadProfile } from "../profile/profile.js";
import { getMeaning } from "../data/meanings_all.js";
import JyotishBackdrop from "../components/JyotishBackdrop.jsx";
import { numSecTX } from "../i18n/numSecTx.js";

// NOTE: Sankhya (numbers) ab LANDING par nahi dikhti.
// Rule: 9 ankabhi tab dikhenge jab —
//   1. user login ho,
//   2. apna data (naam + janm tithi) de chuka ho,
//   3. aur apne hisaab se chun raha ho ki kya dekha hai.
// Landing par sankhya sirf background art me dikhti hain
// (mandala chakra + kundali chart) — wahi halka hai.

const TILES = {
  hi: [
    ["🕉️", "कुंडली", "जन्म से पूरी कुंडली, दशा और भविष्यवाणी।", "/kundli"],
    ["✨", "राशिफल", "आज, हफ्ते और महीने का पूरा भविष्यवाणी।", "/rashifal"],
    ["📅", "पंचांग", "तिथि, नक्षत्र, योग, करण और शुभ समय।", "/panchang"],
    ["🔢", "लो शु ग्रिड", "आपके योग, क्रिस्टल और साल का फल।", "/loshu"],
    ["📊", "रिपोर्ट", "विस्तृत रिपोर्ट और ग्राफ़्स।", "/reports"],
    ["🌟", "डेली लकी", "रोज़ का शुभ समय और भाग्य।", "/daily"],
  ],
  mr: [
    ["🕉️", "कुंडली", "जन्मापासून संपूर्ण कुंडली, दशा आणि भविष्यवाचन.", "/kundli"],
    ["✨", "राशिफल", "आज, आठवडा आणि महिन्याचे पूर्ण भविष्यवाचन.", "/rashifal"],
    ["📅", "पंचांग", "तिथी, नक्षत्र, योग, करण आणि शुभ वेळ.", "/panchang"],
    ["🔢", "लो शु ग्रिड", "तुमचे योग, रत्न आणि वर्षाचा निकाल.", "/loshu"],
    ["📊", "रिपोर्ट", "सविस्तर अहवाल आणि आलेख.", "/reports"],
    ["🌟", "डेली लकी", "रोजची शुभ वेळ आणि नशीब.", "/daily"],
  ],
  bn: [
    ["🕉️", "কুণ্ডলী", "জন্ম থেকে সম্পূর্ণ কুণ্ডলী, দশা ও ভবিষ্যৎবাণী।", "/kundli"],
    ["✨", "রাশিফল", "আজ, সপ্তাহ ও মাসের সম্পূর্ণ ভবিষ্যৎবাণী।", "/rashifal"],
    ["📅", "পঞ্চাঙ্গ", "তিথি, নক্ষত্ৰ, যোগ, কর্ণ ও শুভ সময়।", "/panchang"],
    ["🔢", "লো শু গ্ৰিড", "আপোনাৰ যোগ, মুক্ত আৰু বছৰৰ ফলাফল।", "/loshu"],
    ["📊", "পৰিদৰ্তন", "বিস্তৃত পৰিদৰ্তন আৰু চাৰ্ট।", "/reports"],
    ["🌟", "দৈনিক লাকি", "দৈনিক শুভ সময় আৰু ভাগ্য।", "/daily"],
  ],
  te: [
    ["🕉️", "కుండలి", "జన్మ నుండి పూర్తి కుండలి, దశ మరియు భవిష్యత్.", "/kundli"],
    ["✨", "రాశిఫల్", "ఈరోజు, వారం, నెల వారాల కంపూర్ణ భవిష్యత్.", "/rashifal"],
    ["📅", "పంచాంగం", "తిథి, నక్షత్రం, యోగం, కరణం, శుభ సమయం.", "/panchang"],
    ["🔢", "లో షూ గ్రిడ్", "మీ యోగం, రత్నం మరియు సంవత్సర ఫలితం.", "/loshu"],
    ["📊", "నివేదికలు", "విస్తృత నివేదికలు మరియు చార్టులు.", "/reports"],
    ["🌟", "డైలీ లకీ", "రోజువారీ శుభ సమయం మరియు భాగ్యం.", "/daily"],
  ],
  ta: [
    ["🕉️", "குண்டளி", "பிறப்பு முதல் முழுக் குண்டளி, தசை மற்றும் எதிர்காலம்.", "/kundli"],
    ["✨", "ராசிபல்", "இன்று, வாரம், மாதம் முழு எதிர்கால விவரம்.", "/rashifal"],
    ["📅", "பஞ்சாங்கம்", "திதி, நட்சத்திரம், யோகம், கரணம், நல் நேரம்.", "/panchang"],
    ["🔢", "லோ சு கிரிட்", "உங்கள் யோகம், ரத்தினம் மற்றும் ஆண்டு பலன்.", "/loshu"],
    ["📊", "அறிக்கைகள்", "விரிவான அறிக்கைகள் மற்றும் வரைபடங்கள்.", "/reports"],
    ["🌟", "தினசரி அதிர்வீடி", "தினசரி நல் நேரம் மற்றும் வீடு.", "/daily"],
  ],
  gu: [
    ["🕉️", "કુંડલી", "જન્મથી સંપૂર્ણ કુંડલી, દશા અને ભવિષ્યવાણી.", "/kundli"],
    ["✨", "રાશિફલ", "આજે, અઠવાડિયું અને મહિનાનું પૂર્ણ ભવિષ્યવાણી.", "/rashifal"],
    ["📅", "પંચાઙ", "તિથિ, નક્ષત્ર, યોગ, કર્ણ અને શુભ સમય.", "/panchang"],
    ["🔢", "લો શુ ગ્રિડ", "તમારા યોગ, રત્ન અને વર્ષનું ફળિત.", "/loshu"],
    ["📊", "રિપોર્ટ", "વિસ્તૃત અહેવાલ અને ચાર્ટ.", "/reports"],
    ["🌟", "ડેઇલી લકી", "રોજનું શુભ સમય અને નસીબ.", "/daily"],
  ],
  ur: [
    ["🕉️", "کنڈلی", "پیدائش سے مکمل کنڈلی، دشا اور مستقبل۔", "/kundli"],
    ["✨", "راشی فال", "آج، ہفتے اور مہینے کا مکمل futur۔", "/rashifal"],
    ["📅", "پنچنگ", "تیتھی، نکشتر، یوگ، کرن اور مبارک وقت۔", "/panchang"],
    ["🔢", "لو شو گرڈ", "آپ کے یوگ،Crystal اور سال کا نتیجہ۔", "/loshu"],
    ["📊", "رپورٹ", "تفصیلی رپورٹ اور چارٹس۔", "/reports"],
    ["🌟", "روزانہ قسمت", "روز کا مبارک وقت اور قسمت۔", "/daily"],
  ],
  kn: [
    ["🕉️", "ಕುಂಡಲಿ", "ಜನನದಿಂದ ಪೂರ್ಣ ಕುಂಡಲಿ, ದಶೆ ಮತ್ತು ಭವಿಷ್ಯ.", "/kundli"],
    ["✨", "ರಾಶಿಫಲ", "ಇಂದು, ವಾರ ಮತ್ತು ತಿಂಗಡದ ಪೂರ್ಣ ಭವಿಷ್ಯ.", "/rashifal"],
    ["📅", "ಪಂಚಾಂಗ", "ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರ್ಣ ಮತ್ತು ಶುಭ ಸಮಯ.", "/panchang"],
    ["🔢", "ಲೋ ಶೂ ಗ್ರಿಡ್", "ನಿಮ್ಮ ಯೋಗ, ರತ್ನ ಮತ್ತು ವರ್ಷದ ಫಲಿತ.", "/loshu"],
    ["📊", "ವರದಿ", "ವಿಸ್ತರಿತ ವರದಿ ಮತ್ತು ಚಾರ್ಟ್.", "/reports"],
    ["🌟", "ದೈನಂದಿನ ಅದೃಷ್ಟ", "ದಿನದ ಶುಭ ಸಮಯ ಮತ್ತು ನಸಿಬು.", "/daily"],
  ],
  ml: [
    ["🕉️", "കുണ്ഡളി", "ജനനം മുതൽ പൂർണ്ണ കുണ്ടളി, ദശയും ഭാവിയും.", "/kundli"],
    ["✨", "രാശിഫലം", "ഇന്ന്, ആഴ്ച, മാസം — പൂർണ്ണ ഭാവിദാനം.", "/rashifal"],
    ["📅", "പഞ്ചാങ്ഗം", "തിഥി, നക്ഷത്രം, യോഗം, കരണം, നല്ല സമയം.", "/panchang"],
    ["🔢", "ലോ ഷൂ ഗ്രിഡ്", "നിങ്ങളുടെ യോഗം, രത്നം, വർഷഫലം.", "/loshu"],
    ["📊", "റിപ്പോർട്ടുകൾ", "വിശതരിച്ച റിപ്പോർട്ടുകളും ചാർട്ടുകളും.", "/reports"],
    ["🌟", "ദിനംദി ഭാഗ്യവാന്", "ദിവസംദി നല്ല സമയവും ഭാഗ്യവും.", "/daily"],
  ],
  pa: [
    ["🕉️", "ਕੁੰਡਲੀ", "ਜਨਮ ਤੋਂ ਪੂਰੀ ਕੁੰਡਲੀ, ਦਸ਼ਾ ਅਤੇ ਭਵਿਸ਼ਿਆਤਬਾਣੀ।", "/kundli"],
    ["✨", "ਰਾਸ਼ੀਫਲ", "ਅੱਜ, ਹਫ਼ਤੇ ਅਤੇ ਮਹੀਨੇ ਦਾ ਪੂਰਾ ਭਵਿਸ਼ਿਆਤਬਾਣੀ।", "/rashifal"],
    ["📅", "ਪੰਚਾਂਗ", "ਤਿਥੀ, ਨਛੱਤਰ, ਯੋਗ, ਕਰਨ ਅਤੇ ਸ਼ੁਭ ਸਮਾਂ।", "/panchang"],
    ["🔢", "ਲੋ ਸ਼ੂ ਗ੍ਰਿਡ", "ਤੁਹਾਡੇ ਯੋਗ, ਰੱਤਨ ਅਤੇ ਸਾਲ ਦਾ ਨਤੀਜਾ।", "/loshu"],
    ["📊", "ਰਿਪੋਰਟ",  "ਵਿਸ਼ਾਲ ਰਿਪੋਰਟ ਅਤੇ ਚਾਰਟ।", "/reports"],
    ["🌟", "ਰੋਜ਼ਾਨਾ ਖ਼ੁਸ਼ਕਤ", "ਰੋਜ਼ ਦਾ ਸ਼ੁਭ ਸਮਾਂ ਅਤੇ ਕਿਸਮਤ।", "/daily"],
  ],
  or: [
    ["🕉️", "କୁଣ୍ଡଳୀ", "ଜନ୍ମଠାରୁ ସମ୍ପୂର୍ଣ୍ଣ କୁଣ୍ଡଳୀ, ଦଶା ଓ ଭବିଷ୍ୟବାଣୀ।", "/kundli"],
    ["✨", "ରାଶିଫଲ", "ଆଜି, ସପ୍ତାହ ଓ ମାସର ସମ୍ପୂର୍ଣ୍ଣ ଭବିଷ୍ୟବାଣୀ।", "/rashifal"],
    ["📅", "ପଞ୍ଚାଙ୍ଗ", "ତିଥି, ନକ୍ଷତ୍ର, ଯୋଗ, କର୍ଣ ଓ ଶୁଭ ସମୟ।", "/panchang"],
    ["🔢", "ଲୋ ଶୁ ଗ୍ରିଡ୍", "ଆପଣଙ୍କ ଯୋଗ, ରତ୍ନ ଓ ବର୍ଷର ଫଳାଫଳ।", "/loshu"],
    ["📊", "ରିପୋର୍ଟ", "ବିସ୍ତୃତ ରିପୋର୍ଟ ଓ ଚାର୍ଟ।", "/reports"],
    ["🌟", "ଦୈନିକ ଭାଗ୍ୟ", "ଦିନର ଶୁଭ ସମୟ ଓ ଭାଗ୍ୟ।", "/daily"],
  ],
  as: [
    ["🕉️", "কুণ্ডলী", "জন্মৰ পৰা সম্পূৰ্ণ কুণ্ডলী, দশা আৰু ভৱিষ্যবাণী।", "/kundli"],
    ["✨", "ৰাশিফল", "আজি, সপ্তাহ আৰু মাহৰ সম্পূৰ্ণ ভৱিষ্যবাণী।", "/rashifal"],
    ["📅", "পঞ্চাঙ", "তিথি, নক্ষত্ৰ, যোগ, কৰণ আৰু শুভ সময়।", "/panchang"],
    ["🔢", "লো শু গ্ৰিড", "আপোনাৰ যোগ, মুক্ত আৰু বৰ্ষৰ ফলাফল।", "/loshu"],
    ["📊", "পৰিদৰ্তন", "বিস্তৃত পৰিদৰ্তন আৰু চাৰ্ট।", "/reports"],
    ["🌟", "দৈনিক ভাগ্য", "দৈনিক শুভ সময় আৰু ভাগ্য।", "/daily"],
  ],
  en: [
    ["🕉️", "Kundli", "Complete birth chart, dasha periods and predictions.", "/kundli"],
    ["✨", "Rashifal", "Full prediction for today, this week and this month.", "/rashifal"],
    ["📅", "Panchang", "Tithi, nakshatra, yoga, karana and auspicious time.", "/panchang"],
    ["🔢", "Lo Shu Grid", "Your yogs, crystals and the year's outcome.", "/loshu"],
    ["📊", "Reports", "Detailed reports with full charts.", "/reports"],
    ["🌟", "Daily Lucky", "Every day's auspicious time and fortune.", "/daily"],
  ],
};

// har tile ka apna chhota roohani akshar
const TILE_GLYPH = ["ॐ", "श्री", "वेद", "ॐ", "सूर्य", "चंद्र"];

export default function Home() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const tiles = TILES[lang] || TILES.en;
  const NS = numSecTX(lang);

  /* Profile localStorage me hai. Login par naya data aata hai,
     isliye user badalne par dobara padhta hai. */
  const [prof, setProf] = useState({});
  useEffect(() => { setProf(loadProfile()); }, [user]);

  const hasData = Boolean(user && prof.name && prof.birthdate);

  /* Ankabhi tab — jab user ne khud chuna ho ki number dekhna hai. */
  const [wantNumbers, setWantNumbers] = useState(() => {
    try { return localStorage.getItem("nv-want-numbers") === "1"; } catch { return false; }
  });
  const showNumbers = hasData && wantNumbers;

  const toggleNumbers = () => {
    const next = !wantNumbers;
    setWantNumbers(next);
    try { localStorage.setItem("nv-want-numbers", next ? "1" : "0"); } catch { /* ignore */ }
  };

  return (
    <div>
      <JyotishBackdrop />

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="logo-ring">
          <img src="/logo.svg" alt="" />
        </div>
        <div><span className="badge">✦ {t("app_name")} ✦</span></div>
        <h1 style={{ marginTop: 18 }}>
          <span className="text-gradient">{t("hero_title")}</span>
        </h1>
        <p>{t("hero_sub")}</p>
        <div className="hero-actions">
          <Link to="/calculator" className="btn">{t("hero_cta")}</Link>
          <Link to="/kundli" className="btn">{t("nav_kundli_page")}</Link>
          <Link to="/experts" className="btn secondary">{t("hero_cta2")}</Link>
        </div>
      </section>

      {/* ============ FEATURE TILES ============ */}
      <section style={{ marginTop: 56 }}>
        <div className="sec-head">
          <div className="kicker">✦ सेवाएँ ✦</div>
          <h2>{t("nav_kundli")} · {t("nav_panchang")} · {t("nav_rashifal")}</h2>
          <div className="rule" />
        </div>

        <div className="tile-grid">
          {tiles.map(([glyph, title, desc, to], i) => (
            <Link key={to} to={to} className="tile">
              <div className="glyph">{glyph}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div
                style={{
                  marginTop: "auto", paddingTop: 10, fontSize: ".7rem",
                  letterSpacing: 2, color: "var(--gold)", opacity: .55,
                }}
              >
                {TILE_GLYPH[i]}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ SHUBH VIBHAG ============ */}
      <section style={{ marginTop: 54 }}>
        <div className="sec-head">
          <div className="kicker">✦ ॐ ✦</div>
          <h2 className="text-gradient">{t("nav_about")}</h2>
          <div className="rule" />
        </div>
        <div className="card" style={{ textAlign: "center", padding: "34px 26px" }}>
          <p style={{ fontSize: "1rem", maxWidth: 720, margin: "0 auto", color: "#c3c6e6" }}>
            {t("footer_tagline")}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            <Link to="/calculator" className="btn secondary">{t("nav_calculator")}</Link>
            <Link to="/match" className="btn secondary">{t("nav_match")}</Link>
            <Link to="/calendar" className="btn secondary">{t("nav_calendar")}</Link>
            <Link to="/remedies" className="btn secondary">{t("nav_remedies")}</Link>
            <Link to="/experts" className="btn secondary">{t("nav_experts")}</Link>
          </div>
        </div>
      </section>

      {/* ============ NUMBER SECTION ============
          Sirf tab dikhta hai jab: login + data + user ne chuna ho.
          Bina in teenon ke landing par koi ankabhi nahi dikhti. */}
      {!showNumbers && (
        <section style={{ marginTop: 50 }}>
          <div className="card num-lock">
            <div className="num-lock-mark">ॐ</div>
            <h3>{NS.unlock}</h3>
            <p>{NS.unlockSub}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
              <Link to={user ? "/calculator" : "/login"} className="btn">
                {NS.start}
              </Link>
              {hasData && (
                <button className="btn secondary" onClick={toggleNumbers}>
                  {NS.explore}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {showNumbers && (
        <>
          <section style={{ marginTop: 54 }}>
            <div className="sec-head">
              <div className="kicker">✦ {NS.explore} ✦</div>
              <h2>{NS.coreTitle}</h2>
              <div className="rule" />
            </div>
            <div className="grid grid-3">
              {NS.core.map(([title, d]) => (
                <div key={title} className="card">
                  <h3>{title}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 50 }}>
            <div className="sec-head">
              <div className="kicker">✦ 1 – 9 ✦</div>
              <h2 className="text-gradient">{NS.explore}</h2>
              <div className="rule" />
            </div>
            <div className="grid grid-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                const m = getMeaning(n, lang);
                return (
                  <div key={n} className="card number-card">
                    <div className="num"><span>{n}</span></div>
                    <h3>{m.title}</h3>
                    <p style={{ fontSize: ".85rem" }}>{m.keywords}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: 26 }}>
              <button className="btn secondary" onClick={toggleNumbers}>
                {NS.explore} ✕
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}