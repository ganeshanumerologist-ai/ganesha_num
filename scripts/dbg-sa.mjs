import sa from "../src/i18n/small/sa.js";
import ne from "../src/i18n/small/ne.js";
import { smallLang, SMALL_LANGS } from "../src/i18n/smallTX.js";

console.log("SMALL_LANGS:", SMALL_LANGS.join(","));
for (const [name, d] of [["sa", sa], ["ne", ne]]) {
  console.log(`\n=== ${name}.js ===`);
  console.log("  keys        :", Object.keys(d).join(","));
  console.log("  code        :", d.code);
  console.log("  translations:", Object.keys(d.translations || {}).length);
  console.log("  site        :", Object.keys(d.site || {}).length);
  console.log("  kundli      :", Object.keys(d.kundli || {}).length);
  console.log("  pg          :", Object.keys(d.pg || {}).length);
  console.log("  nav_home    :", d.translations?.nav_home);
  console.log("  nav_kundli  :", d.translations?.nav_kundli);
}
console.log("\n=== smallLang() ===");
for (const l of SMALL_LANGS) {
  const m = smallLang(l);
  const n = m ? Object.keys(m.translations || {}).length : 0;
  console.log(`  ${l.padEnd(4)} ${m ? "OK" : "*** NULL ***"}  translations=${n}`);
}