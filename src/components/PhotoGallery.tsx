import React, { useState, useEffect } from "react";
import { supabase, WEDDING_SLUG } from "../supabaseClient";

export default function PhotoGallery() {
  const [guestPhotos, setGuestPhotos] = useState<any[]>([]);

  // Fetch photos from Supabase filtered by wedding_slug
  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("wedding_slug", WEDDING_SLUG)
      .eq("approved", true) // Only show approved photos by default
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
        { event: "INSERT", schema: "public", table: "photos" },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {guestPhotos.map((photo) => (
          <div key={photo.id} className="aspect-square border rounded-xl overflow-hidden bg-gray-100 shadow-sm relative group">
            {photo.url && (
              <img
                src={photo.url}
                alt={photo.caption || "Guest photo"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-left opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs font-semibold">{photo.name}</p>
              {photo.caption && <p className="text-[10px] text-gray-200 truncate">{photo.caption}</p>}
            </div>
          </div>
        ))}
        {guestPhotos.length === 0 && (
          <div className="col-span-full py-12 text-sm text-gray-500 italic">
            No photos shared yet. Be the first to share a memory above!
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="mt-16 text-center border-t pt-8 max-w-xl mx-auto">
        <p className="text-sm text-gray-600 mb-2">
          Made with love by EverAfterInvites
        </p>
        <a 
          href="https://www.instagram.com/_everafterinvites_/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block hover:opacity-80 transition-opacity text-[#C5A059]"
        >
          {/* Instagram Logo SVG */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mx-auto"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
      </footer>
    </section>
  );
}
