import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { allNumbers, destinyNumber, soulUrgeNumber, personalityNumber, luckyNumber, onlyLetters } from "../utils/numerology.js";
import { personalYear } from "../data/forecast.js";
import { yearMeaning } from "../data/varshphal_i18n.js";
import { getMeaning } from "../data/meanings_all.js";
import kundliT from "../i18n/kundli.js";
import { universalDay } from "../data/daily.js";

// DD-MM-YYYY ya YYYY-MM-DD → YYYY-MM-DD
function toISO(raw) {
  const s = raw.trim();
  let m = s.match(/(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = s.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return null;
}

const STR = {
  hi: {
    head: (n) => `${n} — आपकी संपूर्ण जानकारी:`,
    hint: "अपना नाम + जन्मतिथि भेजें, मैं Life Path, Destiny, Soul Urge सब निकाल दूंगा। Example: 'Rahul Sharma 1995-08-15'",
    nodate: "तारीख समझ नहीं आई। Format: Naam YYYY-MM-DD, जैसे 'Rahul Sharma 1995-08-15'.",
    greet: "नमस्ते! मैं Numerology VIP AI हूँ। नाम + जन्मतिथि भेजें (जैसे 'Rahul Sharma 1995-08-15'), या कोई अंक लिखें।",
    fallback: "नाम + जन्मतिथि भेजें (जैसे 'Rahul Sharma 1995-08-15'), या 'career', 'love', 'aaj', 'upay' या कोई अंक लिखें।",
    love: "प्रेम के लिए 2, 6, 9 अंक शुभ माने जाते हैं। अपना Soul Urge जानने के लिए नाम + जन्मतिथि भेजें।",
    career: "करियर के लिए Destiny अंक देखें: 1-नेता, 4-निर्माता, 5-व्यापार/मीडिया, 8-धन/CEO। नाम + जन्मतिथि भेजें।",
    today: (u) => `आज Universal Day ${u} है — Daily Lucky पेज पर अपना पूरा हाल देखें।`,
    milan: "शादी/पार्टनरशिप मिलान के लिए Milan पेज पर दोनों के नाम + जन्मतिथि डालें।",
    book: "Expert से बात करने के लिए Experts पेज पर Book Session दबाएं या WhatsApp बटन से जुड़ें।",
    upayAsk: "किस अंक का उपाय चाहिए? अंक लिखें (1-9, 11, 22, 33), मैं अर्थ + उपाय दोनों बताऊंगा।",
    nameHead: (n) => `${n} — नाम से निकले अंक:`,
    mobile: (d, v) => `Mobile/vehicle ${d} का Lucky अंक ${v} है।`,
    friend: "मित्र",
    arthik: "धन के लिए Bhagyank 8 और Moolank 1-5-6 शुभ माने जाते हैं। अपने अंक जानने के लिए नाम + जन्मतिथि भेजें।",
    gochar: "Guru-Shani ki live sthiti Gochar page par dekhein। Apni rashi ka haal Rashifal page par hai।",
    muhurat: "Vivah/mundan/vidyarambh ke liye Muhurat page par tarikh jaanch kar dekhein।",
    rashi: "Apni Chandra rashi janane ke liye Reports page par DOB dalen, ya Rashifal me apni rashi chunein।",
    menu: "Main ye sab bata sakta hoon:\n• Naam + tarikh bhejo → poore ank (jaise 'Rahul Sharma 1995-08-15')\n• Koi ank likho (1-9) → arth + upay\n• 'aaj' likho → aaj ka din\n• 'milan' → shaadi matching\n• 'love' / 'career' / 'paisa' → salah",
    yearAsk: (y) => `${y || "Us saal"} ka haal janane ke liye apni janm-tithi bhejein (jaise 'Rahul Sharma 1995-08-15').`,
    health: "Sehat ke liye dincharya, neend aur khan-paan sudharein. Gambhir samasya par doctor se milein — ank margdarshan hai, ilaj nahi.",
    market: "Share-bazaar me nivesh apne jokhim par — expert salah zaroor lein. Ank-shastra disha deta hai, guarantee nahi. Dhan-yog Personal Year 8 me prabal.",
    business: "Vyapar ke liye Bhagyank 5-8 aur Moolank 1-3-5 shubh. Naya vyapar Personal Year 1 me shuru karein. Naam + tarikh bhejein, poore ank batata hoon.",
    mental: "Maan ki shanti ke liye dhyaan, gehri saans aur Somvaar ko chandra-darshan. Tension zyada ho to vishwas-patra se baat karein.",
  },
  mr: {
    head: (n) => `${n} — संपूर्ण माहिती:`,
    hint: "तुमचे नाव + जन्मतारीख पाठवा, मी Life Path, Destiny, Soul Urge सर्व काढून देईन. Example: 'Rahul Sharma 1995-08-15'",
    nodate: "तारीख समजली नाही. Format: Naam YYYY-MM-DD, जसे 'Rahul Sharma 1995-08-15'.",
    greet: "नमस्कार! मी Numerology VIP AI आहे. नाव + जन्मतारीख पाठवा (जसे 'Rahul Sharma 1995-08-15'), किंवा अंक लिहा.",
    fallback: "नाव + जन्मतारीख पाठवा (जसे 'Rahul Sharma 1995-08-15'), किंवा 'career', 'love', 'aaj', 'upay' किंवा अंक लिहा.",
    love: "प्रेमासाठी 2, 6, 9 अंक शुभ मानले जातात. Soul Urge जाणण्यासाठी नाव + जन्मतारीख पाठवा.",
    career: "करिअरसाठी Destiny अंक पहा: 1-नेता, 4-निर्माता, 5-व्यापार/मीडिया, 8-धन/CEO. नाव + जन्मतारीख पाठवा.",
    today: (u) => `आज Universal Day ${u} आहे — Daily Lucky पेजवर संपूर्ण हाल पहा.`,
    milan: "लग्न/पार्टनरशिप मिलनासाठी Milan पेजवर दोघांची नावे + जन्मतारखा टाका.",
    book: "Expert शी बोलण्यासाठी Experts पेजवर Book Session दाबा किंवा WhatsApp बटनने जोडा.",
    upayAsk: "कोणत्या अंकाचा उपाय हवा? अंक लिहा (1-9, 11, 22, 33), मी अर्थ + उपाय सांगेन.",
    nameHead: (n) => `${n} — नावावरून निघालेले अंक:`,
    mobile: (d, v) => `Mobile/vehicle ${d} चा Lucky अंक ${v} आहे.`,
    friend: "मित्र",
    arthik: "धनासाठी Bhagyank 8 आणि Moolank 1-5-6 शुभ मानले जातात. अंक जाणण्यासाठी नाव + जन्मतारीख पाठवा.",
    gochar: "Guru-Shani chi live sthiti Gochar page var paha. Rashi haal Rashifal page var aahe.",
    muhurat: "Vivah/mundan/vidyarambh sathi Muhurat page var tarikh tapasun paha.",
    rashi: "Chandra rashi jananyasathi Reports page var DOB taka, ki Rashifal madhe rashi nivda.",
    menu: "Mi he sarva sangu shakto:\n• Naav + tarikh pathva → purna ank (jase 'Rahul Sharma 1995-08-15')\n• Ank liha (1-9) → arth + upay\n• 'aaj' liha → aajcha divas\n• 'milan' → lagna matching\n• 'love' / 'career' / 'paisa' → salla",
    yearAsk: (y) => `${y || "Tya varsh"}cha haal jananyasathi janm-tarikh pathva (jase 'Rahul Sharma 1995-08-15').`,
    health: "Aarogyasathi dincharya, zhop aani khan-paan sudhara. Gambhir samasyesathi doctor la bheta — ank margadarshan aahe, upchar nahi.",
    market: "Share-bazarat guntavanuk swatachya jokhamivar — tadnyancha salla ghya. Ank-shastra disha dete, guarantee nahi.",
    business: "Vyaparasathi Bhagyank 5-8 aani Moolank 1-3-5 shubh. Nava vyapar Personal Year 1 madhe suru kara.",
    mental: "Manachya shantisathi dhyan, khol shvas aani Somvari chandra-darshan. Tension jast asel tar vishvasu vyaktishi bola.",
  },
  en: {
    head: (n) => `${n} — your complete reading:`,
    hint: "Send your name + birthdate and I'll calculate Life Path, Destiny, Soul Urge. Example: 'Rahul Sharma 1995-08-15'",
    nodate: "Couldn't read the date. Format: Name YYYY-MM-DD, e.g. 'Rahul Sharma 1995-08-15'.",
    greet: "Hello! I am Numerology VIP AI. Send name + birthdate like 'Rahul Sharma 1995-08-15', or ask about any number.",
    fallback: "Send name + birthdate (like 'Rahul Sharma 1995-08-15'), or ask about 'career', 'love', 'today', 'upay' or any number.",
    love: "For love, numbers 2, 6, 9 are harmonious. Send name + birthdate to find your Soul Urge.",
    career: "For career look at Destiny: 1-leader, 4-builder, 5-sales/media, 8-business/CEO. Send name + birthdate.",
    today: (u) => `Today is Universal Day ${u} — see your full forecast on the Daily Lucky page.`,
    milan: "For marriage/partnership matching, enter both names + birthdates on the Milan page.",
    book: "To talk to an expert, press Book Session on the Experts page or use the WhatsApp button.",
    upayAsk: "Which number's upay do you want? Write a number (1-9, 11, 22, 33).",
    nameHead: (n) => `${n} — numbers from your name:`,
    mobile: (d, v) => `Lucky number of ${d} is ${v}.`,
    friend: "friend",
    arthik: "For wealth, Bhagyank 8 and Moolank 1-5-6 are considered good. Send name + birthdate for your numbers.",
    gochar: "See live Guru-Shani positions on the Gochar page. Rashi forecast is on the Rashifal page.",
    muhurat: "Check dates for vivah/mundan/vidyarambh on the Muhurat page.",
    rashi: "Enter DOB on the Reports page to know your Moon sign, or pick your rashi on Rashifal.",
    menu: "I can tell you:\n• Send name + date → full numbers (like 'Rahul Sharma 1995-08-15')\n• Write a number (1-9) → meaning + upay\n• Write 'today' → today's forecast\n• 'milan' → marriage matching\n• 'love' / 'career' / 'money' → guidance",
    yearAsk: (y) => `To know about ${y || "that year"}, send your birthdate (like 'Rahul Sharma 1995-08-15').`,
    health: "Improve routine, sleep and diet for health. See a doctor for serious issues — numbers guide, they don't treat.",
    market: "Invest at your own risk — take expert advice. Numerology shows direction, not guarantee.",
    business: "Bhagyank 5-8 and Moolank 1-3-5 suit business. Start new ventures in Personal Year 1.",
    mental: "For peace of mind: meditation, deep breathing and Monday moon-gazing. Talk to someone trusted if stressed.",
  },
};
const S = (lang, key) => (STR[lang] && STR[lang][key] !== undefined ? STR[lang][key] : STR.en[key]);

function fullBlock(pairs, lang) {
  const L = kundliT(lang);
  return pairs
    .filter(([, v]) => v != null)
    .map(([label, v]) => {
      const m = getMeaning(v, lang);
      return `${label}: ${v} — ${m.title}\n${m.desc}\n${L.k_career}: ${m.career}\n${L.k_love}: ${m.love}\n${L.k_upay}: ${m.upay}`;
    })
    .join("\n\n");
}

// "mera 2027 kaisa jayega" jaise sawalon se saaf naam nikalo
const STOPWORDS = new Set([
  "mera", "meri", "mere", "mujhe", "mujhko", "ka", "ki", "ke", "ko", "kaisa", "kaisi", "kaise",
  "jayega", "jayegi", "jayenge", "rahega", "rahegi", "rahengi", "hoga", "hogi", "honge",
  "saal", "sal", "year", "years", "batao", "bataiye", "bataen", "kya", "hai", "he", "hain", "mein", "me",
  "majha", "majhi", "majhya", "maza", "mala", "kasa", "kashi", "kase", "honar", "asel", "jaeel",
  "varsh", "sang", "sanga", "sangu", "krupaya", "for", "my", "will", "how", "tell", "about", "please",
  "cha", "chi", "che", "la", "ne", "shi", "bol", "saka", "te", "tar", "ahe", "aahe",
]);
function cleanName(s) {
  const parts = s.split(/\s+/).filter((w) => w && !STOPWORDS.has(w.toLowerCase()) && !/^\d+$/.test(w));
  return parts.join(" ") || null;
}

function yearText(name, y, py, lang) {
  const m = yearMeaning(py, lang);
  const L = kundliT(lang);
  const H = lang === "hi" ? "सेहत" : lang === "mr" ? "आरोग्य" : "Health";
  const C = lang === "hi" || lang === "mr" ? "शुभ रंग" : "Lucky colour";
  const A = lang === "hi" ? "सलाह" : lang === "mr" ? "सल्ला" : "Advice";
  return `${name} — ${y} (Personal Year ${py}): ${m.t}\n${m.d}\n${L.k_career}: ${m.c}\n${L.k_love}: ${m.love}\n${H}: ${m.h}\n${C}: ${m.col}\n${A}: ${m.adv}`;
}

function aiReply(text, lang) {
  const t = text.toLowerCase();

  // 1) Naam + tarikh → saal ka sawal ho to varshphal, nahi to poori gadna
  const dateRaw = text.match(/\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}|\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{4}/);
  const yearQ = text.match(/\b(20\d{2})\b/);
  const yearIntent = /(saal|\bsal\b|year|varsh|साल|वर्ष)/.test(t);
  if (dateRaw) {
    const iso = toISO(dateRaw[0]);
    const rest = text.replace(dateRaw[0], "").replace(/[,;]+/g, " ");
    const name = cleanName(rest) || S(lang, "friend");
    if (iso) {
      try {
        // "mera 2027 kaisa" → us saal ka varshphal
        if (yearQ || yearIntent) {
          const y = yearQ ? Number(yearQ[1]) : new Date().getFullYear();
          const py = personalYear(iso, y);
          if (py) return yearText(name, y, py, lang);
        }
        const nums = allNumbers({ name, birthdate: iso });
        if (nums.lifePath) {
          const body = fullBlock(
            [["Life Path", nums.lifePath], ["Destiny", nums.destiny], ["Soul Urge", nums.soulUrge], ["Personality", nums.personality], ["Birthday", nums.birthday]],
            lang
          );
          return `${S(lang, "head")(name)}\n\n${body}`;
        }
      } catch { /* neeche */ }
    }
    return S(lang, "nodate");
  }
  // Saal poochha par janm-tithi nahi → DOB mango
  if (yearQ || yearIntent) {
    return S(lang, "yearAsk")(yearQ ? yearQ[1] : "");
  }

  // 2) Koi ank → arth + upay
  const numMatch = text.match(/\b(11|22|33|[1-9])\b/);
  if (numMatch) {
    const n = Number(numMatch[1]);
    const m = getMeaning(n, lang);
    const L = kundliT(lang);
    if (m.title) return `${n} — ${m.title}\n${m.desc}\n${L.k_career}: ${m.career}\n${L.k_love}: ${m.love}\n${L.k_upay}: ${m.upay}`;
  }

  // 3) Sawal ke vishay
  if (/love|shaadi|vivah|pyar|prem|kaadhal|prema|लग्न|प्रेम|प्यार|शादी/.test(t)) return S(lang, "love");
  if (/career|naukri|job|business|vyapar|vyapaar|velai|udyog|नोकरी|करिअर|व्यापार|karyakshetra|karya|kaam|dhanda|nokari|vela|pan|வேலை/.test(t)) return S(lang, "career");
  if (/paisa|dhan|money|wealth|arthik|पैसा|धन/.test(t)) return S(lang, "arthik");
  if (/swasthya|sehat|health|tabiyat|tandurusti|vajan|waj an|weight|आरोग्य|तब्येत|वजन/.test(t)) return S(lang, "health");
  if (/share|stock|market|nivesh|शेअर/.test(t)) return S(lang, "market");
  if (/vyavasay|business|udyog|dukan|shop|व्यवसाय|उद्योग/.test(t)) return S(lang, "business");
  if (/mansik|tension|stress|depression|neend|मानसिक|तणाव/.test(t)) return S(lang, "mental");
  if (/paramarsh|advisor|salahkar|consultant/.test(t)) return S(lang, "book");
  if (/\baaj\b|today|daily|rashifal|innru|ivval/.test(t)) {
    const d = new Date();
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return S(lang, "today")(universalDay(iso));
  }
  if (/milan|jodi|matching|kundli milan|porutham|जोड़ी|मिलन/.test(t)) return S(lang, "milan");
  if (/book|fee|fees|price|expert|appointment|session|consult|फीस/.test(t)) return S(lang, "book");
  if (/upay|upaya|remedy|pariharam|prayasc|उपाय/.test(t)) return S(lang, "upayAsk");
  if (/gochar|guru|shani|shani|vakri|grahan|grah|गोचर|ग्रह|शनि|गुरु|राहु/.test(t)) return S(lang, "gochar");
  if (/muhurat|shubh|muhurt|मुहूर्त|शुभ/.test(t)) return S(lang, "muhurat");
  if (/rashi|rashifal|राशि/.test(t)) return S(lang, "rashi");
  if (/(life path|moolank|mulank|bhagyank|destiny|soul urge|personality|calculate|ganana|meri|mera number|majha|enakku|bhavishya|bhagya|future|jeevan|\blife\b|भविष्य|भाग्य|मूलांक|भाग्यांक)/.test(t)) return S(lang, "hint");
  if (/\b(hi|hii+|hello|hey|namaste|namaskar|vanakkam)\b/.test(t) && text.length < 25) return S(lang, "greet");

  // 4) Sirf mobile/vehicle number → lucky ank
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 7) {
    const v = luckyNumber(digits);
    if (v) return S(lang, "mobile")(digits, v);
  }

  // 5) Sirf naam (bina tarikh) → naam se nikalne wale ank
  const letters = onlyLetters(text);
  if (letters.length >= 3 && !/\d/.test(text)) {
    try {
      const d = destinyNumber(text);
      const s = soulUrgeNumber(text);
      const p = personalityNumber(text);
      if (d) {
        const body = fullBlock([["Destiny", d], ["Soul Urge", s], ["Personality", p]], lang);
        return `${S(lang, "nameHead")(cleanName(text) || text.trim())}\n\n${body}`;
      }
    } catch { /* neeche */ }
  }

  return S(lang, "menu");
}

export default function AiChat() {
  const { t, lang } = useLanguage();
  const [msgs, setMsgs] = useState([
    { from: "ai", text: lang === "hi" ? "Namaste! Main aapka AI Numerologist hoon. Apna naam + janm-tithi bhejein." : "Hello! I am your AI Numerologist. Send your name + birthdate." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMsgs((p) => [...p, { from: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMsgs((p) => [...p, { from: "ai", text: aiReply(userMsg, lang) }]);
    }, 500);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1 className="text-gradient">{t("chat_title")}</h1>
      <div className="card" style={{ marginTop: 16, height: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === "user" ? "flex-end" : "flex-start",
            background: m.from === "user" ? "linear-gradient(135deg,#8b5cf6,#22d3ee)" : "rgba(255,255,255,.07)",
            padding: "10px 14px", borderRadius: 14, maxWidth: "85%", whiteSpace: "pre-wrap",
          }}>
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("ai_placeholder")} />
        <button className="btn" type="submit">Send</button>
      </form>
    </div>
  );
}
