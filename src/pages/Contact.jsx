import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err?.message || "Failed to send. Check Firestore rules/config.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-gradient">Contact Us</h1>
      <p>Have questions about your numerology reading? Send us a message.</p>

      <div style={{ marginTop: 24 }} className="card">        {sent && <p style={{ color: "var(--accent-2)", marginBottom: 12 }}>Message sent successfully! We'll get back to you.</p>}
        <form onSubmit={submit} className="grid" style={{ gap: 14 }}>
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input" rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} />
          </div>
          <button className="btn" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
