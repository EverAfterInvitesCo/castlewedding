import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function CountdownSection() {
  const targetDate = new Date("2026-07-18T17:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isOver: false
      });
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section id="date-countdown" className="py-24 px-6 bg-[#FDFBF7] text-[#2A2825] text-center border-b border-[#EFE3C3]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl font-light mb-12">July 18, 2026</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-6 border border-[#EFE3C3] flex flex-col items-center">
            <Calendar className="w-6 h-6 text-[#C5A03E] mb-3" />
            <span className="font-semibold text-[#2A2825]">Saturday, July 18</span>
          </div>
          <div className="bg-white p-6 border border-[#EFE3C3] flex flex-col items-center">
            <Clock className="w-6 h-6 text-[#C5A03E] mb-3" />
            <span className="font-semibold text-[#2A2825]">{timeLeft.isOver ? "Happily Married!" : `${timeLeft.days} Days Left`}</span>
          </div>
          <div className="bg-white p-6 border border-[#EFE3C3] flex flex-col items-center">
            <MapPin className="w-6 h-6 text-[#C5A03E] mb-3" />
            <span className="font-semibold text-[#2A2825]">The Nile Palace</span>
            <span className="text-xs text-gray-500">Zamalek, Cairo</span>
          </div>
        </div>
      </div>
    </section>
  );
}
