import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { db, storage } from "../firebase.js";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection, addDoc, serverTimestamp,
  getDocs, deleteDoc, doc,
} from "firebase/firestore";
import { useAuth } from "../auth/AuthContext.jsx";
import { useAdmin } from "../auth/useAdmin.js";

const TX = {
  hi: {
    sub: "फोटो अपलोड करें — एडमिन स्वीकृति देने पर ही सार्वजनिक गैलरी में दिखेगी।",
    drop: "अपलोड के लिए चित्र चुनें", mine: "मेरे अपलोड", approved: "गैलरी",
    del: "हटाएँ", confirm: "हटाएँ?", noImg: "अभी कोई फोटो नहीं है।",
    needLogin: "अपलोड के लिए पहले लॉगिन करें।", done: "अपलोड हो गया! एडमिन स्वीकृति देगा तब दिखेगा।",
    errFile: "कृपया चित्र फाइल चुनें।",
  },
  mr: {
    sub: "फोटो अपलोड करा — एडमिन मान्यता देईल तेव्हाच सार्वजनिक गॅलरीत दिसेल.",
    drop: "अपलोडसाठी चित्र निवडा", mine: "माझे अपलोड", approved: "गॅलरी",
    del: "हटवा", confirm: "हटवायचे?", noImg: "अजून कोणताही फोटो नाही.",
    needLogin: "अपलोडसाठी आधी लॉगिन करा.", done: "अपलोड झाले! एडमिन मान्यता देईल तेव्हा दिसेल.",
    errFile: "कृपया चित्र फाइल निवडा.",
  },
  bn: {
    sub: "একটি ছবি আপলোড করুন — অ্যাডমিন অনুমোদনের পর সেটি পাব্লিক গ্যালারিতে দেখা যাবে।",
    drop: "একটি ছবি বেছে নিতে ক্লিক করুন", mine: "আমার আপলোড", approved: "গ্যালারি",
    del: "মুছুন", confirm: "এই ছবিটি মুছবেন?", noImg: "এখনও কোনো ছবি নেই।",
    needLogin: "আপলোড করতে প্রথমে লগইন করুন।", done: "আপলোড হয়েছে! অ্যাডমিন অনুমোদনের পর দেখা যাবে।",
    errFile: "অনুগ্রহ করে একটি ছবির ফাইল নির্বাচন করুন।",
  },
  te: {
    sub: "ఒక ఫోటోను అప్‌లోడ్ చేయండి — అడ్మిన్ ఆమోదం తర్వాత అది పబ్లిక్ గ్యాలరీలో కనిపిస్తుంది.",
    drop: "ఇమేజ్‌ను ఎంచుకోవడానికి క్లిక్ చేయండి", mine: "నా అప్‌లోడ్లు", approved: "గ్యాలరీ",
    del: "తొలగించు", confirm: "ఈ చిత్రాన్ని తొలగించాలా?", noImg: "ఇంకా ఫోటోలు లేవు.",
    needLogin: "అప్‌లోడ్ చేయడానికి దయచేసి ముందుగా లాగిన్ అవ్వండి.", done: "అప్‌లోడ్ అయ్యింది! అడ్మిన్ ఆమోదం తర్వాత కనిపిస్తుంది.",
    errFile: "దయచేసి ఒక ఇమేజ్ ఫైల్‌ను ఎంచుకోండి.",
  },
  ta: {
    sub: "ஒரு படத்தைப் பதிவேற்றுங்கள் — நிர்வாகி ஒப்புதலுக்குப் பிறகு அது பொது கலைக்காட்சியில் தெரியும்.",
    drop: "ஒரு படத்தைத் தேர்ந்தெடுக்க கிளிக் செய்யுங்கள்", mine: "எனது பதிவுகள்", approved: "கலைக்காட்சி",
    del: "நீக்கு", confirm: "இந்தப் படத்தை நீக்கவா?", noImg: "இன்னும் படங்கள் இல்லை.",
    needLogin: "பதிவேற்ற முதல் உள்ளேறவும்.", done: "பதிவேற்றப்பட்டது! நிர்வாகி ஒப்புதலுக்குப் பிறகு தெரியும்.",
    errFile: "ஒரு படக் கோப்பைத் தேர்ந்தெடுக்கவும்.",
  },
  gu: {
    sub: "ફોટો અપલોડ કરો — એડમિન મંજૂરી પછી તે જાહેર ગેલેરીમાં દેખાશે.",
    drop: "ઇમેજ પસંદ કરવા ક્લિક કરો", mine: "મારા અપલોડ", approved: "ગેલેરી",
    del: "કાઢી નાખો", confirm: "આ ફોટો કાઢી નાખવો છે?", noImg: "હજી કોઈ ફોટો નથી.",
    needLogin: "અપલોડ કરવા પહેલાં લોગિન કરો.", done: "અપલોડ થઈ ગયું! એડમિન મંજૂરી પછી દેખાશે.",
    errFile: "કૃપા કરીને ઇમેજ ફાઇલ પસંદ કરો.",
  },
  ur: {
    sub: "تصویر اپ لوڈ کریں — ایڈمن کی منظوری کے بعد یہ عوامی گیلری میں نظر آئے گا۔",
    drop: "تصویر منتخب کرنے کے لیے کلک کریں", mine: "میری اپ لوڈز", approved: "گیلری",
    del: "حذف کریں", confirm: "کیا یہ تصویر حذف کر دیں؟", noImg: "ابھی کوئی تصویر نہیں۔",
    needLogin: "اپ لوڈ کرنے کے لیے پہلے لاگ اِن کریں۔", done: "اپ لوڈ ہو گیا! ایڈمن کی منظوری کے بعد نظر آئے گا۔",
    errFile: "براہِ کرم ایک تصویر فائل منتخب کریں۔",
  },
  kn: {
    sub: "ಒಂದು ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ — ನಿರ್ವಹಕರ ಅನುಮೋದನೆಯ ನಂತರ ಅದು ಸಾರ್ವಜನಿಕ ಗ್ಯಾಲರಿಯಲ್ಲಿ ಕಾಣುಗಳುಗಿಯುತ್ತದೆ.",
    drop: "ಚಿತ್ರ ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ", mine: "ನನ್ನ ಅಪ್‌ಲೋಡ್‌ಗಳು", approved: "ಗ್ಯಾಲರಿ",
    del: "ಅಳಿಸಿ", confirm: "ಈ ಚಿತ್ರವನ್ನು ಅಳಿಸಬೇಕೇ?", noImg: "ಇನ್ನೂ ಯಾವುದೇ ಫೋಟೋ ಇಲ್ಲ.",
    needLogin: "ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಮೊದಲು ಲಾಗಿನ್ ಆಗಿ.", done: "ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ! ನಿರ್ವಹಕರ ಅನುಮೋದನೆಯ ನಂತರ ಕಾಣುಗಳುಗಿಯುತ್ತದೆ.",
    errFile: "ದಯವಿಟ್ಟು ಒಂದು ಚಿತ್ರ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.",
  },
  ml: {
    sub: "ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക — അഡ്മിൻ അനുമോദനയ്ക്ക് ശേഷം അത് പൊതു ഗാലറിയിൽ കാണാം.",
    drop: "ഒരു ഇമേജ് തിരഞ്ഞെടുക്കാൻ ക്ലിക്ക് ചെയ്യുക", mine: "എന്റെ അപ്‌ലോഡുകൾ", approved: "ഗാലറി",
    del: "ഇല്ലാതാക്കുക", confirm: "ഈ ചിത്രം ഇല്ലാതാക്കണമോ?", noImg: "ഇതുവരെ ഫോട്ടോകൾ ഇല്ല.",
    needLogin: "അപ്‌ലോഡ് ചെയ്യാൻ ആദ്യം ലോഗിൻ ചെയ്യുക.", done: "അപ്‌ലോഡ് ചെയ്തു! അഡ്മിൻ അനുമോദനയ്ക്ക് ശേഷം കാണാം.",
    errFile: "ഒരു ഇമേജ് ഫയൽ തിരഞ്ഞെടുക്കുക.",
  },
  pa: {
    sub: "ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ — ਐਡਮਿਨ ਦੀ ਮਨਜ਼ੂਰੀ ਤੋਂ ਬਾਅਦ ਇਹ ਜਨਤਾ ਗੈਲਰੀ ਵਿੱਚ ਦਿਸੇਗਾ।",
    drop: "ਚਿੱਤਰ ਚੁਣਨ ਲਈ ਕਲਿੱਕ ਕਰੋ", mine: "ਮੇਰੇ ਅਪਲੋਡ", approved: "ਗੈਲਰੀ",
    del: "ਮਿਟਾਓ", confirm: "ਕੀ ਇਹ ਤਸਵੀਰ ਮਿਟਾ ਦੇਵੀਂ?", noImg: "ਹਾਲੇ ਕੋਈ ਤਸਵੀਰ ਨਹੀਂ।",
    needLogin: "ਅਪਲੋਡ ਕਰਨ ਲਈ ਪਹਿਲਾਂ ਲੌਗਇਨ ਕਰੋ।", done: "ਅਪਲੋਡ ਹੋ ਗਿਆ! ਐਡਮਿਨ ਦੀ ਮਨਜ਼ੂਰੀ ਤੋਂ ਬਾਅਦ ਦਿਸੇਗਾ।",
    errFile: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਚਿੱਤਰ ਫ਼ਾਈਲ ਚੁਣੋ।",
  },
  or: {
    sub: "ଏକଟି ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ — ଆଡମିନ ଅନୁମୋଦନ ପରେ ତାହା ସାର୍ବଜନୀନ ଗ୍ୟାଲରୀରେ ଦେଖାଯିବ।",
    drop: "ଛବି ବାଛିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ", mine: "ମୋର ଅପଲୋଡ", approved: "ଗ୍ୟାଲରୀ",
    del: "ମିଟାଅନ୍ତୁ", confirm: "ଏହି ଛବିଟି ମିଟାଇବେ କି?", noImg: "ଏ ପର୍ଯ୍ୟନ୍ତ କୌଣସି ଫଟୋ ନାହିଁ।",
    needLogin: "ଅପଲୋଡ୍ କରିବା ପୂର୍ବରୁ ଲଗଇନ୍ କରନ୍ତୁ।", done: "ଅପଲୋଡ୍ ହେଲା! ଆଡମିନ ଅନୁମୋଦନ ପରେ ଦେଖାଯିବ।",
    errFile: "ଦୟା କରି ଏକଟି ଛବି ଫାଇଲ ବାଛନ୍ତୁ।",
  },
  as: {
    sub: "এখন ফট’ অপলোড কৰক — এডমিনৰ অনুমোদনৰ পিছত সেইটো ৰাজহীন গেলাৰীত দেখা যাব।",
    drop: "ছবিটো বাছনিৰ বাবে ক্লিক কৰক", mine: "মোৰ আপলোড", approved: "গেলাৰী",
    del: "মচক", confirm: "এই ছবিটো মচাৱ নেকি?", noImg: "এতিয়ালৈকে কোনো ফটো নাই।",
    needLogin: "আপলোড কৰাৰ পৰ্বতে লগইন কৰক।", done: "আপলোড হৈছে! এডমিনৰ অনুমোদনৰ পিছত দেখা যাব।",
    errFile: "অনুগ্ৰহ কৰি এখন ছবি ফাইল বাছনি কৰক।",
  },
  en: {
    sub: "Upload a photo — it appears in the public gallery after admin approval.",
    drop: "Click to select an image", mine: "My Uploads", approved: "Gallery",
    del: "Delete", confirm: "Delete this image?", noImg: "No photos yet.",
    needLogin: "Please login first to upload.", done: "Uploaded! Visible after admin approval.",
    errFile: "Please select an image file.",
  },
};

export default function Gallery() {
  const { t, lang } = useLanguage();
  const T = pageTX(TX, lang);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [files, setFiles] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const byDateDesc = (arr) => [...arr].sort((a, b) => {
    const ta = a.createdAt?.seconds || 0;
    const tb = b.createdAt?.seconds || 0;
    return tb - ta;
  });

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "gallery"));
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFiles(byDateDesc(all.filter((g) => g.status === "approved")));
    } catch (err) {
      setError(err?.message || t("gallery_empty"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadMine = useCallback(async () => {
    if (!user) { setMine([]); return; }
    try {
      const snap = await getDocs(collection(db, "gallery"));
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMine(byDateDesc(all.filter((g) => g.uid === user.uid)));
    } catch { /* ignore */ }
  }, [user]);

  useEffect(() => { loadFiles(); }, [loadFiles]);
  useEffect(() => { loadMine(); }, [loadMine]);

  const handleUpload = (fileList) => {
    if (!fileList || !fileList.length) return;
    const file = fileList[0];
    if (!file.type.startsWith("image/")) {
      setError(T.errFile);
      return;
    }
    if (!user) {
      setError(T.needLogin);
      return;
    }
    setError("");
    setMessage("");
    setUploading(true);
    setProgress(0);
    const path = `images/${user.uid}_${Date.now()}_${file.name}`;
    const fileRef = storageRef(storage, path);
    const task = uploadBytesResumable(fileRef, file);
    task.on(
      "state_changed",
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => {
        setError(err?.message || T.errFile);
        setUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, "gallery"), {
            path, url,
            name: file.name,
            uid: user.uid,
            email: user.email || "",
            status: "pending",
            createdAt: serverTimestamp(),
          });
          setMessage(T.done);
          loadMine();
        } catch (e) {
          setError(e.message);
        } finally {
          setUploading(false);
        }
      }
    );
  };

  const handleDelete = async (item, setter) => {
    if (!window.confirm(T.confirm)) return;
    try {
      await deleteObject(storageRef(storage, item.path)).catch(() => {});
      await deleteDoc(doc(db, "gallery", item.id));
      setter((prev) => prev.filter((f) => f.id !== item.id));
      if (setter === mine) loadFiles();
    } catch (err) {
      setError(err?.message || T.confirm);
    }
  };

  const canDelete = (item) => isAdmin || (user && item.uid === user.uid);

  return (
    <div>
      <h1 className="text-gradient">{t("gallery_title")}</h1>
      <p>{T.sub}</p>

      <div style={{ marginTop: 20 }} className="card">
        <label className="label">{t("gallery_upload")}</label>
        <div className="dropzone" onClick={() => document.getElementById("file-input").click()}>
          <p>{T.drop}</p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
        {uploading && (
          <div style={{ marginTop: 12 }}>
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>
            <p style={{ textAlign: "center", marginTop: 6 }}>{progress}%</p>
          </div>
        )}
        {message && <p style={{ color: "var(--accent-2)", marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>}
      </div>

      {user && mine.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>{T.mine}</h3>
          <div className="gallery-grid" style={{ marginTop: 10 }}>
            {mine.map((f) => (
              <div key={f.id} style={{ position: "relative" }}>
                <img src={f.url} alt={f.name} />
                <span className="badge" style={{ position: "absolute", top: 8, left: 8 }}>{f.status}</span>
                {canDelete(f) && (
                  <button
                    className="btn danger"
                    style={{ position: "absolute", top: 8, right: 8, padding: "6px 10px", fontSize: ".75rem" }}
                    onClick={() => handleDelete(f, setMine)}
                  >
                    {T.del}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>{T.approved} ({files.length})</h3>
          <button className="btn secondary" onClick={loadFiles} disabled={loading}>{t("gallery_refresh")}</button>
        </div>
        {loading && <div className="spinner" />}
        {!loading && files.length === 0 && <p>{t("gallery_empty")}</p>}
        <div className="gallery-grid">
          {files.map((f) => (
            <div key={f.id} style={{ position: "relative" }}>
              <img src={f.url} alt={f.name} loading="lazy" />
              {canDelete(f) && (
                <button
                  className="btn danger"
                  style={{ position: "absolute", top: 8, right: 8, padding: "6px 10px", fontSize: ".75rem" }}
                  onClick={() => handleDelete(f, setFiles)}
                >
                  {T.del}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
