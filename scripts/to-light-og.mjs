import fs from "node:fs";
const F = "scripts/gen-og-image.mjs";
let s = fs.readFileSync(F, "utf8");
let n = 0;
const rep = (from, to, why) => {
  const c = s.split(from).length - 1;
  if (!c) { console.log(`  MISS  ${why}`); return; }
  s = s.split(from).join(to); n += c;
  console.log(`  ${String(c).padStart(3)}x  ${why}`);
};

console.log("═══ light theme adjust ═══");

// ── wordmark gradient ──
// Pehle GOLD_LT (bright) → GOLD → ROSE tha. Ab GOLD_LT bhi deep hai,
// to gradient ulta padhega. Simple: GOLD (sabse gehra, 7:1) upar se
// ROSE tak — dono readable.
rep(`            const col =
              t < 0.62
                ? GOLD_LT
                : t < 0.78
                ? GOLD
                : ROSE;`,
    `            const col = t < 0.72 ? GOLD : ROSE;`,
    "wordmark gradient → deep bronze → rose");

// ── glow strength ──
// Cream par alpha .22/.26/.30 bahut halka lagta hai. Badha do.
rep("const a = Math.pow(1 - d, 2.4) * 0.30;", "const a = Math.pow(1 - d, 2.2) * 0.55;", "top glow");
rep("const a = Math.pow(1 - d, 2.2) * 0.26;", "const a = Math.pow(1 - d, 2.0) * 0.45;", "bottom glow");

// ── mandala rings ──
rep("set(x, y, k === 1 ? GOLD : ROSE, a);", "set(x, y, k === 1 ? GOLD : ROSE, a);", "ring colour (same)");
rep("const a = (1 - edge / 1.4) * (0.13 - k * 0.032);", "const a = (1 - edge / 1.4) * (0.30 - k * 0.07);", "ring opacity up");
rep("const fade = Math.max(0, 1 - d / R0) * 0.11;", "const fade = Math.max(0, 1 - d / R0) * 0.26;", "spoke opacity up");

// ── stars ──
rep("const a = 0.25 + rnd() * 0.45;", "const a = 0.35 + rnd() * 0.55;", "star alpha");

// ── rule / hairline ──
rep("const a = 0.85 * Math.pow(1 - t, 0.7);", "const a = 0.95 * Math.pow(1 - t, 0.7);", "hairline opacity");

// ── chips: pehle colour se fill ban raha tha (0.30 alpha) ──
// cream bg par chip ka fill theek dikhna chahiye
rep("const a = Math.min(1, d / 6) * 0.30;", "const a = Math.min(1, d / 6) * 0.14;", "chip fill (subtle on light)");

fs.writeFileSync(F, s, "utf8");
console.log(`\n${n} fix`);