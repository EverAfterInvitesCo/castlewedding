import { useState, useRef } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToNext = () => {
    const nextSection = document.getElementById("date-countdown");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Safely resolve the asset path relative to the base URL (handles different trailing slash configurations)
  const getAssetUrl = (filename: string) => {
    const base = import.meta.env.BASE_URL || "./";
    if (base.endsWith("/")) {
      return `${base}${filename}`;
    }
    return `${base}/${filename}`;
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#2D2B28]">
      {/* Immersive Video/Poster background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover animate-fade-in"
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => {
            console.warn("Couple video failed to load, launching artwork fallback.");
            setVideoError(true);
          }}
        >
          <source src={getAssetUrl("Couple.mp4")} type="video/mp4" />
          <source src={getAssetUrl("couple.mp4")} type="video/mp4" />
        </video>

        {/* Sophisticated Dark/Champagne translucent overlay for high contrast text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-[#FDFBF7]" />
        
        {/* Watercolor overlay vignette */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=1200')`,
            backgroundSize: 'cover',
          }}
        />

        {/* Art Backdrop Fallback if video isn't there */}
        {(!videoLoaded || videoError) && (
          <motion.div 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200')`, // Elegant wedding scenery
            }}
          />
        )}
      </div>

      {/* Elegant content floating in front */}
      <div className="relative z-10 text-center px-4 max-w-xl flex flex-col items-center">
        {/* Tiny Laurel Icon or Decorative Ornament */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="mb-6 font-serif text-3xl text-amber-100 opacity-80"
        >
          ❦
        </motion.div>

        {/* Fancy Elegant Typography Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h2 className="font-script text-6xl md:text-7xl lg:text-8xl text-white font-normal drop-shadow-sm mb-2 select-none">
            Farah & Omar
          </h2>

          <h3 className="font-cinzel text-lg md:text-xl text-[#F3E8C1] tracking-[0.25em] font-normal leading-relaxed uppercase select-none mt-2">
            Are Getting Married
          </h3>

          <div className="w-12 h-[1px] bg-[#C5A03E] my-4 opacity-60" />

          <p className="font-serif italic text-white/85 font-normal text-sm md:text-base max-w-xs drop-shadow-sm">
            Save the Date for our most beautiful chapter yet
          </p>
        </motion.div>
      </div>

      {/* Elegant scroll down indicator at bottom */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 z-10 flex flex-col items-center cursor-pointer select-none"
        onClick={scrollToNext}
      >
        <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#C5A03E] uppercase font-semibold mb-2">
          Discover Celebration
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#C5A03E]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
