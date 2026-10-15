import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pgT } from "../i18n/jyotish_b.js";
import kundliT from "../i18n/kundli.js";
import { personNumbers, matchScore } from "../utils/compatibility.js";
import ShareButtons from "../components/ShareButtons.jsx";

const TX = {
  hi: {
    title: "Naam-Milan", sub: "शादी या भागीदारी — दोनों के अंक मिलाकर देखें।",
    p1: "पहला व्यक्ति", p2: "दूसरा व्यक्ति", btn: "मिलान देखें",
    err: "दोनों के नाम और जन्मतिथि भरें।",
    verdict: { "Uttam Milan": ["उत्तम मिलन", "बहुत सुंदर जोड़ा! भरोसा और आकर्षण दोनों रहेंगे।"],
      "Achha Milan": ["अच्छा मिलन", "अच्छा जोड़ा है। एक-दूसरे की खूबी को जगह दो।"],
      "Madhyam Milan": ["मध्यम मिलन", "मेहनत वाला रिश्ता है। बातचीत खुली रखो।"],
      "Kathin Milan": ["कठिन मिलन", "अंक टकरा रहे हैं। Expert से सलाह लें।"] },
    note: { same: "समान अंक — तुरंत समझ, थोड़ी तकरार भी।", friend: "मित्र अंक — स्वाभाविक तालमेल।", hard: "चुनौती वाला जोड़ — समझौते से चलेगा।" },
  },
  mr: {
    title: "नाव-मिलन", sub: "लग्न किंवा भागीदारी — दोघांचे अंक मिळवून पहा.",
    p1: "पहिली व्यक्ती", p2: "दुसरी व्यक्ती", btn: "मिलन पहा",
    err: "दोघांची नावे आणि जन्मतारखा भरा.",
    verdict: { "Uttam Milan": ["उत्तम मिलन", "खूप सुंदर जोडी! विश्वास आणि आकर्षण दोन्ही राहतील."],
      "Achha Milan": ["चांगले मिलन", "चांगली जोडी आहे. एकमेकांच्या गुणांना वाव द्या."],
      "Madhyam Milan": ["मध्यम मिलन", "मेहनतीचे नाते आहे. मोकळा संवाद ठेवा."],
      "Kathin Milan": ["कठीण मिलन", "अंक एकमेकांशी भिडत आहेत. Expert चा सल्ला घ्या."] },
    note: { same: "समान अंक — लगेच समज, थोडी भांडणेही.", friend: "मित्र अंक — नैसर्गिक ताळमेळ.", hard: "आव्हानात्मक जोडी — तडजोडीने चालेल." },
  },
  en: {
    title: "Name Compatibility", sub: "Marriage or partnership — match both numbers.",
    p1: "First Person", p2: "Second Person", btn: "Check Match",
    err: "Fill both names and birthdates.",
    verdict: { "Uttam Milan": ["Excellent Match", "Wonderful match! Trust and attraction will last."],
      "Achha Milan": ["Good Match", "Good match. Honour each other's strengths."],
      "Madhyam Milan": ["Average Match", "Needs effort. Keep communication open."],
      "Kathin Milan": ["Difficult Match", "Numbers clash. Consult an expert."] },
    note: { same: "Same numbers — instant understanding, some friction.", friend: "Friendly numbers — natural harmony.", hard: "Challenging pair — needs compromise." },
  },
};

function PersonForm({ title, data, setData, L }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="grid" style={{ marginTop: 10 }}>
        <div>
          <label className="label">{L.k_name}</label>
          <input className="input" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        </div>
        <div>
          <label className="label">{L.k_dob}</label>
          <input className="input" type="date" value={data.birthdate} onChange={(e) => setData({ ...data, birthdate: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

export default function Compatibility() {
  const { lang } = useLanguage();
  const P = pgT(lang);
  const L = kundliT(lang);
  const T = TX[lang] || TX.en;
  const [a, setA] = useState({ name: "", birthdate: "" });
  const [b, setB] = useState({ name: "", birthdate: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calc = (e) => {
    e.preventDefault();
    setError("");
    if (!a.name.trim() || !a.birthdate || !b.name.trim() || !b.birthdate) {
      setError(T.err);
      return;
    }
    const na = personNumbers({ name: a.name.trim(), birthdate: a.birthdate });
    const nb = personNumbers({ name: b.name.trim(), birthdate: b.birthdate });
    const m = matchScore(na, nb);
    if (!m) { setError(T.err); return; }
    const v = T.verdict[m.verdict] || [m.verdict, m.advice];
    setResult({ na, nb, ...m, vTitle: v[0], vAdvice: v[1] });
  };

  const pairLabel = { lifePath: P.pg_lifepath, destiny: P.pg_destiny, soulUrge: P.pg_soul };

  return (
    <div>
      <h1 className="text-gradient">{T.title}</h1>
      <p>{T.sub}</p>

      <form onSubmit={calc} style={{ marginTop: 20 }}>
        <div className="grid grid-2">
          <PersonForm title={T.p1} data={a} setData={setA} L={L} />
          <PersonForm title={T.p2} data={b} setData={setB} L={L} />
        </div>
        <button className="btn" type="submit" style={{ marginTop: 16 }}>{T.btn}</button>
        {error && <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>}
      </form>

      {result && (
        <div style={{ marginTop: 24 }}>
          <div className="card number-card">
            <div className="num"><span>{result.total}%</span></div>
            <h2>{result.vTitle}</h2>
            <p style={{ marginTop: 8 }}>{result.vAdvice}</p>
          </div>
          <div className="grid grid-3" style={{ marginTop: 20 }}>
            {result.pairs.map((p) => (
              <div key={p.key} className="card" style={{ textAlign: "center" }}>
                <h3>{pairLabel[p.key] || p.label}</h3>
                <div className="num" style={{ fontSize: "2rem", fontWeight: 800 }}>
                  <span className="text-gradient">{p.a} × {p.b}</span>
                </div>
                <p style={{ fontWeight: 700 }}>{p.score}%</p>
                <p style={{ fontSize: ".85rem" }}>{T.note[p.key] || p.note}</p>
              </div>
            ))}
          </div>
          <ShareButtons title={T.title} text={`${result.total}% — ${result.vTitle}`} />
        </div>
      )}
    </div>
  );
}
