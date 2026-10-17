// Nested template literal `${...}` ko string concatenation se badla do —
// wrapper script me backtick ke andar backtick nahi aa sakta.
import fs from "node:fs";

const F = "scripts/add-birth-glance.mjs";
let s = fs.readFileSync(F, "utf8");

const OLD = "    moonDegree: `${Math.floor(rev(lons.Moon) % 30)}°${String(Math.floor((rev(lons.Moon) % 1) * 60)).padStart(2, \"0\")}'`,";

const NEW = '    moonDegree: Math.floor(rev(lons.Moon) % 30) + "\\u00b0" + '
  + 'String(Math.floor((rev(lons.Moon) % 1) * 60)).padStart(2, "0") + "\\u2032",';

if (s.includes(OLD)) {
  s = s.replace(OLD, NEW);
  fs.writeFileSync(F, s, "utf8");
  console.log("moonDegree fix ho gaya");
} else {
  console.log("!! moonDegree line nahi mili");
}
