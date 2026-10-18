import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ALL_POSTS } from "../data/blog.js";
import { needFirebase } from "../firebaseLazy.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Blog() {
  const { S } = useLanguage();
  const [posts, setPosts] = useState(ALL_POSTS);

  useEffect(() => {
    let dead = false;
    // Dynamic import — pehle static tha, isliye Blog page Firebase ko
    // eagerly le aata tha. Ab default posts foran dikhte hain, aur
    // Firebase ke aate hi custom posts upar aa jaate hain.
    (async () => {
      try {
        const F = await needFirebase();
        let snap;
        try {
          snap = await F.getDocs(
            F.query(
              F.collection(F.db, "posts"),
              F.where("status", "==", "published"),
              F.orderBy("createdAt", "desc"),
            ),
          );
        } catch {
          snap = await F.getDocs(F.collection(F.db, "posts"));
        }
        if (dead) return;
        const custom = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => (p.status || "published") === "published");
        if (custom.length) setPosts([...custom, ...ALL_POSTS]);
      } catch { /* Firestore nahi hai to default posts */ }
    })();
    return () => { dead = true; };
  }, []);

  return (
    <div>
      <h1 className="text-gradient">{S.blog_title}</h1>
      <p>{S.blog_sub}</p>
      <div className="grid grid-2" style={{ marginTop: 20 }}>
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.id}`} className="card">
            <h3>{p.title}</h3>
            <p style={{ marginTop: 8 }}>{p.excerpt}</p>
            <p style={{ marginTop: 10, fontSize: ".8rem" }}>
              {(p.tags || []).join(" · ")}{p.readMin ? ` · ${p.readMin} min` : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
