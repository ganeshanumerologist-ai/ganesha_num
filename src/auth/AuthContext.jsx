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
import { auth, db } from "../firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { toAuthEmail, toE164, looksLikePhone, toPhone } from "./identity.js";

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

// Firestore atak jaye to app na atke — 15 sec timeout
const withTimeout = (p, ms = 15000) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

// Jitne bhi user docs kholte hain, un sabka ek hi shape rakho
const userDoc = (name, email, phone) => ({
  name: name || "",
  email: email || "",
  phone: phone || "",
  createdAt: serverTimestamp(),
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const ref = doc(db, "users", u.uid);
          const snap = await withTimeout(getDoc(ref));
          if (!snap.exists()) {
            await withTimeout(setDoc(ref, userDoc(u.displayName, u.email, ""))).catch(() => {});
          }
          try {
            setProfile((await withTimeout(getDoc(ref))).data() || null);
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
    return () => unsub();
  }, []);

  /* ---------------- email / password ---------------- */

  /* `id` ya to email hai ya mobile number — dono me se koi ek chalega. */
  const login = (id, password) =>
    signInWithEmailAndPassword(auth, toAuthEmail(id), password);

  const signup = async (name, id, password) => {
    const mail = toAuthEmail(id);
    const isPhone = looksLikePhone(id);
    const cred = await createUserWithEmailAndPassword(auth, mail, password);
    // Profile save fail ho to bhi signup safal rahe — atakna nahi chahiye
    try {
      await withTimeout(updateProfile(cred.user, { displayName: name }), 10000);
      await withTimeout(
        setDoc(doc(db, "users", cred.user.uid), userDoc(name, isPhone ? "" : mail, "")),
        10000,
      );
    } catch { /* ignore — login phir bhi safal */ }
    return cred;
  };

  const googleLogin = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    try {
      const ref = doc(db, "users", cred.user.uid);
      const snap = await withTimeout(getDoc(ref));
      if (!snap.exists()) {
        await withTimeout(setDoc(ref, userDoc(cred.user.displayName, cred.user.email, "")));
      }
    } catch { /* ignore */ }
    return cred;
  };

  const logout = () => signOut(auth);

  /* ---------------- SMS OTP ----------------
     1. sendOtp(phone, containerId) -> SMS chali jaati hai
     2. verifyOtp(code)            -> user login
     3. signupWithOtp(phone, name, code) -> naya user

     containerId wo div ka id hai jisme reCAPTCHA dikhta hai — Login.jsx
     usko render karta hai. Bina uske Firebase OTP bhej hi nahi sakta. */

  const [otpConfirmation, setOtpConfirmation] = useState(null);

  const verifierFor = (containerId) => {
    if (!containerId) return null;
    return new RecaptchaVerifier(auth, containerId, { size: "normal" });
  };

  const sendOtp = async (phone, containerId) => {
    const verifier = verifierFor(containerId);
    if (!verifier) throw new Error("otp-captcha-missing");
    const res = await signInWithPhoneNumber(auth, toE164(phone), verifier);
    setOtpConfirmation(res);
    return res;
  };

  const verifyOtp = async (code) => {
    if (!otpConfirmation) throw new Error("otp-pehle-bhejo");
    const cred = await otpConfirmation.confirm(String(code || "").trim());
    setOtpConfirmation(null);
    return cred;
  };

  const signupWithOtp = async (phone, name, code) => {
    const cred = await verifyOtp(code);
    try {
      if (name) await withTimeout(updateProfile(cred.user, { displayName: name }), 10000);
      await withTimeout(
        setDoc(doc(db, "users", cred.user.uid), userDoc(name, "", toPhone(phone))),
        10000,
      );
    } catch { /* ignore — login phir bhi safal */ }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);