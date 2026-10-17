// Global profile: ek baar bhara data har form me khud aayega.
//
// ── GUPNEE HAI ──────────────────────────────────────────────────────
// Pehle ek hi localStorage key thi ("nv-profile") — matlab ek hi phone
// par User A ka naam/jant/path DEKHTA BHI tha to User B, aur logout
// karne par bhi data wahi rehta tha. Ye serious privacy leak tha.
//
// Ab har user ka apna slot hai:
//   nv-profile:<uid>   → logged-in user (A ka data B ko kabhi nahi dikhega)
//   nv-profile:anon    → bina login ke aaya hua user
//
// AuthContext login/logout par setProfileOwner() call karta hai, isliye
// koi bhi page ka code badalna zaroori nahi — loadProfile() apne aap
// sahi slot padhta hai.
//
// Purana shared key ("nv-profile") delete kar diya gaya hai — warna
// koi bhi naye anonymous slot me purana data dekh leta.
const UID_KEY = "nv-uid";
const PREFIX = "nv-profile:";
const LEGACY = "nv-profile"; // purana shared key — ab use nahi hota

const key = (owner) => PREFIX + owner;

const read = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k)) || {};
  } catch {
    return {};
  }
};

const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch { /* ignore */ }
};

const currentOwner = () => {
  try {
    return localStorage.getItem(UID_KEY) || "anon";
  } catch {
    return "anon";
  }
};

// Purana shared key hatao — naye slot me wapas nahi aana chahiye.
function dropLegacy() {
  try {
    if (localStorage.getItem(LEGACY)) localStorage.removeItem(LEGACY);
  } catch { /* ignore */ }
}

/**
 * Kis user ka profile dikhana hai. AuthContext ye login/logout par
 * call karta hai. uid null = logout / anonymous.
 */
export function setProfileOwner(uid) {
  try {
    if (uid) localStorage.setItem(UID_KEY, uid);
    else localStorage.removeItem(UID_KEY);
  } catch { /* ignore */ }
  dropLegacy();
}

export function loadProfile() {
  dropLegacy();
  return read(key(currentOwner()));
}

export function saveProfile(patch) {
  dropLegacy();
  const k = key(currentOwner());
  const next = { ...read(k) };
  for (const [kk, v] of Object.entries(patch || {})) {
    if (v !== undefined && v !== "") next[kk] = v;
  }
  write(k, next);
  return next;
}

/** Sirf current user ka data mitao. */
export function clearProfile() {
  try {
    localStorage.removeItem(key(currentOwner()));
  } catch { /* ignore */ }
}

/** Har user ka data mitao — logout par safety ke liye. */
export function clearAllProfiles() {
  try {
    const kill = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) kill.push(k);
    }
    for (const k of kill) localStorage.removeItem(k);
    localStorage.removeItem(LEGACY);
  } catch { /* ignore */ }
}

/** Saare saved profiles ka hisaab (debug/admin). */
export function listProfileOwners() {
  try {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
    }
    return out;
  } catch {
    return [];
  }
}

export default {
  loadProfile, saveProfile, clearProfile, clearAllProfiles,
  setProfileOwner, listProfileOwners,
};