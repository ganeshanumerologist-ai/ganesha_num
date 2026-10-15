import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { useAdmin } from "../auth/useAdmin.js";
import { db, storage } from "../firebase.js";
import { collection, addDoc, serverTimestamp, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { EXPERTS as DEFAULT_EXPERTS } from "../data/experts.js";
import Reviews from "../components/Reviews.jsx";
import { WHATSAPP_DEFAULT, waLink } from "../config/contact.js";
import { PAYMENT_DEFAULTS, upiLink, parsePrice } from "../config/payment.js";

const EXP_TX = {
  en: {
    needLogin: "Please login first to book a session.",
    booked: (n) => `Booked with ${n}! We will contact you.`,
    errFile: "Please select an image file.",
    adminOnly: "Only admin can update photos. Go to /admin.",
    updated: (n) => `${n}'s photo updated!`,
    sub: "Talk to a live numerologist — expert guidance.",
    adminNote: "You are admin — full edit in Admin Panel.",
    search: "Search by language or name...",
    uploading: "Uploading...", updatePhoto: "Update Photo",
    onlinePay: "Online Pay",
  },
  hi: {
    needLogin: "सत्र बुक करने के लिए पहले लॉगिन करें।",
    booked: (n) => `${n} के साथ बुक हो गया! हम संपर्क करेंगे।`,
    errFile: "कृपया एक चित्र फ़ाइल चुनें।",
    adminOnly: "केवल एडमिन फ़ोटो बदल सकता है। /admin पर जाएँ।",
    updated: (n) => `${n} की फ़ोटो अपडेट हो गई!`,
    sub: "लाइव न्यूमेरोलॉजिस्ट से बात करें — विशेषज्ञ मार्गदर्शन।",
    adminNote: "आप एडमिन हैं — पूरा बदलाव Admin Panel में करें।",
    search: "भाषा या नाम से खोजें...",
    uploading: "अपलोड हो रहा है...", updatePhoto: "फ़ोटो बदलें",
    onlinePay: "ऑनलाइन भुगतान",
  },
  mr: {
    needLogin: "सत्र बुक करण्यासाठी आधी लॉगिन करा.",
    booked: (n) => `${n} यांच्यासोबत बुक झाले! आम्ही संपर्क करू.`,
    errFile: "कृपया एक प्रतिमा फाइल निवडा.",
    adminOnly: "फक्त admin फोटो बदलू शकतो. /admin मध्ये जा.",
    updated: (n) => `${n} यांचा फोटो अपडेट झाला!`,
    sub: "थेट न्यूमेरोलॉजिस्टशी बोला — तज्ज्ञ मार्गदर्शन.",
    adminNote: "तुम्ही admin आहात — पूर्ण बदल Admin Panel मध्ये करा.",
    search: "भाषा किंवा नावाने शोधा...",
    uploading: "अपलोड होत आहे...", updatePhoto: "फोटो बदला",
    onlinePay: "ऑनलाइन पेमेंट",
  },
  bn: {
    needLogin: "সেশন বুক করতে আগে লগইন করুন।",
    booked: (n) => `${n} এর সাথে বুক হয়েছে! আমরা যোগাযোগ করব।`,
    errFile: "অনুগ্রহ করে একটি ছবির ফাইল নির্বাচন করুন।",
    adminOnly: "শুধু অ্যাডমিন ছবি আপডেট করতে পারেন। /admin এ যান।",
    updated: (n) => `${n} এর ছবি আপডেট হয়েছে!`,
    sub: "একজন লাইভ নিউমেরোলজিস্টের সাথে কথা বলুন — বিশেষজ্ঞ পরামর্শ।",
    adminNote: "আপনি অ্যাডমিন — সম্পূর্ণ বদল Admin Panel এ করুন।",
    search: "ভাষা বা নাম দিয়ে খুঁজুন...",
    uploading: "আপলোড হচ্ছে...", updatePhoto: "ছবি পরিবর্তন",
    onlinePay: "অনলাইন পেমেন্ট",
  },
  te: {
    needLogin: "సెషన్ బుక్ చేయడానికి ముందుగా లాగిన్ చేయండి.",
    booked: (n) => `${n} తో బుక్ అయ్యింది! మేము సంప్రదిస్తాము.`,
    errFile: "దయచేసి ఒక చిత్ర ఫైల్ ఎంచుకోండి.",
    adminOnly: "ఫోటోలను అద్మిన్ మాత్రమే అప్‌డేట్ చేయగలరు. /admin కు వెళ్ళండి.",
    updated: (n) => `${n} ఫోటో అప్‌డేట్ అయ్యింది!`,
    sub: "ఒక లైవ్ న్యూమెరాలజిస్ట్‌తో మాట్లాడండి — నిపుణుల సూచన.",
    adminNote: "మీరు అద్మిన్ — పూర్తి మార్పు Admin Panel లో చేయండి.",
    search: "భాష లేదా పేరు ద్వారా వెతకండి...",
    uploading: "అప్‌లోడ్ అవుతోంది...", updatePhoto: "ఫోటో మార్చు",
    onlinePay: "ఆన్‌లైన్ చెల్లింపు",
  },
  ta: {
    needLogin: "அரசவை பதிவு செய்ய முதலில் உள்நுழையுங்கள்.",
    booked: (n) => `${n} உடன் பதிவு ஆனது! நாங்கள் தொடர்பு கொள்வோம்.`,
    errFile: "ஒரு படக் கோப்பைத் தேர்ந்தெடுக்கவும்.",
    adminOnly: "படங்களை நிர்வாகிக்க மட்டுமே முடியும். /admin செல்லுங்கள்.",
    updated: (n) => `${n} படம் புதுப்பிக்கப்பட்டது!`,
    sub: "ஒரு நேரடி நியூமராலஜிஸ்டுடன் பேசுங்கள் — நிபுணர் வழிகாட்டுதல்.",
    adminNote: "நீங்கள் நிர்வாகி — முழு மாற்றம் Admin Panel இல் செய்யுங்கள்.",
    search: "மொழி அல்லது பெயர் மூலம் தேடுங்கள்...",
    uploading: "ஏற்றுகிறது...", updatePhoto: "படத்தை மாற்று",
    onlinePay: "இணைய கட்டணம்",
  },
  gu: {
    needLogin: "સેશન બુક કરવા પહેલા લોગિન કરો.",
    booked: (n) => `${n} સાથે બુક થઈ ગયું! અમે સંપર્ક કરીશું.`,
    errFile: "કૃપા કરીને એક ચિત્ર ફાઇલ પસંદ કરો.",
    adminOnly: "ફોટા ફક્ત એડમિન જ અપડેટ કરી શકે. /admin પર જાઓ.",
    updated: (n) => `${n} નો ફોટો અપડેટ થઈ ગયો!`,
    sub: "લાઇવ ન્યુમરોલોજિસ્ટ સાથે વાત કરો — નિષ્ણાત માર્ગદર્શન.",
    adminNote: "તમે એડમિન છો — સંપૂર્ણ ફેરફાર Admin Panel માં કરો.",
    search: "ભાષા કે નામથી શોધો...",
    uploading: "અપલોડ થઈ રહ્યું છે...", updatePhoto: "ફોટો બદલો",
    onlinePay: "ઓનલાઇન ચુકવણી",
  },
  ur: {
    needLogin: "سیشن بک کرنے کے لیے پہلے لاگ ان کریں۔",
    booked: (n) => `${n} کے ساتھ بک ہو گیا! ہم رابطہ کریں گے۔`,
    errFile: "براہِ کرم ایک تصویر فائل منتخب کریں۔",
    adminOnly: "تصاویر صرف ایڈمن اپ ڈیٹ کر سکتا ہے۔ /admin پر جائیں۔",
    updated: (n) => `${n} کی تصویر اپ ڈیٹ ہو گئی!`,
    sub: "ایک لائیو نیومرولوجسٹ سے بات کریں — ماہر رہنمائی۔",
    adminNote: "آپ ایڈمن ہیں — مکمل تبدیلی Admin Panel میں کریں۔",
    search: "زبان یا نام سے تلاش کریں...",
    uploading: "اپ لوڈ ہو رہا ہے...", updatePhoto: "تصویر بدلیں",
    onlinePay: "آن لائن ادائیگی",
  },
  kn: {
    needLogin: "ಸೆಷನ್ ಬುಕ್ ಮಾಡಲು ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ.",
    booked: (n) => `${n} ಜೊತೆ ಬುಕ್ ಆಗಿದೆ! ನಾವು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.`,
    errFile: "ದಯವಿಟ್ಟು ಒಂದು ಚಿತ್ರ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.",
    adminOnly: "ಫೋಟೋಗಳನ್ನು ಆದನಿಗೆ ಮಾತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು. /admin ಗೆ ಹೋಗಿ.",
    updated: (n) => `${n} ನ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ!`,
    sub: "ಒಬ್ಬ ಲೈವ್ ನ್ಯೂಮರಾಲಜಿಸ್ಟ್‌ನೊಂದಿಗೆ ಮಾತನಾಡಿ — ತಜ್ಞರ ಮಾರ್ಗದರ್ಶನ.",
    adminNote: "ನೀವು ಆದನಿ — ಪೂರ್ಣ ಬದಲಾವಣೆ Admin Panel ನಲ್ಲಿ ಮಾಡಿ.",
    search: "ಭಾಷೆ ಅಥವಾ ಹೆಸರಿಂದ ಹುಡುಕಿ...",
    uploading: "ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...", updatePhoto: "ಫೋಟೋ ಬದಲಿಸಿ",
    onlinePay: "ಆನ್‌ಲೈನ್ ಪಾವತಿ",
  },
  ml: {
    needLogin: "സെഷൻ ബുക്ക് ചെയ്യാൻ ആദ്യം ലോഗിൻ ചെയ്യുക.",
    booked: (n) => `${n} ഉമ്മുമായി ബുക്ക് ആയി! ഞങ്ങൾ ബന്ധപ്പെടുക.`,
    errFile: "ഒരു പടം ഫയൽ തിരഞ്ഞെടുക്കൂ.",
    adminOnly: "ഫോട്ടോകൾ അഡ്മിൻ മാത്രമേ അപ്ഡേറ്റ് ചെയ്യാൻ കഴിയൂ. /admin ലേക്ക് പോകുക.",
    updated: (n) => `${n} ന്റെ ഫോട്ടോ അപ്ഡേറ്റ് ആയി!`,
    sub: "ഒരു ലൈവ് ന്യൂമറോളജിസ്റ്റിനൊപ്പം സംസാരിക്കൂ — വിദഗ്ധ മാർഗനിർദേശം.",
    adminNote: "നിങ്ങൾ അഡ്മിൻ — പൂർണ്ണ മാറ്റം Admin Panel ൽ ചെയ്യുക.",
    search: "ഭാഷയോ പേരോ കൊണ്ട് തിരയുക...",
    uploading: "അപ്‌ലോഡ് ചെയ്യുന്നു...", updatePhoto: "ഫോട്ടോ മാറ്റുക",
    onlinePay: "ഓൺലൈൻ പേയ്‌മെന്റ്",
  },
  pa: {
    needLogin: "ਸੈਸ਼ਨ ਬੁੱਕ ਕਰਨ ਲਈ ਪਹਿਲਾਂ ਲਾਗਇਨ ਕਰੋ।",
    booked: (n) => `${n} ਨਾਲ ਬੁੱਕ ਹੋ ਗਿਆ! ਅਸੀਂ ਸੰਪਰਕ ਕਰਾਂਗੇ।`,
    errFile: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਤਸਵੀਰ ਫ਼ਾਈਲ ਚੁਣੋ।",
    adminOnly: "ਤਸਵੀਰਾਂ ਸਿਰਫ਼ ਐਡਮਿਨ ਅਪਡੇਟ ਕਰ ਸਕਦਾ ਹੈ। /admin ਤੇ ਜਾਓ।",
    updated: (n) => `${n} ਦੀ ਤਸਵੀਰ ਅਪਡੇਟ ਹੋ ਗਈ!`,
    sub: "ਇੱਕ ਲਾਈਵ ਨਿਊਮਰੋਲੋਜਿਸਟ ਨਾਲ ਗੱਲ ਕਰੋ — ਮਾਹਰ ਮਾਰਗਦਰਸ਼ਨ।",
    adminNote: "ਤੁਸੀਂ ਐਡਮਿਨ ਹੋ — ਪੂਰਾ ਬਦਲਾਅ Admin Panel ਵਿੱਚ ਕਰੋ।",
    search: "ਭਾਸ਼ਾ ਜਾਂ ਨਾਮ ਨਾਲ ਖੋਜੋ...",
    uploading: "ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", updatePhoto: "ਤਸਵੀਰ ਬਦਲੋ",
    onlinePay: "ਆਨਲਾਈਨ ਭੁਗਤਾਨ",
  },
  or: {
    needLogin: "ସେସନ ବୁକ୍ କରିବା ପୂର୍ବରୁ ଲଗଇନ୍ କରନ୍ତୁ।",
    booked: (n) => `${n} ସହ ବୁକ୍ ହୋଇଛି! ଆମେ ଯୋଗାଯୋଗ କରିବୁ।`,
    errFile: "ଦୟାକରି ଏକ ଚିତ୍ର ଫାଇଲ ବାଛନ୍ତୁ।",
    adminOnly: "ଫଟୋ କେବଳ ଆଡମିନ ଅପଡେଟ କରିପାରେ। /admin କୁ ଯାଆନ୍ତୁ।",
    updated: (n) => `${n} ର ଫଟୋ ଅପଡେଟ ହୋଇଛି!`,
    sub: "ଜଣେ ଲାଇଭ ନ୍ୟୁମେରୋଲୋଜିସ୍ଟ ସହ କଥା କରନ୍ତୁ — ବିଶେଷଜ୍ଞ ମାର୍ଗଦର୍ଶନ।",
    adminNote: "ଆପଣ ଆଡମିନ — ସମ୍ପୂର୍ଣ୍ଣ ପରିବର୍ତ୍ତନ Admin Panel ରେ କରନ୍ତୁ।",
    search: "ଭାଷା କିମ୍ବା ନାମରେ ଖୋଜନ୍ତୁ...",
    uploading: "ଅପଲୋଡ୍ ହେଉଛି...", updatePhoto: "ଫଟୋ ବଦଳାନ୍ତୁ",
    onlinePay: "ଅନଲାଇନ୍ ପେମେଣ୍ଟ",
  },
  as: {
    needLogin: "ছেশ্ন বুক কৰিবলৈ প্ৰথমে লগইন কৰক।",
    booked: (n) => `${n}ৰ সৈতে বুক হৈছে! আমি যোগাযোগ কৰিম।`,
    errFile: "দয়া কৰি এটা ছবিৰ ফাইল বাছনি কৰক।",
    adminOnly: "ছবি কেৱল এডমিনে আপডেট কৰিব পাৰে। /admin লৈ যাওক।",
    updated: (n) => `${n}ৰ ছবি আপডেট হৈছে!`,
    sub: "এজন লাইভ নিউমেৰলজিষ্টৰ সৈতে কথা কৰক — বিশেষজ্ঞ দিশনিৰ্দেশন।",
    adminNote: "আপুনি এডমিন — সম্পূৰ্ণ সলনি Admin Panelত কৰক।",
    search: "ভাষা বা নামৰে সন্ধান কৰক...",
    uploading: "আপলোড হৈছে...", updatePhoto: "ছবি সলনি কৰক",
    onlinePay: "অনলাইন পেৱমেন্ট",
  },
};

export default function Experts() {
  const { t, lang } = useLanguage();
  const TX = pageTX(EXP_TX, lang);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("");
  const [experts, setExperts] = useState(DEFAULT_EXPERTS.map((e) => ({ ...e, id: e.id })));
  const [uploadingId, setUploadingId] = useState(null);
  const [payment, setPayment] = useState(PAYMENT_DEFAULTS);
  const [whatsapp, setWhatsapp] = useState(WHATSAPP_DEFAULT);

  // Admin overrides (Firestore: experts + expert_photos) merge with defaults
  useEffect(() => {
    (async () => {
      try {
        const overSnap = await getDocs(collection(db, "experts"));
        const overrides = {};
        overSnap.docs.forEach((d) => { overrides[d.id] = { id: d.id, ...d.data() }; });
        const photoSnap = await getDocs(collection(db, "expert_photos"));
        const photos = {};
        photoSnap.docs.forEach((d) => { if (d.data()?.url) photos[d.id] = d.data().url; });
        const merged = DEFAULT_EXPERTS.map((e) => ({
          ...e,
          ...(overrides[e.id] || {}),
          photo: photos[e.id] || overrides[e.id]?.photo || e.photo,
          langs: Array.isArray(overrides[e.id]?.langs) ? overrides[e.id].langs : e.langs,
        }));
        Object.values(overrides).forEach((o) => {
          if (!merged.find((m) => m.id === o.id)) {
            merged.push({ photo: photos[o.id] || o.photo || "", langs: o.langs || [], ...o });
          }
        });
        setExperts(merged);
        const pSnap = await getDoc(doc(db, "settings", "payment")).catch(() => null);
        if (pSnap?.exists()) {
          setPayment({ ...PAYMENT_DEFAULTS, ...pSnap.data() });
          if (pSnap.data()?.whatsapp) setWhatsapp(pSnap.data().whatsapp);
        }
      } catch {
        // Firestore not configured yet — fall back to local photos
      }
    })();
  }, []);

  const book = async (expert) => {
    if (!user) {
      setMsg(TX.needLogin);
      return;
    }
    try {
      await addDoc(collection(db, "bookings"), {
        uid: user.uid, email: user.email,
        expertId: expert.id, expertName: expert.name,
        createdAt: serverTimestamp(), status: "pending",
      });
      setMsg(TX.booked(expert.name));
    } catch (e) {
      setMsg(e.message);
    }
  };

  // Admin-only quick photo update (full edit Admin panel me hai)
  const updatePhoto = async (expert, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMsg(TX.errFile); return; }
    if (!isAdmin) { setMsg(TX.adminOnly); return; }
    setUploadingId(expert.id);
    setMsg("");
    try {
      const path = `expert-photos/${expert.id}_${Date.now()}_${file.name}`;
      const r = storageRef(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await setDoc(doc(db, "expert_photos", expert.id), {
        url, path, updatedAt: serverTimestamp(), updatedBy: user.uid,
      });
      setExperts((p) => p.map((x) => (x.id === expert.id ? { ...x, photo: url } : x)));
      setMsg(TX.updated(expert.name));
    } catch (e) {
      setMsg(e.message || "Upload failed. Storage rules check karein.");
    } finally {
      setUploadingId(null);
    }
  };

  const langsOf = (e) => (Array.isArray(e.langs) ? e.langs.join(", ") : e.langs);

  const list = experts.filter((e) =>
    !filter || langsOf(e).toLowerCase().includes(filter.toLowerCase()) || e.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-gradient">{t("experts_title")}</h1>
      <p>{TX.sub}</p>
      {isAdmin && (
        <p style={{ fontSize: ".85rem", marginTop: 6 }}>
          {TX.adminNote} <Link to="/admin" style={{ color: "var(--accent-2)" }}>Admin Panel</Link>
        </p>
      )}
      <div style={{ marginTop: 16, maxWidth: 400 }}>
        <input className="input" placeholder={TX.search} value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      {msg && <p style={{ color: "var(--accent-2)", marginTop: 12 }}>{msg}</p>}
      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {list.map((e) => (
          <div key={e.id} className="card" style={{ textAlign: "center" }}>
            <img src={e.photo} alt={e.name} style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
            <h3 style={{ marginTop: 10 }}>{e.name}</h3>
            <p>⭐ {e.rating} · {e.exp} exp</p>
            <p style={{ fontSize: ".85rem" }}>{langsOf(e)}</p>
            <p style={{ fontWeight: 700, color: "var(--gold)" }}>{e.price}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
              <button className="btn" onClick={() => book(e)}>{t("book_session")}</button>
              {(() => {
                const amt = parsePrice(e.price);
                const upi = upiLink({ upiId: payment.upiId, payeeName: payment.payeeName, amount: amt, note: `Numerology session ${e.name}` });
                return (
                  <>
                    <a className="btn secondary" href={upi}>UPI Pay{amt ? ` ₹${amt}` : ""}</a>
                    <a
                      className="btn secondary"
                      href={waLink(whatsapp, `Namaste! Mujhe ${e.name} se numerology session chahiye. (${e.price})`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                    {payment.paymentLink && (
                      <a className="btn secondary" href={payment.paymentLink} target="_blank" rel="noreferrer">{TX.onlinePay}</a>
                    )}
                  </>
                );
              })()}
            </div>
            {isAdmin && (
              <div style={{ marginTop: 10 }}>
                <label className="btn secondary" style={{ padding: "8px 14px", fontSize: ".8rem", cursor: "pointer" }}>
                  {uploadingId === e.id ? TX.uploading : TX.updatePhoto}
                  <input
                    type="file" accept="image/*" style={{ display: "none" }}
                    disabled={uploadingId === e.id}
                    onChange={(ev) => updatePhoto(e, ev.target.files?.[0])}
                  />
                </label>
              </div>
            )}
            <Reviews expertId={e.id} expertName={e.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
