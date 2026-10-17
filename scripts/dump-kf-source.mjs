// Kundli full-chart ke labels 10 aur bhasha me.
// Pehle sirf en/hi/mr the — baaki 19 bhasha me poora chart English aa raha tha.
// Isi proven pipeline se: per-language file + script-purity checker.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SRC = "src/i18n/kundliFullTX.js";
const OUT = "src/i18n/kf/";

// Script ranges
const SCRIPT = {
  bn: [0x0980, 0x09ff], ta: [0x0b80, 0x0bff], te: [0x0c00, 0x0c7f],
  gu: [0x0a80, 0x0aff], ur: [0x0600, 0x06ff], kn: [0x0c80, 0x0cff],
  or: [0x0b00, 0x0b7f], ml: [0x0d00, 0x0d7f], pa: [0x0a00, 0x0a7f],
  as: [0x0980, 0x09ff],
};

// In keys me Latin rehna SAHI hai (proper noun / technical / brand)
const LATIN_OK = new Set([]);

const ALLOWED = [
  [0x0000, 0x007f], [0x0964, 0x0965], [0x060c, 0x060c], [0x061b, 0x061f],
  [0x200c, 0x200f], [0x2013, 0x2014], [0x2018, 0x201f], [0x2026, 0x2026],
  [0x00b7, 0x00b7], [0x2190, 0x2193], [0x2600, 0x27bf], [0x1f000, 0x1faff],
];

const inR = (cp, r) => cp >= r[0] && cp <= r[1];

const mod = await import(pathToFileURL(SRC).href);
const EN = mod.kfTX("en");

fs.mkdirSync(OUT, { recursive: true });
// base JSON — agents isko translate karenge
const out = { keys: Object.keys(EN), source: EN };
fs.writeFileSync("scripts/kf-source.json", JSON.stringify(out, null, 2), "utf8");

console.log("scripts/kf-source.json likha —", Object.keys(EN).length, "keys");
console.log("target languages:", Object.keys(SCRIPT).join(", "));
console.log("");
console.log("sample keys:", Object.keys(EN).slice(0, 10).join(", "));
void LATIN_OK; void ALLOWED; void inR; void path;