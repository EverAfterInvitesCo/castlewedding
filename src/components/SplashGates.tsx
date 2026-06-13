import { useState } from "react";
import { motion } from "motion/react";

interface SplashGatesProps {
  onReveal: () => void;
}

export default function SplashGates({ onReveal }: SplashGatesProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0 }}
    >
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onLoadedData={() => setVideoLoaded(true)}
        onEnded={onReveal}
        onError={() => onReveal()}
      >
        <source src="/gates.mp4" type="video/mp4" />
      </video>
      
      {!videoLoaded && (
        <div className="text-white absolute">Loading...</div>
      )}
    </motion.div>
  );
}
