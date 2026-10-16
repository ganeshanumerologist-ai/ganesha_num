// Extra jyotish keys (mobile, build, city)
const EXTRA = {
  en: { pg_mobile: "Mobile Number", pg_build: "Build", pg_city: "Birth City" },
  hi: { pg_mobile: "मोबाइल नंबर", pg_build: "बनाएं", pg_city: "जन्म शहर" },
  mr: { pg_mobile: "मोबाईल नंबर", pg_build: "बनवा", pg_city: "जन्मशहर" },
  bn: { pg_mobile: "মোবাইল নম্বর", pg_build: "বানান", pg_city: "জন্মশহর" },
  te: { pg_mobile: "మొబైల్ నంబర్", pg_build: "తయారుచేయండి", pg_city: "పుట్టిన నగరం" },
  ta: { pg_mobile: "மொபைல் எண்", pg_build: "உருவாக்கு", pg_city: "பிறந்த நகரம்" },
  gu: { pg_mobile: "મોબાઈલ નંબર", pg_build: "બનાવો", pg_city: "જન્મશહેર" },
  ur: { pg_mobile: "موبائل نمبر", pg_build: "بنائیں", pg_city: "شہر پیدائش" },
  kn: { pg_mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", pg_build: "ಮಾಡಿ", pg_city: "ಹುಟ್ಟಿದ ನಗರ" },
  or: { pg_mobile: "ମୋବାଇଲ ନମ୍ବର", pg_build: "ବନାନ୍ତୁ", pg_city: "ଜନ୍ମ ସହର" },
  ml: { pg_mobile: "മൊബൈൽ നമ്പർ", pg_build: "ഉണ്ടാക്കൂ", pg_city: "ജനനനഗരം" },
  pa: { pg_mobile: "ਮੋਬਾਈਲ ਨੰਬਰ", pg_build: "ਬਣਾਓ", pg_city: "ਜਨਮ ਸ਼ਹਿਰ" },
  as: { pg_mobile: "ম'বাইল নম্বৰ", pg_build: "বনাওক", pg_city: "জন্ম চহৰ" },
};
// Chhoti bhasha ko parivaar ki bhasha. `sat` → Bengali, `mni` → Hindi.
const FALLBACK = {
  mai: "hi", ne: "hi", doi: "hi", brx: "hi", sa: "hi",
  ks: "ur", sd: "ur",
  sat: "bn", mni: "hi",
};
export function pgX(lang) {
  if (EXTRA[lang]) return EXTRA[lang];
  if (FALLBACK[lang]) return EXTRA[FALLBACK[lang]];
  return EXTRA.en;
}
export default pgX;
