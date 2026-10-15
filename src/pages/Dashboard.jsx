import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { db, storage } from "../firebase.js";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const byDateDesc = (arr) => [...arr].sort((a, b) => {
  const ta = a.createdAt?.seconds || 0;
  const tb = b.createdAt?.seconds || 0;
  return tb - ta;
});

const DASH_TX = {
  en: {
    welcome: "Welcome", bookings: "My Bookings", noBooking: "No bookings yet. Book a session from Experts page.",
    noReading: "No saved readings yet. Go to Calculator.", del: "Delete", confirm: "Delete?",
    errFile: "Please choose an image file.", kundliDone: "Kundli attached! Expert will see it in session.",
    status: "Status", paid: "Paid", unpaid: "Unpaid", kundli: "Kundli", view: "View", noKundli: "Not attached",
    uploading: "Uploading...", change: "Change Kundli", attach: "Attach Kundli",
  },
  hi: {
    welcome: "स्वागत है", bookings: "मेरी बुकिंग", noBooking: "अभी कोई बुकिंग नहीं। विशेषज्ञ पेज से सत्र बुक करें।",
    noReading: "अभी कोई रीडिंग सेव नहीं है। कैलकुलेटर पर जाएँ।", del: "हटाएँ", confirm: "हटाएँ?",
    errFile: "कृपया एक चित्र फ़ाइल चुनें।", kundliDone: "कुंडली जुड़ गई! विशेषज्ञ सत्र में इसे देखेंगे।",
    status: "स्थिति", paid: "भुगतान हो गया", unpaid: "बकाया", kundli: "कुंडली", view: "देखें", noKundli: "नहीं जुड़ी",
    uploading: "अपलोड हो रहा है...", change: "कुंडली बदलें", attach: "कुंडली जोड़ें",
  },
  mr: {
    welcome: "स्वागत आहे", bookings: "माझ्या बुकिंग", noBooking: "अजून कोणतीही बुकिंग नाही. तज्ज्ञ पानावरून सत्र बुक करा.",
    noReading: "अजून काहीही सेव्ह केलेले नाही. कॅल्क्युलेटरवर जा.", del: "हटवा", confirm: "हटवायचे?",
    errFile: "कृपया एक प्रतिमा फाइल निवडा.", kundliDone: "कुंडली जोडली! तज्ज्ञ सत्रात ती पाहिल.",
    status: "स्थिती", paid: "पैसे भरले", unpaid: "बाकी", kundli: "कुंडली", view: "पहा", noKundli: "जोडलेली नाही",
    uploading: "अपलोड होत आहे...", change: "कुंडली बदला", attach: "कुंडली जोडा",
  },
  bn: {
    welcome: "স্বাগতম", bookings: "আমার বুকিং", noBooking: "এখনো কোনো বুকিং নেই। বিশেষজ্ঞ পেজ থেকে সেশন বুক করুন।",
    noReading: "এখনো কোনো রিডিং সেভ নেই। ক্যালকুলেটরে যান।", del: "মুছুন", confirm: "মুছবেন?",
    errFile: "অনুগ্রহ করে একটি ছবির ফাইল বেছে নিন।", kundliDone: "কুণ্ডলী যুক্ত হয়েছে! বিশেষজ্ঞ সেশনে তা দেখবেন।",
    status: "অবস্থা", paid: "পরিশোধিত", unpaid: "বাকি", kundli: "কুণ্ডলী", view: "দেখুন", noKundli: "যুক্ত নয়",
    uploading: "আপলোড হচ্ছে...", change: "কুণ্ডলী বদলান", attach: "কুণ্ডলী যুক্ত করুন",
  },
  te: {
    welcome: "స్వాగతం", bookings: "నా బుకింగ్‌లు", noBooking: "ఇంకా బుకింగ్ లేదు. నిపుణుల పేజీ నుండి సెషన్ బుక్ చేయండి.",
    noReading: "ఇంకా ఏ రీడింగ్ సేవ్ కాలేదు. కాలిక్యులేటర్‌కు వెళ్ళండి.", del: "తొలగించు", confirm: "తొలగించాలా?",
    errFile: "దయచేసి ఒక చిత్ర ఫైల్ ఎంచుకోండి.", kundliDone: "జాతకం అనుసంధానమైంది! నిపుణుడు సెషన్‌లో దీన్ని చూస్తాడు.",
    status: "స్థితి", paid: "చెల్లించారు", unpaid: "బাকీ", kundli: "జాతకం", view: "చూడండి", noKundli: "అనుసంధానం కాలేదు",
    uploading: "అప్‌లోడ్ అవుతోంది...", change: "జాతకం మార్చు", attach: "జాతకం జోడించు",
  },
  ta: {
    welcome: "வரவேற்பு", bookings: "என் பதிவுகள்", noBooking: "இன்னும் பதிவு இல்லை. நிபுணர் பக்கத்தில் அரசவை பதிவு செய்யுங்கள்.",
    noReading: "இன்னும் ஏதும் சேமிக்கப்படவில்லை. கால்குலேட்டருக்குச் செல்லுங்கள்.", del: "நீக்கு", confirm: "நீக்கவா?",
    errFile: "ஒரு படக் கோப்பைத் தேர்ந்தெடுக்கவும்.", kundliDone: "ஜாதகம் இணைக்கப்பட்டது! நிபுணர் அரசவையில் அதைப் பார்ப்பார்.",
    status: "நிலை", paid: "செலுத்தப்பட்டது", unpaid: "நிலுவை", kundli: "ஜாதகம்", view: "பார்", noKundli: "இணைக்கப்படவில்லை",
    uploading: "ஏற்றுகிறது...", change: "ஜாதகத்தை மாற்று", attach: "ஜாதகம் இணை",
  },
  gu: {
    welcome: "સ્વાગત છે", bookings: "મારી બુકિંગ", noBooking: "હજી કોઈ બુકિંગ નથી. નિષ્ણાત પેજ પરથી સેશન બુક કરો.",
    noReading: "હજી કંઈ સેવ નથી. કેલ્ક્યુલેટર પર જાઓ.", del: "કાઢી નાખો", confirm: "કાઢી નાખવું?",
    errFile: "કૃપા કરીને એક ચિત્ર ફાઇલ પસંદ કરો.", kundliDone: "કુંડળી જોડાઈ! નિષ્ણાત સેશનમાં તે જુશે.",
    status: "સ્થિતિ", paid: "ચૂકવેલ", unpaid: "બાકી", kundli: "કુંડળી", view: "જુઓ", noKundli: "જોડાઈ નથી",
    uploading: "અપલોડ થઈ રહ્યું છે...", change: "કુંડળી બદલો", attach: "કુંડળી જોડો",
  },
  ur: {
    welcome: "خوش آمدید", bookings: "میری بکنگ", noBooking: "ابھی کوئی بکنگ نہیں۔ ماہر کے صفحے سے سیشن بک کریں۔",
    noReading: "ابھی کچھ محفوظ نہیں۔ کیلکولیٹر پر جائیں۔", del: "حذف کریں", confirm: "حذف کریں؟",
    errFile: "براہِ کرم ایک تصویر فائل منتخب کریں۔", kundliDone: "کنڈلی منسلک ہو گئی! ماہر سیشن میں اسے دیکھیں گے۔",
    status: "حالت", paid: "ادا شدہ", unpaid: "واجب", kundli: "کنڈلی", view: "دیکھیں", noKundli: "منسلک نہیں",
    uploading: "اپ لوڈ ہو رہا ہے...", change: "کنڈلی بدلیں", attach: "کنڈلی منسلک کریں",
  },
  kn: {
    welcome: "ಸ್ವಾಗತ", bookings: "ನನ್ನ ಬುಕಿಂಗ್", noBooking: "ಇನ್ನೂ ಯಾವುದೇ ಬುಕಿಂಗ್ ಇಲ್ಲ. ತಜ್ಞರ ಪುಟದಿಂದ ಸೆಷನ್ ಬುಕ್ ಮಾಡಿ.",
    noReading: "ಇನ್ನೂ ಏನೂ ಉಳಿಸಿಲ್ಲ. ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗೆ ಹೋಗಿ.", del: "ಅಳಿಸಿ", confirm: "ಅಳಿಸಬೇಕೇ?",
    errFile: "ದಯವಿಟ್ಟು ಒಂದು ಚಿತ್ರ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.", kundliDone: "ಜಾತಕ ಜೋಡಾಯಿತು! ತಜ್ಞರು ಸೆಷನ್‌ನಲ್ಲಿ ಅದನ್ನು ನೋಡುತ್ತಾರೆ.",
    status: "ಸ್ಥಿತಿ", paid: "ಪಾವತಿಸಲಾಗಿದೆ", unpaid: "ಬಾಕಿ", kundli: "ಜಾತಕ", view: "ನೋಡಿ", noKundli: "ಜೋಡಿಸಿಲ್ಲ",
    uploading: "ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...", change: "ಜಾತಕ ಬದಲಿಸಿ", attach: "ಜಾತಕ ಜೋಡಿಸಿ",
  },
  ml: {
    welcome: "സ്വാഗതം", bookings: "എന്റെ ബുക്കിംഗുകൾ", noBooking: "ഇതുവരെ ബുക്കിംഗില്ല. വിദഗ്ധ പേജിലെ സെഷൻ ബുക്ക് ചെയ്യുക.",
    noReading: "ഇതുവരെ ഒന്നും സേവ് ചെയ്തിട്ടില്ല. കാൽക്കുലേറ്ററിലേക്ക് പോകുക.", del: "ഇല്ലാതാക്കുക", confirm: "ഇല്ലാതാക്കണോ?",
    errFile: "ഒരു പടം ഫയൽ തിരഞ്ഞെടുക്കൂ.", kundliDone: "ജാതകം ചേർത്തു! വിദഗ്ധൻ സെഷനിൽ അത് കാണും.",
    status: "നില", paid: "അടച്ചു", unpaid: "കുട്ടിയത്", kundli: "ജാതകം", view: "കാണുക", noKundli: "ചേർത്തിട്ടില്ല",
    uploading: "അപ്‌ലോഡ് ചെയ്യുന്നു...", change: "ജാതകം മാറ്റുക", attach: "ജാതകം ചേർക്കുക",
  },
  pa: {
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ", bookings: "ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ", noBooking: "ਹਾਲੇ ਕੋਈ ਬੁਕਿੰਗ ਨਹੀਂ। ਮਾਹਰ ਪੇਜ ਤੋਂ ਸੈਸ਼ਨ ਬੁਕ ਕਰੋ।",
    noReading: "ਹਾਲੇ ਕੁਝ ਵੀ ਸੇਵ ਨਹੀਂ। ਕੈਲਕੁਲੇਟਰ ਤੇ ਜਾਓ।", del: "ਮਿਟਾਓ", confirm: "ਮਿਟਾਉਣਾ ਹੈ?",
    errFile: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਤਸਵੀਰ ਫ਼ਾਈਲ ਚੁਣੋ।", kundliDone: "ਕੁੰਡਲੀ ਜੁੜ ਗਈ! ਮਾਹਰ ਸੈਸ਼ਨ ਵਿੱਚ ਇਹ ਦੇਖੇਗਾ।",
    status: "ਹਾਲਤ", paid: "ਭਰਤੀ", unpaid: "ਬਕਾਇਆ", kundli: "ਕੁੰਡਲੀ", view: "ਵੇਖੋ", noKundli: "ਨਹੀਂ ਜੁੜੀ",
    uploading: "ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", change: "ਕੁੰਡਲੀ ਬਦਲੋ", attach: "ਕੁੰਡਲੀ ਜੋੜੋ",
  },
  or: {
    welcome: "ସ୍ୱାଗତ", bookings: "ମୋ ବୁକିଂ", noBooking: "ଏ ପର୍ଯ୍ୟନ୍ତ କୌଣସି ବୁକିଂ ନାହିଁ। ବିଶେଷଜ୍ଞ ପୃଷ୍ଠାରୁ ସେସନ ବୁକ୍ କରନ୍ତୁ।",
    noReading: "ଏ ପର୍ଯ୍ୟନ୍ତ କୌଣସି ସେଭ ନାହିଁ। କାଲକୁଲେଟରକୁ ଯାଆନ୍ତୁ।", del: "ମଚାନ୍ତୁ", confirm: "ମଚାନ୍ତିବେ?",
    errFile: "ଦୟାକରି ଏକ ଚିତ୍ର ଫାଇଲ ବାଛନ୍ତୁ।", kundliDone: "କୁଣ୍ଡଳୀ ଯୋଡ଼ାଇଲା! ବିଶେଷଜ୍ଞ ସେସନରେ ତାହା ଦେଖିବେ।",
    status: "ସ୍ଥିତି", paid: "ପେଲା", unpaid: "ବକିଆ", kundli: "କୁଣ୍ଡଳୀ", view: "ଦେଖନ୍ତୁ", noKundli: "ଯୋଡ଼ାଯାଇନି",
    uploading: "ଅପଲୋଡ୍ ହେଉଛି...", change: "କୁଣ୍ଡଳୀ ବଦଳାନ୍ତୁ", attach: "କୁଣ୍ଡଳୀ ଯୋଡ଼ାନ୍ତୁ",
  },
  as: {
    welcome: "স্বাগতম", bookings: "মোৰ বুকিং", noBooking: "এতিয়ালৈকে কোনো বুকিং নাই। বিশেষজ্ঞ পৃষ্ঠাৰ পৰা ছেশ্ন বুক কৰক।",
    noReading: "এতিয়ালৈকে কিবা সেভ নাই। কেলকুলেটৰলৈ যাওক।", del: "মচক", confirm: "মচিব নেকি?",
    errFile: "দয়া কৰি এটা ছবিৰ ফাইল বাছনি কৰক।", kundliDone: "কুণ্ডলী সংযুক্ত হ'ল! বিশেষজ্ঞ ছেশ্নত তা দেখিব।",
    status: "অৱস্থা", paid: "পৰিশোধিত", unpaid: "বাকী", kundli: "কুণ্ডলী", view: "চাওক", noKundli: "সংযুক্ত নহয়",
    uploading: "আপলোড হৈছে...", change: "কুণ্ডলী সলনি কৰক", attach: "কুণ্ডলী সংযুক্ত কৰক",
  },
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { t, lang } = useLanguage();
  const T = pageTX(DASH_TX, lang);
  const nav = useNavigate();
  const [readings, setReadings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    if (!loading && !user) nav("/login");
  }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    const timer = setTimeout(() => { if (alive) setFetching(false); }, 20000);
    (async () => {
      try {
        const rSnap = await getDocs(query(collection(db, "readings"), where("uid", "==", user.uid)));
        if (alive) setReadings(byDateDesc(rSnap.docs.map((d) => ({ id: d.id, ...d.data() }))));
      } catch { if (alive) setReadings([]); }
      try {
        const bSnap = await getDocs(query(collection(db, "bookings"), where("uid", "==", user.uid)));
        if (alive) setBookings(byDateDesc(bSnap.docs.map((d) => ({ id: d.id, ...d.data() }))));
      } catch { if (alive) setBookings([]); }
      if (alive) setFetching(false);
      clearTimeout(timer);
    })();
    return () => { alive = false; clearTimeout(timer); };
  }, [user]);

  const remove = async (id) => {
    if (!window.confirm(T.confirm)) return;
    await deleteDoc(doc(db, "readings", id));
    setReadings((p) => p.filter((r) => r.id !== id));
  };

  // Kundli photo booking ke saath jodo (expert dekh payega)
  const uploadKundli = async (booking, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMsg(T.errFile); return; }
    setUploading(booking.id);
    try {
      const path = `kundli/${user.uid}/${booking.id}_${Date.now()}_${file.name}`;
      const r = storageRef(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await updateDoc(doc(db, "bookings", booking.id), { kundliUrl: url, kundliPath: path });
      setBookings((p) => p.map((b) => (b.id === booking.id ? { ...b, kundliUrl: url, kundliPath: path } : b)));
      setMsg(T.kundliDone);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setUploading(null);
    }
  };

  if (loading || fetching) return <div className="spinner" />;

  return (
    <div>
      <h1 className="text-gradient">{t("dashboard_title")}</h1>
      <p>{T.welcome}, {user?.displayName || user?.email}</p>
      {msg && <p style={{ color: "var(--accent-2)", marginTop: 10 }}>{msg}</p>}

      <h2 style={{ marginTop: 24 }}>{T.bookings} ({bookings.length})</h2>
      {bookings.length === 0 && <p>{T.noBooking}</p>}
      <div className="grid grid-2" style={{ marginTop: 12 }}>
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <h3>{b.expertName}</h3>
            <div style={{ marginTop: 8 }}>
              <div className="kv"><span className="k">{T.status}</span><span className="v">{b.status}{b.paid ? " · ✅ " + T.paid : " · ⏳ " + T.unpaid}</span></div>
              <div className="kv"><span className="k">{T.kundli}</span><span className="v">{b.kundliUrl ? <a href={b.kundliUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent-2)" }}>{T.view}</a> : T.noKundli}</span></div>
            </div>
            <label className="btn secondary" style={{ marginTop: 10, cursor: "pointer" }}>
              {uploading === b.id ? T.uploading : b.kundliUrl ? T.change : T.attach}
              <input
                type="file" accept="image/*" style={{ display: "none" }}
                disabled={uploading === b.id}
                onChange={(e) => uploadKundli(b, e.target.files?.[0])}
              />
            </label>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 24 }}>{t("saved_readings")} ({readings.length})</h2>
      {readings.length === 0 && <p>{T.noReading}</p>}
      <div className="grid grid-2" style={{ marginTop: 12 }}>
        {readings.map((r) => (
          <div key={r.id} className="card">
            <h3>{r.name} · {r.birthdate} {r.kind === "kundli" ? <span className="badge">Kundli</span> : null}</h3>
            {r.kind === "kundli" && (r.time || r.place) && (
              <p style={{ fontSize: ".85rem" }}>{[r.time, r.place].filter(Boolean).join(" · ")}</p>
            )}
            <div style={{ marginTop: 8 }}>
              {r.numbers && Object.entries(r.numbers).map(([k, v]) => (
                <div key={k} className="kv"><span className="k">{k}</span><span className="v">{String(v)}</span></div>
              ))}
            </div>
            <button className="btn danger" style={{ marginTop: 10 }} onClick={() => remove(r.id)}>{T.del}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
