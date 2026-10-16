// Lo Shu Grid yog + remedy + gemstone + year-forecast data — English base.
//
// `yogs` ke keys wahi hain jo src/utils/loshuYog.js detect karta hai.
// Naye yog add karne se pehle engine me bhi add karna padega.

export default {
  // ---- Yog: key -> { name, desc } ----
  yogs: {
    "1-5-6": { name: "Maharaj Yog", desc: "Authority, leadership and royal comfort. You lead by example and decisions are accepted without argument." },
    "1-6": { name: "Deva Yog", desc: "Grace of higher support. Work done with sincerity is rewarded unusually fast." },
    "1-9": { name: "Hans / Ayog Yog", desc: "Long life, travels, inner strength. Life keeps giving you chances to restart." },
    "5-9": { name: "Raghu Yog", desc: "Fame from work, respect in society, steady growth over time." },
    "3-5": { name: "Shubh Kesari Yog", desc: "Reputation and recognition. People talk about your success in a good way." },
    "3-9": { name: "Siddhi Yog", desc: "Achievement of goals. Efforts convert into results faster than usual." },
    "1-3": { name: "Hamsa / Kalash Yog", desc: "Self-made fortune, courage to start alone, prosperity that grows quietly." },
    "1-2": { name: "Kutumb Yog", desc: "Family support and harmony at home; wealth through relatives." },
    "2-7": { name: "Kul / Dhan Yog", desc: "Wealth from family property, partnerships and steady long-term saving." },
    "5-7": { name: "Company Yog", desc: "Partnership and teamwork bring the real growth; do not work alone." },
    "1-4-7": { name: "Kesari / Punarjanma Yog", desc: "Strong will, learning ability, luck after struggle — success comes after initial hardship." },
    "1-8": { name: "Surya Yog", desc: "Government or institutional support, authority from systems, steady position." },
    "2-9": { name: "Dhan Lakshmi Yog", desc: "Money and comforts come, but they come with responsibilities attached." },
    "4-7": { name: "Yuvan Yog", desc: "Travel, relocation and long journeys bring progress." },
    "6-9": { name: "Bhukti Yog", desc: "Comfort, vehicles, good food and a comfortable standard of living." },
    "1-7": { name: "Raj Yog", desc: "Political or social leadership, authority in your field, public respect." },
    "2-4": { name: "Dhyan Yog", desc: "Steady income through property, agriculture or fixed assets." },
    "5-8": { name: "Vastra Dhan Yog", desc: "Wealth through business, trade and dealings with others." },
    "3-6": { name: "Rajya Yog", desc: "Political or administrative power, being appointed, organisational role." },
    "7-9": { name: "Bhagy Yog", desc: "Fortune, luxury and foreign or overseas connections." },
    "1-4": { name: "Khet Yog", desc: "Gains from land, farming and long-held assets." },
    "3-8": { name: "Abhijit Yoga (incomplete)", desc: "The 3 and 8 combination is incomplete — certain muhurtas remain blocked, but the number itself is powerful." },
  },

  // ---- Missing number ke upay: "do this" ----
  doList: {
    1: ["Start new work on a Sunday.", "Wear a gold ring in the little finger on a Sunday.", "Keep your intention clear and write it down."],
    2: ["Keep your family's advice in partnerships.", "Save steadily on the 2nd of every month.", "Learn a family skill or craft from elders."],
    3: ["Take initiative — the first step is yours.", "Speak in public or lead a small group.", "Wear yellow or orange on Tuesdays."],
    4: ["Write plans and schedules; follow them.", "Take help from an experienced elder.", "Wear a blue or green shirt on Thursdays."],
    5: ["Give time and money to those who need it.", "Meditate or sit in silence for ten minutes daily.", "Keep your promises; your word carries weight."],
    6: ["Give priority to family before work.", "Help in the house; balance is restored.", "Wear white on Fridays."],
    7: ["Travel at least once this season.", "Share what you know — teaching brings luck back to you.", "Keep your promises to elders."],
    8: ["Build a regular saving habit from today.", "Slow down before big decisions; check twice.", "Honour agreements and deadlines strictly."],
    9: ["Serve someone without expecting anything.", "Donate grain, oil or blankets.", "Keep faith in your own effort."],
  },

  // ---- Missing number: "don't do this" ----
  dontList: {
    1: ["Don't start two new things at once.", "Avoid ego clashes over small issues.", "Don't lend in the hope of a quick return."],
    2: ["Avoid unnecessary arguments at home.", "Don't keep secrets that hurt later.", "Don't over-promise in relationships."],
    3: ["Don't answer in anger even when provoked.", "Avoid gossip and back-biting.", "Don't scatter your energy across ten tasks."],
    4: ["Don't rely on luck alone — check the details.", "Avoid partnership with a number-4 person in money matters.", "Don't delay important paperwork."],
    5: ["Don't force a decision before you are ready.", "Avoid over-indulgence in food or spending.", "Don't let a friend take advantage of you."],
    6: ["Don't sacrifice your health for the family constantly.", "Avoid over-committing on the phone.", "Don't neglect your own needs."],
    7: ["Don't trust blindly — verify before signing.", "Avoid gossip that breaks a friendship.", "Don't compare yourself with relatives."],
    8: ["Avoid sudden big financial moves.", "Don't ignore health warnings.", "Don't lend without a written record."],
    9: ["Don't get into arguments over religion or politics.", "Avoid self-pity — act instead.", "Don't spend money on show-off purchases."],
  },

  // ---- Missing number: gemstone ----
  gem: {
    1: "Red coral (Moonga) in gold — for confidence and leadership. Start wearing from the 11th day of the 1st month.",
    2: "Moonstone or pearl in silver — for calm and family harmony. Wear on the left wrist on Mondays.",
    3: "Yellow sapphire (Pukhraj) in gold — for courage and recognition. Begin on a Tuesday.",
    4: "Blue sapphire (Neelam) — very powerful; test carefully and never buy on impulse. Start on a Thursday.",
    5: "Emerald (Panna) in gold — for wisdom and prosperity. Begin on the 5th of the 5th month.",
    6: "Diamond or white sapphire — for balance and family happiness. Start on a Friday.",
    7: "Cat's eye (Lehsunia) — for travel and fortune. Wear in gold or copper; start on a Saturday.",
    8: "Blue sapphire or Amethyst — for steady wealth. Start on the 8th day; test before permanent use.",
    9: "Yellow sapphire (Pukhraj) or Ruby — for overall luck. Start on a Thursday morning.",
  },

  // ---- Poore saal ka forecast (grid ke hisab se) ----
  yearGood: "A year of steady growth. Numbers 1, 3 and 5 dominate your grid, so work, courage and recognition open the door. Income improves and you earn a respected name.",
  yearCaution: "A year that needs patience. Money matters bring surprises; keep a reserve and avoid partnerships that look too good.",
  yearOverall: "Health and relations are your strength this year; career and money improve if you stay disciplined. The second half is better than the first.",
  monthsGood: "Best months: the ones where your Lo Shu number's date falls.",
  monthsAvoid: "Take it easy during transit, and avoid starting anything big on 3-6-9 dates without checking.",

  // ---- Grid ke hisab se summary lines ----
  missingHead: "Numbers missing from your chart and what to do about them",
  strongHead: "Numbers that dominate your grid",
  yearHead: "How the year will go by your Lo Shu grid",
  yogHead: "Yogs present in your Lo Shu grid",
  gemHead: "Stone for your missing number",
};