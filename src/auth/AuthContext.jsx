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
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { toAuthEmail, looksLikePhone, toPhone } from "./identity.js";

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

// Firestore atak jaye to app na atke — 15 sec timeout
const withTimeout = (p, ms = 15000) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

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
            await withTimeout(setDoc(ref, {
              name: u.displayName || "",
              email: u.email || "",
              createdAt: serverTimestamp(),
            })).catch(() => {});
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
      await withTimeout(setDoc(doc(db, "users", cred.user.uid), {
        name,
        email: isPhone ? "" : mail,
        phone: isPhone ? toPhone(id) : "",
        createdAt: serverTimestamp(),
      }), 10000);
    } catch { /* ignore — login phir bhi safal */ }
    return cred;
  };

  const googleLogin = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    try {
      const ref = doc(db, "users", cred.user.uid);
      const snap = await withTimeout(getDoc(ref));
      if (!snap.exists()) {
        await withTimeout(setDoc(ref, {
          name: cred.user.displayName || "",
          email: cred.user.email || "",
          createdAt: serverTimestamp(),
        }));
      }
    } catch { /* ignore */ }
    return cred;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
