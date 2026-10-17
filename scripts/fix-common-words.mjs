// 18 shabd jo maine galti se whitelist me daal diye the — "Kundli", "Share",
// "Refresh", "Admin Panel" ye AAM shabd hain, inhe har bhasha me apne
// shabdon me hona chahiye. Sirf sach me proper noun wale English rehte hain
// (GANESHA SUYOG ASTROLOGY, Lo Shu Grid, AI, React, Shodashvarga, Lal Kitab).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = path.join(process.cwd(), "src", "i18n", "small");

const FIX = {
  ne: {
    translations: { nav_kundli: "कुन्दली", nav_kundli_page: "कुन्दली", nav_charts: "कुन्दली चार्ट" },
    site: {
      admin_title: "एडमिन प्यानल", admin_activate: "एडमिन पहुँच सक्रिय गर्नुहोस्",
      admin_refresh: "रिफ्रेस गर्नुहोस्", blog_back: "← पछाडि जानुहोस्", blog_all: "← सबै लेख",
      share_title: "सेयर गर्नुहोस्", share_copy_link: "लिङ्क कपी गर्नुहोस्",
      share_copy_caption: "क्याप्सन कपी गर्नुहोस्", share_copied: "कपी भयो!",
      share_phone: "फोनबाट सेयर", share_copy_fail: "कपी भएन", kundli_word: "कुन्दली",
    },
    kundli: {
      k_title: "आफ्नो कुन्दली खोल्नुहोस्", k_open: "कुन्दली खोल्नुहोस्",
      k_new: "नयाँ कुन्दली", k_save: "कुन्दली सुरक्षित गर्नुहोस्",
      k_open_saved: "मैले सुरक्षित गरेका कुन्दली",
    },
  },
  sa: {
    translations: { nav_kundli: "कुण्डली", nav_kundli_page: "कुण्डली", nav_charts: "कुण्डलीचित्रम्" },
    site: {
      admin_title: "प्रशासकपटलम्", admin_activate: "प्रशासकाधिकारं क्रियतु",
      admin_refresh: "पुनरीकृत्यतु", blog_back: "← प्रतिगम्यताम्", blog_all: "← सर्वलेखाः",
      share_title: "वितरणयतु", share_copy_link: "सूत्रं प्रतिलिख्यतु",
      share_copy_caption: "विवरणं प्रतिलिख्यतु", share_copied: "प्रतिलिखितम्!",
      share_phone: "भवन्तः फोनद्वारा वितरणम्", share_copy_fail: "प्रतिलेखनं निष्फलम्",
      kundli_word: "कुण्डली",
    },
    kundli: {
      k_title: "स्वकुण्डलीं प्राप्यतु", k_open: "कुण्डलीं प्राप्यतु",
      k_new: "नूतनकुण्डली", k_save: "कुण्डलीं सञ्चयतु",
      k_open_saved: "मम सञ्चितकुण्डलीः",
    },
  },
  doi: {
    translations: { nav_kundli: "कुंडली", nav_kundli_page: "कुंडली", nav_charts: "कुंडली चार्ट" },
    site: {
      admin_title: "एडमिन पैनल", admin_activate: "एडमिन पहुँच चालू करो",
      admin_refresh: "रिफ्रेश करो", blog_back: "← वापस जाओ", blog_all: "← सारे लेख",
      share_title: "शेयर करो", share_copy_link: "लिंक कॉपी करो", share_copy_caption: "कैप्शन कॉपी करो",
      share_copied: "कॉपी हो गया!", share_phone: "फोन तरैं शेयर", share_copy_fail: "कॉपी नईं होया",
      kundli_word: "कुंडली",
    },
    kundli: {
      k_title: "अपनी कुंडली खोलो", k_open: "कुंडली खोलो", k_new: "नईं कुंडली",
      k_save: "कुंडली सेव करो", k_open_saved: "मेरी सेव की कुंडलियां",
    },
  },
  mai: {
    translations: { nav_kundli: "कुंडली", nav_kundli_page: "कुंडली", nav_charts: "कुंडली चार्ट" },
    site: {
      admin_title: "एडमिन पैनल", admin_activate: "एडमिन पहुँच चालू करू",
      admin_refresh: "रिफ्रेस करू", share_title: "शेयर करू", share_copy_link: "लिंक कॉपी करू",
      share_copy_caption: "कैप्शन कॉपी करू", share_copied: "कॉपी भेल!",
      share_phone: "फोन से शेयर", share_copy_fail: "कॉपी नईं भेल", kundli_word: "कुंडली",
    },
    kundli: {
      k_title: "अपन कुंडली खोलू", k_open: "कुंडली खोलू", k_new: "नईं कुंडली",
      k_save: "कुंडली सेव करू", k_open_saved: "हमर सेव की कुंडली",
    },
  },
  brx: {
    translations: { nav_kundli: "गाननि", nav_kundli_page: "गाननि", nav_charts: "गाननि चार्ट" },
    site: {
      admin_title: "एडमिन पैनल", admin_activate: "एडमिन पहुँच चालू खालम",
      admin_refresh: "रिफ्रेश खालम", share_title: "शेयर खालम", share_copy_link: "लिंक कपी खालम",
      share_copy_caption: "कैप्शन कपी खालम", share_copied: "कपी होल!",
      share_phone: "फोन निङ लिरा शेयर खालम", share_copy_fail: "कपी नङ नागर", kundli_word: "गाननि",
    },
    kundli: {
      k_title: "नोंगानि गाननि खानल", k_open: "गाननि खानल", k_new: "गौव गाननि",
      k_save: "गाननि सबथाय", k_open_saved: "नोंगानि सबथाय गाननि",
    },
  },
  ks: {
    translations: { nav_kundli: "کُنجھلی", nav_kundli_page: "کُنجھلی", nav_charts: "کُنجھلی چارٹ" },
    site: {
      admin_title: "ایڈمن پینل", admin_activate: "ایڈمن رسائی فعّال کریو",
      admin_refresh: "تازہ کریو", share_title: "شریع کریو", share_copy_link: "لنک کاپی کریو",
      share_copy_caption: "کیپشن کاپی کریو", share_copied: "کاپی گوم!",
      share_phone: "فون نال شریع کریو", share_copy_fail: "کاپی نہ گوم", kundli_word: "کُنجھلی",
    },
    kundli: {
      k_title: "پنُوج کُنجھلی کھولیو", k_open: "کُنجھلی کھولیو", k_new: "نی کُنجھلی",
      k_save: "کُنجھلی محفوظ کریو", k_open_saved: "میوں محفوظ کُنجھلیاں",
    },
  },
  sd: {
    translations: { nav_kundli: "ڪنجھلي", nav_kundli_page: "ڪنجھلي", nav_charts: "ڪنجھلي چارٽ" },
    site: { kundli_word: "ڪنجھلي" },
  },
  sat: {
    translations: { nav_kundli: "ᱠᱚᱸᱡᱚᱞᱤ", nav_kundli_page: "ᱠᱚᱸᱡᱚᱞᱤ", nav_charts: "ᱠᱚᱸᱡᱚᱞᱤ ᱡᱚᱛᱚᱨ" },
    site: {
      admin_title: "ᱚᱯᱚᱢᱤᱱ ᱯᱮᱱᱚᱞ", admin_activate: "ᱚᱯᱚᱢᱤᱱ ᱥᱮᱛᱚᱢᱩᱜ ᱦᱩᱭᱟᱹᱨᱟᱹ",
      admin_refresh: "ᱧᱮᱥᱟᱹ ᱦᱩᱭᱟᱹᱨᱟᱹ", share_title: "ᱥᱮᱭᱟᱹᱨ", share_copy_link: "ᱞᱤᱝᱠ ᱠᱚᱯᱤ",
      share_copy_caption: "ᱠᱮᱥᱚᱱ ᱠᱚᱯᱤ", share_copied: "ᱠᱚᱯᱤ ᱦᱩᱭᱟᱹᱨᱟᱹ!",
      share_phone: "ᱯᱷᱚᱱ ᱠᱷᱤᱡ ᱥᱮᱭᱟᱹᱨ", share_copy_fail: "ᱠᱚᱯᱤ ᱵᱟᱹᱛᱟᱹ ᱮᱢᱟᱹᱛᱤ",
      kundli_word: "ᱠᱚᱸᱡᱚᱞᱤ",
    },
    kundli: {
      k_title: "ᱟᱹᱢᱩᱜᱟᱣᱟᱜ ᱠᱚᱸᱡᱚᱞᱤ ᱡᱷᱤᱲᱟᱹ", k_open: "ᱠᱚᱸᱡᱚᱞᱤ ᱡᱷᱤᱲᱟᱹ",
      k_new: "ᱱᱟᱜᱟᱜ ᱠᱚᱸᱡᱚᱞᱤ", k_save: "ᱠᱚᱸᱡᱚᱞᱤ ᱥᱮᱭᱟᱹᱨ",
      k_open_saved: "ᱤᱧᱜᱟᱣᱟᱜ ᱥᱮᱭᱟᱹᱨ ᱠᱚᱸᱡᱚᱞᱤ",
    },
  },
  mni: {
    // Bengali: technical/borrowed shabd — real Manipuri publications ka tareeqa
    translations: { nav_kundli: "কুণ্ডলী", nav_kundli_page: "কুণ্ডলী", nav_charts: "কুণ্ডলী চার্ট" },
    site: {
      admin_title: "এডমিন প্যানেল", admin_activate: "এডমিন এক্সেস চালু করৈ",
      admin_refresh: "রিফ্ৰেশ কৰা", share_title: "শেয়াৰ কৰা", share_copy_link: "লিংক কপি কৰা",
      share_copy_caption: "ক্যাপশ্ন কপি কৰা", share_copied: "কপি হৈছে!",
      share_phone: "ফোনৰ যোগেৰে শেয়াৰ কৰা", share_copy_fail: "কপি নহ'ল", kundli_word: "কুণ্ডলী",
    },
    kundli: {
      k_title: "আপোনাৰ কুণ্ডলী খুলা", k_open: "কুণ্ডলী খুলা", k_new: "নতুন কুণ্ডলী",
      k_save: "কুণ্ডলী সংৰক্ষণ কৰা", k_open_saved: "মইঁ সংৰক্ষণ কৰা কুণ্ডলীসমূহ",
    },
  },
};

for (const [code, groups] of Object.entries(FIX)) {
  const file = path.join(DIR, `${code}.js`);
  const mod = await import(pathToFileURL(file).href);
  const d = mod.default;
  let n = 0;
  for (const [grp, kv] of Object.entries(groups)) {
    for (const [k, v] of Object.entries(kv)) {
      if (d[grp] && k in d[grp]) { d[grp][k] = v; n++; }
    }
  }
  // file dobara likho (module object mutate hua, disk par nahi)
  const out = `// Chhoti bhasha — ${code}
// 326 keys · translations 94 / site 149 / kundli 27 / pg 56
// Values us bhasha ke apne script me. Brand aur technical shabd
// (GANESHA SUYOG ASTROLOGY, Lo Shu Grid, AI, React, Shodashvarga)
// English me hi rehte hain.
export default ${JSON.stringify(d, null, 2)};
`;
  fs.writeFileSync(file, out, "utf8");
  console.log(`  ${code.padEnd(4)} ${n} shabd translate kiye`);
}
console.log("\ndone");