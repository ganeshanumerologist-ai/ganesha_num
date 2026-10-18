import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { needFirebase } from "../firebaseLazy.js";

const TX = {
  hi: { sub: "न्यूमरोलॉजी रीडिंग के बारे में सवाल है? संदेश भेजें।", errFill: "कृपया सभी खाने भरें।", sending: "भेजा जा रहा है..." },
  mr: { sub: "न्यूमरॉलॉजी रीडिंगबद्दल प्रश्न आहे? संदेश पाठवा.", errFill: "कृपया सर्व रकाने भरा.", sending: "पाठवत आहे..." },
  bn: { sub: "নিউমেরোলজি রিডিং নিয়ে প্রশ্ন আছে? বার্তা পাঠান।", errFill: "অনুগ্রহ করে সব ঘর পূরণ করুন।", sending: "পাঠানো হচ্ছে..." },
  te: { sub: "న్యూమెరాలజీ రీడింగ్ గురించి ప్రశ్నలు ఉన్నాయా? సందేశం పంపండి.", errFill: "దయచేసి అన్ని ఖాళాలు నింపండి.", sending: "పంపుతోంది..." },
  ta: { sub: "நியூமராலஜி வாசிப்பு பற்றி கேள்விகள் உள்ளன? செய்தி அனுப்புங்கள்.", errFill: "அனைத்து புலங்களையும் நிரப்பவும்.", sending: "அனுப்பப்படுகிறது..." },
  gu: { sub: "ન્યુમરોલોજી રીડિંગ વિશે પ્રશ્નો છે? સંદેશ મોકલો.", errFill: "કૃપા કરીને બધા ખાના ભરો.", sending: "મોકલાય છે..." },
  ur: { sub: "نیومرولوجی ریڈنگ کے بارے میں سوال ہیں؟ پیغام بھیجیں۔", errFill: "براہِ کرم تمام خانے پُر کریں۔", sending: "بھیجا جا رہا ہے..." },
  kn: { sub: "ನ್ಯೂಮರಾಲಜಿ ಓದುವಿನ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿವೆ? ಸಂದೇಶ ಕಳುಹಿಸಿ.", errFill: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕಣಗಳನ್ನು ತುಂಬಿ.", sending: "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..." },
  ml: { sub: "ന്യൂമറോളജി വായനയെക്കുറിച്ച് ചോദ്യങ്ങളുണ്ടോ? സന്ദേശം അയയ്ക്കൂ.", errFill: "എല്ലാ ഫീഡുകളും പൂരിപ്പിക്കൂ.", sending: "അയയ്ക്കുന്നു..." },
  pa: { sub: "ਨਿਊਮਰੋਲੋਜੀ ਰੀਡਿੰਗ ਬਾਰੇ ਸਵਾਲ ਹਨ? ਸੁਨੇਹਾ ਭੇਜੋ।", errFill: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖਾਨੇ ਭਰੋ।", sending: "ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ..." },
  or: { sub: "ନ୍ୟୁମେରୋଲୋଜି ରୀଡିଙ୍ଗ ବିଷୟରେ ପ୍ରଶ୍ନ ଅଛି? ବାର୍ତ୍ତା ପଠାନ୍ତୁ।", errFill: "ଦୟାକରି ସବୁ ଖଣ୍ଡ ପୂରଣ କରନ୍ତୁ।", sending: "ପଠାଯାଉଛି..." },
  as: { sub: "নিউমেৰলজি ৰিডিঙৰ বিষয়ে প্ৰশ্ন আছে? বাৰ্তা পঠিয়াওক।", errFill: "দয়া কৰি সকলো খোজা পূৰণ কৰক।", sending: "পঠিয়ানো হৈছে..." },
  en: { sub: "Have questions about your numerology reading? Send us a message.", errFill: "Please fill all fields.", sending: "Sending..." },
};

export default function Contact() {
  const { t, lang } = useLanguage();
  const T = pageTX(TX, lang);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError(T.errFill);
      return;
    }
    setLoading(true);
    try {
      // Dynamic import — pehle static tha, isliye Contact page
      // Firebase ko eagerly le aata tha
      const F = await needFirebase();
      await F.addDoc(F.collection(F.db, "inquiries"), {
        ...form,
        createdAt: F.serverTimestamp(),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err?.message || T.errFill);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-gradient">{t("contact_title")}</h1>
      <p>{T.sub}</p>

      <div style={{ marginTop: 24 }} className="card">
        {sent && <p style={{ color: "var(--accent-2)", marginBottom: 12 }}>{t("contact_success")}</p>}
        <form onSubmit={submit} className="grid" style={{ gap: 14 }}>
          <div>
            <label className="label">{t("contact_name")}</label>
            <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className="label">{t("contact_email")}</label>
            <input className="input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="label">{t("contact_message")}</label>
            <textarea className="input" rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} />
          </div>
          <button className="btn" disabled={loading}>{loading ? T.sending : t("contact_send")}</button>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
