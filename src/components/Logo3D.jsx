// 3D logo — resolution independent (SVG + CSS), isliye 4K/8K par bhi
// razor-sharp. Agar aap apna logo daalna chahein to bas ye file rakhiye:
//
//     public/logo.png        <- transparent PNG, 512x512 ya usse bada
//
// Ye pehle /logo.png try karega. Na mile to apne 3D diya hua mark
// dikha dega (mandala + kalash + ॐ). Kuch code badalne ki zaroorat nahi.

import React, { useState } from "react";

export default function Logo3D({ size = 132, text = "GANESHA SUYOG ASTROLOGY" }) {
  const [customFailed, setCustomFailed] = useState(false);

  return (
    <div className="logo3d" style={{ width: size, height: size }}>
      {/* ---- aapka apna logo ---- */}
      {!customFailed && (
        <img
          className="logo3d-img"
          src="/logo.png"
          alt=""
          onError={() => setCustomFailed(true)}
        />
      )}

      {/* ---- fallback: 3D mandala mark ---- */}
      {customFailed && (
        <svg className="logo3d-mark" viewBox="-100 -100 200 200">
          <defs>
            <radialGradient id="lgc" cx="35%" cy="28%">
              <stop offset="0%" stopColor="#fff6d8" />
              <stop offset="35%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <linearGradient id="lgr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="55%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <filter id="lgshadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.55" />
            </filter>
          </defs>

          {/* chaakra */}
          <g filter="url(#lgshadow)">
            <circle r="72" fill="none" stroke="url(#lgr)" strokeWidth="4" />
            <circle r="58" fill="none" stroke="url(#lgr)" strokeWidth="1.6" opacity="0.7" />
            <circle r="40" fill="url(#lgc)" opacity="0.92" />
            <circle r="40" fill="none" stroke="#fff8e1" strokeWidth="1.2" opacity="0.55" />
          </g>

          {/* bhed */}
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i * Math.PI) / 8;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 58} y1={Math.sin(a) * 58}
                x2={Math.cos(a) * 72} y2={Math.sin(a) * 72}
                stroke="#fbbf24" strokeWidth="2" opacity="0.75"
              />
            );
          })}

          {/* ॐ */}
          <text
            x="0" y="16"
            textAnchor="middle"
            fontSize="46"
            fontWeight="800"
            fill="#4a1d05"
            opacity="0.92"
          >
            ॐ
          </text>
        </svg>
      )}

      {/* ---- neeche chamak ---- */}
      <div className="logo3d-glow" />
    </div>
  );
}