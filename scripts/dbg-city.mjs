import fs from "node:fs";
const s = fs.readFileSync("src/i18n/siteTx.js", "utf8");

const re = /^([ \t]*)pan_city: ("(?:[^"\\]|\\.)*")/gm;
let m; const order = [];
while ((m = re.exec(s))) order.push({ v: m[2], start: m.index });
console.log("pan_city occurrences:", order.length);
order.forEach((o, i) => console.log("  " + String(i).padStart(2), o.v, "@" + o.start));

const br = /^  ([a-z]{2,4}): \{|^const EN = \{/gm;
let b; const bl = [];
while ((b = br.exec(s))) bl.push([b.index, b[1]]);
console.log("\nblock marks:", bl.length);
console.log("first 4:", JSON.stringify(bl.slice(0, 4)));
console.log("\nhar pan_city ka owner:");
for (const o of order) {
  const own = [...bl].reverse().find((x) => x[0] < o.start);
  console.log("  @" + String(o.start).padStart(6), "->", own ? own[1] : "*** ORPHAN ***");
}