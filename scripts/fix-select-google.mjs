// Jo English values bachi hain, unme se 2 AAM shabd the —
// "— Select —" aur "Continue with Google". Baaki sab brand/technical hain
// (GANESHA SUYOG ASTROLOGY, Lo Shu Grid, AI, React, Rahul Sharma example)
// wo theek hi English me rahne chahiye.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = path.join(process.cwd(), "src", "i18n", "small");

const FIX = {
  ne: { city_choose: "— चुन्नुहोस् —", google_signin: "गुगलबाट जारी राख्नुहोस्" },
  sa: { city_choose: "— चिनोतु —", google_signin: "गूगलद्वारा सततं कुरु" },
  doi: { city_choose: "— चुनो —", google_signin: "गुगल कन्ने जारी रखो" },
  mai: { city_choose: "— चुनू —", google_signin: "गुगल से जारी रखू" },
  brx: { city_choose: "— बासिङ —", google_signin: "गुगल निङ लिरा जारी रखालम" },
  ks: { city_choose: "— چونیو —", google_signin: "گوگل نال جاری رکھیو" },
  sd: { city_choose: "— چونڊيو —", google_signin: "گوگل کان جاري رکو" },
  sat: { city_choose: "— ᱵᱟᱥᱤᱝ —", google_signin: "ᱜᱩᱜᱞ ᱠᱷᱤᱡ ᱠᱟᱹᱨᱤ ᱦᱩᱭᱟᱹᱨᱟᱹ" },
  mni: { city_choose: "— বাছনি কৰা —", google_signin: "গুগলৰ যোগেৰে চালু থকোৱা" },
};

for (const [code, kv] of Object.entries(FIX)) {
  const file = path.join(DIR, `${code}.js`);
  const d = (await import(pathToFileURL(file).href)).default;
  let n = 0;
  for (const grp of ["translations", "site"]) {
    if (!d[grp]) continue;
    for (const [k, v] of Object.entries(kv)) {
      if (k in d[grp]) { d[grp][k] = v; n++; }
    }
  }
  fs.writeFileSync(file, `export default ${JSON.stringify(d, null, 2)};\n`, "utf8");
  console.log(`  ${code.padEnd(4)} ${n} fix`);
}