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
    
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.warn("Unmuted play blocked. Attempting muted.", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch((playErr) => {
            console.error("Muted playback failed:", playErr);
            handleEnded();
          });
        }
      });
    }

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

  const getAssetUrl = (filename: string) => {
    const path = window.location.pathname;
    let dir = path;
    if (!path.endsWith("/")) {
      const lastPart = path.substring(path.lastIndexOf("/") + 1);
      if (lastPart.includes(".")) {
        dir = path.substring(0, path.lastIndexOf("/"));
      }
    }
    if (!dir.endsWith("/")) {
      dir += "/";
    }
    return `${dir}${filename}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden cursor-pointer select-none"
      onClick={handleTapToPlay}
    >
      {!videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted={!isPlaying}
          playsInline
          webkit-playsinline="true"
          onEnded={handleEnded}
          onError={(e) => {
            console.error("Video load failed.", e);
            setVideoError(true);
            handleEnded();
          }}
        >
          <source src={getAssetUrl("gates.mp4")} type="video/mp4" />
        </video>
      )}
    </motion.div>
  );
}
