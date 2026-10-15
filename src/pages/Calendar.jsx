import React, { useState } from "react";
import { FESTIVALS_2026, MONTHS, MONTH_GUIDE } from "../data/calendar.js";

export default function Calendar() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const list = FESTIVALS_2026.filter((f) => f.month === month);

  return (
    <div>
      <h1 className="text-gradient">Tyohar & Shubh Calendar 2026</h1>
      <p>Mahina chunein — tyohar aur us mahine ke shubh karya jaanein. (Tithi ke anusaar 1-2 din antar sambhav.)</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        {MONTHS.map((m, i) => (
          <button key={m} className={month === i + 1 ? "btn" : "btn secondary"} style={{ padding: "8px 14px" }} onClick={() => setMonth(i + 1)}>
            {m.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>{MONTHS[month - 1]} 2026</h2>
        <p style={{ marginTop: 6 }}>{MONTH_GUIDE[month]}</p>
      </div>

      <div className="grid grid-2" style={{ marginTop: 20 }}>
        {list.length === 0 && <p>Is mahine me koi bada tyohar list me nahi hai.</p>}
        {list.map((f) => (
          <div key={f.name} className="card">
            <h3>{f.day} {MONTHS[month - 1]} — {f.name}</h3>
            <p style={{ marginTop: 8 }}>{f.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
