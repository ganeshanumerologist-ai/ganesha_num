// Har bhasha me abhi kitne keys hain, aur 201 target me kya bacha hai.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = path.join(process.cwd(), "src", "i18n", "kf");
const SRC = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "kf-source.json"), "utf8"));

// nayi family: gem / muhurat / why
const NEW = SRC.keys.filter((k) => /^k_gem_[A-Za-z]+_(stone|metal|day|finger)$/.test(k) || /^k_mu_/.test(k) || /^k_why_/.test(k));

const lines = [];
lines.push(`source me total keys : ${SRC.keys.length}`);
lines.push(`nayi family (gem/mu/why): ${NEW.length}`);
lines.push("");

for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".js")).sort()) {
  const code = f.replace(/\.js$/, "");
  const d = (await import(pathToFileURL(path.join(DIR, f)).href)).default;
  const has = NEW.filter((k) => k in d).length;
  lines.push(
    `  ${code.padEnd(4)} ${String(Object.keys(d).length).padStart(3)} keys   ` +
    `${has}/${NEW.length} nayi   ${has === NEW.length ? "READY" : "→ agent chahiye: " + NEW.filter((k) => !(k in d)).length}`,
  );
}

fs.writeFileSync("scripts/_kf-status.txt", lines.join("\n"), "utf8");
console.log(lines.join("\n"));
