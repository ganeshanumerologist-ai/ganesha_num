// Login gate.
//
// User ne kaha: "jabtak user login hi karta tab tak use sirf home page
// dikhna chahiye ... kuch bhi nahi dikhna chahiye."
//
// Pehle koi bhi page bina login khol sakta tha, aur navbar me har link
// dikhta tha. Ab:
//   • bina login  → sirf / (home) aur /login
//   • login ke baad → sab kuch
//
// Gate ke peeche kya kya milega — wo list yahin dikhti hai, taaki user
// ko login karne ka matlab samajh aaye.
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

/** Ye page sirf login ke baad khulega. */
export function OnlyLoggedIn({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  // Auth state abhi pata nahi — blank screen na dikhe
  if (loading) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}

/**
 * Gate: jab tak login nahi, protected page nahi khulegi.
 * User hamesha /login par bheja jaata hai aur login ke baad wahin
 * wapas laata hai (state.from).
 *
 * "Login ke baad kya milega" ki listing Home page par hai, kyunki
 * user ne kaha tha "sirf home page dikhna chahiye jab tak login na ho".
 */
export default OnlyLoggedIn;