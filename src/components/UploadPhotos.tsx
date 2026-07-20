import { useState } from "react";
import { supabase, WEDDING_SLUG } from "../supabaseClient";
import { Upload } from "lucide-react";

export default function UploadPhotos() {
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    // Upload to Supabase Storage with slug prefix
    const filePath = `${WEDDING_SLUG}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
    } else {
      const { data: publicURLData } = supabase.storage
        .from('gallery')
        .getPublicUrl(data.path);

      // Save reference to DB with wedding_slug
      await supabase.from('photos').insert([{ 
        wedding_slug: WEDDING_SLUG,
        url: publicURLData.publicUrl || data.path, 
        name, 
        caption,
        approved: false 
      }]);
      alert("Photo shared successfully!");
      setFile(null);
      setName("");
      setCaption("");
    }
    setUploading(false);
  };

  return (
    <section className="py-10 px-6 max-w-lg mx-auto">
      <div className="bg-white rounded-2xl p-8 border border-[#F3EBDD] shadow-sm">
        <h3 className="font-serif text-2xl text-[#2A2825] mb-6">Share your photos</h3>
        <div className="space-y-4">
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-[#FAF6EE] file:text-[#C5A059]" 
          />
          <input 
            type="text" 
            placeholder="Your Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-3 border rounded-xl" 
          />
          <input 
            type="text" 
            placeholder="Caption (Optional)" 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            className="w-full p-3 border rounded-xl" 
          />
          <button 
            onClick={handleUpload} 
            disabled={uploading || !file} 
            className="w-full py-3 bg-[#2A2825] text-white rounded-xl font-semibold text-xs hover:bg-black transition-all"
          >
            {uploading ? "Sharing..." : "Share Photo"}
          </button>
        </div>
      </div>
    </section>
  );
}
