import React, { useEffect, useState } from "react";
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
    if (!user) { setMsg("Review ke liye login karein."); return; }
    if (!text.trim()) { setMsg("Apna anubhav likhein."); return; }
    try {
      await addDoc(collection(db, "reviews"), {
        expertId, expertName,
        uid: user.uid, email: user.email || "",
        name: user.displayName || (user.email || "").split("@")[0],
        rating, text: text.trim(),
        status: "pending", createdAt: serverTimestamp(),
      });
      setMsg("Dhanyavaad! Admin approve karega tab review dikhega.");
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
          {avg ? <>⭐ {avg} ({reviews.length} reviews)</> : "Abhi koi review nahi"}
        </span>
        <button className="btn secondary" style={{ padding: "6px 12px", fontSize: ".75rem" }} onClick={() => setShowForm(!showForm)}>
          Review Likhein
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
          <textarea className="input" rows={2} style={{ marginTop: 8 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Apna anubhav likhein..." />
          <button className="btn" style={{ marginTop: 8, padding: "8px 16px" }} type="submit">Bhejein</button>
        </form>
      )}
      {msg && <p style={{ fontSize: ".8rem", color: "var(--accent-2)", marginTop: 6 }}>{msg}</p>}
    </div>
  );
}
