import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dirs = process.argv.slice(2);
let bad = 0;
for (const d of dirs) {
  const files = fs.readdirSync(d).filter((f) => f.endsWith(".js")).sort();
  for (const f of files) {
    const full = path.join(d, f);
    const src = fs.readFileSync(full, "utf8");
    // invisible characters jo syntax tod sakte hain
    const badChars = [];
    for (let i = 0; i < src.length; i++) {
      const c = src.charCodeAt(i);
      // U+200B..U+200F, U+2028/2029, U+FEFF, U+2060..U+2064, U+00AD
      if ((c >= 0x200b && c <= 0x200f) || c === 0x2028 || c === 0x2029 || c === 0xfeff
        || (c >= 0x2060 && c <= 0x2064) || c === 0x00ad) {
        badChars.push(`U+${c.toString(16).toUpperCase().padStart(4, "0")}`);
      }
    }
    let status = "OK";
    try {
      // ESM parse check — dynamic import se module compile hoga
      await import(pathToFileURL(path.resolve(full)).href + "?t=" + Date.now());
    } catch (e) {
      status = "PARSE-FAIL: " + String(e.message).split("\n")[0];
      bad++;
    }
    const flag = status !== "OK" || badChars.length ? " <-- " + status + (badChars.length ? " invisible:" + [...new Set(badChars)].join(",") : "") : "";
    if (flag) console.log(full + flag);
  }
}
console.log(bad === 0 ? "ALL FILES PARSE OK" : `${bad} FILES FAILED TO PARSE`);