import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { POSTS } from "../data/blog.js";
import { db } from "../firebase.js";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Blog() {
  const { S } = useLanguage();
  const [posts, setPosts] = useState(POSTS);

  useEffect(() => {
    (async () => {
      try {
        let snap;
        try {
          snap = await getDocs(query(collection(db, "posts"), where("status", "==", "published"), orderBy("createdAt", "desc")));
        } catch {
          snap = await getDocs(collection(db, "posts"));
        }
        const custom = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => (p.status || "published") === "published");
        if (custom.length) setPosts([...custom, ...POSTS]);
      } catch { /* Firestore nahi hai to default posts */ }
    })();
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
