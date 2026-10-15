import React, { useState, useRef, useEffect } from "react";
import { STATES } from "../data/cities.js";

const ALL = STATES.flatMap((g) => g.cities.map((c) => ({ name: c[0], state: g.state })));

// Type karte hi sheher sujhav — chunne par onChange(name)
export default function CitySelect({ value, onChange, placeholder }) {
  const [text, setText] = useState(value || "");
  const [show, setShow] = useState(false);
  const box = useRef(null);

  useEffect(() => { setText(value || ""); }, [value]);

  useEffect(() => {
    const h = (e) => { if (box.current && !box.current.contains(e.target)) setShow(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const q = text.trim().toLowerCase();
  const list = (q ? ALL.filter((c) => c.name.toLowerCase().includes(q)) : ALL.slice(0, 60)).slice(0, 60);

  const pick = (name) => {
    setText(name);
    onChange(name);
    setShow(false);
  };

  return (
    <div className="city-pick" ref={box}>
      <input
        className="input"
        value={text}
        placeholder={placeholder || "Type karke sheher chunein..."}
        onChange={(e) => { setText(e.target.value); onChange(e.target.value); setShow(true); }}
        onFocus={() => setShow(true)}
      />
      {show && (
        <div className="city-list">
          {list.length === 0 && <div style={{ padding: "10px 14px", color: "var(--muted)" }}>Koi sheher nahi mila — naam likhkar aage badhein.</div>}
          {list.map((c) => (
            <button key={c.state + c.name} type="button" onClick={() => pick(c.name)}>
              {c.name}<span className="st">{c.state}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
