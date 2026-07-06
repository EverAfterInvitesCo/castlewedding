import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function PhotoGallery() {
  const [guestPhotos, setGuestPhotos] = useState<any[]>([]);

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

    // Set up real-time subscription to update gallery automatically
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
                loading="lazy"
              />
            )}
            <p className="text-xs font-medium p-2 truncate">{photo.uploader_name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
