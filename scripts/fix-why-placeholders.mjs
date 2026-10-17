// 1. Checker: {p} aur {h} jaan-boojh kar rakhe jaate hain (placeholder),
//    isliye unhe Latin na samjha jaaye.
// 2. Do asli galtiyan: ta.k_mu_amrit aur te.k_why_node me Devanagari chhadak.
import fs from "node:fs";

// ── 1. checker fix ──
{
  const F = "scripts/check-kf-files.mjs";
  let s = fs.readFileSync(F, "utf8");

  const OLD = '    if (/[A-Za-z]/.test(s)) { problems.push(`${k} me Latin: "${s.slice(0, 34)}"`); continue; }';

  const NEW = [
    "    // {p} (points) aur {h} (house) jaan-boojh kar rakhe jaate hain —",
    "    // inhe rendering time par number se replace kiya jaata hai.",
    "    // Pehle ye Latin samajh aa rahe the aur 40 false FAIL de rahe the.",
    '    const withoutPh = s.replaceAll("{p}", "").replaceAll("{h}", "");',
    '    if (/[A-Za-z]/.test(withoutPh)) {',
    '      problems.push(`${k} me Latin: "${s.slice(0, 34)}"`);',
    "      continue;",
    "    }",
  ].join("\n");

  if (s.includes(OLD)) {
    s = s.replace(OLD, NEW);
    fs.writeFileSync(F, s, "utf8");
    console.log("checker fix: {p}/{h} placeholder exempt");
  } else {
    console.log("!! checker: line nahi mili");
  }
}

// ── 2. ta.k_mu_amrit ──
// "அம்ருத" me U+0943 (Devanagari vocalic r) aa gaya tha.
{
  const F = "src/i18n/kf/ta.js";
  let s = fs.readFileSync(F, "utf8");
  const lines = s.split("\n");
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("k_mu_amrit:")) {
      lines[i] = '  k_mu_amrit: "அமுத காலம்",';
      n++;
    }
  }
  fs.writeFileSync(F, lines.join("\n"), "utf8");
  console.log(`ta.k_mu_amrit fix (${n})`);
}

// ── 3. te.k_why_node ──
// "చెబుతాయి" ke beech me Devanagari matra chhadak thi.
{
  const F = "src/i18n/kf/te.js";
  let s = fs.readFileSync(F, "utf8");
  const lines = s.split("\n");
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("k_why_node:")) {
      lines[i] = '  k_why_node: "ఛాయా గ్రహం — శాస్త్రాలకు దీనిని ధరించవద్దని చెప్పుతారు.",';
      n++;
    }
  }
  fs.writeFileSync(F, lines.join("\n"), "utf8");
  console.log(`te.k_why_node fix (${n})`);
}
