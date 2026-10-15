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

export default function Experts() {
  const { t, lang } = useLanguage();
  const T = {
    hi: {
      needLogin: "Session book karne ke liye pehle login karein.",
      booked: (n) => `${n} ke saath book ho gaya! Hum sampark karenge.`,
      errFile: "Kripya image file chunein.",
      adminOnly: "Sirf admin photo update kar sakta hai. /admin me jayein.",
      updated: (n) => `${n} ki photo update ho gayi!`,
      sub: "Live numerologist se baat karein — expert margdarshan.",
      adminNote: "Aap admin hain — poora edit Admin Panel me karein.",
      search: "Bhasha ya naam se khojein...",
      uploading: "Upload ho raha hai...", updatePhoto: "Photo Badlein",
      onlinePay: "Online Pay",
    },
    mr: {
      needLogin: "Session book करण्यासाठी आधी लॉगिन करा.",
      booked: (n) => `${n} यांच्यासोबत book झाले! आम्ही संपर्क करू.`,
      errFile: "कृपया image file निवडा.",
      adminOnly: "फक्त admin फोटो update करू शकतो. /admin मध्ये जा.",
      updated: (n) => `${n} यांचा फोटो update झाला!`,
      sub: "Live numerologist शी बोला — तज्ज्ञ मार्गदर्शन.",
      adminNote: "तुम्ही admin आहात — पूर्ण edit Admin Panel मध्ये करा.",
      search: "भाषा किंवा नावाने शोधा...",
      uploading: "Upload होत आहे...", updatePhoto: "फोटो बदला",
      onlinePay: "Online Pay",
    },
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
  }[lang] || null;
  const TX = T || {
    needLogin: "Please login first.", booked: (n) => `Booked with ${n}!`,
    errFile: "Image file only.", adminOnly: "Admin only.", updated: (n) => `${n} updated.`,
    sub: "Expert guidance.", adminNote: "Admin panel.", search: "Search...",
    uploading: "...", updatePhoto: "Update", onlinePay: "Pay",
  };
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
