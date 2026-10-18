// ════════════════════════════════════════════════════════════════════
//  BLOG POST
//
//  Post ke data file me ab 4 hisse hain:
//    body     — shuruaat ka pargraph
//    sections — h2 + paragraphs (ye proper article structure hai,
//               Google "long form content" isi pehchaanta hai)
//    faq      — sawaal-jawaab → JSON-LD FAQPage (rich result)
//    links    — related pages (internal linking)
//
//  FAQPage JSON-LD sirf tab jab post me faq hai.
// ════════════════════════════════════════════════════════════════════
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ALL_POSTS } from "../data/blog.js";
import ShareButtons from "../components/ShareButtons.jsx";
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { SITE_URL, BRAND } from "../seo/routes.js";

export default function BlogPost() {
  const { S, lang } = useLanguage();
  const { id } = useParams();
  const [post, setPost] = useState(() => ALL_POSTS.find((p) => p.id === id) || null);
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    if (post) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "posts", id));
        if (snap.exists()) setPost({ id: snap.id, ...snap.data() });
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, [id, post]);

  // ── FAQPage JSON-LD ──
  // Google in sawaal-jawaab ko search result me seedha dikhata hai
  // ("People also ask" wala box). Sirf post ke apne sawaal hone par.
  useEffect(() => {
    if (!post || !Array.isArray(post.faq) || !post.faq.length) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-blog-faq", "1");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
    document.head.appendChild(script);

    return () => script.remove();
  }, [post]);

  if (loading) return <div className="spinner" />;
  if (!post) return <div><h1>{S.blog_not_found}</h1><Link to="/blog">{S.blog_back}</Link></div>;

  const body = Array.isArray(post.body) ? post.body : String(post.body || "").split("\n");
  const sections = Array.isArray(post.sections) ? post.sections : [];
  const related = Array.isArray(post.links) ? post.links : [];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Link to="/blog" style={{ color: "var(--accent-2)" }}>{S.blog_all}</Link>

      <article className="nv-article">
        <h1 style={{ marginTop: 10 }}>{post.title}</h1>
        <p style={{ marginTop: 6, color: "var(--muted)" }}>
          {(post.tags || []).join(" · ")}
          {post.readMin ? ` · ${post.readMin} min read` : ""}
        </p>

        <div className="card" style={{ marginTop: 20 }}>
          {/* shuruaat ke paragraph */}
          {body.map((para, i) => (
            <p key={`b${i}`} style={{ marginBottom: 12, lineHeight: 1.85 }}>{para}</p>
          ))}

          {/* h2 sections — proper article structure */}
          {sections.map((sec, si) => (
            <section key={`s${si}`} style={{ marginTop: 26 }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  margin: "0 0 10px",
                  color: "var(--gold)",
                }}
              >
                {sec.h}
              </h2>
              {(sec.p || []).map((para, pi) => (
                <p key={`p${pi}`} style={{ marginBottom: 12, lineHeight: 1.85 }}>
                  {para}
                </p>
              ))}
            </section>
          ))}

          {/* FAQ — screen par bhi, taaki user ko turant jawab mile */}
          {post.faq?.length > 0 && (
            <section style={{ marginTop: 30 }}>
              <h2 style={{ fontSize: "1.25rem", margin: "0 0 12px", color: "var(--gold)" }}>
                {S.blog_faq || "Saav sawaal"}
              </h2>
              {post.faq.map(([q, a], qi) => (
                <details
                  key={`q${qi}`}
                  style={{
                    marginBottom: 10,
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {q}
                  </summary>
                  <p style={{ margin: "10px 0 0", lineHeight: 1.8 }}>{a}</p>
                </details>
              ))}
            </section>
          )}
        </div>

        {/* ── Related pages (internal linking) ──
            inke bina Google ko nahi pata chalta ki article kis
            service se juda hai — aur sitemap me bhi link nahi hota. */}
        {related.length > 0 && (
          <nav
            className="card"
            style={{ marginTop: 20, padding: 16 }}
            aria-label={S.blog_related || "Related"}
          >
            <h2 style={{ fontSize: ".95rem", margin: "0 0 10px", color: "var(--gold)" }}>
              {S.blog_related || "Ye bhi dekhein"}
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {related.map(([path, label]) => (
                <li key={path} style={{ marginBottom: 8 }}>
                  <Link
                    to={lang === "en" ? path : `/${lang}${path}`}
                    style={{ color: "var(--accent-2)", textDecoration: "none" }}
                  >
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>

      <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/calculator" className="btn">{S.blog_cta_number}</Link>
        <Link to="/experts" className="btn secondary">{S.blog_cta_expert}</Link>
      </div>

      {/* Article schema — Google ko batata hai ye ek article hai,
          author/date ke saath. Knowledge graph me dikhne me madad karta hai. */}
      <ArticleSchema post={post} />

      <ShareButtons title="Ye lekh share karein" text={`${post.title} — ${post.excerpt}`} />
    </div>
  );
}

function ArticleSchema({ post }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-blog-article", "1");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: `${SITE_URL}/og-image.png`,
      author: { "@type": "Organization", name: BRAND },
      publisher: { "@type": "Organization", name: BRAND },
      datePublished: "2026-10-18",
      dateModified: "2026-10-18",
      inLanguage: "hi",
      mainEntityOfPage: `${SITE_URL}/blog/${post.id}`,
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [post]);

  return null;
}