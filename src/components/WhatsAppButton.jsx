import React, { useEffect, useState } from "react";
import { WHATSAPP_DEFAULT, waLink } from "../config/contact.js";
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

export default function WhatsAppButton() {
  const [number, setNumber] = useState(WHATSAPP_DEFAULT);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "payment"));
        if (snap.exists() && snap.data()?.whatsapp) setNumber(snap.data().whatsapp);
      } catch { /* default number */ }
    })();
  }, []);

  return (
    <a
      href={waLink(number, "Namaste! Mujhe numerology session ke baare me baat karni hai.")}
      target="_blank"
      rel="noreferrer"
      title="WhatsApp par baat karein"
      style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 100,
        width: 56, height: 56, borderRadius: "50%",
        background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,.4)",
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.3-.9.9-1.1 2.2-.2 3.9a11.6 11.6 0 0 0 4.5 4.2c1.7.8 2.4.9 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.5-.3z" />
      </svg>
    </a>
  );
}
