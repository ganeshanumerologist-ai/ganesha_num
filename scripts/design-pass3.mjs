// Hero H1 ka clamp range: pehle 5rem max tha, yaani 1280px pe hi cap
// ho jaati thi aur 4K monitor pe (3840px) wahi 80px chhoti padti thi.
// Ultra-wide par content width to capped rahega, par display type ko
// thoda bada hona chahiye — wahi "grand" feel deta hai.
import fs from "node:fs";

const F = "src/styles.css";
let css = fs.readFileSync(F, "utf8");

const OLD = `  font-size: clamp(2.1rem, 6.4vw, 5rem);
  line-height: 1.06;`;
const NEW = `  /* max 5rem pehle 1280px pe hi cap ho jaati thi — 4K pe chhoti
     padti thi. Ab 6.5rem tak ja sakti hai, 4.6vw preferred ke saath. */
  font-size: clamp(2.1rem, 4.6vw, 6.5rem);
  line-height: 1.06;`;

if (css.includes(OLD)) {
  css = css.replace(OLD, NEW);
  fs.writeFileSync(F, css, "utf8");
  console.log("hero H1 clamp: clamp(2.1rem, 4.6vw, 6.5rem)");
} else {
  console.log("!! hero clamp line nahi mili");
}

// section headings bhi thoda upar
const OLD2 = `  font-size: clamp(1.35rem, 2.9vw, 2.1rem);`;
const NEW2 = `  font-size: clamp(1.35rem, 2.6vw, 3rem);`;
if (css.includes(OLD2)) {
  css = fs.readFileSync(F, "utf8").replace(OLD2, NEW2);
  fs.writeFileSync(F, css, "utf8");
  console.log("section H2 clamp: clamp(1.35rem, 2.6vw, 3rem)");
}
