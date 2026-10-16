// Email-ya-mobile logic ka test. AuthContext Firebase import karta hai,
// isliye hum wahi pure functions yahan dohra kar check karte hain.

import { toAuthEmail, isValidId, looksLikePhone, toPhone } from "../src/auth/identity.js";

let fails = 0;
const ok = (c, m) => { if (!c) { console.log("FAIL:", m); fails++; } };
const eq = (a, b, m) => ok(a === b, `${m}  →  mila "${a}", chahiye "${b}"`);

/* ---------- normal email ---------- */
eq(toAuthEmail("Ravi@Example.COM"), "ravi@example.com", "email lowercase hota hai");
eq(toAuthEmail("  a.b@c.co  "), "a.b@c.co", "email trim hoti hai");
ok(isValidId("a@b.co"), "simple email valid");

/* ---------- Indian mobile ---------- */
eq(toAuthEmail("9876543210"), "919876543210@nvip.app", "10 digit → 91 laga");
eq(toAuthEmail("+91 98765 43210"), "919876543210@nvip.app", "+91 aur spaces hat jaate hain");
eq(toAuthEmail("919876543210"), "919876543210@nvip.app", "pehle se 91 wala 12 digit");
eq(toAuthEmail("98765 43210"), "919876543210@nvip.app", "space ke saath 10 digit");

/* ---------- validation ---------- */
ok(isValidId("9876543210"), "10 digit valid hai");
ok(isValidId("6198765430"), "6 se shuru wala bhi valid hai");
ok(!isValidId("1234567890"), "1 se shuru wala galat hai");
ok(!isValidId("12345"), "chhota number galat hai");
ok(!isValidId("98765"), "5 digit galat hai");
ok(!isValidId(""), "khali galat hai");
ok(!isValidId("abc"), "text galat hai");
ok(isValidId("919876543210"), "12 digit 91 wala valid hai");
ok(!isValidId("91987654321"), "11 digit galat hai");

/* ---------- looksLikePhone ---------- */
ok(looksLikePhone("9876543210"), "10 digit phone dikhta hai");
ok(looksLikePhone("+91 98765 43210"), "+91 wala phone dikhta hai");
ok(!looksLikePhone("a@b.co"), "email phone nahi hai");
ok(!looksLikePhone("98765"), "chhota number phone nahi");

/* ---------- toPhone ---------- */
eq(toPhone("9876543210"), "919876543210", "toPhone 91 lagata hai");
eq(toPhone("+91-98765-43210"), "919876543210", "toPhone punctuation hatata hai");

/* ---------- email aur mobile ek hi field se ---------- */
const ids = ["ravi@example.com", "9876543210", "+91 98765 43210", "919876543210"];
for (const i of ids) {
  ok(isValidId(i), `"${i}" valid hona chahiye`);
  const mail = toAuthEmail(i);
  ok(mail.includes("@"), `"${i}" → email me badla: ${mail}`);
}
console.log(fails === 0 ? "LOGIN TESTS OK" : `${fails} FAILURES`);
process.exit(fails ? 1 : 0);