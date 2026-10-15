// Payment settings. Admin inhe Admin Panel > Payment tab se bhi badal sakta hai
// (Firestore: settings/payment). Yahan ke values default hain.

export const PAYMENT_DEFAULTS = {
  upiId: "yourname@upi",
  payeeName: "Numerology VIP",
  // Agar Razorpay / Stripe / koi payment link hai to yahan dalein, nahi to khaali rakhein.
  paymentLink: "",
  currency: "INR",
};

export function upiLink({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName || "Numerology VIP",
    cu: "INR",
    ...(amount ? { am: String(amount) } : {}),
    ...(note ? { tn: note } : {}),
  });
  return `upi://pay?${params.toString()}`;
}

export function parsePrice(priceStr) {
  // "₹501 / 30 min" -> 501
  const m = String(priceStr || "").replace(/,/g, "").match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

export default PAYMENT_DEFAULTS;
