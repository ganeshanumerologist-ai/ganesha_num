import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { ADMIN_EMAILS } from "../config/admins.js";
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

// Admin = email allowlist me hai YA Firestore me admins/{uid} doc hai
export function useAdmin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    const emailOk = ADMIN_EMAILS.map((e) => e.toLowerCase()).includes((user.email || "").toLowerCase());
    if (emailOk) {
      setIsAdmin(true);
      setChecking(false);
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "admins", user.uid));
        setIsAdmin(snap.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    })();
  }, [user, loading]);

  return { isAdmin, checking };
}

export default useAdmin;
