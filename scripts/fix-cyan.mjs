import fs from "node:fs";

const F = "src/components/JyotishBackdrop.jsx";
let s = fs.readFileSync(F, "utf8");

// kalash ka neeche wala ellipse cyan tha
s = s.replace('fill="#22d3ee"', 'fill="#f7c948"');
fs.writeFileSync(F, s, "utf8");
console.log('kalash ellipse #22d3ee -> #f7c948');

// verify
const src = fs.readFileSync(F, "utf8");
const cool = (src.match(/22d3ee|8b5cf6|5ee7f5|a78bfa|67e8f9/gi) || []);
console.log(cool.length ? "ab bhi: " + [...new Set(cool)].join(", ") : "JyotishBackdrop: sab warm ✅");
