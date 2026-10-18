// Select-String lambi lines par chup ho jaata hai — node se pakka count karo
import fs from "node:fs";
const f = fs.readdirSync("dist/assets").find((x) => x.endsWith(".js"));
const s = fs.readFileSync("dist/assets/" + f, "utf8");
console.log("bundle:", f, (s.length / 1024).toFixed(0), "KB\n");
for (const needle of [
  "hreflang", "FAQPage", "og-image.png", "application/ld+json",
  "summary_large_image", "noindex, nofollow", "GANESHA SUYOG ASTROLOGY",
  "seo_desc_kundli", "WebApplication", "x-default", "icon-512.png",
]) {
  const n = s.split(needle).length - 1;
  console.log(`  ${n ? "OK " : "-- "} ${String(n).padStart(3)}x  ${needle}`);
}
// koi bhasha wala description bundle me?
const hi = "मुफ़्त न्यूमेरोलॉजी";
console.log(`\n  hindi desc in bundle: ${s.split(hi).length - 1}x`);
const ta = "22 இந்திய மொழிகளில்";
console.log(`  tamil desc in bundle: ${s.split(ta).length - 1}x`);