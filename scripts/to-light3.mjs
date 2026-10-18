import fs from "node:fs";
const F = "src/styles.css";
let s = fs.readFileSync(F, "utf8");
let n = 0;
const rep = (from, to, why) => {
  const c = s.split(from).length - 1;
  if (!c) { console.log(`  MISS  ${why}`); return; }
  s = s.split(from).join(to); n += c;
  console.log(`  ${String(c).padStart(3)}x  ${why}`);
};

// ── gold thoda gehra: 5.53:1 → ~6.6:1 (AAA) ──
rep("--gold: #8a5a00;", "--gold: #7a4d00;", "--gold #8a5a00 → #7a4d00 (AAA)");
rep("--saffron: #a15c00;", "--saffron: #8f5200;", "--saffron → #8f5200 (AAA)");
rep("rgba(160,110,22,", "rgba(122,84,0,", "gold border rgba → deeper");

// ── bache hue spaced/wine variants ──
const GOLD_SP = /rgba\(\s*247\s*,\s*201\s*,\s*72\s*,\s*([\d.]+)\s*\)/g;
s = s.replace(GOLD_SP, (m, a) => `rgba(122, 84, 0, ${a})`); n++;
const ROSE_SP = /rgba\(\s*242\s*,\s*160\s*,\s*184\s*,\s*([\d.]+)\s*\)/g;
s = s.replace(ROSE_SP, (m, a) => `rgba(176, 53, 106, ${a})`); n++;
const WINE_SP = /rgba\(\s*209\s*,\s*107\s*,\s*138\s*,\s*([\d.]+)\s*\)/g;
s = s.replace(WINE_SP, (m, a) => `rgba(141, 36, 80, ${a})`); n++;

fs.writeFileSync(F, s, "utf8");
console.log(`\n${n} fix`);

// ── bacha hua bright gold/rose? ──
const left = [...s.matchAll(/rgba\(\s*(247|242|209|255)\s*,\s*(201|160|107|255)\s*,\s*(72|184|138|255)\s*,\s*([\d.]+)\s*\)/g)];
console.log(`\nbright gold/rose rgba bache: ${left.length}`);
left.slice(0, 10).forEach(m => console.log("  " + m[0]));

// ── contrast ──
function hex2rgb(h){h=h.replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16));}
function lum([r,g,b]){const f=v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4;};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);}
function ratio(a,b){const [l1,l2]=[lum(a),lum(b)].sort((x,y)=>y-x);return (l1+0.05)/(l2+0.05);}
const BG = hex2rgb("#fdf6ee"), CARD = hex2rgb("#ffffff");
const grade = r => r>=7?"AAA":r>=4.5?"AA ":r>=3?"AA-large":"FAIL";
console.log("\n═══ FINAL CONTRAST ═══");
console.log("  rang                    cream     white    rating");
let fail=0;
for (const [name,hex] of Object.entries({
  "--text #2b141c":"#2b141c","--muted #6a4351":"#6a4351",
  "--gold #7a4d00":"#7a4d00","--rose #b0356a":"#b0356a",
  "--rose-deep #8d2450":"#8d2450","--saffron #8f5200":"#8f5200",
  "--danger #b3261e":"#b3261e","--border":"#c9a8b5",
})) {
  const c=hex2rgb(hex), r1=ratio(c,BG), r2=ratio(c,CARD);
  const bad=r1<4.5; if(bad)fail++;
  console.log(`  ${name.padEnd(23)} ${r1.toFixed(2)}  ${r2.toFixed(2)}   ${grade(r1)}${bad?"  FAIL":""}`);
}
console.log(fail?`\n${fail} FAIL`:"\nSab AA+/AAA ✅");