// Engine sanity test — data files se independent.
import { detectYogs, groupYogs, bazaarProfile, gridProfile, yearOutlook } from "../src/utils/loshuYog.js";
import { buildPlan, numLuck, luckyNumbers, personalDayNum, LORD_NUM } from "../src/utils/rashifalPredict.js";

let fails = 0;
const ok = (cond, msg) => { if (!cond) { console.log("FAIL:", msg); fails++; } };

// --- loshuYog ---
const full = { 1: 2, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1 };
const all = detectYogs(full);
ok(all.length === 22, `full grid par 22 yog chahiye, mile ${all.length}`);
ok(all[0].nums.length === 3, "3-number yogs sabse aage hone chahiye");

const sparse = detectYogs({ 1: 1 });
ok(sparse.length === 0, `sparse grid par 0 yog, mile ${sparse.length}`);

const some = detectYogs({ 1: 1, 5: 1, 6: 1, 8: 1 });
const keys = some.map((y) => y.key);
ok(keys.includes("1-5-6") && keys.includes("1-6") && keys.includes("1-8"), "1,5,6,8 → 1-5-6 + 1-6 + 1-8");

const g = groupYogs(some);
ok(Array.isArray(g) && g.every(([tag, list]) => list.length > 0), "groupYogs sahi shape");

const bz = bazaarProfile({ 3: 1, 8: 1, 5: 1 });
ok(bz.level === "high", `3,5,8 → high, mila ${bz.level}`);
ok(bazaarProfile({ 1: 1, 2: 1 }).level === "low", "sparse → low");
ok(bazaarProfile({ 8: 1 }).volatile === true, "8 ke bina 7 → volatile");

const gp = gridProfile(full);
ok(gp.missing.length === 0 && gp.allNine === true, "full grid: koi missing nahi");
ok(gp.repeated.includes(1), "1 do baara hai to repeated me aaye");

const yo = yearOutlook(full, 5);
ok(yo.personalYear === 5 && yo.pyLucky === true, "personal year 5 grid me hai");

// --- rashifalPredict ---
ok(LORD_NUM.length === 12 && LORD_NUM[0] === 9 && LORD_NUM[4] === 1, "LORD_NUM sahi");
// Mesha (lord 9 = Mangal) ke liye: 1,2,3 friends; 4,5,7,8 enemies
ok(numLuck(1, 0) === "friend", "Mangal ke liye 1 friend");
ok(numLuck(5, 0) === "neutral", "Mangal ke liye 5 neutral");
const LN = luckyNumbers(0);
ok(LN.good.includes(1) && LN.good.includes(2) && LN.good.includes(3), "good list me 1,2,3");
// Mesha (lord Mangal=9): friends 1,2,3 · neutral 5,6,8,9 · enemy 4,7
ok(LN.bad.includes(4) && LN.bad.includes(7), `bad list me 4,7 · mila ${LN.bad.join(",")}`);
ok(LN.ok.includes(5) && LN.ok.includes(8), `neutral list me 5,8 · mila ${LN.ok.join(",")}`);

const pd = personalDayNum(new Date(2026, 9, 16), 5, 10);
ok(pd >= 1 && pd <= 9, `personal day number 1-9, mila ${pd}`);

const deep = {
  shubh: Array.from({ length: 12 }, (_, i) => `good ${i}`),
  ashubh: Array.from({ length: 12 }, (_, i) => `bad ${i}`),
  naukri: Array.from({ length: 12 }, (_, i) => `job ${i}`),
};
const p1 = buildPlan({ deep, ri: 0, birthDay: 5, birthMonth: 10, period: "dainik", now: new Date(2026, 9, 16) });
ok(p1.topics.shubh.length === 2, "dainik me 2 line per topic (hero + card)");
ok(p1.shubh.length + p1.ashubh.length + p1.neutral.length === 1, "dainik me 1 hi din");

const p2 = buildPlan({ deep, ri: 0, birthDay: 5, birthMonth: 10, period: "saptahik", now: new Date(2026, 9, 16) });
ok(p2.topics.shubh.length === 2, "saptahik me 2 line per topic");
ok(p2.topics.shubh[0] !== p2.topics.shubh[1], "saptahik ki 2 line alag hon");
ok(p1.topics.shubh[0] !== p1.topics.shubh[1], "dainik ki 2 line alag hon");
ok(p2.shubh.length + p2.ashubh.length + p2.neutral.length === 7, "saptahik me 7 din");

const p3 = buildPlan({ deep, ri: 0, birthDay: 5, birthMonth: 10, period: "masik", now: new Date(2026, 9, 16) });
ok(p3.shubh.length + p3.ashubh.length + p3.neutral.length === 31, "masik me poore 31 din");

// Deterministic: same input → same output
const a = buildPlan({ deep, ri: 0, birthDay: 5, birthMonth: 10, period: "dainik", now: new Date(2026, 9, 16) });
const b = buildPlan({ deep, ri: 0, birthDay: 5, birthMonth: 10, period: "dainik", now: new Date(2026, 9, 16) });
ok(JSON.stringify(a.topics) === JSON.stringify(b.topics), "same input par same output (deterministic)");

// 12 lines ke pool me koi repeat nahi (2 lines maangne par)
for (let ri = 0; ri < 12; ri++) {
  for (const per of ["saptahik", "masik"]) {
    const pl = buildPlan({ deep, ri, birthDay: 5, birthMonth: 10, period: per, now: new Date(2026, 9, 16) });
    for (const t of Object.keys(pl.topics)) {
      ok(new Set(pl.topics[t]).size === pl.topics[t].length, `${per}/ri=${ri}/${t}: duplicate line`);
    }
  }
}

console.log(fails === 0 ? "ENGINE TESTS OK" : `${fails} FAILURES`);
process.exit(fails ? 1 : 0);