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

    // Retrieve dynamically and setup real-time listener
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
      // Fail silently to the console but don't crash
    });

    return () => unsubscribe();
  }, []);

  // Compress photo function using canvas
  const processAndResizePhoto = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimension 550px to keep base64 string small (~30KB-40KB) for quick uploads
          const MAX_DIM = 550;
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

          // Render as JPEG with medium-high compression quality
          const dataUrl = canvas.toDataURL("image/jpeg", 0.72);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Unable to parse image layout"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Unable to read image file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadError(null);
      
      // Standard image validation
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select a valid image file");
        return;
      }

      try {
        const preview = URL.createObjectURL(file);
        setPreviewUri(preview);
        
        setIsUploading(true);
        const compressed = await processAndResizePhoto(file);
        setCompressedUri(compressed);
      } catch (err) {
        setUploadError("Failed to process image. Try a different photo.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadError(null);
      
      if (!file.type.startsWith("image/")) {
        setUploadError("Please drop an image file");
        return;
      }

      try {
        const preview = URL.createObjectURL(file);
        setPreviewUri(preview);

        setIsUploading(true);
        const compressed = await processAndResizePhoto(file);
        setCompressedUri(compressed);
      } catch (err) {
        setUploadError("Failed to process image. Try another.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploaderName.trim()) {
      setUploadError("Please provide your name");
      return;
    }

    if (!compressedUri) {
      setUploadError("Please select or drop a photo first");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const path = "guestPhotos";
    try {
      const photoRef = doc(collection(db, path));
      const photoId = photoRef.id;

      const photoDoc = {
        uploaderName: uploaderName.trim(),
        imageUri: compressedUri,
        caption: caption.trim() || null,
        likes: 0,
        createdAt: new Date() // Evaluates request.time in firestore rules
      };

      await setDoc(photoRef, photoDoc);

      setUploadSuccess(true);
      // Switch immediately to Guest Moments wall to let them see their picture at the top!
      setActiveTab("guest");
      setTimeout(() => {
        closeUploadState();
      }, 2000);
    } catch (err) {
      console.error("Firestore photos setting failed:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, `${path}/[generatedId]`);
      } catch (formattedErr) {
        setUploadError("Permission denied or storage error writing data.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const closeUploadState = () => {
    setUploaderName("");
    setCaption("");
    setPreviewUri(null);
    setCompressedUri(null);
    setUploadSuccess(false);
    setUploadError(null);
    setShowUploadModal(false);
  };

  // Safe client-side increment likes
  const handleLikePhoto = async (photoId: string, currentLikes: number) => {
    const docPath = `guestPhotos/${photoId}`;
    try {
      const photoRef = doc(db, "guestPhotos", photoId);
      // Increment atomically as required by rules: incoming().likes == existing().likes + 1
      await updateDoc(photoRef, {
        likes: increment(1)
      });
    } catch (err) {
      console.error("Liking failed:", err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, docPath);
      } catch (e) {
        // Handle gracefully, might hit rule barriers if liking multiple times
      }
    }
  };

  return (
    <section id="photo-gallery" className="py-24 px-6 bg-[#FDFBF7] text-[#2A2825] relative overflow-hidden">
      <div className="absolute inset-4 border border-[#C5A03E]/10 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Gallery Headings */}
        <div className="text-center mb-14">
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-2 block">
            Memory Archive
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2825] tracking-wide mb-3">
            Wedding Gallery
          </h2>
          <div className="w-16 h-[1px] bg-[#C5A03E] mx-auto mt-4 opacity-50" />
        </div>

        {/* Dynamic Navigation Tabs and Upload Camera Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-[#EFE3C3]/40">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("curated")}
              className={`px-5 py-2 font-cinzel text-[11px] tracking-wider uppercase border rounded transition-all duration-300 pointer-events-auto cursor-pointer ${
                activeTab === "curated"
                  ? 'border-[#C5A03E] bg-[#FAF6EE] text-[#8E702D] font-semibold'
                  : 'border-transparent text-gray-500 hover:text-[#2A2825]'
              }`}
            >
              Curated Memories
            </button>
            <button
              onClick={() => setActiveTab("guest")}
              className={`px-5 py-2 font-cinzel text-[11px] tracking-wider uppercase border rounded transition-all duration-300 relative pointer-events-auto cursor-pointer ${
                activeTab === "guest"
                  ? 'border-[#C5A03E] bg-[#FAF6EE] text-[#8E702D] font-semibold'
                  : 'border-transparent text-gray-500 hover:text-[#2A2825]'
              }`}
            >
              Guest Moments ({guestPhotos.length})
              {guestPhotos.length > 0 && (
                <span className="absolute -top-1.5 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-[#C5A03E] hover:bg-[#8E702D] text-white px-5 py-2.5 rounded font-cinzel text-[10px] tracking-widest uppercase transition-colors shadow-sm cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Upload Your Photos
          </button>
        </div>

        {/* --- GRID GALLERY CONTENT --- */}
        <AnimatePresence mode="wait">
          {activeTab === "curated" ? (
            <motion.div
              key="curated-memories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
            >
              {curatedPhotos.map((photo, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="bg-white border border-[#EFE3C3] p-1.5 sm:p-2.5 rounded shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-2 sm:inset-3 border border-[#C5A03E]/5 pointer-events-none group-hover:border-[#C5A03E]/20 transition-all duration-300 z-10" />
                  
                  <div className="overflow-hidden aspect-square sm:aspect-[3/4] bg-gray-50 relative rounded">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 pointer-events-none select-none"
                    />
                  </div>
                  <div className="mt-2 text-center px-0.5">
                    <p className="font-serif italic text-[10px] sm:text-xs text-[#8E702D] truncate">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="guest-memories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {guestPhotos.length === 0 ? (
                <div className="text-center py-20 px-6 border border-dashed border-[#C5A03E]/20 rounded bg-white">
                  <Camera className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-serif text-lg text-gray-700">No photos uploaded yet</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Be the first to capture a wonderful memory of Farah and Omar! Tap the upload button above to add yours.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {guestPhotos.map((photo, index) => (
                    <div 
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className="bg-white border border-[#EFE3C3] p-1.5 rounded shadow-sm relative group overflow-hidden flex flex-col justify-between cursor-pointer"
                    >
                      <div className="absolute inset-1.5 border border-[#C5A03E]/5 pointer-events-none group-hover:border-[#C5A03E]/15 transition-all duration-300 z-10" />
                      
                      <div className="overflow-hidden aspect-square sm:aspect-[4/5] bg-gray-100 relative rounded">
                        <img
                          src={photo.imageUri}
                          alt={photo.caption || "Guest Moments"}
                          className="w-full h-full object-cover pointer-events-none select-none"
                        />
                      </div>

                      {/* Photo details & Like button */}
                      <div className="p-2 sm:p-3 text-left">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-serif text-[10px] sm:text-[11px] font-semibold text-gray-800 tracking-wide inline-block truncate max-w-[70%]">
                            {photo.uploaderName}
                          </span>
                          
                          {/* Interactive Like action */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePhoto(photo.id, photo.likes);
                            }}
                            className="flex items-center gap-0.5 sm:gap-1 text-gray-400 hover:text-red-500 transition-colors pointer-events-auto cursor-pointer"
                          >
                            <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 hover:scale-110 active:scale-95 transition-transform" />
                            <span className="text-[9px] sm:text-[10px] font-mono text-gray-500">{photo.likes}</span>
                          </button>
                        </div>
                        
                        {photo.caption && (
                          <p className="font-sans text-[9px] sm:text-[10px] text-gray-500 italic leading-snug line-clamp-1">
                            "{photo.caption}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- LIVE STATS BAR --- */}
        <div className="mt-14 p-6 bg-[#FAF6EE] text-[#8E702D] border border-[#C5A03E]/15 max-w-lg mx-auto rounded flex items-center justify-center gap-3 text-center">
          <HeartHandshake className="w-5 h-5 text-[#C5A03E] flex-shrink-0 animate-pulse" />
          <p className="font-sans text-xs italic">
            Thank you for helping us harvest and preserve every joyful glance and beautiful smile from our wedding.
          </p>
        </div>

        {/* --- UPLOAD DIALOG OVERLAY --- */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white border border-[#C5A03E] w-full max-w-md rounded shadow-2xl relative overflow-hidden flex flex-col"
              >
                {/* Thin inner gold frame */}
                <div className="absolute inset-1.5 border border-[#C5A03E]/10 pointer-events-none" />

                {/* Header */}
                <div className="p-5 border-b border-[#EFE3C3]/50 flex justify-between items-center bg-[#FAF6EE] z-10">
                  <div className="flex items-center gap-2 text-[#8E702D]">
                    <Camera className="w-4 h-4" />
                    <h3 className="font-cinzel text-xs tracking-wider uppercase font-semibold">Share Your Photo</h3>
                  </div>
                  <button 
                    onClick={closeUploadState} 
                    className="p-1 rounded-full text-gray-400 hover:text-[#2A2825] transition-colors focus:outline-none pointer-events-auto cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form / Upload Panel */}
                <form onSubmit={handlePhotoUpload} className="p-6 space-y-4">
                  
                  {/* Photo drop/select zone */}
                  {!previewUri ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileSelect}
                      className={`h-40 border-2 border-dashed rounded flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors ${
                        isDragActive 
                          ? 'border-[#C5A03E] bg-[#FAF6EE]' 
                          : 'border-gray-200 hover:border-[#C5A03E]/40'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Upload className="w-7 h-7 text-gray-400 mb-2 group-hover:text-[#C5A03E]" />
                      <span className="font-serif text-sm text-gray-600">Choose or Drag Your Photo</span>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-cinzel">JPG, PNG, WEBP</span>
                    </div>
                  ) : (
                    <div className="relative h-44 rounded overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-[#C5A03E]/80 border-t-[#C5A03E] rounded-full animate-spin" />
                          <span className="text-[10px] font-cinzel tracking-wider text-gray-400">Processing...</span>
                        </div>
                      ) : (
                        <>
                          <img 
                            src={previewUri} 
                            alt="Uploader preview" 
                            className="h-full w-full object-cover opacity-90"
                          />
                          <button
                            type="button"
                            onClick={() => { setPreviewUri(null); setCompressedUri(null); }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors pointer-events-auto cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Metadata inputs */}
                  <div className="space-y-3.5 text-left">
                    <div className="flex flex-col">
                      <label htmlFor="uploader-input" className="font-cinzel text-[9px] tracking-wider uppercase text-gray-500 mb-1 font-semibold">Your Name *</label>
                      <input
                        id="uploader-input"
                        type="text"
                        required
                        value={uploaderName}
                        onChange={(e) => setUploaderName(e.target.value)}
                        placeholder="e.g. Juliet Henderson"
                        className="w-full text-xs p-2.5 bg-[#FDFBF7] border border-gray-200 rounded outline-none focus:ring-1 focus:ring-[#C5A03E] focus:border-[#C5A03E] placeholder-gray-400"
                      />
                    </div>

                    <div className="flex flex-col font-sans">
                      <label htmlFor="caption-input" className="font-cinzel text-[9px] tracking-wider uppercase text-gray-500 mb-1 font-semibold">Caption / Note (Optional)</label>
                      <input
                        id="caption-input"
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="e.g. Gorgeous couple! So happy to be here."
                        className="w-full text-xs p-2.5 bg-[#FDFBF7] border border-gray-200 rounded outline-none focus:ring-1 focus:ring-[#C5A03E] focus:border-[#C5A03E] placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Errors */}
                  {uploadError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-[11px] leading-relaxed">
                      {uploadError}
                    </div>
                  )}

                  {/* Success Screen embedded */}
                  {uploadSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Photo posted to the Guest Wall!</span>
                    </div>
                  )}

                  {/* Upload Trigger Button */}
                  <button
                    type="submit"
                    disabled={isUploading || uploadSuccess || !previewUri}
                    className="w-full bg-[#C5A03E] text-white hover:bg-[#8E702D] disabled:bg-gray-200 py-3 rounded font-cinzel text-[10px] tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Poster to Live Wall
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- LIGHTBOX MODAL --- */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && activePhotos[selectedPhotoIndex] && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 select-none">
              
              {/* Top bar with counter, author, and close button */}
              <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex items-center justify-between text-white bg-gradient-to-b from-black/60 to-transparent z-10 font-sans">
                <div className="text-left">
                  <p className="text-xs uppercase font-cinzel tracking-wider text-[#F3E8C1]">
                    {activePhotos[selectedPhotoIndex].uploaderName}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {selectedPhotoIndex + 1} of {activePhotos.length}
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="p-2 md:p-3 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white cursor-pointer pointer-events-auto"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="relative w-full max-w-4xl h-[70vh] md:h-[80vh] flex items-center justify-center">
                
                {/* Navigation Left */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) =>
                      prev !== null ? (prev - 1 + activePhotos.length) % activePhotos.length : null
                    );
                  }}
                  className="absolute left-2 md:left-4 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white transition-colors cursor-pointer pointer-events-auto z-20"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                {/* Animated Image Wrapper */}
                <motion.div
                  key={selectedPhotoIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex items-center justify-center p-2"
                >
                  <img
                    src={activePhotos[selectedPhotoIndex].url}
                    alt={activePhotos[selectedPhotoIndex].caption || "Wedding gallery photo"}
                    className="max-w-full max-h-full object-contain rounded-sm shadow-xl select-none"
                    draggable={false}
                  />
                </motion.div>

                {/* Navigation Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) =>
                      prev !== null ? (prev + 1) % activePhotos.length : null
                    );
                  }}
                  className="absolute right-2 md:right-4 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white transition-colors cursor-pointer pointer-events-auto z-20"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>

              {/* Bottom Caption bar */}
              {activePhotos[selectedPhotoIndex].caption && (
                <div className="mt-4 max-w-xl text-center px-6 py-3 bg-white/5 backdrop-blur-xs rounded-full border border-white/10 z-10 inline-block">
                  <p className="text-xs md:text-sm font-serif italic text-[#F3E8C1] leading-relaxed">
                    "{activePhotos[selectedPhotoIndex].caption}"
                  </p>
                </div>
              )}

              {/* Tap backdrop to close clue (visible on desktop) */}
              <div 
                className="absolute inset-0 -z-10" 
                onClick={() => setSelectedPhotoIndex(null)}
              />
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
