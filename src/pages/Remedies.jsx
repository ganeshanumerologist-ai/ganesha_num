import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { RUDRAKSHA_GUIDE, JADI_GUIDE, YANTRA_GUIDE } from "../data/remedies.js";

const TX = {
  hi: { title: "रुद्राक्ष · जड़ी-बूटी · यंत्र मार्गदर्शक", sub: "कौन-सा पहनें, क्यों पहनें — पूरी जानकारी। अपने लिए सही चुनाव Reports में जन्मतिथि से जानें।",
    t1: "रुद्राक्ष (1-14 मुखी)", t2: "जड़ी-बूटी (नवग्रह)", t3: "यंत्र (नवग्रह)",
    planet: "ग्रह", devta: "देवता", fayda: "लाभ", mantra: "मंत्र", upyog: "उपयोग", dharan: "धारण", sthapana: "स्थापना",
    personal: "मेरे लिए कौन-सा? Reports में जन्मतिथि डालें →", btn: "मेरी रिपोर्ट बनाएँ" },
  mr: { title: "रुद्राक्ष · जडी-बुटी · यंत्र मार्गदर्शक", sub: "कोणते घालावे, का घालावे — संपूर्ण माहिती. तुमच्यासाठी योग्य निवड Reports मध्ये जन्मतारीख ने जाणून घ्या.",
    t1: "रुद्राक्ष (1-14 मुखी)", t2: "जडी-बुटी (नवग्रह)", t3: "यंत्र (नवग्रह)",
    planet: "ग्रह", devta: "देवता", fayda: "लाभ", mantra: "मंत्र", upyog: "उपयोग", dharan: "धारण", sthapana: "स्थापना",
    personal: "माझ्यासाठी कोणते? Reports मध्ये जन्मतारीख टाका →", btn: "माझी रिपोर्ट बनवा" },
  bn: { title: "রুদ্রাক্ষ · ঔষধি · যন্ত্র পথনির্দেশিকা", sub: "কোনটি পরবেন, কেন পরবেন — সম্পূর্ণ তথ্য। আপনার জন্য সঠিক বাছাই Reports-এ জন্মতারিখ দিয়ে জানুন।",
    t1: "রুদ্রাক্ষ (১-১৪ মুখী)", t2: "ঔষধি (নবগ্রহ)", t3: "যন্ত্র (নবগ্রহ)",
    planet: "গ্রহ", devta: "দেবতা", fayda: "লাভ", mantra: "মন্ত্র", upyog: "ব্যবহার", dharan: "পরিধান", sthapana: "স্থাপন",
    personal: "আমার জন্য কোনটি? Reports-এ জন্মতারিখ দিন →", btn: "আমার রিপোর্ট তৈরি করুন" },
  te: { title: "రుద్రాక్ష · మూలిక ద్రవ్యాలు · యంత్ర మార్గదర్శకం", sub: " ఏది ధరించాలి, ఎందుకు — పూర్తి సమాచారం. మీ కోసం సరైన ఎంపికను Reports లో పుట్టిన తేదీతో తెలుసుకోండి.",
    t1: "రుద్రాక్ష (1-14 ముఖి)", t2: "మూలిక ద్రవ్యాలు (నవగ్రహ)", t3: "యంత్రాలు (నవగ్రహ)",
    planet: "గ్రహం", devta: "దేవుడు", fayda: "లాభం", mantra: "మంత్రం", upyog: "ఉపయోగం", dharan: "ధారण", sthapana: "స్థాపన",
    personal: "నా కోసం ఏది? Reports లో పుట్టిన తేదీ ఇవ్వండి →", btn: "నా నివేదిక రూపొందించు" },
  ta: { title: "ருத்ராக்ஷ · மூலிகை · யந்திர வழிகாட்டி", sub: "எது அணிய வேண்டும், ஏன் — முழு விவரம். உங்களுக்கான சரியான தேர்வை Reports இல் பிறந்த தேதியால் அறியுங்கள்.",
    t1: "ருத்ராக்ஷ (1-14 முகி)", t2: "மூலிகை (நவகிரகங்கள்)", t3: "யந்திரங்கள் (நவகிரகங்கள்)",
    planet: "கிரகம்", devta: "தெய்வம்", fayda: "பயன்", mantra: "மந்திரம்", upyog: "பயன்பாடு", dharan: "அணிதல்", sthapana: "அமைப்பு",
    personal: "எனக்கு எது? Reports இல் பிறந்த தேதியை உள்ளிடவும் →", btn: "என் அறிக்கையை உருவாக்கு" },
  gu: { title: "રુદ્રાક્ષ · ઔષધિ · યંત્ર માર્ગદર્શક", sub: "કયું ધારવું, કેમ — સંપૂર્ણ માહિતી. તમારા માટે સાચી પસંદ Reports માં જન્મતારીખથી જાણો.",
    t1: "રુદ્રાક્ષ (1-14 મુખી)", t2: "ઔષધિ (નવગ્રહ)", t3: "યંત્ર (નવગ્રહ)",
    planet: "ગ્રહ", devta: "દેવતા", fayda: "ફાયદો", mantra: "મંત્ર", upyog: "ઉપયોગ", dharan: "ધારણ", sthapana: "સ્થાપન",
    personal: "મારા માટે કયું? Reports માં જન્મતારીખ ભરો →", btn: "મારી રિપોર્ટ બનાવો" },
  ur: { title: "رُدڑاکش · جڑی بوٹی · یانتر رہنمائی", sub: "کون سا پہنیں، کیوں — مکمل معلومات۔ اپنے لیے صحیح انتخاب Reports میں تاریخِ پیدائش سے جانیں۔",
    t1: "رُدڑاکش (1-14 منہی)", t2: "جڑی بوٹی (نو گرہ)", t3: "یانتر (نو گرہ)",
    planet: "سیارہ", devta: "دیوی", fayda: "فائدہ", mantra: "مانتھر", upyog: "استعمال", dharan: "پہننا", sthapana: "نصب",
    personal: "میرے لیے کون سا؟ Reports میں تاریخِ پیدائش درج کریں →", btn: "میری رپورٹ بنائیں" },
  kn: { title: "ರುದ್ರಾಕ್ಷ · ಔಷಧಿ · ಯಂತ್ರ ಮಾರ್ಗದರ್ಶಕ", sub: "ಯಾವದನ್ನು ಧರಿಸಬೇಕು, ಏಕೆ — ಪೂರ್ಣ ಮಾಹಿತಿ. ನಿಮ್ಮಿಗೆ ಸರಿಯಾದ ಆಯ್ಕೆ Reports ನಲ್ಲಿ ಹುಟ್ಟಿದ ದಿನದಿಂದ ತಿಳಿಯಿರಿ.",
    t1: "ರುದ್ರಾಕ್ಷ (1-14 ಮುಖಿ)", t2: "ಔಷಧಿ (ನವಗ್ರಹ)", t3: "ಯಂತ್ರ (ನವಗ್ರಹ)",
    planet: "ಗ್ರಹ", devta: "ದೇವತೆ", fayda: "ಲಾಭ", mantra: "ಮಂತ್ರ", upyog: "ಬಳಕೆ", dharan: "ಧಾರಣ", sthapana: "ಸ್ಥಾಪನೆ",
    personal: "ನನಗೆ ಯಾವದು? Reports ನಲ್ಲಿ ಹುಟ್ಟಿದ ದಿನ ನಮೂದಿಸಿ →", btn: "ನನ್ನ ವರದಿ ತಯಾರಿಸಿ" },
  ml: { title: "രുദ്രാക്ഷ · ഔഷധി · യന്ത്ര വഴികാടി", sub: "ഏത് ധരിക്കണം, എന്തുകൊണ്ട് — പൂർണ്ണ വിവരങ്ങൾ. നിങ്ങൾക്കുള്ള ശരിയായ തിരഞ്ഞെടുപ്പ് Reports-ൽ ജനനത്തീയതി മുകളിൽ അറിയുക.",
    t1: "രുദ്രാക്ഷ (1-14 മുഖി)", t2: "ഔഷധി (നവഗ്രഹങ്ങൾ)", t3: "യന്ത്രങ്ങൾ (നവഗ്രഹങ്ങൾ)",
    planet: "ഗ്രഹം", devta: "ദേവത", fayda: "പ്രയോജനം", mantra: "മന്ത്രം", upyog: "ഉപയോഗം", dharan: "ധരിക്കുക", sthapana: "സ്ഥാപനം",
    personal: "എനിക്ക് ഏത്? Reports-ൽ ജനനത്തീയതി നൽകുക →", btn: "എന്റെ റിപ്പോർട്ട് ഉണ്ടാക്കുക" },
  pa: { title: "ਰੁਦ੍ਰਾਕਸ਼ · ਔਸਧੀ · ਯੰਤਰ ਮਾਰਗਦਰਸ਼ਕ", sub: "ਕਿਹੜਾ ਧਰਨਾ ਹੈ, ਕਿਉਂ — ਪੂਰੀ ਜਾਣਕਾਰੀ। ਤੁਹਾਡੇ ਲਈ ਸਹੀ ਚੋਣ Reports ਵਿੱਚ ਜਨਮ ਤਾਰੀਖ ਨਾਲ ਜਾਣੋ।",
    t1: "ਰੁਦ੍ਰਾਕਸ਼ (1-14 ਮੁਖੀ)", t2: "ਔਸਧੀ (ਨਵਗ੍ਰਹ)", t3: "ਯੰਤਰ (ਨਵਗ੍ਰਹ)",
    planet: "ਗ੍ਰਹ", devta: "ਦੇਵਤਾ", fayda: "ਲਾਭ", mantra: "ਮੰਤਰ", upyog: "ਵਰਤੋਂ", dharan: "ਧਾਰਨ", sthapana: "ਸਥਾਪਨਾ",
    personal: "ਮੇਰੇ ਲਈ ਕਿਹੜਾ? Reports ਵਿੱਚ ਜਨਮ ਤਾਰੀਖ ਪਾਓ →", btn: "ਮੇਰੀ ਰਿਪੋਰਟ ਬਣਾਓ" },
  or: { title: "ରୁଦ୍ରାକ୍ଷ · ଔଷଧି · ଯନ୍ତ୍ର ମାର୍ଗଦର୍ଶକ", sub: "କେଉଁଥି ପିନ୍ଧିବେ, କାହିଁକି — ସମ୍ପୂର୍ଣ୍ଣ ସୂଚନା। ଆପଣଙ୍କ ପାଇଁ ସଠିକ୍ ବାଛାଇ Reports ରେ ଜନ୍ମତାରିଖ ଦ୍ୱାରା ଜାଣନ୍ତୁ।",
    t1: "ରୁଦ୍ରାକ୍ଷ (1-14 ମୁଖୀ)", t2: "ଔଷଧି (ନବଗ୍ରହ)", t3: "ଯନ୍ତ୍ର (ନବଗ୍ରହ)",
    planet: "ଗ୍ରହ", devta: "ଦେବତା", fayda: "ଲାଭ", mantra: "ମନ୍ତ୍ର", upyog: "ବ୍ୟବହାର", dharan: "ଧାରଣ", sthapana: "ସ୍ଥାପନା",
    personal: "ମୋ ପାଇଁ କେଉଁଥି? Reports ରେ ଜନ୍ମତାରିଖ ଦିଅନ୍ତୁ →", btn: "ମୋ ରିପୋର୍ଟ ତିଆରି କରନ୍ତୁ" },
  as: { title: "ৰুদ্ৰাক্ষ · ঔষধি · যন্ত্ৰ পথনিৰ্দেশিকা", sub: "কোনটি পৰাৰিব, কিয় — সম্পূৰ্ণ তথ্য। আপোনাৰ বাবে সঠিক বাছনি Reports-ত জন্মতাৰিখ দি জানা।",
    t1: "ৰুদ্ৰাক্ষ (১-১৪ মুখী)", t2: "ঔষধি (নৱগ্ৰহ)", t3: "যন্ত্ৰ (নৱগ্ৰহ)",
    planet: "গ্ৰহ", devta: "দেৱতা", fayda: "লাভ", mantra: "মন্ত্ৰ", upyog: "ব্যৱহাৰ", dharan: "পৰাৰণ", sthapana: "স্থাপন",
    personal: "মোৰ বাবে কোনটি? Reports-ত জন্মতাৰিখ দিয়ক →", btn: "মোৰ পৰিবেদন তৈয়া কৰক" },
  en: { title: "Rudraksha · Herbs · Yantra Guide", sub: "Which to wear and why — full guide. Find yours via DOB in Reports.",
    t1: "Rudraksha (1-14 Mukhi)", t2: "Herbs (Navagraha)", t3: "Yantras (Navagraha)",
    planet: "Planet", devta: "Deity", fayda: "Benefit", mantra: "Mantra", upyog: "Use", dharan: "How to wear", sthapana: "Installation",
    personal: "Which one for me? Enter DOB in Reports →", btn: "Make My Report" },
};

export default function Remedies() {
  const { lang } = useLanguage();
  const T = pageTX(TX, lang);
  const [tab, setTab] = useState("r");

  return (
    <div>
      <h1 className="text-gradient">{T.title}</h1>
      <p>{T.sub}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        {[["r", T.t1], ["j", T.t2], ["y", T.t3]].map(([k, l]) => (
          <button key={k} className={tab === k ? "btn" : "btn secondary"} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "r" && (
        <div className="grid grid-2" style={{ marginTop: 20 }}>
          {RUDRAKSHA_GUIDE.map((x) => (
            <div key={x.m} className="card">
              <h3>📿 {x.m} — {x.planet}</h3>
              <div style={{ marginTop: 8 }}>
                <div className="kv"><span className="k">{T.devta}</span><span className="v">{x.devta}</span></div>
                <div className="kv"><span className="k">{T.fayda}</span><span className="v">{x.fayda}</span></div>
                <div className="kv"><span className="k">{T.mantra}</span><span className="v">{x.mantra}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "j" && (
        <div className="grid grid-2" style={{ marginTop: 20 }}>
          {JADI_GUIDE.map((x) => (
            <div key={x.herb} className="card">
              <h3>🌿 {x.herb} — {x.planet}</h3>
              <div style={{ marginTop: 8 }}>
                <div className="kv"><span className="k">{T.upyog}</span><span className="v">{x.upyog}</span></div>
                <div className="kv"><span className="k">{T.dharan}</span><span className="v">{x.dharan}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "y" && (
        <div className="grid grid-2" style={{ marginTop: 20 }}>
          {YANTRA_GUIDE.map((x) => (
            <div key={x.yantra} className="card">
              <h3>🔯 {x.yantra} — {x.planet}</h3>
              <div style={{ marginTop: 8 }}>
                <div className="kv"><span className="k">{T.fayda}</span><span className="v">{x.fayda}</span></div>
                <div className="kv"><span className="k">{T.sthapana}</span><span className="v">{x.sthapana}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginTop: 20, textAlign: "center" }}>
        <p>{T.personal}</p>
        <Link to="/reports" className="btn" style={{ marginTop: 10 }}>{T.btn}</Link>
      </div>
    </div>
  );
}
