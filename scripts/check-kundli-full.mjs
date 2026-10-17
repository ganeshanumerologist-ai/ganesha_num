import { kundliFull } from "../src/utils/kundliFull.js";

const r = kundliFull({
  name: "Ganesha", birthdate: "1972-02-18", time: "10:30", place: "Nagpur", gender: "male",
});
const f = (d) => d.toISOString().slice(0, 10);

console.log("lagna :", r.lagna, "| D9 lagna :", r.d9Lagna, "| karakamsha :", r.karakamshaName);
console.log("graha :", r.grahas.map((g) => `${g.key}=${g.rashi}${g.retro ? "(R)" : ""} bh${g.bhav}`).join(", "));
console.log("panchang:", r.panchang.tithi.name, "|", r.panchang.nak.name, "| yoga", r.panchang.yoga, "|", r.panchang.karana);

console.log("\n=== MAHADASHA ===");
for (const p of r.dasha.periods) {
  const cur = p.lord === r.dasha.cur.lord ? "   <== CHALU" : "";
  console.log(`  ${p.lord.padEnd(9)} ${f(p.start)} -> ${f(p.end)}${cur}`);
}

console.log(`\n=== ANTARDASHA (${r.dasha.cur.lord} MD) ===`);
for (const a of r.dasha.ads) {
  const cur = a.lord === r.dasha.curAD.lord ? "   <== CHALU" : "";
  console.log(`  ${a.lord.padEnd(9)} ${f(a.start)} -> ${f(a.end)}${cur}`);
}

// dasha ki sanity: 9 MD ka total ~120 saal hona chahiye
const totalY = r.dasha.periods.reduce((s, p) => s + (p.end - p.start) / 31557600000, 0);
console.log(`\n  9 mahadasha ka kul yog: ${totalY.toFixed(1)} saal (120 ke aas paas hona chahiye)`);
const adTotal = r.dasha.ads.reduce((s, a) => s + (a.end - a.start) / 31557600000, 0);
console.log(`  9 antar ka kul: ${adTotal.toFixed(1)} saal (MD ke barabar hona chahiye)`);

console.log("\navakanda:", r.avakanda.cells.map((c) => c.eng + (c.friends ? "+MITT" : "-shatru")).join("  "));
console.log("maitri  :", "friend=" + r.maitri.filter((x) => x.rel === "friend").length,
  " enemy=" + r.maitri.filter((x) => x.rel === "enemy").length);

const c = r.shodashvarga.rows[0].cells;
console.log("varga   :", ["D1", "D2", "D3", "D7", "D9", "D10", "D12", "D16", "D30", "D60"]
  .map((d) => `${d}=${c[d].text}`).join(" "));

console.log("shadbala:", r.shadbala.map((s) => `${s.planet}:${s.total}`).join(" "));
console.log("ashtak  :", JSON.stringify(r.ashtakavarga.total));
console.log("gochar  :", r.gochar.map((g) => `${g.key}:${g.nowRashi}${g.same ? "*" : ""}`).join(" "));

// ── guard: har hissa bhar hona chahiye ──
const need = ["lagIdx", "lagna", "d9Lagna", "grahas", "panchang", "dasha", "shodashvarga",
  "chalit", "paraDristi", "maitri", "avakanda", "shadbala", "ashtakavarga", "ratna",
  "gochar", "karakamshaName", "swaphalaName", "bhavMadhya"];
const bad = need.filter((k) => r[k] === undefined || r[k] === null);
console.log(bad.length ? `\nMISSING: ${bad.join(", ")}` : "\nSAARE HISSE BHARE HAIN ✅");