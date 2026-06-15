import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function PhotoGallery() {
  const [guestPhotos, setGuestPhotos] = useState<any[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch photos from Supabase
  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("guest_photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching photos:", error);
    else setGuestPhotos(data || []);
  };

  useEffect(() => {
    fetchPhotos();

    // Set up real-time subscription
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guest_photos" },
        fetchPhotos
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uploaderName.trim()) {
      alert("Please select a file and enter your name.");
      return;
    }

    setIsUploading(true);

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("guest-photos")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Failed to upload image to storage.");
      setIsUploading(false);
      return;
    }

    // 2. Get the Public URL
    const { data: publicUrlData } = supabase.storage
      .from("guest-photos")
      .getPublicUrl(fileName);

    // 3. Save reference to Database
    const { error: dbError } = await supabase.from("guest_photos").insert([
      {
        uploader_name: uploaderName,
        caption: caption,
        image_url: publicUrlData.publicUrl,
      },
    ]);

    if (dbError) {
      console.error("Database error:", dbError);
      alert("Failed to save photo info.");
    } else {
      setUploaderName("");
      setCaption("");
      setFile(null);
      alert("Photo shared successfully!");
    }
    setIsUploading(false);
  };

  return (
    <section className="py-24 px-6 bg-[#FDFBF7] text-[#2A2825]">
      <h2 className="text-3xl font-serif mb-8 text-center">Guest Photo Gallery</h2>
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {guestPhotos.map((photo) => (
          <div key={photo.id} className="aspect-square border overflow-hidden bg-gray-100">
            {photo.image_url && (
              <img
                src={photo.image_url}
                alt={photo.caption || "Guest photo"}
                className="w-full h-full object-cover"
              />
            )}
            <p className="text-xs font-medium p-2 truncate">{photo.uploader_name}</p>
          </div>
        ))}
      </div>

      {/* Upload Form */}
      <form
        onSubmit={handlePhotoUpload}
        className="mt-12 p-6 border rounded-lg max-w-md mx-auto bg-white shadow-sm"
      >
        <h3 className="text-xl font-serif mb-4">Share your photos</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
        />
        <input
          placeholder="Your Name"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          className="block w-full mb-2 p-2 border rounded"
        />
        <input
          placeholder="Caption (Optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
        />
        <button
          disabled={isUploading}
          className="w-full bg-[#2A2825] text-white py-2 rounded hover:bg-black transition-colors"
        >
          {isUploading ? "Uploading..." : "Share Photo"}
        </button>
      </form>
    </section>
  );
}
