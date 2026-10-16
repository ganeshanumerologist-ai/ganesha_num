// Jyotish/numerology background — pure SVG.
//
// Kyun SVG aur koi image file nahi: SVG vector hai, isliye 4K/8K/retina
// par bhi pixel-perfect sharp rehta hai, aur file size 2-3 KB rehta hai.
// 4K wallpaper jaisa look aata hai bina 5 MB ki photo ke.
//
// Layers ( peeche se aage ):
//   1. celestial gradient + taare
//   2. bada mandala (dheere ghoomta hai)
//   3. kundali ka chart (North-Indian style, dono kone)
//   4. kalash (sacred pot)
//   5. sankhya 1-9 (haze me)
//   6. swastik watermark
//   7. vignette, taaki text padhne me dikkat na ho

import React from "react";

/* ------------------------------------------------------------------ */
/*  Kundali chart — North Indian style                                 */
/*  Square + dono diagonals + chaaron kinaron ke midpoint ka diamond  */
/*  isse 12 ghar bante hain (8 corner + 4 inner)                      */
/* ------------------------------------------------------------------ */
const S = 200;
const C = S / 2;
const MT = [C, 0];    // top midpoint
const MR = [S, C];    // right midpoint
const MB = [C, S];    // bottom midpoint
const ML = [0, C];    // left midpoint
const CORNERS = [[0, 0], [S, 0], [S, S], [0, S]];
const CENT = [C, C];

const pts = (arr) => arr.map((p) => p.join(",")).join(" ");

/* 12 bhava (ghar) — har ek ek polygon */
const HOUSES = [
  // ---- 4 inner (diamond wale) ----
  [MT, [150, 50], CENT],                  // 1  - uttara-ish (top)
  [[150, 50], MR, CENT],                  // 2
  [MR, MB, CENT],                         // 3
  [MB, [50, 150], CENT],                  // 4
  [[50, 150], ML, CENT],                  // 5
  [ML, MT, CENT],                         // 6
  // ---- 8 corner ----
  [[0, 0], [50, 50], ML],                 // 7  top-left
  [[0, 0], MT, [50, 50]],                 // 8
  [[200, 0], [150, 50], MT],              // 9
  [[200, 0], MR, [150, 50]],              // 10
  [[200, 200], MB, [150, 150]],           // 11
  [[200, 200], [150, 150], MR],           // 12
  [[0, 200], [50, 150], MB],              // 13
  [[0, 200], ML, [50, 150]],              // 14
].map((p) => pts(p));

/* ------------------------------------------------------------------ */
/*  Taare (stars) — fixed positions, taaki har render same rahe       */
/* ------------------------------------------------------------------ */
const STARS = (() => {
  let h = 987654321;
  const rnd = () => {
    h = (h * 1103515245 + 12345) % 2147483648;
    return h / 2147483648;
  };
  return Array.from({ length: 110 }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    r: 0.35 + rnd() * 1.5,
    o: 0.18 + rnd() * 0.62,
    d: 3 + rnd() * 7,
  }));
})();

/* Sansar chakra ke 60 samo ke liye chhote tik */
const RAASHI_TICKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return { a, i };
});

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  OPTIONAL photos                                                   */
/*                                                                     */
/*  Photos `public/photos/` me rakhiye — naming: bg1.jpg, bg2.jpg...   */
/*  Component unhe apne aap dhoondhta hai: file hui to dikhayega,      */
/*  nahi hui to chup-chaap hat jayegi aur SVG art rahega.              */
/*  Code me kuch badalne ki zaroorat nahi.                             */
/*                                                                     */
/*  FREE + commercial use, copyright-safe sources:                     */
/*    unsplash.com  (Unsplash License)                                 */
/*    pexels.com    (Pexels License)                                   */
/*    pixabay.com   (Pixabay License)                                   */
/*    wikimedia.org (Creative Commons — har photo ka license check     */
/*                   karna, kuch CC BY hote hain jinke credit dena    */
/*                   padta hai)                                        */
/*                                                                     */
/*  Google Images se download ki photo KA copyright creator ka hota   */
/*  hai — woh use na karein.                                            */
/* ------------------------------------------------------------------ */
const PHOTOS = [1, 2, 3].map((i) => `/photos/bg${i}.jpg`);

function PhotoLayer({ src, i }) {
  const [ok, setOk] = React.useState(true);
  if (!ok) return null;
  return (
    <div
      className="jy-layer jy-photo"
      style={{
        opacity: [0.24, 0.17, 0.13][i],
        top: `${6 + i * 27}%`,
        left: i % 2 ? "48%" : "-5%",
        width: i % 2 ? "56%" : "50%",
        animationDelay: `${i * 7}s`,
      }}
    >
      <img
        src={src}
        alt=""
        onError={() => setOk(false)}
        style={{ width: "100%", borderRadius: 26, display: "block" }}
      />
    </div>
  );
}

export default function JyotishBackdrop() {
  return (
    <div className="jy-bg" aria-hidden="true">
      {/* ---------- 0. OPTIONAL photos (public/photos me hain to) ---------- */}
      {PHOTOS.map((src, i) => (
        <PhotoLayer key={src} src={src} i={i} />
      ))}

      {/* ---------- 1. celestial gradient ---------- */}
      <div className="jy-sky" />

      {/* ---------- 2. taare ---------- */}
      <svg className="jy-layer jy-stars" viewBox="0 0 100 100" preserveAspectRatio="none">
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r / 6}
            fill="#fff"
            opacity={s.o}
            style={{ animation: `twinkle ${s.d}s ease-in-out ${(i % 7) * 0.4}s infinite` }}
          />
        ))}
      </svg>

      {/* ---------- 3. bada mandala ---------- */}
      <div className="jy-layer jy-mandala-wrap">
        <svg className="jy-mandala" viewBox="-200 -200 400 400">
          <defs>
            <linearGradient id="jyg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.55" />
            </linearGradient>
            <radialGradient id="jyglow">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle r="190" fill="url(#jyglow)" />

          {/* bahar ki peti */}
          {[186, 178, 170].map((r) => (
            <circle key={r} r={r} fill="none" stroke="url(#jyg)" strokeWidth="0.7" opacity="0.55" />
          ))}

          {/* 12 bhed */}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * Math.PI) / 12;
            const inner = i % 2 ? 170 : 160;
            return (
              <line
                key={i}
                x1={Math.cos(a) * inner}
                y1={Math.sin(a) * inner}
                x2={Math.cos(a) * 178}
                y2={Math.sin(a) * 178}
                stroke="#fbbf24"
                strokeWidth="0.6"
                opacity="0.4"
              />
            );
          })}

          {/* 9 sankhya ka chakra — ghair (circle) bachi hai,
              lekin usme digit LIKHA NAHI hai. User ne kaha tha ki
              landing par 9 number na dikhe, isliye yahan sirf
              structure hai. */}
          <circle r="150" fill="none" stroke="url(#jyg)" strokeWidth="1.1" opacity="0.7" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = (i * 2 * Math.PI) / 9 - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={Math.cos(a) * 150}
                cy={Math.sin(a) * 150}
                r="17"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="0.8"
                opacity="0.42"
              />
            );
          })}

          {/* 12 rashi bhed */}
          <circle r="112" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.45" />
          {RAASHI_TICKS.map(({ a, i }) => (
            <line key={i}
              x1={Math.cos(a) * 100} y1={Math.sin(a) * 100}
              x2={Math.cos(a) * 112} y2={Math.sin(a) * 112}
              stroke="#22d3ee" strokeWidth="0.7" opacity="0.4" />
          ))}

          {/* 24 ghadiya bhed */}
          <circle r="100" fill="none" stroke="#8b5cf6" strokeWidth="0.6" opacity="0.4" />
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * Math.PI) / 12;
            return (
              <line key={i}
                x1={Math.cos(a) * 86} y1={Math.sin(a) * 86}
                x2={Math.cos(a) * 100} y2={Math.sin(a) * 100}
                stroke="#8b5cf6" strokeWidth="0.5" opacity="0.35" />
            );
          })}

          {/* 12 rashi bhed ke andar ka akshar bhi hata diya —
              sirf bhed lines bachi hain. */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6 - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={Math.cos(a) * 66}
                cy={Math.sin(a) * 66}
                r="9"
                fill="none"
                stroke="#e8ecff"
                strokeWidth="0.6"
                opacity="0.16"
              />
            );
          })}

          {/* gucchha (chakra) */}
          <circle r="58" fill="none" stroke="url(#jyg)" strokeWidth="1.4" opacity="0.6" />
          <circle r="44" fill="none" stroke="#fbbf24" strokeWidth="0.7" opacity="0.4" />

          {/* 8 padma patti */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <ellipse key={i}
                cx={Math.cos(a) * 32} cy={Math.sin(a) * 32}
                rx="13" ry="6.5"
                transform={`rotate(${(i * Math.PI) / 4} ${Math.cos(a) * 32} ${Math.sin(a) * 32})`}
                fill="none" stroke="#22d3ee" strokeWidth="0.7" opacity="0.38" />
            );
          })}
          <circle r="14" fill="#fbbf24" opacity="0.10" />
        </svg>
      </div>

      {/* ---------- 4. kundali chart — dono taraf ---------- */}
      <svg className="jy-layer jy-chart jy-chart-l" viewBox={`-10 -10 220 220`}>
        <g fill="rgba(139,92,246,.07)" stroke="#fbbf24" strokeWidth="0.9" opacity="0.55">
          {HOUSES.map((p, i) => (
            <polygon key={i} points={p} />
          ))}
        </g>
        {/* bhed lines */}
        <g stroke="#22d3ee" strokeWidth="0.7" opacity="0.4" fill="none">
          <line x1="0" y1="0" x2="200" y2="200" />
          <line x1="200" y1="0" x2="0" y2="200" />
          <polygon points={pts([MT, MR, MB, ML])} />
        </g>
        {/* NOTE: is chart me jo 1-9 likha tha wo hata diya gaya hai —
            user ne kaha tha ki landing par number na dikhe.
            Ab har ghar me ek chhoti gol rekha hai (ghar ka nishan). */}
        {HOUSES.map((p, i) => {
          const xs = p.split(" ").map((q) => +q.split(",")[0]);
          const ys = p.split(" ").map((q) => +q.split(",")[1]);
          return (
            <circle
              key={i}
              cx={(Math.min(...xs) + Math.max(...xs)) / 2}
              cy={(Math.min(...ys) + Math.max(...ys)) / 2}
              r="4.5"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.8"
              opacity="0.32"
            />
          );
        })}
      </svg>

      <svg className="jy-layer jy-chart jy-chart-r" viewBox={`-10 -10 220 220`}>
        <g fill="rgba(34,211,238,.05)" stroke="#8b5cf6" strokeWidth="0.9" opacity="0.5">
          {HOUSES.map((p, i) => (
            <polygon key={i} points={p} />
          ))}
        </g>
        <g stroke="#22d3ee" strokeWidth="0.7" opacity="0.3" fill="none">
          <line x1="0" y1="0" x2="200" y2="200" />
          <line x1="200" y1="0" x2="0" y2="200" />
          <polygon points={pts([MT, MR, MB, ML])} />
        </g>
      </svg>

      {/* ---------- 5. kalash ---------- */}
      <svg className="jy-layer jy-kalash" viewBox="0 0 120 160">
        <defs>
          <linearGradient id="jkp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.50" />
          </linearGradient>
        </defs>
        {/* matka */}
        <path d="M38 96 q-22 8 -22 28 q0 26 22 26 q22 0 22 -26 q0 -20 -22 -28 z"
          fill="url(#jkp)" stroke="#fbbf24" strokeWidth="1.2" />
        {/* mukh */}
        <ellipse cx="60" cy="96" rx="22" ry="6" fill="#fbbf24" opacity="0.35" stroke="#fbbf24" strokeWidth="1" />
        {/* taal */}
        <ellipse cx="60" cy="150" rx="26" ry="5" fill="#22d3ee" opacity="0.22" stroke="#22d3ee" strokeWidth="0.9" />
        {/* matki / chaabi */}
        <path d="M34 54 h52 q6 0 6 6 v6 h-64 v-6 q0 -6 6 -6 z" fill="url(#jkp)" stroke="#fbbf24" strokeWidth="1" />
        <rect x="42" y="66" width="36" height="12" rx="2" fill="#fbbf24" opacity="0.30" stroke="#fbbf24" strokeWidth="0.8" />
        {/* nari */}
        <path d="M56 54 q-10 -18 0 -28 q6 -6 4 -16" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6" />
        {/* kamal */}
        <path d="M44 40 q16 -16 32 0 q-16 -6 -32 0 z" fill="#fbbf24" opacity="0.45" />
        <circle cx="44" cy="41" r="4" fill="#fbbf24" opacity="0.55" />
        <circle cx="76" cy="41" r="4" fill="#fbbf24" opacity="0.55" />
      </svg>

      {/* ---------- 7. vignette ---------- */}
      <div className="jy-vignette" />
    </div>
  );
}