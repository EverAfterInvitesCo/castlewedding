import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/castlewedding/Couple.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-[#FDFBF7]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-xl flex flex-col items-center">
        <h2 className="font-script text-6xl md:text-7xl lg:text-8xl text-white font-normal drop-shadow-sm mb-2 select-none">
          Farah and Omar
        </h2>
        {/* The text line has been removed from here */}
        <div className="w-12 h-[1px] bg-[#C5A03E] my-4 opacity-60" />
        <p className="font-serif italic text-white/85 font-normal text-sm md:text-base max-w-xs drop-shadow-sm">
          Save the Date for our most beautiful chapter yet
        </p>
      </div>
      
      <div className="absolute bottom-10 z-10 flex flex-col items-center cursor-pointer select-none">
        <ChevronDown className="w-5 h-5 text-[#C5A03E] animate-bounce" />
      </div>
    </motion.section>
  );
}
