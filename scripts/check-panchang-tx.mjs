import { siteTX } from "../src/i18n/siteTx.js";
const L = ["en", "hi", "mr", "bn", "ta", "te", "gu", "ur", "kn", "or", "ml", "pa", "as"];
console.log("lang  pan_godhuli_time                          pan_hora_note");
for (const l of L) {
  const S = siteTX(l);
  console.log(
    l.padEnd(5),
    String(S.pan_godhuli_time).slice(0, 36).padEnd(38),
    String(S.pan_hora_note).slice(0, 34),
  );
}
const withTime = L.filter((l) => /\d{1,2}:\d{2}/.test(String(siteTX(l).pan_godhuli_time)));
console.log("\ngedhuli me ab bhi static time hai:", withTime.length ? withTime.join(",") : "nahi ✅");
const withSix = L.filter((l) => /6:00/.test(String(siteTX(l).pan_hora_note)));
console.log("hora note me ab bhi '6:00':", withSix.length ? withSix.join(",") : "nahi ✅");