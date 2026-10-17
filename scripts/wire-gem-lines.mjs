import fs from "node:fs";

const F = "src/components/KundliChart.jsx";
let lines = fs.readFileSync(F, "utf8").split("\n");

let n = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];

  // gem-rec block — stone
  if (l.trim() === "<b>{g.stone}</b>") {
    lines[i] = l.replace("{g.stone}", "{X[`k_gem_${g.planet}_stone`] ?? g.stone}"); n++;
  }
  // metal + finger (beech me middle-dot hai — regex se pakdo)
  else if (l.includes("gem-rec-gr") && l.includes("{g.metal}") && l.includes("{g.finger}")) {
    lines[i] = l
      .replace("{g.metal}", "{X[`k_gem_${g.planet}_metal`] ?? g.metal}")
      .replace("{g.finger}", "{X[`k_gem_${g.planet}_finger`] ?? g.finger}"); n++;
  }
  // why
  else if (l.includes("gem-rec-why") && l.includes("{g.reason}")) {
    lines[i] = l.replace("{g.reason}", "{why(g)}"); n++;
  }
  // day
  else if (l.includes("gem-rec-day") && l.includes("{g.day}")) {
    lines[i] = l.replace("{g.day}", "{X[`k_gem_${g.planet}_day`] ?? g.day}"); n++;
  }
  // table: stone / metal / day
  else if (l.trim() === "<td>{g.stone}</td>") {
    lines[i] = l.replace("{g.stone}", "{X[`k_gem_${g.planet}_stone`] ?? g.stone}"); n++;
  }
  else if (l.trim() === "<td>{g.metal}</td>") {
    lines[i] = l.replace("{g.metal}", "{X[`k_gem_${g.planet}_metal`] ?? g.metal}"); n++;
  }
  else if (l.trim() === "<td>{g.day}</td>") {
    lines[i] = l.replace("{g.day}", "{X[`k_gem_${g.planet}_day`] ?? g.day}"); n++;
  }
}

fs.writeFileSync(F, lines.join("\n"), "utf8");
console.log(`${n} lines localize hue`);
