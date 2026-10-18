// Firebase Authentication.
//
// Teen tareeke chal rahe hain:
//   1. email + password          (login aur signup)
//   2. mobile number + SMS OTP   (login aur signup — Firebase Phone Auth)
//   3. Google                    (ek tap)
//
// Email/password me mobile number bhi chalta hai — wo `identity.js` me ek
// "synt email" bana deta hai, jaise 9876543210 → 919876543210@nvip.app
// Isse Phone Auth (SMS) ki zaroorat nahi padti. Password wahi rehta hai jo
// user ne signup par diya tha.

import React, { createContext, useContext, useEffect, useState } from "react";
import { setProfileOwner, clearAllProfiles } from "../profile/profile.js";
import { warmFirebase, needFirebase } from "../firebaseLazy.js";
import { toAuthEmail, toE164, looksLikePhone, toPhone } from "./identity.js";

// NOTE: `firebase/auth` aur `firebase/firestore` ab KABHI static import
// nahi hote. Pehle ye line har page ka pehla load 115 KB (gzip) bhaari
// kar deti thi, chahe user login page par ho ya kundli par.
// Ab ye sab `firebaseLazy.js` ke through BAAD me load hote hain.

const AuthContext = createContext();

// Firestore atak jaye to app na atke — 15 sec timeout
const withTimeout = (p, ms = 15000) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

// Jitne bhi user docs kholte hain, un sabka ek hi shape rakho
// `serverTimestamp` ab har call ke saath milta hai (dynamic import)
const userDoc = (name, email, phone, serverTimestamp) => ({
  name: name || "",
  email: email || "",
  phone: phone || "",
  createdAt: serverTimestamp(),
});

/* ════════════════════════════════════════════════════════════════════
   REMEMBER ME — "ek baar register, baar baar mat pucho"

   User ne kaha: "sign up karne ke baad jab sign in karta hoon to phir
   se sign up karne ko bolta hai. Data save hona chahiye. Ek baar
   register karne ke baad baar baar register karne ko nahi bolna
   chahiye."

   Firebase ka apna session localStorage me hota hai. Lekin:
     • storage block ho to session khatam ho jaata hai
     • "invalid-credential" error user ko confuse karta hai — wo
       samajhta hai ki account hi nahi bana

   Isliye hum bhi ek chhota record rakhte hain: last id + naam.
   Login page par usse:
     • form khud bhar jaata hai
     • "Welcome back" dikhta hai
     • mode hamesha LOGIN rehta hai (signup nahi)

   Ye security nahi todta — password ya token yahan nahi hai, sirf
   "kaun ka account tha" ka nishani. Password user hi dalega.
   ════════════════════════════════════════════════════════════════════ */
const LS_KEY = "nv-remember";

export function readRemembered() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function rememberMe(user, id) {
  try {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        id: String(id || ""),
        name: (user && user.displayName) || "",
        at: Date.now(),
      })
    );
  } catch { /* private mode — chhod do */ }
}

export function clearRemembered() {
  try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
}

/** Login page se bhi call ho sakta hai — jab Firebase bataye ki account
 *  pehle se bana hua hai. Tab user ka account confirm ho gaya, to yaad
 *  rakh lo (naam optional). */
export function rememberAccount(id, name) {
  if (!id) return;
  rememberMe({ displayName: name || "" }, id);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fb, setFb] = useState(null);

  // ── Firebase BAAD me load, app turant render ho ──────────────
  useEffect(() => {
    let unsub = null;
    let dead = false;

    (async () => {
      const F = await needFirebase();
      if (dead) return;
      setFb(F);

      unsub = F.onAuthStateChanged(F.auth, async (u) => {
        setUser(u);
        // ── Profile ka owner badlo ──────────────────────────────
        // Pehle ek hi "nv-profile" key thi, to ek hi phone par dusre
        // user ka naam/jant/path dikh jaata tha. Ab har user ka apna
        // slot hota hai (nv-profile:<uid>), logout par anonymous.
        setProfileOwner(u ? u.uid : null);
        if (u) {
          try {
            const ref = F.doc(F.db, "users", u.uid);
            const snap = await withTimeout(F.getDoc(ref));
            if (!snap.exists()) {
              await withTimeout(
                F.setDoc(ref, userDoc(u.displayName, u.email, "", F.serverTimestamp)),
              ).catch(() => {});
            }
            try {
              setProfile((await withTimeout(F.getDoc(ref))).data() || null);
            } catch {
              setProfile(null);
            }
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    })().catch(() => {
      // Firebase load hi nahi hua (offline / blocked) — app chalti rahe
      if (!dead) setLoading(false);
    });

    return () => {
      dead = true;
      if (unsub) unsub();
    };
  }, []);

  /* ---------------- email / password ---------------- */

  /* `id` ya to email hai ya mobile number — dono me se koi ek chalega. */
  const login = async (id, password) => {
    const F = await needFirebase();
    const cred = await F.signInWithEmailAndPassword(F.auth, toAuthEmail(id), password);
    rememberMe(cred.user, id);
    return cred;
  };

  const signup = async (name, id, password) => {
    const F = await needFirebase();
    const mail = toAuthEmail(id);
    const isPhone = looksLikePhone(id);
    const cred = await F.createUserWithEmailAndPassword(F.auth, mail, password);
    // Profile save fail ho to bhi signup safal rahe — atakna nahi chahiye
    try {
      await withTimeout(F.updateProfile(cred.user, { displayName: name }), 10000);
      await withTimeout(
        F.setDoc(
          F.doc(F.db, "users", cred.user.uid),
          userDoc(name, isPhone ? "" : mail, "", F.serverTimestamp),
        ),
        10000,
      );
    } catch { /* ignore — login phir bhi safal */ }
    // Yaad rakhne ka kaam SABSE Aakhir me — tab tak displayName set
    // ho chuka hota hai, warna "Welcome back" par naam khaali dikhta
    rememberMe(cred.user, id);
    return cred;
  };

  const googleLogin = async () => {
    const F = await needFirebase();
    const provider = new F.GoogleAuthProvider();
    const cred = await F.signInWithPopup(F.auth, provider);
    rememberMe(cred.user, cred.user.email || "");
    try {
      const ref = F.doc(F.db, "users", cred.user.uid);
      const snap = await withTimeout(F.getDoc(ref));
      if (!snap.exists()) {
        await withTimeout(
          F.setDoc(ref, userDoc(cred.user.displayName, cred.user.email, "", F.serverTimestamp)),
        );
      }
    } catch { /* ignore */ }
    return cred;
  };

  const logout = async () => {
    const F = await needFirebase();
    // Profile ka data logout par bhi mitao — shared device par agla
    // user use na dekh sake. (setProfileOwner Auth listener kar raha hai)
    await F.signOut(F.auth);
    // "Yaad rakha hua account" bhi mitao — warna logout ke baad bhi
    // login page par purana naam/id dikhta rahega.
    clearRemembered();
    try {
      clearAllProfiles();
    } catch { /* ignore */ }
  };

  /* ---------------- SMS OTP ----------------
     1. sendOtp(phone, containerId) -> SMS chali jaati hai
     2. verifyOtp(code)            -> user login
     3. signupWithOtp(phone, name, code) -> naya user

     containerId wo div ka id hai jisme reCAPTCHA dikhta hai — Login.jsx
     usko render karta hai. Bina uske Firebase OTP bhej hi nahi sakta. */

  const [otpConfirmation, setOtpConfirmation] = useState(null);

  /* ---------------------------------------------------------------
     TEST MODE
     ---------------------------------------------------------------
     Firebase ka Phone Auth asli SMS ke liye Blaze (billing) plan
     maangta hai. Lekin Firebase TEST phone numbers free (Spark) plan
     par bhi chalte hain — unke liye koi SMS nahi jaata, har baar
     wahi fixed OTP milta hai.

     Console  →  Authentication  →  Phone  →  "Phone numbers for
     testing" section me test numbers add karke unhe yahan list karo.
     Fir VITE_FIREBASE_TEST_PHONES="+911234567890,+91..." .env me daal do.

     Ye sirf development/testing ke liye hai — production me isko hata do.
     --------------------------------------------------------------- */
  const TEST_PHONES = (import.meta.env.VITE_FIREBASE_TEST_PHONES || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  useEffect(() => {
    // Firebase ko batao ki in numbers par verification skip kar do
    if (!TEST_PHONES.length || !fb) return;
    fb.auth.settings.appVerificationDisabledForTesting = true;
    // Firebase har test number ke liye ek fixed code chunta hai; wo
    // confirmation.result se milta hai. Hum use yahan nahi rakhenge —
    // wo confirm() ke waqt khud verify hota hai. Sirf ye setting chahiye.
  }, [fb, TEST_PHONES.length]);

  const verifierFor = (F, containerId) => {
    // Test number par reCAPTCHA ki zaroorat nahi
    if (TEST_PHONES.length) return null;
    if (!containerId) return null;
    return new F.RecaptchaVerifier(F.auth, containerId, { size: "normal" });
  };

  /** Kya ye number test list me hai? */
  const isTestPhone = (phone) => TEST_PHONES.includes(toE164(phone));

  const sendOtp = async (phone, containerId) => {
    const F = await needFirebase();
    const verifier = verifierFor(F, containerId);
    // Test number: verifier null chalta hai, Firebase khud fixed code dega
    const res = verifier
      ? await F.signInWithPhoneNumber(F.auth, toE164(phone), verifier)
      : await F.signInWithPhoneNumber(F.auth, toE164(phone));
    setOtpConfirmation(res);
    return res;
  };

  const verifyOtp = async (code, phone) => {
    if (!otpConfirmation) throw new Error("otp-pehle-bhejo");
    const cred = await otpConfirmation.confirm(String(code || "").trim());
    setOtpConfirmation(null);
    if (phone) rememberMe(cred.user, phone);
    return cred;
  };

  const signupWithOtp = async (phone, name, code) => {
    const F = await needFirebase();
    const cred = await verifyOtp(code, phone);
    try {
      if (name) await withTimeout(F.updateProfile(cred.user, { displayName: name }), 10000);
      await withTimeout(
        F.setDoc(
          F.doc(F.db, "users", cred.user.uid),
          userDoc(name, "", toPhone(phone), F.serverTimestamp),
        ),
        10000,
      );
    } catch { /* ignore — login phir bhi safal */ }
    // naam ab set hua hai — yaad record dobara bhar do
    rememberMe(cred.user, phone);
    return cred;
  };

  /** User ne Back dabaya ya number badla — purana confirmation phenk do. */
  const resetOtp = () => setOtpConfirmation(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        googleLogin,
        logout,
        sendOtp,
        verifyOtp,
        signupWithOtp,
        resetOtp,
        otpReady: Boolean(otpConfirmation),
        testPhones: TEST_PHONES,
        isTestPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);