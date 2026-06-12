import React, { useState, useRef } from "react";
import { motion } from "motion/react";

interface SplashGatesProps {
  onReveal: () => void;
}

export default function SplashGates({ onReveal }: SplashGatesProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTapToPlay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Unmute, reset to the starting frame, disable looping, and play the entry video
    if (videoRef.current) {
      videoRef.current.loop = false;
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.warn("Unmuted play blocked by browser. Attempting muted play.", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch((playErr) => {
            console.error("Muted playback failed:", playErr);
            handleEnded();
          });
        }
      });
    }

    // Safety timeout: automatically transition after 15 seconds if the video gets stuck or is blocked
    fallbackTimeoutRef.current = setTimeout(() => {
      handleEnded();
    }, 15000);
  };

  const handleEnded = () => {
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onReveal();
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
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden cursor-pointer select-none"
      onClick={handleTapToPlay}
    >
      {/* Immersive Entry Background Video (gates.mp4) */}
      {!videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop={!isPlaying}
          muted={!isPlaying}
          playsInline
          webkit-playsinline="true"
          onEnded={handleEnded}
          onError={(e) => {
            console.error("Gates video load failed. Highlighting fallback transitioning.", e);
            setVideoError(true);
            handleEnded();
          }}
        >
          <source src={getAssetUrl("gates.mp4")} type="video/mp4" />
          <source src={getAssetUrl("Gates.mp4")} type="video/mp4" />
        </video>
      )}
    </motion.div>
  );
}
