import { useState, useRef } from "react";
import { motion } from "motion/react";

interface SplashGatesProps {
  onReveal: () => void;
}

export default function SplashGates({ onReveal }: SplashGatesProps) {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoInteraction = () => {
    // When the user clicks anywhere, attempt to play
    if (videoRef.current) {
      videoRef.current.muted = false; // Enable sound on click
      videoRef.current.play().catch((err) => {
        console.warn("Playback failed:", err);
      });
    }
  };

  const handleEnded = () => {
    // This is called when the video finishes
    onReveal();
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
      onClick={handleVideoInteraction}
    >
      {!videoError ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted // Must be muted to autoplay in most browsers
          playsInline
          onEnded={handleEnded}
          onError={() => {
            console.error("Video failed to load.");
            setVideoError(true);
            onReveal(); // If video fails, reveal site anyway
          }}
        >
          <source src="/gates.mp4" type="video/mp4" />
        </video>
      ) : (
        // Fallback if video fails to load
        <div className="text-white">Loading...</div>
      )}
    </motion.div>
  );
}
