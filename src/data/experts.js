// Expert list. Default photos are local AI-style illustrations in /public/experts/.
// Admin can override any photo later from the Experts page (uploads to Firebase Storage,
// URL saved in Firestore collection "expert_photos"). No code change needed.

export const EXPERTS = [
  { id: "e1", name: "Acharya Dev Sharma", langs: ["Hindi", "English", "Sanskrit"], exp: "15 yrs", price: "₹501 / 30 min", rating: 4.9, photo: "/experts/e1.svg" },
  { id: "e2", name: "Dr. Meena Iyer", langs: ["Tamil", "English", "Hindi"], exp: "12 yrs", price: "₹401 / 30 min", rating: 4.8, photo: "/experts/e2.svg" },
  { id: "e3", name: "Pandit Ramesh Joshi", langs: ["Marathi", "Hindi", "Gujarati"], exp: "20 yrs", price: "₹551 / 30 min", rating: 4.9, photo: "/experts/e3.svg" },
  { id: "e4", name: "Fatima Khan", langs: ["Urdu", "Hindi", "English"], exp: "10 yrs", price: "₹351 / 30 min", rating: 4.7, photo: "/experts/e4.svg" },
  { id: "e5", name: "Gurpreet Singh", langs: ["Punjabi", "Hindi", "English"], exp: "9 yrs", price: "₹301 / 30 min", rating: 4.8, photo: "/experts/e5.svg" },
  { id: "e6", name: "Ananya Das", langs: ["Bengali", "Assamese", "English"], exp: "11 yrs", price: "₹351 / 30 min", rating: 4.8, photo: "/experts/e6.svg" },
];

export default EXPERTS;
