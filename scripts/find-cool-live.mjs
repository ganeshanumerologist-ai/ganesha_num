// Ye 11 blue hex LIVE code me hain ya sirf comment me?
// (Purane commented-out values galat hue dikha rahe the.)
import fs from "node:fs";

const COOL = ["#070b18", "#141838", "#c2c7ee", "#9d9fc4", "#0b1024", "#0d0a1a",
  "#22275c", "#1b1f4a", "#33245f", "#151b36", "#c3c6e6"];

const css = fs.readFileSync("src/styles.css", "utf8");
const lines = css.split("\n");

let live = 0, comment = 0;
const liveLines = [];

lines.forEach((l, i) => {
  const found = COOL.filter((c) => l.toLowerCase().includes(c.toLowerCase()));
  if (!found.length) return;

  // comment check: line comment ya block comment ke andar
  const t = l.trim();
  const isLineCmt = t.startsWith("//") || t.startsWith("*") || t.startsWith("/*");
  // block comment state
  const before = css.slice(0, css.split("\n").slice(0, i).join("\n").length);
  const inBlock = (before.match(/\/\*/g) || []).length > (before.match(/\*\//g) || []).length;
  const isCmt = isLineCmt || inBlock;

  if (isCmt) {
    comment++;
    console.log(`  [comment] L${i + 1}: ${found.join(",")}`);
  } else {
    live++;
    liveLines.push(i + 1);
    console.log(`  [LIVE]    L${i + 1}: ${found.join(",")}  ->  ${t.slice(0, 72)}`);
  }
});

console.log(`\n  comment me: ${comment}   LIVE me: ${live}`);
if (liveLines.length) console.log(`  LIVE lines: ${liveLines.join(", ")}`);
