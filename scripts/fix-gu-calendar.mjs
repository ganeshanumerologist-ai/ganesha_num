// gu.js ke 4 notes me Kannada chars the — line-replace se pure Gujarati text daalta hai.
// (edit tool mixed-script bytes match nahi kar paata, isliye line-number se replace.)
import { readFileSync, writeFileSync } from "node:fs";

const NEW = {
  // month/day -> correct Gujarati note
  "9/14": "ગણપતિની સ્થાપના — વિઘ્નોનું નાશન કરનાર દેવનો આગમન, રંગીન આનંદ ઉત્સવ.",
  "10/11": "શક્તિની પૂજાની નવ રાત્રિ — ભજન, કીર્તન, ગરબા અને ભક્તિભક્તિનો ઉત્સવ.",
  "11/8": "લક્ષ્મી અને ધનની પૂજા — નવા વ્યવસાય, ઘર સફાઈ અને દીવડિયાંનો ઉત્સાહ.",
  "12/25": "પ્રેમ અને સેવાનો તિહાર — કુટુંબ સાથે આનંદ અને સાંજનો સુંદર સમય.",
};

const P = "src/data/calendar/gu.js";
const lines = readFileSync(P, "utf8").split(/\r?\n/);
let n = 0;

for (let i = 0; i < lines.length; i++) {
  const mm = lines[i].match(/^\s*\{ month: (\d+), day: (\d+),/);
  if (!mm) continue;
  const k = `${mm[1]}/${mm[2]}`;
  if (!NEW[k]) continue;
  const name = lines[i].match(/name: "([^"]*)"/)?.[1];
  const indent = lines[i].match(/^\s*/)[0];
  lines[i] = `${indent}{ month: ${mm[1]}, day: ${mm[2]}, name: "${name}", note: "${NEW[k]}" },`;
  n++;
}
writeFileSync(P, lines.join("\n"));

const s = readFileSync(P, "utf8");
const left = [...s].filter((c) => {
  const cp = c.codePointAt(0);
  return (cp >= 0x0900 && cp <= 0x0DFF) && !(cp >= 0x0A80 && cp <= 0x0AFF) && cp !== 0x0964;
});
console.log(`gu.js: ${n} notes rewritten, ${left.length} wrong chars left`);