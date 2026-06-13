import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function CountdownSection() {
  // Target Date: Saturday, July 18, 2026 at 5:00 PM
  const targetDate = new Date("2026-07-18T17:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section 
      id="date-countdown" 
      className="py-24 px-6 bg-[#FDFBF7] text-[#2A2825] relative overflow-hidden flex flex-col items-center justify-center border-b border-[#EFE3C3]/50"
    >
      {/* Ornamental Floral background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=1200')`, // Delicate white leaf/roses texture
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Frame boundary */}
      <div className="absolute top-12 bottom-12 left-6 right-6 border border-[#C5A03E]/10 pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center"
      >
        {/* Scroll Anchor Ornament */}
        <motion.div variants={itemVariants} className="font-serif text-[#C5A03E] text-2xl mb-4">
          ✦ ─── ⚜ ─── ✦
        </motion.div>

        {/* Cinematic Header */}
        <motion.h4 
          variants={itemVariants}
          className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-2"
        >
          The Royal Invitation
        </motion.h4>

        <motion.h2 
          variants={itemVariants}
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2825] tracking-wide mb-8"
        >
          July 18, 2026
        </motion.h2>

        {/* Date and Location Badges */}
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-14"
        >
          <div className="bg-white/50 backdrop-blur-sm border border-[#EFE3C3] p-6 rounded flex flex-col items-center">
            <Calendar className="w-6 h-6 text-[#C5A03E] mb-3" />
            <span className="font-cinzel text-xs tracking-wider uppercase text-gray-500 mb-1">Date</span>
            <span className="font-serif text-base font-semibold text-[#2A2825]">Saturday, July 18</span>
            <span className="text-xs text-gray-400 mt-1">Starting at 5:00 PM</span>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border border-[#EFE3C3] p-6 rounded flex flex-col items-center">
            <Clock className="w-6 h-6 text-[#C5A03E] mb-3" />
            <span className="font-cinzel text-xs tracking-wider uppercase text-gray-500 mb-1">Countdown</span>
            <span className="font-serif text-base font-semibold text-[#2A2825]">
              {timeLeft.isOver ? "Happily Married!" : `${timeLeft.days} Days Left`}
            </span>
            <span className="text-xs text-gray-400 mt-1">To the Ceremony</span>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border border-[#EFE3C3] p-6 rounded flex flex-col items-center">
            <MapPin className="w-6 h-6 text-[#C5A03E] mb-3" />
            <span className="font-cinzel text-xs tracking-wider uppercase text-gray-500 mb-1">Venue</span>
            <span className="font-serif text-base font-semibold text-[#2A2825] px-1 line-clamp-1 block">The Nile Palace</span>
            <span className="text-xs text-gray-400 mt-1">Zamalek,Cairo</span>
          </div>
        </motion.div>

        {/* Countdown Timers */}
        {!timeLeft.isOver ? (
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 md:gap-6"
          >
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Mins" },
              { value: timeLeft.seconds, label: "Secs" }
            ].map((unit, index) => (
              <div 
                key={index} 
                className="w-20 h-24 md:w-24 md:h-28 bg-[#FAF6EE] border border-[#C5A03E]/45 p-3 flex flex-col justify-center items-center shadow-lg rounded relative overflow-hidden group"
              >
                {/* Micro gold border inside card */}
                <div className="absolute inset-1.5 border border-[#C5A03E]/10 pointer-events-none group-hover:border-[#C5A03E]/30 transition-all duration-300" />
                
                <span className="text-3xl md:text-4xl font-serif text-[#8E702D] font-light leading-none">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="font-cinzel text-[9px] md:text-[10px] tracking-widest text-[#B08E35] mt-2 uppercase">
                  {unit.label}
                </span>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-[#FAF6EE] border border-[#C5A03E] text-[#8E702D] max-w-md rounded"
          >
            <h3 className="font-serif text-xl mb-1">Happily Ever After</h3>
            <p className="text-xs leading-relaxed text-gray-500 font-sans">
              Farah and Omar's beautiful journey has officially begun! We thank all of our family and friend for their blessings.
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
