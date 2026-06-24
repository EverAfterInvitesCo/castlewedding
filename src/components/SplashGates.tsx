import { motion } from "motion/react";

interface SplashGatesProps {
  onReveal: () => void;
}

export default function SplashGates({ onReveal }: SplashGatesProps) {
  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={onReveal}
        onError={onReveal}
      >
        <source src="/castlewedding/gates.mp4" type="video/mp4" />
      </video>

      {/* Skip Button - positioned with high z-index */}
      <div className="absolute top-8 right-8 z-[200]">
        <button
          onClick={onReveal}
          className="px-6 py-2 bg-transparent border border-[#C5A03E] text-[#C5A03E] hover:bg-[#C5A03E] hover:text-white transition-all duration-300 font-serif tracking-widest text-sm uppercase cursor-pointer pointer-events-auto"
        >
          Skip Intro
        </button>
      </div>
    </motion.div>
  );
}
