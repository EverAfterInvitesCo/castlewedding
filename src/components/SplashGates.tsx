import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SplashGatesProps {
  onReveal: () => void;
}

export default function SplashGates({ onReveal }: SplashGatesProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    // Fail-safe: If video takes longer than 6 seconds to load/play, force reveal
    const timer = setTimeout(() => {
      onReveal();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onReveal]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* This video tag is the only thing that should be showing */}
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onCanPlay={() => setIsVideoReady(true)}
        onEnded={onReveal}
        onError={() => onReveal()}
      >
        <source src="/gates.mp4" type="video/mp4" />
      </video>
      
      {!isVideoReady && (
        <div className="text-white absolute font-cinzel tracking-widest text-sm animate-pulse">
          Loading...
        </div>
      )}
    </motion.div>
  );
}
