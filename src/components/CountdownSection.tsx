import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function CountdownSection() {
  const targetDate = new Date("2026-07-18T17:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
          isOver: false
        });
      }
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <section id="date-countdown" className="py-24 px-6 bg-[#FDFBF7] text-[#2A2825] border-b border-[#EFE3C3]/50">
      <div className="max-w-4xl mx-auto text-center">
        <h4 className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-2">The Royal Invitation</h4>
        <h2 className="font-serif text-3xl md:text-5xl font-light mb-12">July 18, 2026</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Calendar, label: "Date", val: "Saturday, July 18" },
            { icon: Clock, label: "Countdown", val: timeLeft.isOver ? "Happily Married!" : `${timeLeft.days} Days Left` },
            { icon: MapPin, label: "Venue", val: "The Nile Palace, Cairo" }
          ].map((item, i) => (
            <div key={i} className="bg-white/50 border border-[#EFE3C3] p-6 flex flex-col items-center">
              <item.icon className="w-6 h-6 text-[#C5A03E] mb-3" />
              <span className="font-cinzel text-[10px] tracking-wider uppercase text-gray-500 mb-1">{item.label}</span>
              <span className="font-serif text-sm font-semibold">{item.val}</span>
            </div>
          ))}
        </div>

        {!timeLeft.isOver && (
          <div className="flex justify-center gap-4">
            {[timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((v, i) => (
              <div key={i} className="w-20 h-24 bg-[#FAF6EE] border border-[#C5A03E]/45 flex flex-col items-center justify-center">
                <span className="text-3xl font-serif text-[#8E702D]">{String(v).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
