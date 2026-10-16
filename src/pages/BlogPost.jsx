import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { POSTS } from "../data/blog.js";
import ShareButtons from "../components/ShareButtons.jsx";
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function BlogPost() {
  const { S } = useLanguage();
  const { id } = useParams();
  const [post, setPost] = useState(() => POSTS.find((p) => p.id === id) || null);
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

  if (loading) return <div className="spinner" />;
  if (!post) return <div><h1>{S.blog_not_found}</h1><Link to="/blog">{S.blog_back}</Link></div>;

  const body = Array.isArray(post.body) ? post.body : String(post.body || "").split("\n");

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Link to="/blog" style={{ color: "var(--accent-2)" }}>{S.blog_all}</Link>
      <h1 style={{ marginTop: 10 }}>{post.title}</h1>
      <p style={{ marginTop: 6 }}>{(post.tags || []).join(" · ")}{post.readMin ? ` · ${post.readMin} min read` : ""}</p>
      <div className="card" style={{ marginTop: 20 }}>
        {body.map((para, i) => (
          <p key={i} style={{ marginBottom: 12 }}>{para}</p>
        ))}
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/calculator" className="btn">{S.blog_cta_number}</Link>
        <Link to="/experts" className="btn secondary">{S.blog_cta_expert}</Link>
      </div>
      <ShareButtons title="Ye lekh share karein" text={`${post.title} — ${post.excerpt}`} />
    </div>
  );
}
