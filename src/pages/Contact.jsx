import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TX = {
  hi: { sub: "न्यूमरोलॉजी रीडिंग के बारे में सवाल है? संदेश भेजें।", errFill: "कृपया सभी खाने भरें।", sending: "भेजा जा रहा है..." },
  mr: { sub: "न्यूमरॉलॉजी रीडिंगबद्दल प्रश्न आहे? संदेश पाठवा.", errFill: "कृपया सर्व रकाने भरा.", sending: "पाठवत आहे..." },
  en: { sub: "Have questions about your numerology reading? Send us a message.", errFill: "Please fill all fields.", sending: "Sending..." },
};

export default function Contact() {
  const { t, lang } = useLanguage();
  const T = TX[lang] || TX.en;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError(T.errFill);
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
      setError(err?.message || T.errFill);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-gradient">{t("contact_title")}</h1>
      <p>{T.sub}</p>

      <div style={{ marginTop: 24 }} className="card">
        {sent && <p style={{ color: "var(--accent-2)", marginBottom: 12 }}>{t("contact_success")}</p>}
        <form onSubmit={submit} className="grid" style={{ gap: 14 }}>
          <div>
            <label className="label">{t("contact_name")}</label>
            <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className="label">{t("contact_email")}</label>
            <input className="input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="label">{t("contact_message")}</label>
            <textarea className="input" rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} />
          </div>
          <button className="btn" disabled={loading}>{loading ? T.sending : t("contact_send")}</button>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
