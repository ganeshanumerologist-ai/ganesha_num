import { readFileSync, writeFileSync } from "node:fs";

// Admin.jsx ke hardcoded English/Hinglish ko src/i18n/adminTx.js se jodta hai.
// Steps:
//   1. import + A (dictionary) add karna
//   2. TABS ids -> labels map
//   3. har hardcoded string ko {A.key} se replace karna

const P = "src/pages/Admin.jsx";
let s = readFileSync(P, "utf8");
const before = s;

// --- 1. import + hook ---
s = s.replace(
  'import { SOCIAL_DEFAULTS, SOCIAL_META } from "../config/social.js";',
  'import { SOCIAL_DEFAULTS, SOCIAL_META } from "../config/social.js";\nimport { useLanguage } from "../i18n/LanguageContext.jsx";\nimport { adminTX } from "../i18n/adminTx.js";'
);

s = s.replace(
  'const TABS = ["Experts", "Bookings", "Inquiries", "Gallery", "Reviews", "Blog", "Social", "Payment"];',
  `const TABS = ["Experts", "Bookings", "Inquiries", "Gallery", "Reviews", "Blog", "Social", "Payment"];
const TAB_LBL = {
  Experts: "adm_tab_experts", Bookings: "adm_tab_bookings", Inquiries: "adm_tab_inquiries",
  Gallery: "adm_tab_gallery", Reviews: "adm_tab_reviews", Blog: "adm_tab_blog",
  Social: "adm_tab_social", Payment: "adm_tab_payment",
};`
);

s = s.replace(
  '  const { user, loading } = useAuth();',
  '  const { S } = useLanguage();\n  const A = adminTX(S.lang);\n  const { user, loading } = useAuth();'
);

// --- 2. setMsg strings ---
const MSG = [
  ["Admin activated! Page refresh karein.", "adm_msg_activated"],
  ["Expert save ho gaya!", "adm_msg_expert_saved"],
  ["Naam likhein.", "adm_msg_name_required"],
  ["Naya expert add ho gaya!", "adm_msg_expert_added"],
  ["Photo update ho gayi!", "adm_msg_photo_updated"],
  ["Delete ho gaya!", "adm_msg_deleted"],
  ["Photo approve ho gayi!", "adm_msg_photo_approved"],
  ["Photo reject/delete ho gayi.", "adm_msg_photo_rejected"],
  ["Payment settings save ho gayi!", "adm_msg_payment_saved"],
  ["Review approve ho gaya!", "adm_msg_review_approved"],
  ["Title aur content likhein.", "adm_msg_post_required"],
  ["Post publish ho gayi!", "adm_msg_post_published"],
  ["Social links save ho gaye! Footer me dikhenge.", "adm_msg_social_saved"],
  ["Delete karein?", "adm_confirm_delete"],
];
for (const [lit, key] of MSG) {
  s = s.split(`"${lit}"`).join(`A.${key}`);
  s = s.split(`'${lit}'`).join(`A.${key}`);
}

// --- 3. JSX text ---
const JSX = [
  ['<h1 className="text-gradient">Admin Panel</h1>', '<h1 className="text-gradient">{S.admin_title}</h1>'],
  ['<p>Aap admin nahi hain ({user?.email || "login nahi hai"}).</p>',
   '<p>{S.admin_not_admin} ({user?.email || S.admin_no_login})</p>'],
  ['<li><b>src/config/admins.js</b> me apna email likhein</li>', '<li>{S.admin_step1}</li>'],
  ['<li><b>firestore.rules</b> me adminEmails line me apna email likhein</li>', '<li>{S.admin_step2}</li>'],
  ['<li>Dobara login karke /admin kholein</li>', '<li>{S.admin_step3}</li>'],
  ['onClick={activateAdmin}>Activate Admin Access</button>', 'onClick={activateAdmin}>{S.admin_activate}</button>'],
  ['onClick={loadAll} disabled={busy}>Refresh</button>', 'onClick={loadAll} disabled={busy}>{S.admin_refresh}</button>'],
  ['{showAdd ? "Cancel" : "+ Naya Expert Add Karein"}', '{showAdd ? A.adm_btn_cancel : A.adm_btn_add_expert}'],
  ['placeholder="Name *" required', 'placeholder={A.adm_ph_name} required'],
  ['placeholder="Languages (Hindi, English)"', 'placeholder={A.adm_ph_langs}'],
  ['placeholder="Experience (e.g. 8 yrs)"', 'placeholder={A.adm_ph_exp}'],
  ['placeholder="Price (e.g. ₹351 / 30 min)"', 'placeholder={A.adm_ph_price}'],
  ['placeholder="Rating" />', 'placeholder={A.adm_ph_rating} />'],
  ['type="submit">Add Expert</button>', 'type="submit">{A.adm_btn_add_expert}</button>'],
  ['placeholder="Name" />', 'placeholder={A.adm_ph_name} />'],
  ['placeholder="Languages (comma)"', 'placeholder={A.adm_ph_langs}'],
  ['placeholder="Experience" />', 'placeholder={A.adm_ph_exp} />'],
  ['placeholder="Price" />', 'placeholder={A.adm_ph_price} />'],
  ['onClick={() => saveExpert(e.id)}>Save</button>', 'onClick={() => saveExpert(e.id)}>{A.adm_btn_save}</button>'],
  ['onClick={() => setEditing(null)}>Cancel</button>', 'onClick={() => setEditing(null)}>{A.adm_btn_cancel}</button>'],
  ['onClick={() => startEdit(e)}>Edit</button>', 'onClick={() => startEdit(e)}>{A.adm_btn_edit}</button>'],
  ['>Delete</button>', '>{A.adm_btn_delete}</button>'],
  ['>Kundli Dekhein</a>', '>{A.adm_view_kundli}</a>'],
  ['onClick={() => approveGallery(g)}>Approve</button>', 'onClick={() => approveGallery(g)}>{A.adm_btn_approve}</button>'],
  ['onClick={() => rejectGallery(g)}>Reject</button>', 'onClick={() => rejectGallery(g)}>{A.adm_btn_reject}</button>'],
  ['onClick={() => approveReview(r)}>Approve</button>', 'onClick={() => approveReview(r)}>{A.adm_btn_approve}</button>'],
  ['onClick={() => delDoc("reviews", r.id, setPendingReviews)}>Reject</button>', 'onClick={() => delDoc("reviews", r.id, setPendingReviews)}>{A.adm_btn_reject}</button>'],
  ['placeholder="Title *" required', 'placeholder={A.adm_ph_title} required'],
  ['placeholder="Short summary"', 'placeholder={A.adm_ph_excerpt}'],
  ['placeholder="Tags (Upay, Dhan)"', 'placeholder={A.adm_ph_tags}'],
  ['placeholder="Poora lekh likhein (har paragraph nayi line par) *" required', 'placeholder={A.adm_ph_body} required'],
  ['type="submit">Publish</button>', 'type="submit">{A.adm_btn_publish}</button>'],
  ['<h3>Social Profile Links</h3>', '<h3>{A.adm_social_links}</h3>'],
  ['type="submit">Save Social Links</button>', 'type="submit">{A.adm_btn_save_social}</button>'],
  ['<h3>Payment Settings</h3>', '<h3>{A.adm_payment_settings}</h3>'],
  ['<label className="label">Payee Name</label>', '<label className="label">{A.adm_payee_name}</label>'],
  ['type="submit">Save Payment Settings</button>', 'type="submit">{A.adm_btn_save_payment}</button>'],
  ['{tb}{count(tb) !== "" ? ` (${count(tb)})` : ""}', '{A[TAB_LBL[tb]]}{count(tb) !== "" ? ` (${count(tb)})` : ""}'],
];

const notApplied = [];
for (const [from, to] of JSX) {
  if (!s.includes(from)) { notApplied.push(from.slice(0, 46)); continue; }
  s = s.split(from).join(to);
}

writeFileSync(P, s);
console.log(`Admin.jsx patched. changed=${s !== before} notApplied=${notApplied.length}`);
for (const n of notApplied) console.log("  MISS:", n);