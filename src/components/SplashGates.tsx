import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SplashGatesProps {
  onReveal: () => void;
}

export default function SplashGates({ onReveal }: SplashGatesProps) {
  useEffect(() => {
    // Fail-safe: Reveal site after 5 seconds if video is stuck
    const timer = setTimeout(() => {
      onReveal();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onReveal]);

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
        onEnded={onReveal}
        onError={() => onReveal()}
      >
        <source src="/gates.mp4" type="video/mp4" />
      </video>
    </motion.div>
  );
}
