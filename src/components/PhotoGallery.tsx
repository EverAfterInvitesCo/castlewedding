import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabaseClient"; // Ensure this path matches your setup

export default function PhotoGallery() {
  const [guestPhotos, setGuestPhotos] = useState<any[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [caption, setCaption] = useState("");
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
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guest_photos' }, fetchPhotos)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName.trim()) return;
    
    setIsUploading(true);
    
    // Insert into Supabase
    const { error } = await supabase
      .from("guest_photos")
      .insert([{ uploader_name: uploaderName, caption: caption }]);

    if (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo.");
    } else {
      setUploaderName("");
      setCaption("");
      alert("Photo uploaded successfully!");
    }
    setIsUploading(false);
  };

  return (
    <section className="py-24 px-6 bg-[#FDFBF7] text-[#2A2825]">
      {/* Gallery UI remains the same, but now maps over 'guestPhotos' */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {guestPhotos.map((photo) => (
          <div key={photo.id} className="aspect-square border overflow-hidden">
             {/* Replace with your image display logic */}
             <p>{photo.uploader_name}</p>
          </div>
        ))}
      </div>
      
      <form onSubmit={handlePhotoUpload} className="mt-8">
        <input placeholder="Name" value={uploaderName} onChange={(e) => setUploaderName(e.target.value)} />
        <button disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>
      </form>
    </section>
  );
}
