import React, { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../auth/AuthContext.jsx";

function Stars({ value, onPick }) {
  return (
    <div style={{ display: "flex", gap: 4, fontSize: "1.4rem", cursor: onPick ? "pointer" : "default" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} onClick={() => onPick && onPick(s)} style={{ color: s <= value ? "var(--gold)" : "var(--border)" }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews({ expertId, expertName }) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const T = {
    hi: { none: "Abhi koi review nahi", write: "Review Likhein", ph: "Apna anubhav likhein...", send: "Bhejein", needLogin: "Review ke liye login karein.", empty: "Apna anubhav likhein.", thanks: "Dhanyavaad! Admin approve karega tab review dikhega.", reviews: "reviews" },
    mr: { none: "अजून कोणताही review नाही", write: "Review लिहा", ph: "तुमचा अनुभव लिहा...", send: "पाठवा", needLogin: "Review साठी लॉगिन करा.", empty: "तुमचा अनुभव लिहा.", thanks: "धन्यवाद! Admin मान्यता देईल तेव्हा review दिसेल.", reviews: "reviews" },
    en: { none: "No reviews yet", write: "Write Review", ph: "Write your experience...", send: "Send", needLogin: "Please login to review.", empty: "Please write your experience.", thanks: "Thanks! Visible after admin approval.", reviews: "reviews" },
  }[lang] || { none: "No reviews yet", write: "Write Review", ph: "Write...", send: "Send", needLogin: "Login required.", empty: "Write something.", thanks: "Thanks!", reviews: "reviews" };
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "reviews"), where("expertId", "==", expertId));
        const snap = await getDocs(q);
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setReviews(all.filter((r) => (r.status || "pending") === "approved"));
      } catch { /* Firestore nahi hai to khaali */ }
    })();
  }, [expertId]);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : null;

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { setMsg(T.needLogin); return; }
    if (!text.trim()) { setMsg(T.empty); return; }
    try {
      await addDoc(collection(db, "reviews"), {
        expertId, expertName,
        uid: user.uid, email: user.email || "",
        name: user.displayName || (user.email || "").split("@")[0],
        rating, text: text.trim(),
        status: "pending", createdAt: serverTimestamp(),
      });
      setMsg(T.thanks);
      setText("");
      setShowForm(false);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ marginTop: 12, textAlign: "left", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: ".85rem" }}>
          {avg ? <>⭐ {avg} ({reviews.length} {T.reviews})</> : T.none}
        </span>
        <button className="btn secondary" style={{ padding: "6px 12px", fontSize: ".75rem" }} onClick={() => setShowForm(!showForm)}>
          {T.write}
        </button>
      </div>
      {reviews.slice(0, 2).map((r) => (
        <div key={r.id} style={{ marginTop: 8, fontSize: ".85rem" }}>
          <Stars value={r.rating || 5} />
          <p style={{ marginTop: 2 }}>"{r.text}" — <b>{r.name}</b></p>
        </div>
      ))}
      {showForm && (
        <form onSubmit={submit} style={{ marginTop: 10 }}>
          <Stars value={rating} onPick={setRating} />
          <textarea className="input" rows={2} style={{ marginTop: 8 }} value={text} onChange={(e) => setText(e.target.value)} placeholder={T.ph} />
          <button className="btn" style={{ marginTop: 8, padding: "8px 16px" }} type="submit">{T.send}</button>
        </form>
      )}
      {msg && <p style={{ fontSize: ".8rem", color: "var(--accent-2)", marginTop: 6 }}>{msg}</p>}
    </div>
  );
}
