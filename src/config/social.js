// ─────────────────────────────────────────────────────────────
// BRAND COLOURS — inhe JAAN-BOOJH kar mat badalna.
// Facebook #1877F2, LinkedIn #0A66C2, WhatsApp #25D366.
// Ye blue/cyan HAIN aur hona bhi chahiye — inhe badalne se
// unka pehchan hi khatam ho jayega. Baaki site puri tarah
// gold + rose + maroon hai, ye sirf official brand colours hain.
// ─────────────────────────────────────────────────────────────
// Social profile links. Admin inhe Admin Panel > Social tab se bhi badal sakta hai
// (Firestore: settings/social). Yahan ke values default hain.

export const SOCIAL_DEFAULTS = {
  facebook: "",
  instagram: "",
  youtube: "",
  x: "",
  linkedin: "",
  tiktok: "",
};

export const SOCIAL_META = [
  { key: "facebook", label: "Facebook", color: "#1877F2" },
  { key: "instagram", label: "Instagram", color: "#E1306C" },
  { key: "youtube", label: "YouTube", color: "#FF0000" },
  { key: "x", label: "X", color: "#e8ecff" },
  { key: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { key: "tiktok", label: "TikTok", color: "#25F4EE" },
];

// One-tap share links (website se seedha post/share)
export function shareLinks({ url, text }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return [
    { key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { key: "x", label: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { key: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { key: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
  ];
}

export default SOCIAL_DEFAULTS;
