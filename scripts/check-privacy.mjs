// Privacy ka guard: ek user ka profile dusre ko NAHI dikhna chahiye.
//
// Pehle ek hi localStorage key thi ("nv-profile"), to ek hi phone par
// User A ka naam/jant/path User B ko bhi dikhta tha, logout ke baad bhi.
// Ab har user ka apna slot hai: nv-profile:<uid>, anonymous ke liye
// nv-profile:anon. Purana shared key delete ho jaata hai.
//
// Browser ki zarurat nahi — ek chhota localStorage shim kaafi hai.
const store = new Map();

const shim = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  key: (i) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
  clear: () => store.clear(),
};

globalThis.localStorage = shim;

const { loadProfile, saveProfile, clearProfile, clearAllProfiles, setProfileOwner, listProfileOwners } =
  await import("../src/profile/profile.js");

let fails = 0;
const chk = (cond, name, extra = "") => {
  if (!cond) fails++;
  console.log(`  ${cond ? "[ OK ]" : "[FAIL]"} ${name}${cond ? " ✅" : "  " + extra}`);
};

console.log("=== 1. Do alag user, ek hi phone ===");
setProfileOwner("userA");
saveProfile({ name: "RAMESH", birthdate: "1972-02-18", mobile: "9876543210" });

setProfileOwner("userB");
const b = loadProfile();
chk(b.name !== "RAMESH", "User B ko A ka naam nahi mila", JSON.stringify(b));
chk(b.birthdate !== "1972-02-18", "User B ko A ki jant nahi mili");
chk(b.mobile !== "9876543210", "User B ko A ka mobile nahi mila");
chk(Object.keys(b).length === 0, "User B ka apna slot khaali hai");

saveProfile({ name: "SUNITA", birthdate: "1985-07-04" });
setProfileOwner("userA");
const a = loadProfile();
chk(a.name === "RAMESH" && a.birthdate === "1972-02-18", "User A ko apna data mila");
chk(a.name !== "SUNITA", "User A ko B ka data nahi mila");

console.log("\n=== 2. Anonymous alag slot me ===");
setProfileOwner(null);
const anon = loadProfile();
chk(!anon.name && !anon.birthdate, "Anonymous ko kisi ka data nahi mila", JSON.stringify(anon));

console.log("\n=== 3. Purana shared key hat gaya? ===");
store.set("nv-profile", JSON.stringify({ name: "PURANA_USER", birthdate: "1900-01-01" }));
setProfileOwner("userC");
const c = loadProfile();
chk(c.name !== "PURANA_USER", "purana shared data leak nahi hua", JSON.stringify(c));
chk(shim.getItem("nv-profile") === null, "purani key delete ho gayi", String(shim.getItem("nv-profile")));

console.log("\n=== 4. Logout par sab mit jaye ===");
setProfileOwner("userD");
saveProfile({ name: "D" });
setProfileOwner("userE");
saveProfile({ name: "E" });
setProfileOwner(null);
clearAllProfiles();
chk(listProfileOwners().length === 0, "logout ke baad koi slot nahi bacha", JSON.stringify(listProfileOwners()));

console.log("\n=== 5. Partial save / khaali value ===");
setProfileOwner("userF");
saveProfile({ name: "AMIT", birthdate: "1990-01-01" });
saveProfile({ birthdate: "1991-02-02" });
const f = loadProfile();
chk(f.name === "AMIT" && f.birthdate === "1991-02-02", "merge: naam bacha, jant update hui", JSON.stringify(f));
saveProfile({ name: "" });
chk(loadProfile().name === "AMIT", "khali value se purana value nahi mit-ta");

console.log("\n=== 6. Sirf current user clear ho ===");
setProfileOwner("userG");
saveProfile({ name: "G" });
setProfileOwner("userH");
saveProfile({ name: "H" });
clearProfile();
chk(loadProfile().name !== "H", "H ka data gaya");
setProfileOwner("userG");
chk(loadProfile().name === "G", "G ka data salamat");

console.log(fails ? `\n${fails} FAIL` : "\nPRIVACY THEEK HAI ✅");
process.exit(fails ? 1 : 0);