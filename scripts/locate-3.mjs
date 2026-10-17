import fs from "node:fs";

const s = fs.readFileSync("src/styles.css", "utf8");
const PATS = ["42, 48, 100", "42,48,100", "29, 34, 74", "29,34,74", "12, 10, 34", "12,10,34"];

for (const p of PATS) {
  let i = -1, n = 0;
  while ((i = s.indexOf(p, i + 1)) >= 0) {
    n++;
    if (n <= 2) {
      const ctx = s.slice(Math.max(0, i - 70), i + 45).replace(/\n/g, " | ");
      // comment ke andar hai ya nahi
      const before = s.slice(0, i);
      const openC = (before.match(/\/\*/g) || []).length;
      const closeC = (before.match(/\*\//g) || []).length;
      const lineStart = s.lastIndexOf("\n", i) + 1;
      const line = s.slice(lineStart, i);
      const isCmt = openC > closeC || /^\s*(\/\/|\*)/.test(line);
      console.log(`  ${p}  ${isCmt ? "COMMENT me" : "*** LIVE ***"}`);
      console.log(`     ...${ctx}...`);
    }
  }
  if (!n) console.log(`  ${p}  -> file me nahi`);
}
