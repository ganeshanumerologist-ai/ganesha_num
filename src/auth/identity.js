// Email ya Mobile — dono me se koi ek chalta hai.
//
// Firebase ka email/password login use kar rahe hain. Mobile number ke liye
// hum use ek "synt email" bana dete hain:
//
//     9876543210   ->   919876543210@nvip.app
//
// Isse SMS OTP (Firebase Phone Auth) ki zaroorat nahi padti, jo billing aur
// account verification maangti hai. Password wahi rehta hai jo user ne signup
// par diya tha — koi naya flow nahi, sirf input jaanna hai.
//
// Ye file jaan-boojh kar JSX se alag hai (plain .js) taaki node scripts
// ise seedha test kar sakein — see scripts/test-login-id.mjs

/** Sirf number hai kya? (email me bhi digit ho sakte hain, isliye @ check) */
export function looksLikePhone(v) {
  return /^[+]?[\d\s-]{10,15}$/.test(String(v || "").trim());
}

/** Input ko auth-email me badal do. Agar wo email hai to wahi rahega. */
export function toAuthEmail(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  if (raw.includes("@")) return raw.toLowerCase();
  let d = raw.replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  return d + "@nvip.app";
}

/** Phone number ko 91 wala standard bana do (profile me save karne ke liye). */
export function toPhone(input) {
  let d = String(input || "").replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  return d;
}

/** Email ya sahi mobile — dono me se koi ek chalega. */
export function isValidId(input) {
  const raw = String(input || "").trim();
  if (!raw) return false;
  if (raw.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return /^[6-9]/.test(d);
  return d.length === 12 && d.startsWith("91");
}

export default { looksLikePhone, toAuthEmail, toPhone, isValidId };