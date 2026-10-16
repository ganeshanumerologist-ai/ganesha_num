// Vishay-gat labels (naukri, dhan, aarogya, vyapar, prem, samajik …) —
// Rashifal aur Lo Shu dono inhi ko use karte hain, taaki translation ek hi
// jagah rahe aur dono pages alag-alag map na banayein.

import { pageTX } from "./pageTx.js";

const PARA = {
  hi: { padhai: "पढ़ाई", vivah: "विवाह", arogya: "स्वास्थ्य", dhan: "धन", share: "शेयर बाज़ार", vyapar: "व्यापार", samman: "सम्मान" },
  mr: { padhai: "अभ्यास", vivah: "विवाह", arogya: "आरोग्य", dhan: "धन", share: "शेअर बाजार", vyapar: "व्यापार", samman: "सन्मान" },
  bn: { padhai: "পড়াশোনা", vivah: "বিবাহ", arogya: "স্বাস্থ্য", dhan: "সম্পদ", share: "শেয়ার বাজার", vyapar: "ব্যবসা", samman: "সম্মান" },
  te: { padhai: "విద్యాభ్యాసం", vivah: "వివాహం", arogya: "ఆరోగ్యం", dhan: "సంపద", share: "షేర్ మార్కెట్", vyapar: "వ్యాపారం", samman: "గౌరవం" },
  ta: { padhai: "கல்வி", vivah: "திருமணம்", arogya: "ஆரோக்கியம்", dhan: "செல்வம்", share: "பங்கு சந்தை", vyapar: "வர்த்தகம்", samman: "மரியாதை" },
  gu: { padhai: "અભ્યાસ", vivah: "લગ્ન", arogya: "આરોગ્ય", dhan: "ધન", share: "શેર બજાર", vyapar: "વ્યાપાર", samman: "સન્માન" },
  ur: { padhai: "تعلیم", vivah: "شادی", arogya: "صحت", dhan: "دولت", share: "شیئرز مارکیٹ", vyapar: "کاروبار", samman: "عزت" },
  kn: { padhai: "ಅಧ್ಯಯನ", vivah: "ವಿವಾಹ", arogya: "ಆರೋಗ್ಯ", dhan: "ಸಂಪತ್ತು", share: "ಶೇರ್ ಮಾರುಕೆಟ್ಟೆ", vyapar: "ವ್ಯಾಪಾರ", samman: "ಗೌರವ" },
  ml: { padhai: "പഠനം", vivah: "വിവാഹം", arogya: "ആരോഗ്യം", dhan: "സമ്പത്ത്", share: "ഓഹരുമാർക്കറ്റ്", vyapar: "വ്യാപാരം", samman: "പ്രതിഷ്ഠ" },
  pa: { padhai: "ਪੜ੍ਹਾਈ", vivah: "ਵਿਆਹ", arogya: "ਸਿਹਤ", dhan: "ਧਨ", share: "ਸ਼ੇਅਰ ਬਾਜ਼ਾਰ", vyapar: "ਕਾਰੋਬਾਰ", samman: "ਸਨਮਾਨ" },
  or: { padhai: "ଶିକ୍ଷା", vivah: "ବିବାହ", arogya: "ସ୍ୱାସ୍ଥ୍ୟ", dhan: "ଧନ", share: "ଶେୟାର ବଜାର", vyapar: "ବ୍ୟାପାର", samman: "ସମ୍ମାନ" },
  as: { padhai: "পঢ়া-পাঁহা", vivah: "বিয়াল", arogya: "স্বাস্থ্য", dhan: "সম্পদ", share: "শেয়াৰ বজাৰ", vyapar: "ব্যৱসায়", samman: "সম্মান" },
  en: { padhai: "Studies", vivah: "Marriage", arogya: "Health", dhan: "Wealth", share: "Stock Market", vyapar: "Business", samman: "Prestige" },
};

export function paraTX(lang) {
  return pageTX(PARA, lang);
}

export default paraTX;