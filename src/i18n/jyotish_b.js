// Jyotish pages UI labels — part 2 (ur, kn, or, ml, pa, as) + helper
import { EN, HI, MR, BN, TE, TA, GU } from "./jyotish_a.js";

const mk = (o) => ({ ...EN, ...o });

const UR = mk({
  pg_make: "رپورٹ بنائیں", pg_view: "دیکھیں", pg_check: "جانچیں",
  pg_jivan: "جیون", pg_dainik: "روزانہ", pg_saptahik: "ہفتہ وار", pg_masik: "ماہانہ", pg_varshik: "سالانہ",
  pg_dasha: "دشا", pg_varga: "شوڈش ورگ", pg_lagna: "لگن", pg_dosh: "دوش و ساڑھے ساتی",
  pg_lalkitab: "لال کتاب", pg_ratna: "رتن", pg_nakshatra: "نچھتر", pg_paramparik: "روایتی",
  pg_tithi: "تتھی", pg_vaar: "وار", pg_naks: "نچھتر", pg_yoga: "یوگ", pg_karana: "کرن",
  pg_chandra: "چندر راشی", pg_surya: "سورج راشی", pg_rahu: "راہو کال", pg_abhijit: "ابھیجیت",
  pg_prem: "محبت", pg_arthik: "دولت", pg_career: "کیریئر", pg_mantra: "منتر",
  pg_luckynum: "مبارک عدد", pg_luckycolor: "مبارک رنگ", pg_day: "مبارک وار",
  pg_gochar: "گوچر", pg_grahan: "گرہن", pg_muhurat: "مہورت",
  pg_grid: "لو شو گرڈ", pg_missing: "غائب اعداد", pg_lucky: "لکی",
  pg_luckyvaar: "مبارک وار", pg_dates: "مبارک تاریخیں", pg_kua: "کوا", pg_namank: "نامانک",
  pg_moolank: "مولانک", pg_bhagyank: "بھاگیانک", pg_soul: "روح کی پکار", pg_persona: "شخصیت",
  pg_year: "ذاتی سال", pg_nature: "مزاج", pg_upay: "علاج",
  pg_lifepath: "جیون مارگ", pg_destiny: "قسمت",
  pg_shubh: "مبارک", pg_ashubh: "نامبارک",
  pg_uttam: "بہترین مہورت", pg_madhyam: "درمیانہ — ماہر سے تصدیق کرائیں", pg_varjit: "پرہیز — دوسری تاریخ لیں",
});

const KN = mk({
  pg_make: "ವರದಿ ಮಾಡಿ", pg_view: "ನೋಡಿ", pg_check: "ಪರಿಶೀಲಿಸಿ",
  pg_jivan: "ಜೀವನ", pg_dainik: "ದೈನಿಕ", pg_saptahik: "ವಾರ", pg_masik: "ಮಾಸಿಕ", pg_varshik: "ವಾರ್ಷಿಕ",
  pg_dasha: "ದಶಾ", pg_varga: "ಷೋಡಶವರ್ಗ", pg_lagna: "ಲಗ್ನ", pg_dosh: "ದೋಷ & ಸಾಡೇಸಾತಿ",
  pg_lalkitab: "ಲಾಲ್ ಕಿತಾಬ್", pg_ratna: "ರತ್ನ", pg_nakshatra: "ನಕ್ಷತ್ರ", pg_paramparik: "ಸಂಪ್ರದಾಯ",
  pg_tithi: "ತಿಥಿ", pg_vaar: "ವಾರ", pg_naks: "ನಕ್ಷತ್ರ", pg_yoga: "ಯೋಗ", pg_karana: "ಕರಣ",
  pg_chandra: "ಚಂದ್ರ ರಾಶಿ", pg_surya: "ಸೂರ್ಯ ರಾಶಿ", pg_rahu: "ರಾಹು ಕಾಲ", pg_abhijit: "ಅಭಿಜಿತ್",
  pg_prem: "ಪ್ರೀತಿ", pg_arthik: "ಸಂಪತ್ತು", pg_career: "ವೃತ್ತಿ", pg_mantra: "ಮಂತ್ರ",
  pg_luckynum: "ಅದೃಷ್ಟ ಸಂಖ್ಯೆ", pg_luckycolor: "ಅದೃಷ್ಟ ಬಣ್ಣ", pg_day: "ಅದೃಷ್ಟ ವಾರ",
  pg_gochar: "ಗೋಚಾರ", pg_grahan: "ಗ್ರಹಣ", pg_muhurat: "ಮುಹೂರ್ತ",
  pg_grid: "ಲೋ ಶೂ ಗ್ರಿಡ್", pg_missing: "ಇಲ್ಲದ ಸಂಖ್ಯೆಗಳು", pg_lucky: "ಲಕ್ಕಿ",
  pg_luckyvaar: "ಅದೃಷ್ಟ ವಾರ", pg_dates: "ಅದೃಷ್ಟ ದಿನಾಂಕಗಳು", pg_kua: "ಕುವಾ", pg_namank: "ನಾಮಾಂಕ",
  pg_moolank: "ಮೂಲಾಂಕ", pg_bhagyank: "ಭಾಗ್ಯಾಂಕ", pg_soul: "ಆತ್ಮದ ಕರೆ", pg_persona: "ವ್ಯಕ್ತಿತ್ವ",
  pg_year: "ವೈಯಕ್ತಿಕ ವರ್ಷ", pg_nature: "ಸ್ವಭಾವ", pg_upay: "ಪರಿಹಾರ",
  pg_lifepath: "ಜೀವನ ಮಾರ್ಗ", pg_destiny: "ಅದೃಷ್ಟ",
  pg_shubh: "ಶುಭ", pg_ashubh: "ಅಶುಭ",
  pg_uttam: "ಉತ್ತಮ ಮುಹೂರ್ತ", pg_madhyam: "ಮಧ್ಯಮ — ತಜ್ಞರಿಂದ ದೃಢೀಕರಿಸಿ", pg_varjit: "ತಪ್ಪಿಸಿ — ಬೇರೆ ದಿನಾಂಕ",
});

const OR = mk({
  pg_make: "ରିପୋର୍ଟ ବନାନ୍ତୁ", pg_view: "ଦେଖନ୍ତୁ", pg_check: "ଯାଞ୍ଚ କରନ୍ତୁ",
  pg_jivan: "ଜୀବନ", pg_dainik: "ଦୈନିକ", pg_saptahik: "ସାପ୍ତାହିକ", pg_masik: "ମାସିକ", pg_varshik: "ବାର୍ଷିକ",
  pg_dasha: "ଦଶା", pg_varga: "ଷୋଡଶବର୍ଗ", pg_lagna: "ଲଗ୍ନ", pg_dosh: "ଦୋଷ ଓ ସାଢେସାତି",
  pg_lalkitab: "ଲାଲ କିତାବ", pg_ratna: "ରତ୍ନ", pg_nakshatra: "ନକ୍ଷତ୍ର", pg_paramparik: "ପାରମ୍ପରିକ",
  pg_tithi: "ତିଥି", pg_vaar: "ବାର", pg_naks: "ନକ୍ଷତ୍ର", pg_yoga: "ଯୋଗ", pg_karana: "କରଣ",
  pg_chandra: "ଚନ୍ଦ୍ର ରାଶି", pg_surya: "ସୂର୍ଯ୍ୟ ରାଶି", pg_rahu: "ରାହୁ କାଳ", pg_abhijit: "ଅଭିଜିତ",
  pg_prem: "ପ୍ରେମ", pg_arthik: "ଧନ", pg_career: "ବୃତ୍ତି", pg_mantra: "ମନ୍ତ୍ର",
  pg_luckynum: "ଶୁଭ ସଂଖ୍ୟା", pg_luckycolor: "ଶୁଭ ରଙ୍ଗ", pg_day: "ଶୁଭ ବାର",
  pg_gochar: "ଗୋଚର", pg_grahan: "ଗ୍ରହଣ", pg_muhurat: "ମୁହୂର୍ତ୍ତ",
  pg_grid: "ଲୋ ଶୁ ଗ୍ରିଡ", pg_missing: "ନଥିବା ସଂଖ୍ୟା", pg_lucky: "ଲକି",
  pg_luckyvaar: "ଶୁଭ ବାର", pg_dates: "ଶୁଭ ତାରିଖ", pg_kua: "କୁଆ", pg_namank: "ନାମାଙ୍କ",
  pg_moolank: "ମୂଳାଙ୍କ", pg_bhagyank: "ଭାଗ୍ୟାଙ୍କ", pg_soul: "ଆତ୍ମାର ଡାକ", pg_persona: "ବ୍ୟକ୍ତିତ୍ୱ",
  pg_year: "ବ୍ୟକ୍ତିଗତ ବର୍ଷ", pg_nature: "ସ୍ୱଭାବ", pg_upay: "ଉପାୟ",
  pg_lifepath: "ଜୀବନ ପଥ", pg_destiny: "ଭାଗ୍ୟ",
  pg_shubh: "ଶୁଭ", pg_ashubh: "ଅଶୁଭ",
  pg_uttam: "ଉତ୍ତମ ମୁହୂର୍ତ୍ତ", pg_madhyam: "ମଧ୍ୟମ — ବିଶେଷଜ୍ଞଙ୍କ ପୁଷ୍ଟି ନିଅନ୍ତୁ", pg_varjit: "ବର୍ଜିତ — ଅନ୍ୟ ତାରିଖ ନିଅନ୍ତୁ",
});

const ML = mk({
  pg_make: "റിപ്പോർട്ട് ഉണ്ടാക്കൂ", pg_view: "കാണൂ", pg_check: "പരിശോധിക്കൂ",
  pg_jivan: "ജീവിതം", pg_dainik: "ദിന", pg_saptahik: "വാര", pg_masik: "മാസ", pg_varshik: "വാർഷിക",
  pg_dasha: "ദശ", pg_varga: "ഷോഡശവർഗം", pg_lagna: "ലഗ്നം", pg_dosh: "ദോഷം & ഏഴര",
  pg_lalkitab: "ലാൽ കിതാബ്", pg_ratna: "രത്നം", pg_nakshatra: "നക്ഷത്രം", pg_paramparik: "പരമ്പരാഗത",
  pg_tithi: "തിഥി", pg_vaar: "വാരം", pg_naks: "നക്ഷത്രം", pg_yoga: "യോഗം", pg_karana: "കരണം",
  pg_chandra: "ചന്ദ്ര രാശി", pg_surya: "സൂര്യ രാശി", pg_rahu: "രാഹു കാലം", pg_abhijit: "അഭിജിത്",
  pg_prem: "സ്നേഹം", pg_arthik: "ധനം", pg_career: "തൊഴിൽ", pg_mantra: "മന്ത്രം",
  pg_luckynum: "ഭാഗ്യ സംഖ്യ", pg_luckycolor: "ഭാഗ്യ നിറം", pg_day: "ഭാഗ്യ വാരം",
  pg_gochar: "ഗോചരം", pg_grahan: "ഗ്രഹണം", pg_muhurat: "മുഹൂർത്തം",
  pg_grid: "ലോ ഷൂ ഗ്രിഡ്", pg_missing: "ഇല്ലാത്ത സംഖ്യകൾ", pg_lucky: "ലക്കി",
  pg_luckyvaar: "ഭാഗ്യ വാരം", pg_dates: "ഭാഗ്യ തീയതികൾ", pg_kua: "കുവ", pg_namank: "നാമാങ്കം",
  pg_moolank: "മൂലാങ്കം", pg_bhagyank: "ഭാഗ്യാങ്കം", pg_soul: "ആത്മവിളി", pg_persona: "വ്യക്തിത്വം",
  pg_year: "വ്യക്തിഗത വർഷം", pg_nature: "സ്വഭാവം", pg_upay: "പരിഹാരം",
  pg_lifepath: "ജീവിത പാത", pg_destiny: "വിധി",
  pg_shubh: "ശുഭം", pg_ashubh: "അശുഭം",
  pg_uttam: "ഉത്തമ മുഹൂർത്തം", pg_madhyam: "മധ്യമം — വിദഗ്ധനോട് ഉറപ്പാക്കൂ", pg_varjit: "ഒഴിവാക്കൂ — വേറെ തീയതി",
});

const PA = mk({
  pg_make: "ਰਿਪੋਰਟ ਬਣਾਓ", pg_view: "ਵੇਖੋ", pg_check: "ਜਾਂਚੋ",
  pg_jivan: "ਜੀਵਨ", pg_dainik: "ਰੋਜ਼ਾਨਾ", pg_saptahik: "ਹਫ਼ਤਾਵਾਰ", pg_masik: "ਮਹੀਨਾਵਾਰ", pg_varshik: "ਸਾਲਾਨਾ",
  pg_dasha: "ਦਸ਼ਾ", pg_varga: "ਸ਼ੋਡਸ਼ਵਰਗ", pg_lagna: "ਲਗਨ", pg_dosh: "ਦੋਸ਼ ਤੇ ਸਾਢੇਸਾਤੀ",
  pg_lalkitab: "ਲਾਲ ਕਿਤਾਬ", pg_ratna: "ਰਤਨ", pg_nakshatra: "ਨਛੱਤਰ", pg_paramparik: "ਰਵਾਇਤੀ",
  pg_tithi: "ਤਿਥੀ", pg_vaar: "ਵਾਰ", pg_naks: "ਨਛੱਤਰ", pg_yoga: "ਯੋਗ", pg_karana: "ਕਰਨ",
  pg_chandra: "ਚੰਨ ਰਾਸ਼ੀ", pg_surya: "ਸੂਰਜ ਰਾਸ਼ੀ", pg_rahu: "ਰਾਹੂ ਕਾਲ", pg_abhijit: "ਅਭਿਜਿਤ",
  pg_prem: "ਪਿਆਰ", pg_arthik: "ਧਨ", pg_career: "ਕਰੀਅਰ", pg_mantra: "ਮੰਤਰ",
  pg_luckynum: "ਸ਼ੁਭ ਅੰਕ", pg_luckycolor: "ਸ਼ੁਭ ਰੰਗ", pg_day: "ਸ਼ੁਭ ਵਾਰ",
  pg_gochar: "ਗੋਚਰ", pg_grahan: "ਗ੍ਰਹਿਣ", pg_muhurat: "ਮੁਹੂਰਤ",
  pg_grid: "ਲੋ ਸ਼ੂ ਗ੍ਰਿਡ", pg_missing: "ਗਾਇਬ ਅੰਕ", pg_lucky: "ਲੱਕੀ",
  pg_luckyvaar: "ਸ਼ੁਭ ਵਾਰ", pg_dates: "ਸ਼ੁਭ ਤਾਰੀਖਾਂ", pg_kua: "ਕੁਆ", pg_namank: "ਨਾਮਾਂਕ",
  pg_moolank: "ਮੂਲਾਂਕ", pg_bhagyank: "ਭਾਗੀਆਂਕ", pg_soul: "ਰੂਹ ਦੀ ਸੱਦ", pg_persona: "ਸ਼ਖ਼ਸੀਅਤ",
  pg_year: "ਨਿੱਜੀ ਸਾਲ", pg_nature: "ਸੁਭਾਅ", pg_upay: "ਉਪਾਅ",
  pg_lifepath: "ਜੀਵਨ ਮਾਰਗ", pg_destiny: "ਕਿਸਮਤ",
  pg_shubh: "ਸ਼ੁਭ", pg_ashubh: "ਅਸ਼ੁਭ",
  pg_uttam: "ਉੱਤਮ ਮੁਹੂਰਤ", pg_madhyam: "ਦਰਮਿਆਨਾ — ਮਾਹਿਰ ਤੋਂ ਪੁਸ਼ਟੀ ਕਰਵਾਓ", pg_varjit: "ਪਰਹੇਜ਼ — ਹੋਰ ਤਾਰੀਖ ਲਓ",
});

const AS = mk({
  pg_make: "ৰিপ'ৰ্ট বনাওক", pg_view: "চাওক", pg_check: "পৰীক্ষা কৰক",
  pg_jivan: "জীৱন", pg_dainik: "দৈনিক", pg_saptahik: "সাপ্তাহিক", pg_masik: "মাহেকীয়া", pg_varshik: "বাৰ্ষিক",
  pg_dasha: "দশা", pg_varga: "ষোড়শবৰ্গ", pg_lagna: "লগ্ন", pg_dosh: "দোষ আৰু সাড়েসাতি",
  pg_lalkitab: "লাল কিতাপ", pg_ratna: "ৰত্ন", pg_nakshatra: "নক্ষত্ৰ", pg_paramparik: "পৰম্পৰাগত",
  pg_tithi: "তিথি", pg_vaar: "বাৰ", pg_naks: "নক্ষত্ৰ", pg_yoga: "যোগ", pg_karana: "কৰণ",
  pg_chandra: "চন্দ্ৰ ৰাশি", pg_surya: "সূৰ্য ৰাশি", pg_rahu: "ৰাহু কাল", pg_abhijit: "অভিজিৎ",
  pg_prem: "প্ৰেম", pg_arthik: "ধন", pg_career: "কেৰিয়াৰ", pg_mantra: "মন্ত্ৰ",
  pg_luckynum: "শুভ সংখ্যা", pg_luckycolor: "শুভ ৰং", pg_day: "শুভ বাৰ",
  pg_gochar: "গোচৰ", pg_grahan: "গ্ৰহণ", pg_muhurat: "মুহূৰ্ত",
  pg_grid: "লো শু গ্ৰিড", pg_missing: "নোহোৱা সংখ্যা", pg_lucky: "লাকী",
  pg_luckyvaar: "শুভ বাৰ", pg_dates: "শুভ তাৰিখ", pg_kua: "কুৱা", pg_namank: "নামাংক",
  pg_moolank: "মূলাংক", pg_bhagyank: "ভাগ্যাংক", pg_soul: "আত্মাৰ মাত", pg_persona: "ব্যক্তিত্ব",
  pg_year: "ব্যক্তিগত বছৰ", pg_nature: "স্বভাৱ", pg_upay: "উপায়",
  pg_lifepath: "জীৱন পথ", pg_destiny: "ভাগ্য",
  pg_shubh: "শুভ", pg_ashubh: "অশুভ",
  pg_uttam: "উত্তম মুহূৰ্ত", pg_madhyam: "মধ্যম — বিশেষজ্ঞৰ পৰা নিশ্চিত কৰক", pg_varjit: "বৰ্জন — আন তাৰিখ লওক",
});

const ALL = { en: EN, hi: HI, mr: MR, bn: BN, te: TE, ta: TA, gu: GU, ur: UR, kn: KN, or: OR, ml: ML, pa: PA, as: AS };
const FALLBACK = { mai: "hi", ne: "hi", doi: "hi", brx: "hi", sa: "hi", ks: "ur", sd: "ur" };

export function pgT(lang) {
  if (ALL[lang]) return ALL[lang];
  if (FALLBACK[lang]) return ALL[FALLBACK[lang]];
  return ALL.en;
}
export default pgT;
