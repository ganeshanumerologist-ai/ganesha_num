import { reduceToDigit } from "./forecast.js";

export const DAY_INFO = {
  1: { color: "Laal (Red)", direction: "Poorab (East)", upay: "Surya ko jal dein, pita ka aashirvaad lein.", vibe: "Nayi shuruaat, himmat wala din." },
  2: { color: "Safed (White)", direction: "Uttar-Pashchim", upay: "Chandra ko doodh-chawal daan, shaant mann rakhein.", vibe: "Rishtey-namrata wala din." },
  3: { color: "Peela (Yellow)", direction: "Ishaan (NE)", upay: "Guru ko namaskar, padhai-likhan par dhyaan.", vibe: "Khushi-creativity wala din." },
  4: { color: "Neela (Blue)", direction: "Dakshin", upay: "Kaam ki list banao, ek-ek karke niptao.", vibe: "Mehnat-anushaasan wala din." },
  5: { color: "Hara (Green)", direction: "Uttar", upay: "Yatra/yojana badlaav ke liye shubh, Ganpati smaran.", vibe: "Badlaav-phaayde wala din." },
  6: { color: "Gulaabi (Pink)", direction: "Aagney (SE)", upay: "Parivaar ke saath samay, kisi ki madad karo.", vibe: "Pyaar-sukh wala din." },
  7: { color: "Baingani (Violet)", direction: "Vayavya (NW)", upay: "Dhyaan/jap, kam bolna, gehri soch.", vibe: "Chintan-adhyayan wala din." },
  8: { color: "Sunehra (Golden)", direction: "Pashchim (West)", upay: "Bada faisla/daam-maangna shubh, Shani smaran.", vibe: "Dhan-safalta wala din." },
  9: { color: "Kesariya (Saffron)", direction: "Madhya", upay: "Daan-seva, purane kaam poore karo.", vibe: "Seva-poornata wala din." },
};

export const VAAR = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];

export function universalDay(dateStr) {
  // dateStr: YYYY-MM-DD
  const digits = dateStr.replace(/\D/g, "");
  return reduceToDigit(digits.split("").reduce((a, b) => a + Number(b), 0));
}

export function personalDay(birthdate, dateStr) {
  if (!birthdate) return null;
  const parts = birthdate.split("-");
  if (parts.length < 3) return null;
  const base = Number(parts[1]) + Number(parts[2]);
  return reduceToDigit(base + universalDay(dateStr));
}

export default DAY_INFO;
