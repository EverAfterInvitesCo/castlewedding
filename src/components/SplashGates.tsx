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
    </motion.div>
  );
}
