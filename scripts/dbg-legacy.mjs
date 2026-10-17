const store = new Map();
const shim = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => { console.log("    removeItem called with:", JSON.stringify(k)); store.delete(k); },
  key: (i) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
  clear: () => store.clear(),
};
globalThis.localStorage = shim;

const m = await import("../src/profile/profile.js");

store.set("nv-profile", JSON.stringify({ name: "PURANA" }));
console.log("before setProfileOwner, keys:", [...store.keys()]);
console.log("getItem('nv-profile') =", store.get("nv-profile"));

m.setProfileOwner("userC");
console.log("after  setProfileOwner, keys:", [...store.keys()]);
m.loadProfile();
console.log("after  loadProfile,     keys:", [...store.keys()]);