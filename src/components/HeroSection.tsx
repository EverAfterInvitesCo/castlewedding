import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToNext = () => {
    const nextSection = document.getElementById("date-countdown");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Immersive Video background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          {/* Using the exact path to your file in the public folder */}
          <source src="/Couple.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-[#FDFBF7]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-xl flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="mb-6 font-serif text-3xl text-amber-100 opacity-80"
        >
          ❦
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h2 className="font-script text-6xl md:text-7xl lg:text-8xl text-white font-normal drop-shadow-sm mb-2 select-none">
            Farah and Omar
          </h2>
          <h3 className="font-cinzel text-md md:text-lg text-[#F3E8C1] tracking-[0.2em] font-normal leading-relaxed uppercase select-none mt-2 max-w-md">
            Are getting married over it
          </h3>
          <div className="w-12 h-[1px] bg-[#C5A03E] my-4 opacity-60" />
          <p className="font-serif italic text-white/85 font-normal text-sm md:text-base max-w-xs drop-shadow-sm">
            Save the Date for our most beautiful chapter yet
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 z-10 flex flex-col items-center cursor-pointer select-none"
        onClick={scrollToNext}
      >
        <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#C5A03E] uppercase font-semibold mb-2">
          Discover Celebration
        </span>
        <ChevronDown className="w-5 h-5 text-[#C5A03E]" />
      </motion.div>
    </section>
  );
}
