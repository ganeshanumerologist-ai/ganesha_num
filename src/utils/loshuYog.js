// Lo Shu Grid yog-detection engine.
//
// Language-neutral: isme koi bhi text nahi hai. Ye sirf number-set se
// batata hai ki grid me kaun-kaun se yog bane aur wo kis category me aate hain.
// Text `src/data/loshu/<lang>.js` se aata hai.
//
// `present` = Set ya object jisme keys 1..9 hain aur value = us number ki
// grid me ginti. Example: {1:2, 3:1, 5:1, 6:1, 9:1}

// Yog ki priority: 3-number wale pehle (unke prabhavZyada hote hain),
// phir 2-number wale.
const YOGS = [
  { key: "1-5-6", nums: [1, 5, 6], tag: "raj" },
  { key: "1-4-7", nums: [1, 4, 7], tag: "labh" },
  { key: "1-6", nums: [1, 6], tag: "raj" },
  { key: "1-9", nums: [1, 9], tag: "labh" },
  { key: "1-3", nums: [1, 3], tag: "dhan" },
  { key: "1-2", nums: [1, 2], tag: "property" },
  { key: "1-8", nums: [1, 8], tag: "raj" },
  { key: "1-7", nums: [1, 7], tag: "raj" },
  { key: "1-4", nums: [1, 4], tag: "property" },
  { key: "2-7", nums: [2, 7], tag: "dhan" },
  { key: "2-9", nums: [2, 9], tag: "dhan" },
  { key: "2-4", nums: [2, 4], tag: "property" },
  { key: "3-9", nums: [3, 9], tag: "dhan" },
  { key: "3-5", nums: [3, 5], tag: "labh" },
  { key: "3-6", nums: [3, 6], tag: "raj" },
  { key: "3-8", nums: [3, 8], tag: "bazaar" },
  { key: "4-7", nums: [4, 7], tag: "property" },
  { key: "5-9", nums: [5, 9], tag: "dhan" },
  { key: "5-7", nums: [5, 7], tag: "vyapar" },
  { key: "5-8", nums: [5, 8], tag: "vyapar" },
  { key: "6-9", nums: [6, 9], tag: "property" },
  { key: "7-9", nums: [7, 9], tag: "dhan" },
];

// Sabhi tag ka fixed order — UI me isi order me group dikhega.
export const YOG_TAGS = ["raj", "dhan", "property", "bazaar", "vyapar", "labh"];

export function presentSet(grid) {
  const s = new Set();
  if (!grid) return s;
  for (let n = 1; n <= 9; n++) {
    const v = Array.isArray(grid) ? grid[n - 1] : grid[n];
    if (v) s.add(n);
  }
  return s;
}

/**
 * Grid se saare yog nikaalta hai.
 * @returns {Array<{key:string, nums:number[], tag:string}>} — strong yogs pehle
 */
export function detectYogs(grid) {
  const p = presentSet(grid);
  if (p.size === 0) return [];
  const out = [];
  for (const y of YOGS) {
    if (y.nums.every((n) => p.has(n))) out.push({ ...y });
  }
  out.sort((a, b) => b.nums.length - a.nums.length || a.key.localeCompare(b.key));
  return out;
}

/** Tag ke hisab se group kar deta hai, sirf non-empty groups. */
export function groupYogs(yogs) {
  const g = {};
  for (const y of yogs) {
    if (!g[y.tag]) g[y.tag] = [];
    g[y.tag].push(y);
  }
  return YOG_TAGS.filter((t) => g[t] && g[t].length).map((t) => [t, g[t]]);
}

/**
 * Share-market yog ka alag se andaza.
 * 3 aur 8 trade/market ke numbers maane jaate hain, 5 deal & brokerage ka.
 */
export function bazaarProfile(grid) {
  const p = presentSet(grid);
  const has3 = p.has(3), has8 = p.has(8), has5 = p.has(5), has9 = p.has(9), has7 = p.has(7);
  let score = 0;
  if (has3) score += 1;
  if (has8) score += 1;
  if (has5) score += 1;
  if (has9) score += 1;
  if (has3 && has8) score += 2;

  let level = "low";
  if (score >= 5) level = "high";
  else if (score >= 3) level = "mid";

  // 7 ke bina 8 = Saturn ki shadow — short-term trade me jyada nuksan.
  const volatile = has8 && !has7;
  return { level, score, has3, has8, has5, has9, volatile, tag: "bazaar" };
}

/** Poore grid ka structural haal — UI ke summary ke liye. */
export function gridProfile(grid) {
  const p = presentSet(grid);
  const counts = Array.isArray(grid) ? grid : null;
  const repeated = [];
  for (let n = 1; n <= 9; n++) {
    const v = counts ? counts[n - 1] : (grid ? grid[n] : 0);
    if (v > 1) repeated.push(n);
  }
  const missing = [];
  for (let n = 1; n <= 9; n++) if (!p.has(n)) missing.push(n);

  return {
    present: p,
    missing,
    repeated,
    single: p.size === 1,
    allNine: p.size === 9,
    // 3 aur 8 dono na ho = Abhijit muhurat khaali; chal sakta hai
    abhijitOpen: !p.has(3) || !p.has(8),
    // 8 (Rahu/Saturn) ke gird 2,4,6,7 ke bina = shani se ghera hua
    shaniGhera: p.has(8) && !p.has(7) && p.has(2) && p.has(4) && p.has(6),
    // 4 aur 8 dono = Rahu ki pakad — naukri/samajik me rukawat
    rahuDosh: p.has(4) && p.has(8),
    // 2 aur 7 dono = Kuber ki pancha — paisa aata hai, kharch bhi
    kuber: p.has(2) && p.has(7),
    // 1,5,6 = sabse powerful raj yog
    maharaj: p.has(1) && p.has(5) && p.has(6),
  };
}

/**
 * Poore saal ka outlook — personal year aur grid ke hisab se.
 * Personal year = reduceNumber(birthDay + birthMonth + currentYear)
 */
export function yearOutlook(grid, personalYear) {
  const gp = gridProfile(grid);
  const strong = [];
  for (let n = 1; n <= 9; n++) {
    const v = grid ? grid[n] : 0;
    if (v > 1) strong.push(n);
  }
  // Personal year ke number bhi grid me ho to aur badhiya.
  const pyLucky = gp.present.has(personalYear);
  const weak = gp.missing.length >= 4;
  return {
    personalYear,
    pyLucky,
    strong,
    missing: gp.missing,
    // strong numbers >=2 = bada saal; 0 strong = bhaari saal
    verdict: strong.length >= 2 ? "up" : strong.length === 1 ? "mixed" : "down",
    weak,
  };
}

export default { detectYogs, groupYogs, bazaarProfile, gridProfile, yearOutlook, YOG_TAGS };