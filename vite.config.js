import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ════════════════════════════════════════════════════════════════════
//  BUNDLE SIZE — pehle ek hi chunk me 3.2 MB
//
//  Mobile par 3 MB JS = 5-10 second extra. Google ka #1 technical
//  ranking factor Core Web Vitals (LCP) isi se kharab hota tha.
//
//  Teen layer:
//   1. manualChunks — bhasha data aur bhaari engine apne chunk me
//      (inhe har page par chahiye, par compress hote hain)
//   2. Har page lazy — kundli kholne par reports/chat ka code nahi aayega
//   3. Vendor alag — app update par vendor cache me rahega
// ════════════════════════════════════════════════════════════════════
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    outDir: "dist",
    sourcemap: false,
    // JS par 700 kB tak warning na aaye — pehle 3 MB par aati thi
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // ── 1. bhasha data ──
        // translations.js + seoDesc.js + saare kf/ files = ~500 KB
        // Har page par chahiye (text ke liye), isliye alag chunk me —
        // inhe compress karke sirf load hote hain jo page khule.
        manualChunks(id) {
          // ── i18n ────────────────────────────────────────────
          // PEHLE: saara src/i18n ek hi "i18n" chunk me tha. Iska
          // matlab bhasha ka poora data (22 bhasha × 9 file ≈ 550 KB)
          // HAR page par download hota tha — jabki user sirf EK
          // bhasha padhta hai.
          //
          // AB: sirf wo teen files eagerly chunk me jaati hain jo
          // navbar/page ko turant chahiye (nav labels, bhasha list).
          // Baaaki (siteTx, shani, names, adminTx, kundliFullTX,
          // charts, numSecTx, jyotish_*) apne lazy page ke saath
          // apne chunk me chali jaati hain — tabhi load hoti hain
          // jab wo page sach me khola jaata hai.
          const I18N_EAGER = /[\\/]src[\\/]i18n[\\/](registry|translations|pageTx|shaniNav|smallTX)\.js$/;
          if (!id.includes("node_modules") && I18N_EAGER.test(id)) {
            return "i18n";
          }
          // jyotish engine — kundliFull, panchang, numerology (heavy math)
          if (!id.includes("node_modules") && /[\\/]src[\\/]utils[\\/]/.test(id)) {
            return "jyotish";
          }
          // SEO — halka, par har page par chahiye
          if (!id.includes("node_modules") && /[\\/]src[\\/]seo[\\/]/.test(id)) {
            return "seo";
          }
          // ── 3. vendor ──
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "firebase";
            if (id.includes("react-router") || id.includes("react-dom")) return "react-core";
            if (id.includes("react")) return "react";
            return "vendor";
          }
        },
      },
    },
  },
});