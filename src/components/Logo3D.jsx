// 3D logo — resolution independent (SVG + CSS), isliye 4K/8K par bhi
// razor-sharp. Agar aap apna logo daalna chahein to bas ye file rakhiye:
//
//     public/logo.png        <- transparent PNG, 512x512 ya usse bada
//
// Ye pehle /logo.png try karega. Na mile to apne 3D diya hua mark
// dikha dega (mandala + kalash + ॐ). Kuch code badalne ki zaroorat nahi.

import React, { useState, useId } from "react";

export default function Logo3D({ size = 132, text = "GANESHA SUYOG ASTROLOGY" }) {
  const [customFailed, setCustomFailed] = useState(false);
  // Har SVG instance ko alag gradient/filter id — warna navbar aur hero
  // ke SVG aapas me id chur lete hain (detail dekho defs ke neeche).
  const uid = useId().replace(/:/g, "");

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
            {/* ── BAHUT ZAROORI ──────────────────────────────
                Ye pehle lgc / lgr / lgshadow the — jo GLOBAL ids hain.
                Logo navbar AUR hero dono me render hota hai, to do SVG
                page par aa jate the aur dusre SVG ka url(#lgc)
                reference pehle wale par chala jaata tha. Result: circle
                ka gradient render hi nahi hota tha → ॐ (dark brown)
                dark background par invisible ho jata tha — yahi mobile
                par "text dikhai nahi de raha" wali problem thi.
                Ab har instance ko apna unique id milta hai. */}
            <radialGradient id={`${uid}-c`} cx="35%" cy="28%">
              <stop offset="0%" stopColor="#fff6d8" />
              <stop offset="35%" stopColor="#f7c948" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <linearGradient id={`${uid}-r`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="55%" stopColor="#f7c948" />
              <stop offset="100%" stopColor="#f2a0b8" />
            </linearGradient>
            <filter id={`${uid}-s`} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.55" />
            </filter>
          </defs>

          {/* chaakra */}
          <g filter={`url(#${uid}-s)`}>
            <circle r="72" fill="none" stroke={`url(#${uid}-r)`} strokeWidth="4" />
            <circle r="58" fill="none" stroke={`url(#${uid}-r)`} strokeWidth="1.6" opacity="0.7" />
            <circle r="40" fill={`url(#${uid}-c)`} opacity="0.92" />
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
                stroke="#f7c948" strokeWidth="2" opacity="0.75"
              />
            );
          })}

          {/* ── ॐ ───────────────────────────────────────────────
              Pehle ॐ ka fill #4a1d05 (gehra brown) tha — wo background
              par 1.25:1 contrast deta tha, yaani phone par bilkul
              invisible. Ab:
                1. uske peeche SOLID chamdi jaisi disc hai (gradient
                   par depend nahi karta — gradient render na ho to bhi
                   ॐ dikhega)
                2. ॐ gehra usi disc par = 7:1 se zyada
                3. disc ka rim chamka rakhta hai jo dark background se
                   alag karta hai
            */}
          <circle r="34" fill="#fff6d8" />
          <circle r="34" fill="none" stroke="#b45309" strokeWidth="1.6" opacity="0.55" />
          <text
            x="0" y="16"
            textAnchor="middle"
            fontSize="46"
            fontWeight="800"
            fill="#3b1604"
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