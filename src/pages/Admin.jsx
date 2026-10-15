import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useAdmin } from "../auth/useAdmin.js";
import { db, storage } from "../firebase.js";
import {
  collection, getDocs, doc, setDoc, deleteDoc, addDoc,
  updateDoc, orderBy, query, serverTimestamp, getDoc, where,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { EXPERTS as DEFAULT_EXPERTS } from "../data/experts.js";
import { PAYMENT_DEFAULTS } from "../config/payment.js";
import { SOCIAL_DEFAULTS, SOCIAL_META } from "../config/social.js";

const TABS = ["Experts", "Bookings", "Inquiries", "Gallery", "Reviews", "Blog", "Social", "Payment"];

const emptyExpert = { name: "", langs: "", exp: "", price: "", rating: 4.5 };

export default function Admin() {
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useAdmin();
  const nav = useNavigate();
  const [tab, setTab] = useState("Experts");
  const [msg, setMsg] = useState("");

  const [experts, setExperts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [pendingGallery, setPendingGallery] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyExpert);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyExpert);
  const [addFile, setAddFile] = useState(null);
  const [payment, setPayment] = useState({ ...PAYMENT_DEFAULTS, whatsapp: "" });
  const [social, setSocial] = useState(SOCIAL_DEFAULTS);
  const [postForm, setPostForm] = useState({ title: "", excerpt: "", tags: "", body: "" });
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    if (!loading && !checking && !user) nav("/login");
  }, [user, loading, checking, nav]);

  const loadAll = async () => {
    setBusy(true);
    setMsg("");
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

      try {
        const bSnap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
        setBookings(bSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch { setBookings([]); }
      try {
        const iSnap = await getDocs(query(collection(db, "inquiries"), orderBy("createdAt", "desc")));
        setInquiries(iSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch { setInquiries([]); }
      try {
        const gSnap = await getDocs(query(collection(db, "gallery"), where("status", "==", "pending"), orderBy("createdAt", "desc")));
        setPendingGallery(gSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        try {
          const gSnap2 = await getDocs(collection(db, "gallery"));
          setPendingGallery(gSnap2.docs.map((d) => ({ id: d.id, ...d.data() })).filter((g) => g.status === "pending"));
        } catch { setPendingGallery([]); }
      }
      try {
        const pSnap = await getDoc(doc(db, "settings", "payment"));
        if (pSnap.exists()) setPayment({ ...PAYMENT_DEFAULTS, whatsapp: "", ...pSnap.data() });
      } catch { /* ignore */ }
      try {
        const rSnap = await getDocs(query(collection(db, "reviews"), where("status", "==", "pending"), orderBy("createdAt", "desc")));
        setPendingReviews(rSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        try {
          const r2 = await getDocs(collection(db, "reviews"));
          setPendingReviews(r2.docs.map((d) => ({ id: d.id, ...d.data() })).filter((r) => (r.status || "pending") === "pending"));
        } catch { setPendingReviews([]); }
      }
      try {
        const sSnap = await getDoc(doc(db, "settings", "social"));
        if (sSnap.exists()) setSocial({ ...SOCIAL_DEFAULTS, ...sSnap.data() });
      } catch { /* ignore */ }
      try {
        const pSnap2 = await getDocs(collection(db, "posts"));
        setPosts(pSnap2.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch { setPosts([]); }
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const activateAdmin = async () => {
    try {
      await setDoc(doc(db, "admins", user.uid), {
        email: user.email, createdAt: serverTimestamp(),
      });
      setMsg("Admin activated! Page refresh karein.");
    } catch (e) {
      setMsg(e.message);
    }
  };

  const startEdit = (e) => {
    setEditing(e.id);
    setForm({
      name: e.name || "",
      langs: Array.isArray(e.langs) ? e.langs.join(", ") : (e.langs || ""),
      exp: e.exp || "",
      price: e.price || "",
      rating: e.rating || 4.5,
    });
  };

  const saveExpert = async (id) => {
    setBusy(true);
    try {
      await setDoc(doc(db, "experts", id), {
        name: form.name,
        langs: form.langs.split(",").map((s) => s.trim()).filter(Boolean),
        exp: form.exp,
        price: form.price,
        rating: Number(form.rating) || 4.5,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setEditing(null);
      setMsg("Expert save ho gaya!");
      loadAll();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  // Naya expert add karo
  const addExpert = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) { setMsg("Naam likhein."); return; }
    setBusy(true);
    try {
      const id = `custom_${Date.now()}`;
      let photoUrl = "";
      if (addFile) {
        const path = `expert-photos/${id}_${Date.now()}_${addFile.name}`;
        const r = storageRef(storage, path);
        await uploadBytes(r, addFile);
        photoUrl = await getDownloadURL(r);
        await setDoc(doc(db, "expert_photos", id), {
          url: photoUrl, path, updatedAt: serverTimestamp(), updatedBy: user.uid,
        });
      }
      await setDoc(doc(db, "experts", id), {
        name: addForm.name.trim(),
        langs: addForm.langs.split(",").map((s) => s.trim()).filter(Boolean),
        exp: addForm.exp,
        price: addForm.price,
        rating: Number(addForm.rating) || 4.5,
        ...(photoUrl ? { photo: photoUrl } : {}),
        createdAt: serverTimestamp(),
      });
      setAddForm(emptyExpert);
      setAddFile(null);
      setShowAdd(false);
      setMsg("Naya expert add ho gaya!");
      loadAll();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  const uploadPhoto = async (id, file) => {
    if (!file) return;
    setBusy(true);
    try {
      const path = `expert-photos/${id}_${Date.now()}_${file.name}`;
      const r = storageRef(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await setDoc(doc(db, "expert_photos", id), {
        url, path, updatedAt: serverTimestamp(), updatedBy: user.uid,
      });
      setMsg("Photo update ho gayi!");
      loadAll();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteExpertOverride = async (id) => {
    if (!window.confirm("Delete/reset karein? Default experts wapas aa jayenge, custom hamesha ke liye delete hoga.")) return;
    try {
      await deleteDoc(doc(db, "experts", id));
      await deleteDoc(doc(db, "expert_photos", id)).catch(() => {});
      setMsg("Delete ho gaya!");
      loadAll();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const setBookingStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      setBookings((p) => p.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch (e) {
      setMsg(e.message);
    }
  };

  const togglePaid = async (b) => {
    try {
      await updateDoc(doc(db, "bookings", b.id), { paid: !b.paid });
      setBookings((p) => p.map((x) => (x.id === b.id ? { ...x, paid: !x.paid } : x)));
    } catch (e) {
      setMsg(e.message);
    }
  };

  const approveGallery = async (g) => {
    try {
      await updateDoc(doc(db, "gallery", g.id), { status: "approved" });
      setPendingGallery((p) => p.filter((x) => x.id !== g.id));
      setMsg("Photo approve ho gayi!");
    } catch (e) {
      setMsg(e.message);
    }
  };

  const rejectGallery = async (g) => {
    if (!window.confirm("Reject + delete karein?")) return;
    try {
      await deleteObject(storageRef(storage, g.path)).catch(() => {});
      await deleteDoc(doc(db, "gallery", g.id));
      setPendingGallery((p) => p.filter((x) => x.id !== g.id));
      setMsg("Photo reject/delete ho gayi.");
    } catch (e) {
      setMsg(e.message);
    }
  };

  const savePayment = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await setDoc(doc(db, "settings", "payment"), {
        ...payment, updatedAt: serverTimestamp(), updatedBy: user.uid,
      });
      setMsg("Payment settings save ho gayi!");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  const approveReview = async (r) => {
    try {
      await updateDoc(doc(db, "reviews", r.id), { status: "approved" });
      setPendingReviews((p) => p.filter((x) => x.id !== r.id));
      setMsg("Review approve ho gaya!");
    } catch (e) {
      setMsg(e.message);
    }
  };

  const addPost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.body.trim()) { setMsg("Title aur content likhein."); return; }
    setBusy(true);
    try {
      await addDoc(collection(db, "posts"), {
        title: postForm.title.trim(),
        excerpt: postForm.excerpt.trim() || postForm.body.trim().slice(0, 120),
        tags: postForm.tags.split(",").map((s) => s.trim()).filter(Boolean),
        body: postForm.body.trim().split("\n"),
        readMin: Math.max(2, Math.round(postForm.body.trim().split(/\s+/).length / 180)),
        status: "published",
        createdAt: serverTimestamp(),
      });
      setPostForm({ title: "", excerpt: "", tags: "", body: "" });
      setShowPostForm(false);
      setMsg("Post publish ho gayi!");
      loadAll();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveSocial = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await setDoc(doc(db, "settings", "social"), {
        ...social, updatedAt: serverTimestamp(), updatedBy: user.uid,
      });
      setMsg("Social links save ho gaye! Footer me dikhenge.");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  const delDoc = async (col, id, setter) => {    if (!window.confirm("Delete karein?")) return;
    try {
      await deleteDoc(doc(db, col, id));
      setter((p) => p.filter((x) => x.id !== id));
    } catch (e) {
      setMsg(e.message);
    }
  };

  const count = (tb) => tb === "Experts" ? experts.length : tb === "Bookings" ? bookings.length : tb === "Inquiries" ? inquiries.length : tb === "Gallery" ? pendingGallery.length : tb === "Reviews" ? pendingReviews.length : tb === "Blog" ? posts.length : "";

  if (loading || checking) return <div className="spinner" />;

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 className="text-gradient">Admin Panel</h1>
        <div className="card" style={{ marginTop: 16 }}>
          <p>Aap admin nahi hain ({user?.email || "login nahi hai"}).</p>
          <ol style={{ margin: "12px 0 12px 20px", color: "var(--muted)", fontSize: ".9rem" }}>
            <li><b>src/config/admins.js</b> me apna email likhein</li>
            <li><b>firestore.rules</b> me adminEmails line me apna email likhein</li>
            <li>Dobara login karke /admin kholein</li>
          </ol>
          <button className="btn secondary" onClick={activateAdmin}>Activate Admin Access</button>
          {msg && <p style={{ marginTop: 10, color: "var(--accent-2)" }}>{msg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <h1 className="text-gradient">Admin Panel</h1>
        <button className="btn secondary" onClick={loadAll} disabled={busy}>Refresh</button>
      </div>
      {msg && <p style={{ color: "var(--accent-2)", marginTop: 10 }}>{msg}</p>}

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        {TABS.map((tb) => (
          <button key={tb} className={tab === tb ? "btn" : "btn secondary"} onClick={() => setTab(tb)}>
            {tb}{count(tb) !== "" ? ` (${count(tb)})` : ""}
          </button>
        ))}
      </div>

      {tab === "Experts" && (
        <div style={{ marginTop: 20 }}>
          <button className="btn" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? "Cancel" : "+ Naya Expert Add Karein"}
          </button>
          {showAdd && (
            <form onSubmit={addExpert} className="card grid grid-2" style={{ marginTop: 12 }}>
              <input className="input" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Name *" required />
              <input className="input" value={addForm.langs} onChange={(e) => setAddForm({ ...addForm, langs: e.target.value })} placeholder="Languages (Hindi, English)" />
              <input className="input" value={addForm.exp} onChange={(e) => setAddForm({ ...addForm, exp: e.target.value })} placeholder="Experience (e.g. 8 yrs)" />
              <input className="input" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} placeholder="Price (e.g. ₹351 / 30 min)" />
              <input className="input" type="number" step="0.1" value={addForm.rating} onChange={(e) => setAddForm({ ...addForm, rating: e.target.value })} placeholder="Rating" />
              <input className="input" type="file" accept="image/*" onChange={(e) => setAddFile(e.target.files?.[0])} />
              <button className="btn" disabled={busy} type="submit">Add Expert</button>
            </form>
          )}
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            {experts.map((e) => (
              <div key={e.id} className="card" style={{ textAlign: "center" }}>
                <img src={e.photo} alt={e.name} style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }} />
                {editing === e.id ? (
                  <div className="grid" style={{ marginTop: 12, textAlign: "left" }}>
                    <input className="input" value={form.name} onChange={(e2) => setForm({ ...form, name: e2.target.value })} placeholder="Name" />
                    <input className="input" value={form.langs} onChange={(e2) => setForm({ ...form, langs: e2.target.value })} placeholder="Languages (comma)" />
                    <input className="input" value={form.exp} onChange={(e2) => setForm({ ...form, exp: e2.target.value })} placeholder="Experience" />
                    <input className="input" value={form.price} onChange={(e2) => setForm({ ...form, price: e2.target.value })} placeholder="Price" />
                    <input className="input" type="number" step="0.1" value={form.rating} onChange={(e2) => setForm({ ...form, rating: e2.target.value })} placeholder="Rating" />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn" disabled={busy} onClick={() => saveExpert(e.id)}>Save</button>
                      <button className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 style={{ marginTop: 8 }}>{e.name}</h3>
                    <p>⭐ {e.rating} · {e.exp} · {Array.isArray(e.langs) ? e.langs.join(", ") : e.langs}</p>
                    <p style={{ color: "var(--gold)", fontWeight: 700 }}>{e.price}</p>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
                      <button className="btn secondary" onClick={() => startEdit(e)}>Edit</button>
                      <label className="btn secondary" style={{ cursor: "pointer" }}>
                        Photo
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={(ev) => uploadPhoto(e.id, ev.target.files?.[0])} />
                      </label>
                      <button className="btn danger" onClick={() => deleteExpertOverride(e.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Bookings" && (
        <div className="grid" style={{ marginTop: 20 }}>
          {bookings.length === 0 && <p>Koi booking nahi hai.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="card">
              <h3>{b.expertName}</h3>
              <p>{b.email} · Status: <b>{b.status}</b>{b.paid ? " · ✅ Paid" : " · ⏳ Unpaid"}</p>
              {b.kundliUrl && <p><a href={b.kundliUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent-2)" }}>Kundli Dekhein</a></p>}
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                  <button key={s} className="btn secondary" onClick={() => setBookingStatus(b.id, s)}>{s}</button>
                ))}
                <button className="btn secondary" onClick={() => togglePaid(b)}>{b.paid ? "Mark Unpaid" : "Mark Paid"}</button>
                <button className="btn danger" onClick={() => delDoc("bookings", b.id, setBookings)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Inquiries" && (
        <div className="grid" style={{ marginTop: 20 }}>
          {inquiries.length === 0 && <p>Koi inquiry nahi hai.</p>}
          {inquiries.map((q) => (
            <div key={q.id} className="card">
              <h3>{q.name} · {q.email}</h3>
              <p>{q.message}</p>
              <button className="btn danger" style={{ marginTop: 10 }} onClick={() => delDoc("inquiries", q.id, setInquiries)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === "Gallery" && (
        <div style={{ marginTop: 20 }}>
          <h3>Pending Approvals ({pendingGallery.length})</h3>
          {pendingGallery.length === 0 && <p style={{ marginTop: 8 }}>Koi pending photo nahi hai.</p>}
          <div className="gallery-grid" style={{ marginTop: 12 }}>
            {pendingGallery.map((g) => (
              <div key={g.id} className="card" style={{ textAlign: "center" }}>
                <img src={g.url} alt={g.name} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }} />
                <p style={{ fontSize: ".8rem", marginTop: 6 }}>{g.email}</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                  <button className="btn" onClick={() => approveGallery(g)}>Approve</button>
                  <button className="btn danger" onClick={() => rejectGallery(g)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <div className="grid" style={{ marginTop: 20 }}>
          <h3>Pending Reviews ({pendingReviews.length})</h3>
          {pendingReviews.length === 0 && <p>Koi pending review nahi hai.</p>}
          {pendingReviews.map((r) => (
            <div key={r.id} className="card">
              <h3>{r.expertName} — ⭐ {r.rating} · {r.name} ({r.email})</h3>
              <p>"{r.text}"</p>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn" onClick={() => approveReview(r)}>Approve</button>
                <button className="btn danger" onClick={() => delDoc("reviews", r.id, setPendingReviews)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Blog" && (
        <div style={{ marginTop: 20 }}>
          <button className="btn" onClick={() => setShowPostForm(!showPostForm)}>
            {showPostForm ? "Cancel" : "+ Nayi Post Likhein"}
          </button>
          {showPostForm && (
            <form onSubmit={addPost} className="card grid" style={{ marginTop: 12 }}>
              <input className="input" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} placeholder="Title *" required />
              <input className="input" value={postForm.excerpt} onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })} placeholder="Short summary" />
              <input className="input" value={postForm.tags} onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })} placeholder="Tags (Upay, Dhan)" />
              <textarea className="input" rows={6} value={postForm.body} onChange={(e) => setPostForm({ ...postForm, body: e.target.value })} placeholder="Poora lekh likhein (har paragraph nayi line par) *" required />
              <button className="btn" disabled={busy} type="submit">Publish</button>
            </form>
          )}
          <div className="grid" style={{ marginTop: 16 }}>
            <h3>Published Posts ({posts.length})</h3>
            {posts.map((p) => (
              <div key={p.id} className="card">
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <button className="btn danger" style={{ marginTop: 10 }} onClick={() => delDoc("posts", p.id, setPosts)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Social" && (
        <form onSubmit={saveSocial} className="card grid" style={{ marginTop: 20, maxWidth: 560 }}>
          <h3>Social Profile Links</h3>
          <p style={{ fontSize: ".85rem" }}>Apne page/profile ka poora link dalein. Khali chhoda to icon nahi dikhega.</p>
          {SOCIAL_META.map((m) => (
            <div key={m.key}>
              <label className="label">{m.label}</label>
              <input
                className="input"
                value={social[m.key] || ""}
                onChange={(e) => setSocial({ ...social, [m.key]: e.target.value })}
                placeholder={`https://.../${m.label.toLowerCase()}/aapka-page`}
              />
            </div>
          ))}
          <button className="btn" disabled={busy} type="submit">Save Social Links</button>
        </form>
      )}

      {tab === "Payment" && (
        <form onSubmit={savePayment} className="card grid" style={{ marginTop: 20, maxWidth: 560 }}>
          <h3>Payment Settings</h3>
          <div>
            <label className="label">UPI ID (paise isi par aayenge)</label>
            <input className="input" value={payment.upiId} onChange={(e) => setPayment({ ...payment, upiId: e.target.value })} placeholder="yourname@upi" />
          </div>
          <div>
            <label className="label">Payee Name</label>
            <input className="input" value={payment.payeeName} onChange={(e) => setPayment({ ...payment, payeeName: e.target.value })} placeholder="Numerology VIP" />
          </div>
          <div>
            <label className="label">Online Payment Link (Razorpay / Stripe — optional)</label>
            <input className="input" value={payment.paymentLink} onChange={(e) => setPayment({ ...payment, paymentLink: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="label">WhatsApp Number (country code ke saath, bina + : 919876543210)</label>
            <input className="input" value={payment.whatsapp || ""} onChange={(e) => setPayment({ ...payment, whatsapp: e.target.value })} placeholder="919876543210" />
          </div>
          <button className="btn" disabled={busy} type="submit">Save Payment Settings</button>
          <p style={{ fontSize: ".8rem" }}>Experts page par har booking ke saath Pay button isi se banega (UPI app + link).</p>
        </form>
      )}
    </div>
  );
}
