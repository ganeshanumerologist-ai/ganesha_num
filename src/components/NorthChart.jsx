import React from "react";

// Uttar-Bharatiya (diamond) kundli chart. houses: {1:[abbr..], ...12}
const CENTERS = {
  1: [150, 72], 2: [72, 24], 3: [24, 72], 4: [72, 148], 5: [24, 224],
  6: [72, 272], 7: [150, 224], 8: [228, 272], 9: [276, 224], 10: [228, 148],
  11: [276, 72], 12: [228, 24],
};
const QUAD = [1, 4, 7, 10];

export default function NorthChart({ title, lagnaIdx, houses }) {
  const signOf = (h) => ((lagnaIdx + h - 1) % 12) + 1;
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h3>{title}</h3>
      <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: 300 }}>
        <rect x="2" y="2" width="296" height="296" fill="none" stroke="var(--border)" strokeWidth="2" />
        <g stroke="var(--border)" strokeWidth="1.5">
          <line x1="2" y1="2" x2="298" y2="298" />
          <line x1="298" y1="2" x2="2" y2="298" />
          <line x1="150" y1="2" x2="298" y2="150" />
          <line x1="298" y1="150" x2="150" y2="298" />
          <line x1="150" y1="298" x2="2" y2="150" />
          <line x1="2" y1="150" x2="150" y2="2" />
        </g>
        {Object.entries(CENTERS).map(([h, [x, y]]) => {
          const hn = Number(h);
          const list = houses[hn] || [];
          const big = QUAD.includes(hn);
          return (
            <g key={h}>
              <text x={x} y={big ? y - 16 : y - 12} textAnchor="middle" fontSize="11" fill="var(--muted)">
                {signOf(hn)}
              </text>
              <text x={x} y={big ? y + 8 : y + 6} textAnchor="middle" fontSize={big ? 14 : 11} fontWeight="700" fill="var(--text)">
                {list.slice(0, 4).join(" ")}
              </text>
              {list.length > 4 && (
                <text x={x} y={big ? y + 24 : y + 18} textAnchor="middle" fontSize={big ? 14 : 11} fontWeight="700" fill="var(--text)">
                  {list.slice(4).join(" ")}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
