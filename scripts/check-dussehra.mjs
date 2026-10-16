// Calendar ke 10/11 aur 10/20 notes check — kya kisi bhasha me Dussehra ka
// note Navratri wali line me leak hua hai?
import { readdirSync, readFileSync } from "node:fs";

const DIR = "src/data/calendar";
// Dussehra note me jo distinctive shabd hote hain, woh 10/11 me hone se problem hai
const SUSPECT = {
  11: /ravan|रावण|রাবণ|రావణ|இராவண|રાવણ|راون|ರಾವಣ|ਰਾਵਣ|ରାବଣ|ৰাৱণ/i,
  20: /nava.?ratri|नवरात्रि|নবরাত্রি|నవరాత్రి|நவராத்திரி|નવરાત્રિ|نوارتَری|ನವರಾತ್ರಿ|ਨਵਰਾਤਰੀ|ନବରାତ୍ରୀ|নৱৰাত্ৰী/i,
};

for (const f of readdirSync(DIR)) {
  if (!f.endsWith(".js")) continue;
  const lines = readFileSync(`${DIR}/${f}`, "utf8").split(/\r?\n/);
  const get = (m, d) => {
    const ln = lines.find((l) => l.includes(`month: ${m}, day: ${d}`));
    return (ln || "").match(/note: "([^"]*)"/)?.[1] || "";
  };
  const n11 = get(10, 11);
  const n20 = get(10, 20);
  const bad11 = SUSPECT[11].test(n11);
  const bad20 = SUSPECT[20].test(n20);
  console.log(
    `${f.padEnd(8)} ${bad11 || bad20 ? "SUSPECT" : "ok    "}` +
    ` | 10/11 (${n11.length}) ${bad11 ? "<<< Dussehra words leaked" : ""}` +
    ` | 10/20 (${n20.length}) ${bad20 ? "<<< Navratri words leaked" : ""}`
  );
  if (bad11) console.log(`         10/11 = ${n11.slice(0, 70)}`);
  if (bad20) console.log(`         10/20 = ${n20.slice(0, 70)}`);
}