import React, { useState } from "react";
import { FESTIVALS_2026, MONTHS, MONTH_GUIDE } from "../data/calendar.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";

const CAL_TX = {
  en: { title: "Festivals & Auspicious Calendar 2026", sub: "Choose a month — see its festivals and good works. (1-2 day difference possible due to tithi.)", empty: "No major festival listed in this month.", month: "Month" },
  hi: { title: "त्योहार और शुभ कैलेंडर 2026", sub: "महीना चुनें — उस महीने के त्योहार और शुभ कार्य जानें। (तिथि के अनुसार 1-2 दिन का अंतर संभव है।)", empty: "इस महीने में कोई बड़ा त्योहार सूचीबद्ध नहीं है।", month: "महीना" },
  mr: { title: "सण आणि शुभ कॅलेंडर 2026", sub: "महिना निवडा — त्या महिन्यातील सण आणि शुभ कार्य जाणून घ्या. (तिथीनुसार 1-2 दिवस फरक शक्य.)", empty: "या महिन्यात मोठा सण नाही.", month: "महिना" },
  bn: { title: "উৎসব ও শুভ ক্যালেন্ডার ২০২৬", sub: "মাস বেছে নিন — সেই মাসের উৎসব ও শুভ কাজ দেখুন। (তিথি অনুযায়ী ১-২ দিনের পার্থক্য হতে পারে।)", empty: "এই মাসে কোনো বড় উৎসব তালিকাভুক্ত নেই।", month: "মাস" },
  te: { title: "పండుగలు మరియు శుభ క్యాలెండర్ 2026", sub: "నెలను ఎంచుకోండి — ఆ నెల పండుగలు మరియు శుభ కార్యాలు తెలుసుకోండి. (తిథి ప్రకారం 1-2 రోజుల తేడా ఉండవచ్చు.)", empty: "ఈ నెలలో పెద్ద పండుగ ఏమీ లేదు.", month: "నెల" },
  ta: { title: "பண்டிகை மற்றும் நல்ல காலண்டர் 2026", sub: "மாதத்தைத் தேர்ந்தெடுக்கவும் — அந்த மாதத்தின் பண்டிகைகளும் நல்ல செயல்களும் அறியுங்கள். (திதி பொறுத்து 1-2 நாள் வேறுபாடு இருக்கலாம்.)", empty: "இந்த மாதத்தில் பெரிய பண்டிகை இல்லை.", month: "மாதம்" },
  gu: { title: "તહોવાર અને શુભ કેલેન્ડર 2026", sub: "મહિનો પસંદ કરો — તે મહિનાના તહોવાર અને શુભ કાર્ય જાણો. (તિથિ પ્રમાણે 1-2 દિવસનો તફાવત શક્ય છે.)", empty: "આ મહિનામાં કોઈ મોટો તહોવાર નથી.", month: "મહિનો" },
  ur: { title: "تہوار اور خوش بخت کیلئنڈر 2026", sub: "ماہ منتخب کریں — اس ماہ کے تہوار اور خوش بخت کام جانیں۔ (تیتھی کے مطابق 1-2 دن کا فرق ممکن ہے۔)", empty: "اس ماہ میں کوئی بڑا تہوار درج نہیں۔", month: "ماہ" },
  kn: { title: "ಹಬ್ಬಗಳು ಮತ್ತು ಶುಭ ಕ್ಯಾಲೆಂಡರ್ 2026", sub: "ತಿಂಗಳು ಆಯ್ಕೆಮಾಡಿ — ಆ ತಿಂಗಳಿನ ಹಬ್ಬಗಳು ಮತ್ತು ಶುಭ ಕಾರ್ಯಗಳನ್ನು ತಿಳಿಯಿರಿ. (ತಿಥಿ ಪ್ರಕಾರ 1-2 ದಿನಗಳ ಅಂತರ ಸಾಧ್ಯ.)", empty: "ಈ ತಿಂಗಳಿನಲ್ಲಿ ದೊಡ್ಡ ಹಬ್ಬ ಇಲ್ಲ.", month: "ತಿಂಗಳು" },
  ml: { title: "ഉത്സവങ്ങളും നല്ല കലണ്ടറും 2026", sub: "മാസം തിരഞ്ഞെടുക്കൂ — ആ മാസത്തെ ഉത്സവങ്ങളും നല്ല പ്രവൃത്തികളും അറിയുക. (തിഥി പ്രകാരം 1-2 ദിവസം വ്യത്യാസം ഉണ്ടാകാം.)", empty: "ഈ മാസത്ത് വലിയ ഉത്സവങ്ങളൊന്നുമില്ല.", month: "മാസം" },
  pa: { title: "ਤਿਉਹਾਰ ਅਤੇ ਸ਼ੁਭ ਕੈਲੰਡਰ 2026", sub: "ਮਹੀਨਾ ਚੁਣੋ — ਉਸ ਮਹੀਨੇ ਦੇ ਤਿਉਹਾਰ ਅਤੇ ਸ਼ੁਭ ਕਾਰਜ ਜਾਣੋ। (ਤਿਥੀ ਅਨੁਸਾਰ 1-2 ਦਿਨ ਦਾ ਫ਼ਰਕ ਹੋ ਸਕਦਾ ਹੈ।)", empty: "ਇਸ ਮਹੀਨੇ ਵਿੱਚ ਕੋਈ ਵੱਡਾ ਤਿਉਹਾਰ ਨਹੀਂ।", month: "ਮਹੀਨਾ" },
  or: { title: "ଉତ୍ସବ ଓ ଶୁଭ କ୍ୟାଲେଣ୍ଡର୍ 2026", sub: "ମାସ ବାଛନ୍ତୁ — ସେ ମାସର ଉତ୍ସବ ଓ ଶୁଭ କାର୍ଯ୍ୟ ଜାଣନ୍ତୁ। (ତିଥି ଅନୁଯାୟୀ 1-2 ଦିନ ଅନ୍ତର ସମ୍ଭବ।)", empty: "ଏ ମାସରେ କୌଣସି ବଡ ଉତ୍ସବ ନାହିଁ।", month: "ମାସ" },
  as: { title: "উৎসৱ আৰু শুভ কেলেণ্ডাৰ ২০২৬", sub: "মাহ বাছনি কৰক — সেই মাহৰ উৎসৱ আৰু শুভ কাৰ্য জানক। (তিথি অনুসাৰে ১-২ দিনৰ পাৰ্থক্য হ'ব পাৰে।)", empty: "এই মাহত কোনো ডাঙৰ উৎসৱ নাই।", month: "মাহ" },
};

export default function Calendar() {
  const { t, lang } = useLanguage();
  const T = pageTX(CAL_TX, lang);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const list = FESTIVALS_2026.filter((f) => f.month === month);

  return (
    <div>
      <h1 className="text-gradient">{T.title}</h1>
      <p>{T.sub}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        {MONTHS.map((m, i) => (
          <button key={m} className={month === i + 1 ? "btn" : "btn secondary"} style={{ padding: "8px 14px" }} onClick={() => setMonth(i + 1)}>
            {m.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>{MONTHS[month - 1]} 2026</h2>
        <p style={{ marginTop: 6 }}>{MONTH_GUIDE[month]}</p>
      </div>

      <div className="grid grid-2" style={{ marginTop: 20 }}>
        {list.length === 0 && <p>{T.empty}</p>}
        {list.map((f) => (
          <div key={f.name} className="card">
            <h3>{f.day} {MONTHS[month - 1]} — {f.name}</h3>
            <p style={{ marginTop: 8 }}>{f.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
