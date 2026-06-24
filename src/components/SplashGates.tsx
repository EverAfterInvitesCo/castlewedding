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

      {/* Enhanced Luxury Skip Button */}
      <div className="absolute bottom-8 right-8 z-[200]">
        <button
          onClick={onReveal}
          className="px-8 py-3 bg-[#FDFBF7]/10 backdrop-blur-md border border-[#C5A03E] text-[#FDFBF7] hover:bg-[#C5A03E] hover:text-[#2A2825] transition-all duration-500 font-serif tracking-[0.2em] text-sm uppercase shadow-lg hover:shadow-gold-500/50 cursor-pointer"
        >
          Skip Intro
        </button>
      </div>
    </motion.div>
  );
}
