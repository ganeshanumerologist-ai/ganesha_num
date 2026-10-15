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
  const { t } = useLanguage();
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
      setMsg("Please login first to book a session.");
      return;
    }
    try {
      await addDoc(collection(db, "bookings"), {
        uid: user.uid, email: user.email,
        expertId: expert.id, expertName: expert.name,
        createdAt: serverTimestamp(), status: "pending",
      });
      setMsg(`Booked with ${expert.name}! We will contact you.`);
    } catch (e) {
      setMsg(e.message);
    }
  };

  // Admin-only quick photo update (full edit Admin panel me hai)
  const updatePhoto = async (expert, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMsg("Please select an image file."); return; }
    if (!isAdmin) { setMsg("Sirf admin photo update kar sakta hai. /admin me jayein."); return; }
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
      setMsg(`${expert.name} ki photo update ho gayi!`);
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
      <p>AstroSage AI jaisa expert guidance — live numerologist se baat karein.</p>
      {isAdmin && (
        <p style={{ fontSize: ".85rem", marginTop: 6 }}>
          Aap admin hain — poora edit <Link to="/admin" style={{ color: "var(--accent-2)" }}>Admin Panel</Link> me karein.
        </p>
      )}
      <div style={{ marginTop: 16, maxWidth: 400 }}>
        <input className="input" placeholder="Search by language or name... (e.g. Hindi, Tamil)" value={filter} onChange={(e) => setFilter(e.target.value)} />
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
                      <a className="btn secondary" href={payment.paymentLink} target="_blank" rel="noreferrer">Online Pay</a>
                    )}
                  </>
                );
              })()}
            </div>
            {isAdmin && (
              <div style={{ marginTop: 10 }}>
                <label className="btn secondary" style={{ padding: "8px 14px", fontSize: ".8rem", cursor: "pointer" }}>
                  {uploadingId === e.id ? "Uploading..." : "Update Photo"}
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
