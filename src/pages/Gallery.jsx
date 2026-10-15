import React, { useEffect, useState, useCallback } from "react";
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

export default function Gallery() {
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

  // Sirf approved photos sabko dikhengi
  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "gallery"));
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFiles(byDateDesc(all.filter((g) => g.status === "approved")));
    } catch (err) {
      setError(err?.message || "Gallery load nahi hui. Firestore rules check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

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
      setError("Please select an image file.");
      return;
    }
    if (!user) {
      setError("Upload ke liye pehle login karein. Approve hone ke baad photo sabko dikhegi.");
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
        setError(err?.message || "Upload failed.");
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
          setMessage("Upload ho gaya! Admin approve karega tab sabko dikhega.");
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
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteObject(storageRef(storage, item.path)).catch(() => {});
      await deleteDoc(doc(db, "gallery", item.id));
      setter((prev) => prev.filter((f) => f.id !== item.id));
      if (setter === mine) loadFiles();
    } catch (err) {
      setError(err?.message || "Delete failed.");
    }
  };

  const canDelete = (item) => isAdmin || (user && item.uid === user.uid);

  return (
    <div>
      <h1 className="text-gradient">Image Gallery</h1>
      <p>Photo upload karein — admin approve karega tabhi public gallery me dikhegi.</p>

      <div style={{ marginTop: 20 }} className="card">
        <label className="label">Upload Image (login zaroori)</label>
        <div className="dropzone" onClick={() => document.getElementById("file-input").click()}>
          <p>Click to select an image to upload</p>
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
          <h3>Meri Uploads (pending / approved)</h3>
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
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Approved Gallery ({files.length})</h3>
          <button className="btn secondary" onClick={loadFiles} disabled={loading}>Refresh</button>
        </div>
        {loading && <div className="spinner" />}
        {!loading && files.length === 0 && <p>Abhi koi approved photo nahi hai.</p>}
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
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
