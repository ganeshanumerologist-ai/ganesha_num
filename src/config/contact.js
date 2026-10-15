// WhatsApp number jis par booking/chat aayegi. Format: country code + number, bina + ke.
// Example: "919876543210". Admin ise Admin Panel > Payment tab se bhi badal sakta hai
// (Firestore: settings/payment -> whatsapp).
export const WHATSAPP_DEFAULT = "919876543210";

export function waLink(number, text) {
  const num = String(number || "").replace(/\D/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${num}${q}`;
}

export default WHATSAPP_DEFAULT;
