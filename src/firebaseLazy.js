// ─────────────────────────────────────────────────────────────────
//  FIREBASE — DHEERE SE LOAD KARO
//
//  Mobile par buffering ka asli kaaran yehi tha.
//
//  Pehle Firebase (~500 KB raw / 115 KB gzip) har page par PEHLE
//  load hota tha — sirf isliye ki AuthProvider use karta hai. Iska
//  matlab: user ko content dekhne se pehle 115 KB ka wait karna
//  padta tha, chahe wo login page par bhi ho ya kundli par.
//
//  Ab:
//    1. App PEHLE render hoti hai (page text dikhta hai)
//    2. Firebase BAAD me, idle time me, apne chunk se load hota hai
//    3. Gate (login zaroori hai) phir bhi WAHI kaam karta hai —
//       bas 100-200 ms extra spinner
//
//  Security me koi kami nahi: protected page tabhi khulta hai jab
//  `user` confirm ho jaye. Firebase load hone tak `loading = true`
//  rehta hai, to koi bina login kuch nahi dekh sakta.
// ─────────────────────────────────────────────────────────────────

let CORE = null;    // ../firebase.js  → { auth, db, storage, isFirebaseConfigured }
let AUTH = null;    // firebase/auth
let STORE = null;   // firebase/firestore
let pending = null;

function loadAll() {
  if (CORE && AUTH && STORE) return Promise.resolve({ CORE, AUTH, STORE });
  if (!pending) {
    pending = Promise.all([
      import("./firebase.js"),
      import("firebase/auth"),
      import("firebase/firestore"),
    ])
      .then(([core, auth, store]) => {
        CORE = core;
        AUTH = auth;
        STORE = store;
        return { CORE, AUTH, STORE };
      })
      .catch((err) => {
        pending = null;      // agli baar fir try kare
        throw err;
      });
  }
  return pending;
}

/** Pehla call — app mount hote hi. UI block nahi karta. */
export function warmFirebase() {
  return loadAll().catch(() => null);
}

/** Login/signup jaise kaam se pehle — yahan se { auth, db } milta hai. */
export async function needFirebase() {
  const { CORE, AUTH, STORE } = await loadAll();
  return {
    auth: CORE.auth,
    db: CORE.db,
    storage: CORE.storage,
    isFirebaseConfigured: CORE.isFirebaseConfigured,
    ...AUTH,
    ...STORE,
  };
}

/** Already load ho chuka hai? (fast path — login page CTA ke liye) */
export function firebaseWarm() {
  return Boolean(CORE);
}