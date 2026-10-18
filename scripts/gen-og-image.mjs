// ════════════════════════════════════════════════════════════════════
//  OG IMAGE GENERATOR  (pure Node, koi library nahi)
//
//  Kyun? Facebook, WhatsApp, Twitter aur LinkedIn — chaaron SVG
//  og:image nahi chalaate. Chahte hain 1200×630 PNG/JPG.
//
//  Node me zlib built-in hai, aur PNG format seedha likha ja sakta hai:
//     signature → IHDR → IDAT (zlib-compressed scanlines) → IEND
//  1200×630×4 bytes = ~3 MB raw, compress karke ~100 KB.
//
//  Text ke liye font nahi hai, isliye hum brand wordmark ko
//  "vector-block" font se draw karte hain — har letter kuch rectangles
//  se bana hai. Neeche BLOCK_FONT me har character ka pattern hai.
//
//  Colours naye theme ke hain: maroon bg + gold + rose. Koi blue nahi.
// ════════════════════════════════════════════════════════════════════
import zlib from "node:zlib";
import fs from "node:fs";

const W = 1200;
const H = 630;

// ── palette (maroon / gold / rose — blue ZERO) ──
// ── palette (LIGHT THEME) ──
//
// Cream background + deep bronze/rose text. Pehle maroon bg thi,
// jis par WhatsApp/Facebook ka preview dark aata tha. User ne kaha:
// "kisi bhi background me black nahi", "saaf dikhni chahiye".
//
// Text ke liye DEEP colour zaroori — cream par bright gold #f7c948
// bilkul invisible hai.
const BG_TOP = [0xff, 0xfb, 0xf5];      // #fffbf5
const BG_BOT = [0xf6, 0xe7, 0xd8];      // #f6e7d8
const GOLD = [0x7a, 0x4d, 0x00];        // #7a4d00  deep bronze 7.0:1
const GOLD_LT = [0x9c, 0x66, 0x0a];     // #9c660a  5.9:1
const ROSE = [0xb0, 0x35, 0x6a];        // #b0356a  5.9:1
const TEXT = [0x2b, 0x14, 0x1c];        // #2b141c  16.1:1
const MUTED = [0x6a, 0x43, 0x51];       // #6a4351  7.9:1
const GOLD_BRIGHT = [0xf2, 0xb7, 0x05]; // #f2b705  sirf FILL ke liye

const px = Buffer.alloc(W * H * 3);

function set(x, y, rgb, a = 1) {
  // ⚠️ Zaroori: text ki centering odd width par fractional x deti hai
  // (jaise "GANESHA SUYOG" → x0 = 289.5). Buffer ka index whole number
  // hona chahiye — px[289.5] likhne par Node CHUP CHAP chhod deta hai.
  // Isi wajah se poora wordmark gayab ho gaya tha jabki font theek tha.
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  if (a >= 1) {
    px[i] = rgb[0]; px[i + 1] = rgb[1]; px[i + 2] = rgb[2];
  } else {
    px[i] += (rgb[0] - px[i]) * a;
    px[i + 1] += (rgb[1] - px[i + 1]) * a;
    px[i + 2] += (rgb[2] - px[i + 2]) * a;
  }
}

// ── background: vertical gradient + radial gold glow + mandala rings ──
function drawBackground() {
  const cx = W / 2, cy = H / 2;

  for (let y = 0; y < H; y++) {
    const t = y / (H - 1);
    const r = BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * t;
    const g = BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * t;
    const b = BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * t;
    for (let x = 0; x < W; x++) {
      px[(y * W + x) * 3] = r | 0;
      px[(y * W + x) * 3 + 1] = g | 0;
      px[(y * W + x) * 3 + 2] = b | 0;
    }
  }

  // top-centre gold glow
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = (x - cx) / (W * 0.62);
      const dy = (y - cy * 0.7) / (H * 0.95);
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 1) {
        const a = Math.pow(1 - d, 2.2) * 0.34;
        set(x, y, GOLD, a);
      }
    }
  }

  // bottom rose glow
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = (x - cx) / (W * 0.70);
      const dy = (y - H * 1.05) / (H * 0.62);
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 1) {
        const a = Math.pow(1 - d, 2.0) * 0.26;
        set(x, y, ROSE, a);
      }
    }
  }

  // mandala rings (panchang/panchak ka chakra)
  const R0 = 250;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      for (let k = 0; k < 3; k++) {
        const rr = R0 - k * 34;
        // anti-aliased ring
        const edge = Math.abs(d - rr);
        if (edge < 1.4) {
          const a = (1 - edge / 1.4) * (0.30 - k * 0.07);
          set(x, y, k === 1 ? GOLD : ROSE, a);
        }
      }
      // 12 spokes = 12 rashis
      if (d < R0 && d > 60) {
        const ang = Math.atan2(dy, dx);
        const sector = (Math.PI * 2) / 12;
        const frac = Math.abs(((ang % sector) + sector) % sector - sector / 2);
        const halfW = sector * 0.028;
        if (frac < halfW) {
          const fade = Math.max(0, 1 - d / R0) * 0.26;
          set(x, y, GOLD, fade);
        }
      }
    }
  }

  // scattered stars
  let seed = 987654321;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let n = 0; n < 150; n++) {
    const x = rnd() * W, y = rnd() * H;
    const d = Math.hypot(x - cx, y - cy);
    if (d < 200) continue;
    const r = 0.7 + rnd() * 1.5;
    const a = 0.35 + rnd() * 0.34;
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++) {
        if (dx * dx + dy * dy <= r * r) set(Math.round(x + dx), Math.round(y + dy), GOLD_LT, a);
      }
  }
}

// ════════════════════════════════════════════════════════════════════
//  BLOCK FONT — har letter 5×7 ka grid
//
//  Har character ke liye 7 row, har row me 5 bit ka pattern.
//  '.', = off,  '#', = on
// ════════════════════════════════════════════════════════════════════
const F = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  // ⚠️ F pehle likha hi nahi gaya tha — isliye "FREE" → "REE" aur
  // "RASHIFAL" → "RASHI AL" dikh raha tha (F blank space me gir raha tha).
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  J: ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#.#.#", "#..##", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
  ".": [".....", ".....", ".....", ".....", ".....", ".##..", ".##.."],
  ",": [".....", ".....", ".....", ".....", ".##..", ".##..", ".#..."],
  ":": [".....", ".##..", ".##..", ".....", ".##..", ".##..", "....."],
  "/": ["....#", "...#.", "...#.", "..#..", ".#...", ".#...", "#...."],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": ["#####", "...#.", "..#..", "...#.", "....#", "#...#", ".###."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
};

function measure(text, scale, gap) {
  let w = 0;
  for (const ch of text) {
    const g = F[ch] || F[ch.toUpperCase()] || F[" "];
    w += 5 * scale + gap;
  }
  return w - gap;
}

function drawText(text, x0, y0, scale, color, alpha = 1, gap = 1) {
  let x = x0;
  for (const ch of text) {
    const rows = F[ch] || F[ch.toUpperCase()] || F[" "];
    for (let r = 0; r < 7; r++) {
      const row = rows[r];
      for (let c = 0; c < 5; c++) {
        if (row[c] !== "#") continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            // vertical gradient on the wordmark: gold -> rose
            const t = (y0 + r * scale + dy) / H;
            const col = t < 0.72 ? GOLD : ROSE;
            set(x + c * scale + dx, y0 + r * scale + dy, col, alpha);
          }
        }
      }
    }
    x += 5 * scale + gap;
  }
  return x - gap - x0;
}

/** golden gradient ke 4 corner wala horizontal rule */
function rule(cx, y, halfW, h) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = -halfW; dx <= halfW; dx++) {
      const t = Math.abs(dx) / halfW;
      const a = 0.95 * Math.pow(1 - t, 0.7);
      const col = dx < 0 ? GOLD : ROSE;
      set(cx + dx, y + dy, col, a);
    }
  }
}

// ════════════════════════════════════════════════════════════════════
//  COMPOSE
// ════════════════════════════════════════════════════════════════════
drawBackground();

const CX = W / 2;

// ── top: ॐ mark ka approximation — trishul + circle (gold ring) ──
// (SVG version Logo3D.jsx me hai; yahan simple ring + tick)
(function drawOmMark() {
  const cy = 150;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - CX, y - cy);
      const edge = Math.abs(d - 44);
      if (edge < 1.6) set(x, y, GOLD, (1 - edge / 1.6) * 0.9);
      // trishul ki 3 lines
      const ang = Math.atan2(y - cy, x - CX) + Math.PI / 2;
      const spoke = Math.abs(((ang % (Math.PI * 2 / 3)) + Math.PI * 2 / 3) % (Math.PI * 2 / 3) - Math.PI / 3);
      if (d > 46 && d < 74 && spoke < 0.045) {
        set(x, y, ROSE, (1 - (d - 46) / 28) * 0.55);
      }
    }
  }
})();

// ── brand wordmark ──
const BRAND = "GANESHA SUYOG";
{
  const s = 9, gap = 3;
  const w = measure(BRAND, s, gap);
  drawText(BRAND, CX - w / 2, 224, s, GOLD, 1, gap);
}

rule(CX, 310, 200, 3);

// ── sub-line ──
{
  const sub = "ASTROLOGY";
  const s = 4, gap = 4;
  const w = measure(sub, s, gap);
  drawText(sub, CX - w / 2, 332, s, ROSE, 0.95, gap);
}

// ── free-numerology line ──
{
  const line = "FREE NUMEROLOGY - KUNDLI - PANCHANG - RASHIFAL";
  const s = 3, gap = 2;
  const w = measure(line, s, gap);
  drawText(line, CX - w / 2, 396, s, TEXT, 0.88, gap);
}

// ── 22 languages line ──
{
  const line = "22 INDIAN LANGUAGES";
  const s = 2, gap = 2;
  const w = measure(line, s, gap);
  drawText(line, CX - w / 2, 428, s, MUTED, 0.80, gap);
}

// ── bottom chips: 3 services ──
function chip(text, cx, cy, color) {
  const s = 2, gap = 2;
  const tw = measure(text, s, gap);
  const padX = 14, padY = 8;
  const bw = tw + padX * 2, bh = 7 * s + padY * 2;
  for (let y = cy - bh / 2; y < cy + bh / 2; y++) {
    for (let x = cx - bw / 2; x < cx + bw / 2; x++) {
      const ex = Math.min(x - (cx - bw / 2), cx + bw / 2 - x);
      const ey = Math.min(y - (cy - bh / 2), cy + bh / 2 - y);
      const d = Math.min(ex, ey);
      if (d < 6) {
        const a = Math.min(1, d / 6) * 0.14;
        set(Math.round(x), Math.round(y), color, a);
      }
    }
  }
  // border
  for (let x = cx - bw / 2; x < cx + bw / 2; x++) {
    for (let t = 0; t < 1; t++) {
      set(Math.round(x), Math.round(cy - bh / 2), color, 0.55);
      set(Math.round(x), Math.round(cy + bh / 2), color, 0.55);
    }
  }
  for (let y = cy - bh / 2; y < cy + bh / 2; y++) {
    set(Math.round(cx - bw / 2), Math.round(y), color, 0.55);
    set(Math.round(cx + bw / 2), Math.round(y), color, 0.55);
  }
  drawText(text, cx - tw / 2, cy - (7 * s) / 2, s, color, 0.95, gap);
}

chip("MULAANK", 250, 520, GOLD);
chip("GEMSTONE", CX, 520, GOLD_LT);
chip("VAARSHPHAL", 950, 520, ROSE);

// ── website line ──
{
  const line = "GANESHANUMROLOGISTY.WEB.APP";
  const s = 2, gap = 2;
  const w = measure(line, s, gap);
  drawText(line, CX - w / 2, 578, s, MUTED, 0.62, gap);
}

// ════════════════════════════════════════════════════════════════════
//  PNG ENCODE
//
//    signature  89 50 4E 47 0D 0A 1A 0A
//    IHDR       width, height, bitdepth=8, colortype=2 (RGB),
//               compression=0, filter=0, interlace=0
//    IDAT       zlib(scanlines) — har scanline se pehle filter byte 0
//    IEND       (khali)
// ════════════════════════════════════════════════════════════════════
function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;   // bit depth
ihdr[9] = 2;   // colour type: truecolour RGB
ihdr[10] = 0;  // deflate
ihdr[11] = 0;  // adaptive filtering
ihdr[12] = 0;  // no interlace

// scanlines: har row se pehle ek 0 byte (filter = None)
const raw = Buffer.alloc(H * (W * 3 + 1));
for (let y = 0; y < H; y++) {
  const o = y * (W * 3 + 1);
  raw[o] = 0;
  px.copy(raw, o + 1, y * W * 3, (y + 1) * W * 3);
}

const idat = zlib.deflateSync(raw, { level: 9 });

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

fs.writeFileSync("public/og-image.png", png);

console.log(`og-image.png     ${(png.length / 1024).toFixed(1)} KB  ${W}x${H}`);

// ════════════════════════════════════════════════════════════════════
//  APP ICON  (square)
//
//  apple-touch-icon square hona ZAROORI hai — 1200x630 ka rectangle
//  iOS par letterbox ban jata hai aur 90% platform (Play Store bhi)
//  square hi maangte hain. 192 / 512 / 180 — teeno banate hain.
// ════════════════════════════════════════════════════════════════════

/**
 * @param {number} S  side length
 * @param {string} file
 */
function makeIcon(S, file) {
  const buf = Buffer.alloc(S * S * 3);
  const c = S / 2;

  // radial maroon gradient (beech se bahar halka)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const d = Math.hypot(x - c, y - c) / c;
      const t = Math.min(1, d);
      const i = (y * S + x) * 3;
      buf[i] = (0x2a + (0x14 - 0x2a) * t) | 0;
      buf[i + 1] = (0x12 + (0x0a - 0x12) * t) | 0;
      buf[i + 2] = (0x1e + (0x10 - 0x1e) * t) | 0;
    }
  }

  const put = (x, y, rgb, a = 1) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= S || y >= S) return;
    const i = (y * S + x) * 3;
    if (a >= 1) { buf[i] = rgb[0]; buf[i + 1] = rgb[1]; buf[i + 2] = rgb[2]; }
    else {
      buf[i] += (rgb[0] - buf[i]) * a;
      buf[i + 1] += (rgb[1] - buf[i + 1]) * a;
      buf[i + 2] += (rgb[2] - buf[i + 2]) * a;
    }
  };

  // gold ring + 12 spokes (12 rashis)
  const R = S * 0.40;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = x - c, dy = y - c;
      const d = Math.hypot(dx, dy);
      const edge = Math.abs(d - R);
      if (edge < S * 0.012) put(x, y, GOLD, 1 - edge / (S * 0.012));
      if (d < R * 0.9 && d > R * 0.2) {
        const ang = Math.atan2(dy, dx);
        const sec = (Math.PI * 2) / 12;
        const frac = Math.abs(((ang % sec) + sec) % sec - sec / 2);
        if (frac < sec * 0.03) put(x, y, ROSE, 0.75 * (1 - d / R));
      }
    }
  }

  // ॐ ka simplified mark: gold dot + crescent + tail
  const u = S / 100; // unit
  const gold = GOLD_LT;

  // bindu (top dot)
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const d = Math.hypot(x - c, y - c * 0.42);
      if (Math.abs(d - 5.2 * u) < 1.1 * u) put(x, y, gold, 0.95);
    }

  // main "3"-like body: do gol
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      for (const [ox, oy, rr] of [[-9, 62, 11], [9, 62, 11], [-7, 80, 7], [7, 80, 7]]) {
        const d = Math.hypot(x - (c + ox * u), y - oy * u);
        const edge = Math.abs(d - rr * u);
        if (edge < 1.3 * u) put(x, y, gold, (1 - edge / (1.3 * u)) * 0.95);
      }
    }
  }

  // tail
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x - (c - 16 * u)) / u, dy = (y - 74 * u) / u;
      const d = Math.hypot(dx, dy);
      if (Math.abs(d - 9) < 1.2 && d > 4) put(x, y, ROSE, 0.8);
    }
  }

  // encode
  const ih = Buffer.alloc(13);
  ih.writeUInt32BE(S, 0); ih.writeUInt32BE(S, 4);
  ih[8] = 8; ih[9] = 2; ih[10] = 0; ih[11] = 0; ih[12] = 0;

  const raw2 = Buffer.alloc(S * (S * 3 + 1));
  for (let y = 0; y < S; y++) {
    raw2[y * (S * 3 + 1)] = 0;
    buf.copy(raw2, y * (S * 3 + 1) + 1, y * S * 3, (y + 1) * S * 3);
  }

  const out = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ih),
    chunk("IDAT", zlib.deflateSync(raw2, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(file, out);
  console.log(`${file.padEnd(28)} ${(out.length / 1024).toFixed(1)} KB  ${S}x${S}`);
}

makeIcon(180, "public/apple-touch-icon.png");
makeIcon(192, "public/icon-192.png");
makeIcon(512, "public/icon-512.png");

// ── verify: blue pixels to nahi? ──
let blue = 0;
for (let i = 0; i < px.length; i += 3) {
  const r = px[i], g = px[i + 1], b = px[i + 2];
  if (b > r + 25 && b > g + 15) blue++;
}
console.log(`\nblue pixels: ${blue}  ${blue === 0 ? "✅" : "❌"}`);