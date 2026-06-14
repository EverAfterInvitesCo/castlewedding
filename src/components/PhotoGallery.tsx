import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Camera, Upload, X, Check, Image as ImageIcon, Sparkles, HeartHandshake, ChevronLeft, ChevronRight } from "lucide-react";
import { collection, query, orderBy, onSnapshot, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { GuestPhoto } from "../types";

export default function PhotoGallery() {
  const curatedPhotos = [
    { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600", caption: "An Endless Promise" },
    { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600", caption: "Hand In Hand" },
    { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600", caption: "Laughter in October" },
    { url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600", caption: "Shared Glances" }
  ];

  const [guestPhotos, setGuestPhotos] = useState<GuestPhoto[]>([]);
  const [activeTab, setActiveTab] = useState<"curated" | "guest">("curated");
  const [uploaderName, setUploaderName] = useState("");
  const [caption, setCaption] = useState("");
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [compressedUri, setCompressedUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePhotos = activeTab === "curated"
    ? curatedPhotos.map((p) => ({ url: p.url, caption: p.caption, uploaderName: "Curated Collection" }))
    : guestPhotos.map((p) => ({ url: p.imageUri, caption: p.caption || "", uploaderName: `By ${p.uploaderName}` }));

  useEffect(() => {
    const q = query(collection(db, "guestPhotos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photos: GuestPhoto[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        photos.push({ id: docSnap.id, uploaderName: data.uploaderName, imageUri: data.imageUri, caption: data.caption || "", likes: data.likes || 0, createdAt: data.createdAt });
      });
      setGuestPhotos(photos);
    });
    return () => unsubscribe();
  }, []);

  const processAndResizePhoto = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 800;
          let width = img.width, height = img.height;
          if (width > height) { if (width > MAX_DIM) { height = (height * MAX_DIM) / width; width = MAX_DIM; } }
          else { if (height > MAX_DIM) { width = (width * MAX_DIM) / height; height = MAX_DIM; } }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName.trim() || !compressedUri) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const photoRef = doc(collection(db, "guestPhotos"));
      await setDoc(photoRef, {
        uploaderName: uploaderName.trim(),
        imageUri: compressedUri,
        caption: caption.trim() || null,
        likes: 0,
        createdAt: new Date()
      });
      setUploadSuccess(true);
      setActiveTab("guest");
      setTimeout(closeUploadState, 2000);
    } catch (err) {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const closeUploadState = () => {
    setUploaderName(""); setCaption(""); setPreviewUri(null); setCompressedUri(null);
    setUploadSuccess(false); setUploadError(null); setShowUploadModal(false);
  };

  return (
    <section className="py-24 px-6 bg-[#FDFBF7] text-[#2A2825]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center font-serif text-4xl mb-10">Wedding Gallery</h2>
        
        <div className="flex justify-center gap-4 mb-10">
          <button onClick={() => setActiveTab("curated")} className={`px-4 py-2 border ${activeTab === "curated" ? "border-[#C5A03E]" : ""}`}>Curated</button>
          <button onClick={() => setActiveTab("guest")} className={`px-4 py-2 border ${activeTab === "guest" ? "border-[#C5A03E]" : ""}`}>Guest Moments</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(activeTab === "curated" ? curatedPhotos : guestPhotos).map((photo: any, index) => (
            <div key={photo.id || index} onClick={() => setSelectedPhotoIndex(index)} className="aspect-square cursor-pointer overflow-hidden border">
              <img src={photo.url || photo.imageUri} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div className="bg-white p-6 w-full max-w-sm rounded">
              <form onSubmit={handlePhotoUpload}>
                <input type="file" onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    setPreviewUri(URL.createObjectURL(e.target.files[0]));
                    setCompressedUri(await processAndResizePhoto(e.target.files[0]));
                  }
                }} />
                <input placeholder="Name" value={uploaderName} onChange={(e) => setUploaderName(e.target.value)} className="w-full my-2 border p-2" />
                <button type="submit" className="w-full bg-[#C5A03E] text-white p-2">Upload</button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
