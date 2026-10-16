// Har page ko browser me khol kar dekhta hai ki:
//   - khaali to nahi hai
//   - error screen to nahi hai
//   - jyotish background laga hua hai ya nahi (Home par)
//
// Browser tool se chalata hai — `node scripts/check-pages.mjs` nahi,
// iske liye opencode ke browser ko chahiye. Isliye ye file sirf
// route list deta hai, jo main browser tool se loop karta hoon.

export const ROUTES = [
  ["/", "Home"],
  ["/calculator", "Calculator"],
  ["/kundli", "Kundli"],
  ["/loshu", "Lo Shu Grid"],
  ["/rashifal", "Rashifal"],
  ["/panchang", "Panchang"],
  ["/calendar", "Calendar"],
  ["/daily", "Daily"],
  ["/forecast", "Forecast"],
  ["/reports", "Reports"],
  ["/charts", "Charts"],
  ["/gochar", "Gochar"],
  ["/shani", "Shani Sade Sati"],
  ["/muhurat", "Muhurat"],
  ["/match", "Matching"],
  ["/varshphal", "Varshphal"],
  ["/remedies", "Remedies"],
  ["/experts", "Experts"],
  ["/chat", "AI Chat"],
  ["/gallery", "Gallery"],
  ["/blog", "Blog"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/login", "Login"],
  ["/dashboard", "Dashboard"],
  ["/admin", "Admin"],
];

// Har page par in shabdon ka pata chalega ki content render hua ya nahi
export const EXPECT = {
  "/": "hero_title",
  "/rashifal": "राशिफल",
  "/loshu": "लो शू ग्रिड",
  "/panchang": "पंचांग",
};

export default ROUTES;