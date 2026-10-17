// TEMP test build ke liye gate bypass. Test ke baad YE FILE revert ho jaati hai.
import fs from "node:fs";

const F = "src/components/RequireAuth.jsx";
const s = fs.readFileSync(F, "utf8");

if (s.includes("nogate")) {
  console.log("bypass pehle se ON");
} else {
  const out = s.replace(
    "  const loc = useLocation();",
    '  const loc = useLocation();\n\n  // __TEMP_TEST_GATE_BYPASS__\n  if (typeof window !== "undefined" && window.location.search.includes("nogate")) return children;',
  );
  if (out === s) {
    console.log("!! marker nahi mila — haath se dekhna padega");
    process.exit(1);
  }
  fs.writeFileSync(F, out, "utf8");
  console.log("bypass ON");
}
