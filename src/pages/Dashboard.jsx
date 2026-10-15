import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { db, storage } from "../firebase.js";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const byDateDesc = (arr) => [...arr].sort((a, b) => {
  const ta = a.createdAt?.seconds || 0;
  const tb = b.createdAt?.seconds || 0;
  return tb - ta;
});

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { t, lang } = useLanguage();
  const T = {
    hi: {
      welcome: "Namaste", bookings: "Meri Bookings", noBooking: "Abhi koi booking nahi. Experts page se session book karein.",
      noReading: "Abhi kuch save nahi hai. Calculator par jayein.", del: "Delete", confirm: "Delete karein?",
      errFile: "Image file chunein.", kundliDone: "Kundli jud gayi! Expert session me ise dekhega.",
      status: "Status", paid: "Paid", unpaid: "Unpaid", kundli: "Kundli", view: "Dekhein", noKundli: "Nahi judi",
      uploading: "Upload ho raha hai...", change: "Kundli Badlein", attach: "Kundli Jodein",
    },
    mr: {
      welcome: "Namaskar", bookings: "Mazhya Bookings", noBooking: "Ajun booking nahi. Experts page varoon session book kara.",
      noReading: "Ajun kahi save nahi. Calculator var ja.", del: "Delete", confirm: "Delete karayche?",
      errFile: "Image file nivda.", kundliDone: "Kundli jodli! Expert session madhe pahanar.",
      status: "Status", paid: "Paid", unpaid: "Unpaid", kundli: "Kundli", view: "Paha", noKundli: "Jodli nahi",
      uploading: "Upload hot aahe...", change: "Kundli Badla", attach: "Kundli Joda",
    },
    en: {
      welcome: "Welcome", bookings: "My Bookings", noBooking: "No bookings yet. Book a session from Experts page.",
      noReading: "No saved readings yet. Go to Calculator.", del: "Delete", confirm: "Delete?",
      errFile: "Please choose an image file.", kundliDone: "Kundli attached! Expert will see it in session.",
      status: "Status", paid: "Paid", unpaid: "Unpaid", kundli: "Kundli", view: "View", noKundli: "Not attached",
      uploading: "Uploading...", change: "Change Kundli", attach: "Attach Kundli",
    },
  }[lang] || {
    welcome: "Welcome", bookings: "Bookings", noBooking: "No bookings.", noReading: "Nothing saved.",
    del: "Delete", confirm: "Delete?", errFile: "Image only.", kundliDone: "Attached!",
    status: "Status", paid: "Paid", unpaid: "Unpaid", kundli: "Kundli", view: "View", noKundli: "-",
    uploading: "...", change: "Change", attach: "Attach",
  };
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
