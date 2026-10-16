// Rashifal ka naksha-banayi jaane wala hissa — language neutral.
//
// Isme koi text nahi hai. Ye sirf batata hai:
//   - kis number ke din shubh hain, kis din ashubh (graha-sangheeya anukool)
//   - kis date par kya chalega
//   - per-topic line kaise pick hogi (deterministic, taaki har user ko
//     same din / same rashi par same prediction mile)
//
// Text `src/data/rashiDeep/<lang>.js` se aata hai.

import { reduceNumber } from "./numerology.js";

// 1 Mesha … 12 Meena ke lord ka number.
export const LORD_NUM = [9, 6, 5, 2, 1, 5, 6, 9, 3, 8, 8, 3];

// 1 Surya, 2 Chandra, 3 Guru, 4 Rahu, 5 Budh, 6 Shukra, 7 Ketu, 8 Shani, 9 Mangal
export const NUM_GRAHA = {
  1: "Surya", 2: "Chandra", 3: "Guru", 4: "Rahu", 5: "Budh",
  6: "Shukra", 7: "Ketu", 8: "Shani", 9: "Mangal",
};

// Graha-bhaav ka anukool-ni-sangheeya sambandh. Values: "friend" | "neutral" | "enemy"
const REL = {
  1: { 1: "neutral", 2: "friend", 3: "friend", 4: "enemy", 5: "neutral", 6: "enemy", 7: "enemy", 8: "enemy", 9: "friend" }, // Surya
  2: { 1: "friend", 2: "neutral", 3: "neutral", 4: "enemy", 5: "enemy", 6: "enemy", 7: "enemy", 8: "enemy", 9: "friend" }, // Chandra
  3: { 1: "friend", 2: "friend", 3: "neutral", 4: "enemy", 5: "neutral", 6: "neutral", 7: "enemy", 8: "neutral", 9: "friend" }, // Guru
  4: { 1: "enemy", 2: "enemy", 3: "enemy", 4: "neutral", 5: "friend", 6: "enemy", 7: "enemy", 8: "friend", 9: "enemy" },   // Rahu
  5: { 1: "friend", 2: "enemy", 3: "neutral", 4: "enemy", 5: "neutral", 6: "friend", 7: "enemy", 8: "neutral", 9: "neutral" }, // Budh
  6: { 1: "enemy", 2: "enemy", 3: "neutral", 4: "enemy", 5: "friend", 6: "neutral", 7: "neutral", 8: "friend", 9: "neutral" },  // Shukra
  7: { 1: "enemy", 2: "enemy", 3: "enemy", 4: "enemy", 5: "friend", 6: "friend", 7: "neutral", 8: "enemy", 9: "enemy" },    // Ketu
  8: { 1: "enemy", 2: "enemy", 3: "neutral", 4: "friend", 5: "friend", 6: "friend", 7: "enemy", 8: "neutral", 9: "neutral" }, // Shani
  9: { 1: "friend", 2: "friend", 3: "friend", 4: "enemy", 5: "neutral", 6: "neutral", 7: "enemy", 8: "neutral", 9: "neutral" }, // Mangal
};

/** Kisi number ko rashi ke hisab se shubh / neutral / ashubh. */
export function numLuck(num, ri) {
  const lord = LORD_NUM[ri] || 1;
  const r = REL[lord];
  if (!r || !r[num]) return "neutral";
  return r[num];
}

/** Poore grid ke liye shubh-wrong number ki list. */
export function luckyNumbers(ri) {
  const good = [], bad = [], ok = [];
  for (let n = 1; n <= 9; n++) {
    const l = numLuck(n, ri);
    if (l === "friend") good.push(n);
    else if (l === "enemy") bad.push(n);
    else ok.push(n);
  }
  return { good, bad, ok };
}

const pad = (n) => String(n).padStart(2, "0");

/** Ek date ka "personal day number". */
export function personalDayNum(date, birthDay, birthMonth) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return reduceNumber(d + birthDay + birthMonth + y, false);
}

/**
 * Aaj se aage `days` din ke liye shubh / ashubh / neutral ki list.
 * @returns {{shubh:Date[], ashubh:Date[], neutral:Date[]}}
 */
export function dayWindow(ri, birthDay, birthMonth, days = 7, from = new Date()) {
  const shubh = [], ashubh = [], neutral = [];
  const base = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < days; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    const n = personalDayNum(d, birthDay, birthMonth);
    const l = numLuck(n, ri);
    if (l === "friend") shubh.push(d);
    else if (l === "enemy") ashubh.push(d);
    else neutral.push(d);
  }
  return { shubh, ashubh, neutral };
}

/** Poore mahine ke liye shubh / ashubh dates. */
export function monthWindow(ri, birthDay, birthMonth, date = new Date()) {
  const y = date.getFullYear(), m = date.getMonth();
  const total = new Date(y, m + 1, 0).getDate();
  const shubh = [], ashubh = [], neutral = [];
  for (let d = 1; d <= total; d++) {
    const dt = new Date(y, m, d);
    const n = personalDayNum(dt, birthDay, birthMonth);
    const l = numLuck(n, ri);
    if (l === "friend") shubh.push(dt);
    else if (l === "enemy") ashubh.push(dt);
    else neutral.push(dt);
  }
  return { shubh, ashubh, neutral };
}

/** Poore saal ke mahine — har mahine ke shubh/ashubh din. */
export function yearWindows(ri, birthDay, birthMonth, date = new Date()) {
  const y = date.getFullYear();
  const out = [];
  for (let m = 0; m < 12; m++) {
    const dt = new Date(y, m, 15);
    const w = monthWindow(ri, birthDay, birthMonth, dt);
    out.push({ month: m, shubh: w.shubh, ashubh: w.ashubh });
  }
  return out;
}

export const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const weekKeyOf = (d = new Date()) => {
  const onejan = new Date(d.getFullYear(), 0, 1);
  const wk = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${wk}`;
};
export const monthKeyOf = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

/** Chhota sa stable hash — text pick karne ke liye. */
export function seed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 1000003;
  return h;
}

/**
 * Ek topic ke liye ek line pick karta hai — hamesha same input par same output.
 * @param {string[]} pool
 * @param {string} key   e.g. "dainik-2026-10-16-3-naukri"
 * @param {number} salt  taaki har topic ki line alag aaye
 */
export function pick(pool, key, salt = 0) {
  if (!pool || !pool.length) return "";
  return pool[(seed(key) + salt * 7) % pool.length];
}

/**
 * Poora rashifal plan banata hai — har topic ke liye lines + date lists.
 *
 * @param {object} o
 * @param {object} o.deep    rashiDeep TX object (topics -> string[])
 * @param {number} o.ri      0..11 rashi index
 * @param {number} o.birthDay
 * @param {number} o.birthMonth
 * @param {"dainik"|"saptahik"|"masik"} o.period
 * @param {Date}   o.now
 * @returns {{topics:object, shubh:Date[], ashubh:Date[], neutral:Date[], key:string}}
 */
export function buildPlan({ deep, ri, birthDay = 0, birthMonth = 1, period = "dainik", now = new Date() }) {
  const isWeek = period === "saptahik";
  const isMonth = period === "masik";
  const key = period === "dainik" ? dayKey(now) : isWeek ? weekKeyOf(now) : monthKeyOf(now);
  const saltBase = period === "dainik" ? 0 : isWeek ? 3 : 6;

  const topics = {};
  if (deep) {
    for (const t of Object.keys(deep)) {
      const arr = deep[t];
      if (!Array.isArray(arr) || !arr.length) continue;
      // Har period me 2 lines — hero box [0] dikhata hai, niche wala card [1].
      // Isse ek hi line do jagah repeat nahi hoti.
      const n = 2;
      const out = [];
      const used = new Set();
      for (let i = 0; i < n; i++) {
        let line = pick(arr, `${key}-${ri}-${t}`, saltBase + i);
        let guard = 0;
        while (used.has(line) && guard++ < arr.length) line = pick(arr, `${key}-${ri}-${t}-x${guard}`, saltBase + i);
        used.add(line);
        out.push(line);
      }
      topics[t] = out;
    }
  }

  let win;
  if (period === "dainik") win = dayWindow(ri, birthDay, birthMonth, 1, now);
  else if (period === "saptahik") win = dayWindow(ri, birthDay, birthMonth, 7, now);
  else win = monthWindow(ri, birthDay, birthMonth, now);

  const { good, bad } = luckyNumbers(ri);
  return {
    topics,
    key,
    period,
    shubh: win.shubh,
    ashubh: win.ashubh,
    neutral: win.neutral,
    goodNums: good,
    badNums: bad,
    days:
      period === "masik"
        ? win.shubh.length + win.ashubh.length + win.neutral.length
        : period === "saptahik" ? 7 : 1,
  };
}

export default {
  LORD_NUM, NUM_GRAHA, numLuck, luckyNumbers, personalDayNum,
  dayWindow, monthWindow, yearWindows, buildPlan, pick, seed,
  dayKey, weekKeyOf, monthKeyOf,
};