// Global profile: ek baar bhara data har form me khud aayega.
// localStorage me save hota hai (login zaroori nahi).
const KEY = "nv-profile";

export function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProfile(patch) {
  try {
    const cur = loadProfile();
    const next = { ...cur };
    for (const [k, v] of Object.entries(patch || {})) {
      if (v !== undefined && v !== "") next[k] = v;
    }
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return {};
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch { /* ignore */ }
}

export default { loadProfile, saveProfile, clearProfile };
