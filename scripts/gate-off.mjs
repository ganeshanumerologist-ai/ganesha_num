// TEMP test bypass ko HATA do — production me nahi rehna chahiye.
// Verify karta hai ki gate wapas apni jagah aa gaya.
import fs from "node:fs";

const F = "src/components/RequireAuth.jsx";
let s = fs.readFileSync(F, "utf8");

if (!s.includes("nogate")) {
  console.log("bypass pehle se OFF ✅");
} else {
  s = s
    .replace(/\n\s*\/\/ __TEMP_TEST_GATE_BYPASS__\n\s*if \(typeof window[^\n]*nogate[^\n]*\n/, "\n");
  fs.writeFileSync(F, s, "utf8");

  if (fs.readFileSync(F, "utf8").includes("nogate")) {
    console.log("*** ABHI BHI HAI — gate toota hua hai! ***");
    process.exit(1);
  }
  console.log("bypass OFF ✅ — production me gate apni jagah hai");
}

// aur confirm: Navigate wala line maujood hai
const chk = fs.readFileSync(F, "utf8");
console.log('gate line maujood: ' + chk.includes('Navigate to="/login"'));
