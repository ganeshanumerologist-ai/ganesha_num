// Email ya Mobile — dono me se koi ek chalta hai.
//
// Firebase ka email/password login use kar rahe hain. Mobile number ke liye
// hum use ek "synt email" bana dete hain:
//
//     9876543210   ->   919876543210@nvip.app
//
// Isse password login bina Firebase Phone Auth ke bhi mobile number se
// chalta hai. OTP login ke liye alag path hai — dekho AuthContext.jsx.
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

/** Phone number ko E.164 me badal do (Firebase Phone Auth isi format maangta hai).
 *  9876543210            -> +919876543210
 *  +91 98765 43210       -> +919876543210
 */
export function toE164(input) {
  let d = String(input || "").replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  return "+" + d;
}

/** Phone number ko 91 wala standard bana do (profile me save karne ke liye). */
export function toPhone(input) {
  let d = String(input || "").replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  return d;
}

/** Email ya sahi mobile — dono me se koi ek. */
export function isValidId(input) {
  const raw = String(input || "").trim();
  if (!raw) return false;
  if (raw.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return /^[6-9]/.test(d);
  return d.length === 12 && d.startsWith("91");
}

/** OTP sirf 4-8 digit ka number hona chahiye. */
export function isValidOtp(code) {
  return /^\d{4,8}$/.test(String(code || "").trim());
}

export default { looksLikePhone, toAuthEmail, toE164, toPhone, isValidId, isValidOtp };