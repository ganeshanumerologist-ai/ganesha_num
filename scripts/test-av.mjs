// Ashtakavarga engine ka test.
// node scripts/test-av.mjs
import { ashtakavarga, shaniBaakut, shaniShantiScore, AV_GRAHAS } from "../src/utils/ashtakavarga.js";

// Rashi index 0..11; test ke liye har graha ki degree banate hain
const R = (i) => i * 30 + 10; // har rashi ke beech me

const mk = (signs, lag) => {
  const p = {};
  AV_GRAHAS.forEach((g, i) => { p[g] = R(signs[i] ?? i); });
  return ashtakavarga(p, lag);
};

// 1) Sab graha ek hi rashi me, lagna wahi
const a = mk([0, 0, 0, 0, 0, 0, 0, 0], 0);
console.log("Lagna=Mesha, sab graha Mesha me");
console.log("  bhava bindus:", a.house.join(","));
console.log("  graha totals :", Object.entries(a.graha).map(([k,v])=>`${k}=${v}`).join(" "));
console.log("  Shani Baakut :", shaniBaakut(a));
console.log("  Shanti Score :", shaniShantiScore(a));

// 2) Shani ka total kabhi 3 se zyada nahi hona chahiye
let maxSaturn = 0, minSaturn = 99, samples = 0;
for (let lag = 0; lag < 12; lag++) {
  for (let s0 = 0; s0 < 12; s0++) {
    for (let s1 = 0; s1 < 12; s1++) {
      for (let s2 = 0; s2 < 12; s2++) {
        for (let s3 = 0; s3 < 12; s3++) {
          const p = { Sun: R(s0), Moon: R(s1), Mars: R(s2), Mercury: R(s3),
                      Jupiter: R((s0+1)%12), Venus: R((s1+2)%12), Saturn: R(s2), Rahu: R(s3) };
          const av = ashtakavarga(p, lag);
          const sn = av.graha.Saturn;
          if (sn > maxSaturn) maxSaturn = sn;
          if (sn < minSaturn) minSaturn = sn;
          samples++;
          // Har bhava ka total kabhi 8 se zyada nahi (8 graha max)
          for (const h of av.house) if (h > 8) console.log("  !! bhava > 8:", h);
        }
      }
    }
  }
}
console.log(`\n${samples} kundli par test:`);
console.log(`  Shani ka min = ${minSaturn}, max = ${maxSaturn} (8 me se 3 se zyada nahi hona chahiye)`);
console.log(`  ${maxSaturn <= 3 ? "PASS" : "FAIL"} — Shani 3 se upar nahi gaya`);

// 3) Jupiter bhi check — uska bhi 3 se zyada nahi (1,5,7)
let maxJ = 0;
for (let lag = 0; lag < 12; lag++) {
  for (let j = 0; j < 12; j++) {
    for (let s = 0; s < 12; s++) {
      const p = { Sun: R(s), Moon: R(j), Mars: R(j), Mercury: R(s),
                  Jupiter: R(j), Venus: R(s), Saturn: R(j), Rahu: R(s) };
      const av = ashtakavarga(p, lag);
      if (av.graha.Jupiter > maxJ) maxJ = av.graha.Jupiter;
    }
  }
}
console.log(`  Jupiter max = ${maxJ} ${maxJ <= 3 ? "PASS" : "FAIL"}`);