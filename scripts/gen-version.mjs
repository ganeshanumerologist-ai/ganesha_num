// Build id — har deploy par badalta hai.
// version.json ke zariye app apna purana cache saaf karke reload kar
// leta hai. Isse user ko "clear cache" manually karne ki zaroorat nahi.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DIST = "dist";

// package.json + git-ish input se hash — content badle tab badle,
// warna same rehta hai (taaki har build par reload na ho)
const src = fs.readFileSync("src/main.jsx", "utf8");
const hash = crypto.createHash("sha1").update(src + String(Date.now())).digest("hex").slice(0, 10);

const json = { builtAt: new Date().toISOString(), build: hash };

fs.mkdirSync(path.join(DIST), { recursive: true });
fs.writeFileSync(path.join(DIST, "version.json"), JSON.stringify(json), "utf8");
fs.writeFileSync("public/version.json", JSON.stringify(json), "utf8");

console.log(`version.json  build=${hash}  ${new Date().toISOString().slice(0, 19)}`);