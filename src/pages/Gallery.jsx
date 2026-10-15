import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { db, storage } from "../firebase.js";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection, addDoc, serverTimestamp,
  getDocs, deleteDoc, doc,
} from "firebase/firestore";
import { useAuth } from "../auth/AuthContext.jsx";
import { useAdmin } from "../auth/useAdmin.js";

const TX = {
  hi: {
    sub: "फोटो अपलोड करें — admin approve करेगा तभी public gallery में दिखेगी।",
    drop: "अपलोड के लिए चित्र चुनें", mine: "मेरे अपलोड", approved: "Gallery",
    del: "Delete", confirm: "Delete करें?", noImg: "अभी कोई फोटो नहीं है।",
    needLogin: "अपलोड के लिए पहले लॉगिन करें।", done: "अपलोड हो गया! Admin approve करेगा तब दिखेगा।",
    errFile: "कृपया चित्र फाइल चुनें।",
  },
  mr: {
    sub: "फोटो अपलोड करा — admin मान्यता देईल तेव्हाच public gallery मध्ये दिसेल.",
    drop: "अपलोडसाठी चित्र निवडा", mine: "माझे अपलोड", approved: "Gallery",
    del: "Delete", confirm: "Delete करायचे?", noImg: "अजून कोणताही फोटो नाही.",
    needLogin: "अपलोडसाठी आधी लॉगिन करा.", done: "अपलोड झाले! Admin मान्यता देईल तेव्हा दिसेल.",
    errFile: "कृपया चित्र फाइल निवडा.",
  },
  en: {
    sub: "Upload a photo — it appears in the public gallery after admin approval.",
    drop: "Click to select an image", mine: "My Uploads", approved: "Gallery",
    del: "Delete", confirm: "Delete this image?", noImg: "No photos yet.",
    needLogin: "Please login first to upload.", done: "Uploaded! Visible after admin approval.",
    errFile: "Please select an image file.",
  },
};

export default function Gallery() {
  const { t, lang } = useLanguage();
  const T = TX[lang] || TX.en;
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [files, setFiles] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const byDateDesc = (arr) => [...arr].sort((a, b) => {
    const ta = a.createdAt?.seconds || 0;
    const tb = b.createdAt?.seconds || 0;
    return tb - ta;
  });

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "gallery"));
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFiles(byDateDesc(all.filter((g) => g.status === "approved")));
    } catch (err) {
      setError(err?.message || t("gallery_empty"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadMine = useCallback(async () => {
    if (!user) { setMine([]); return; }
    try {
      const snap = await getDocs(collection(db, "gallery"));
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMine(byDateDesc(all.filter((g) => g.uid === user.uid)));
    } catch { /* ignore */ }
  }, [user]);

  useEffect(() => { loadFiles(); }, [loadFiles]);
  useEffect(() => { loadMine(); }, [loadMine]);

  const handleUpload = (fileList) => {
    if (!fileList || !fileList.length) return;
    const file = fileList[0];
    if (!file.type.startsWith("image/")) {
      setError(T.errFile);
      return;
    }
    if (!user) {
      setError(T.needLogin);
      return;
    }
    setError("");
    setMessage("");
    setUploading(true);
    setProgress(0);
    const path = `images/${user.uid}_${Date.now()}_${file.name}`;
    const fileRef = storageRef(storage, path);
    const task = uploadBytesResumable(fileRef, file);
    task.on(
      "state_changed",
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => {
        setError(err?.message || T.errFile);
        setUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, "gallery"), {
            path, url,
            name: file.name,
            uid: user.uid,
            email: user.email || "",
            status: "pending",
            createdAt: serverTimestamp(),
          });
          setMessage(T.done);
          loadMine();
        } catch (e) {
          setError(e.message);
        } finally {
          setUploading(false);
        }
      }
    );
  };

  const handleDelete = async (item, setter) => {
    if (!window.confirm(T.confirm)) return;
    try {
      await deleteObject(storageRef(storage, item.path)).catch(() => {});
      await deleteDoc(doc(db, "gallery", item.id));
      setter((prev) => prev.filter((f) => f.id !== item.id));
      if (setter === mine) loadFiles();
    } catch (err) {
      setError(err?.message || T.confirm);
    }
  };

  const canDelete = (item) => isAdmin || (user && item.uid === user.uid);

  return (
    <div>
      <h1 className="text-gradient">{t("gallery_title")}</h1>
      <p>{T.sub}</p>

      <div style={{ marginTop: 20 }} className="card">
        <label className="label">{t("gallery_upload")}</label>
        <div className="dropzone" onClick={() => document.getElementById("file-input").click()}>
          <p>{T.drop}</p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
        {uploading && (
          <div style={{ marginTop: 12 }}>
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>
            <p style={{ textAlign: "center", marginTop: 6 }}>{progress}%</p>
          </div>
        )}
        {message && <p style={{ color: "var(--accent-2)", marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>}
      </div>

      {user && mine.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>{T.mine}</h3>
          <div className="gallery-grid" style={{ marginTop: 10 }}>
            {mine.map((f) => (
              <div key={f.id} style={{ position: "relative" }}>
                <img src={f.url} alt={f.name} />
                <span className="badge" style={{ position: "absolute", top: 8, left: 8 }}>{f.status}</span>
                {canDelete(f) && (
                  <button
                    className="btn danger"
                    style={{ position: "absolute", top: 8, right: 8, padding: "6px 10px", fontSize: ".75rem" }}
                    onClick={() => handleDelete(f, setMine)}
                  >
                    {T.del}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>{T.approved} ({files.length})</h3>
          <button className="btn secondary" onClick={loadFiles} disabled={loading}>{t("gallery_refresh")}</button>
        </div>
        {loading && <div className="spinner" />}
        {!loading && files.length === 0 && <p>{t("gallery_empty")}</p>}
        <div className="gallery-grid">
          {files.map((f) => (
            <div key={f.id} style={{ position: "relative" }}>
              <img src={f.url} alt={f.name} loading="lazy" />
              {canDelete(f) && (
                <button
                  className="btn danger"
                  style={{ position: "absolute", top: 8, right: 8, padding: "6px 10px", fontSize: ".75rem" }}
                  onClick={() => handleDelete(f, setFiles)}
                >
                  {T.del}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
