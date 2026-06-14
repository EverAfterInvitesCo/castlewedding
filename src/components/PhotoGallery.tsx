import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Camera, Upload, X, Check, Image as ImageIcon, Sparkles, HeartHandshake, ChevronLeft, ChevronRight } from "lucide-react";
import { collection, query, orderBy, onSnapshot, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { GuestPhoto } from "../types";

export default function PhotoGallery() {
  // Hardcoded curated pre-wedding professional photos
  const curatedPhotos = [
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
      caption: "An Endless Promise"
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
      caption: "Hand In Hand"
    },
    {
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600",
      caption: "Laughter in October"
    },
    {
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600",
      caption: "Shared Glances"
    }
  ];

  const [guestPhotos, setGuestPhotos] = useState<GuestPhoto[]>([]);
  const [activeTab, setActiveTab] = useState<"curated" | "guest">("curated");
  
  // Upload State
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

  // Derived list of currently active photos for optimal lightbox viewing
  const activePhotos = activeTab === "curated"
    ? curatedPhotos.map((p) => ({ url: p.url, caption: p.caption, uploaderName: "Curated Collection" }))
    : guestPhotos.map((p) => ({ url: p.imageUri, caption: p.caption || "", uploaderName: `By ${p.uploaderName}` }));

  // Dynamic touch & hotkey navigations for full-screen lightbox experience
  useEffect(() => {
    if (selectedPhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhotoIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) => 
          prev !== null ? (prev - 1 + activePhotos.length) % activePhotos.length : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) => 
          prev !== null ? (prev + 1) % activePhotos.length : null
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, activePhotos.length]);

  // Read guest photos in real-time from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "guestPhotos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photos: GuestPhoto[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        photos.push({
          id: docSnap.id,
          uploaderName: data.uploaderName,
          imageUri: data.imageUri,
          caption: data.caption || "",
          likes: data.likes || 0,
          createdAt: data.createdAt,
        });
      });
      setGuestPhotos(photos);
    }, (err) => {
      console.error("Listening to guestPhotos failed:", err);
    });

    return () => unsubscribe();
  }, []);

  // Process and resize photo function
  const processAndResizePhoto = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 800; // Increased slightly for better clarity
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = (height * MAX_DIM) / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = (width * MAX_DIM) / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.onerror = () => reject(new Error("Image parsing error"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      await handleImageProcessing(file);
    }
  };

  const handleImageProcessing = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }
    try {
      setPreviewUri(URL.createObjectURL(file));
      setIsUploading(true);
      const compressed = await processAndResizePhoto(file);
      setCompressedUri(compressed);
    } catch (err) {
      setUploadError("Failed to process image. Please try another.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = () => setIsDragActive(false);
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) await handleImageProcessing(e.dataTransfer.files[0]);
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName.trim() || !compressedUri) return;

    setIsUploading(true);
    try {
      const photoRef
