import { motion } from "motion/react";
import { MapPin, Sparkles, Shirt, Compass, Heart, Gift } from "lucide-react";
import { TimelineEvent, EventDetails as EventDetailsType } from "../types";

export default function EventAndTimeline() {
  const events: EventDetailsType[] = [
    {
      title: "The Solemn Ceremony",
      date: "Saturday, July 18, 2026",
      time: "5:00 PM – 6:00 PM",
      venueName: "The Secret Garden Pavilion",
      address: "9875 Carmel Mansion Dr, Beverly Hills, CA 90210",
      attire: "Formal Black Tie / Elegant Tuxedos & Floor-length Gowns (Champagne and pastel theme)",
      gmapsUrl: "https://maps.google.com/?q=9875+Carmel+Mansion+Dr,+Beverly+Hills,+CA+90210"
    },
    {
      title: "The Grand Reception",
      date: "Saturday, July 18, 2026",
      time: "7:00 PM – 11:30 PM",
      venueName: "The Grand Gilded Ballroom",
      address: "9875 Carmel Mansion Dr, Beverly Hills, CA 90210",
      attire: "Formal Black Tie / Elegant Tuxedos & Floor-length Gowns (Champagne and pastel theme)",
      gmapsUrl: "https://maps.google.com/?q=9875+Carmel+Mansion+Dr,+Beverly+Hills,+CA+90210"
    }
  ];

  const timeline: TimelineEvent[] = [
    {
      time: "4:30 PM",
      title: "Welcome & Ambient Tea",
      description: "Guests arrive at the Garden Pavilion. Soft classical string quartets and warm welcome refreshments are served.",
      icon: "Ambient"
    },
    {
      time: "5:00 PM",
      title: "The Wedding Vows (Nikkah)",
      description: "Under the blossom arch, Farah and Omar exchanges vows, solemnizing their lifelong promise.",
      icon: "Ceremony"
    },
    {
      time: "6:15 PM",
      title: "Twilight Cocktail Hour",
      description: "Sip on signature mocktails and canapés on the sunset terrace. A perfect opportunity for photos and greetings.",
      icon: "Toast"
    },
    {
      time: "7:30 PM",
      title: "Grand Ballroom Entrance",
      description: "Welcome the newly wed couples with a grand entrance, followed by the first dance and emotional bridal toasts.",
      icon: "Dance"
    },
    {
      time: "8:15 PM",
      title: "Elysian Feast & Dinner",
      description: "A seated multi-course luxury dinner featuring custom fusion culinary options and romantic backing harp music.",
      icon: "Feast"
    },
    {
      time: "9:30 PM",
      title: "Cake Cutting & Sweet Delights",
      description: "The sweet cutting ceremony, followed by gourmet dessert layouts, coffee stations, and dancing.",
      icon: "Slice"
    },
    {
      time: "11:30 PM",
      title: "Sparkler Send-off",
      description: "Gather with golden sparklers outside the mansion facade to bid a spectacular farewell to Farah and Omar.",
      icon: "Spark"
    }
  ];

  return (
    <section id="event-timeline" className="py-24 px-6 bg-[#FDFBF7] text-[#2A2825] relative overflow-hidden">
      <div className="absolute inset-4 border border-[#C5A03E]/10 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- EVENT DETAILS SECTION --- */}
        <div className="mb-24 text-center">
          <div className="mb-10">
            <span className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-2 block">
              Where & When
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2825] tracking-wide">
              Event Details
            </h2>
            <div className="w-16 h-[1px] bg-[#C5A03E] mx-auto mt-4 opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {events.map((evt, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: idx * 0.2 }}
                className="bg-white border border-[#EFE3C3] p-8 rounded shadow-md relative group overflow-hidden"
              >
                {/* Tiny gold accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A03E] opacity-75" />
                <div className="absolute inset-1 border border-[#C5A03E]/5 pointer-events-none group-hover:border-[#C5A03E]/20 transition-all duration-300" />

                <h3 className="font-serif text-xl text-[#8E702D] font-semibold mb-4 tracking-wide">
                  {evt.title}
                </h3>

                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-4 h-4 text-[#C5A03E] mt-1 flex-shrink-0" />
                  <div className="font-sans text-xs">
                    <p className="font-semibold text-[#2A2825]">{evt.date}</p>
                    <p className="text-gray-500 mt-0.5">{evt.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-4 h-4 text-[#C5A03E] mt-1 flex-shrink-0" />
                  <div className="font-sans text-xs">
                    <p className="font-semibold text-[#2A2825]">{evt.venueName}</p>
                    <p className="text-gray-500 mt-0.5 leading-relaxed">{evt.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <Shirt className="w-4 h-4 text-[#C5A03E] mt-1 flex-shrink-0" />
                  <div className="font-sans text-xs">
                    <p className="font-semibold text-[#2A2825]">Attire Guidelines</p>
                    <p className="text-gray-500 mt-0.5 leading-relaxed">{evt.attire}</p>
                  </div>
                </div>

                <a 
                  href={evt.gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-2 border border-[#C5A03E] bg-amber-50/20 hover:bg-[#C5A03E] hover:text-[#FDFBF7] text-[#8E702D] py-2.5 rounded font-cinzel text-[10px] tracking-widest uppercase transition-all duration-300 shadow-sm"
                >
                  <Compass className="w-3.5 h-3.5" />
                  View Location Map
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- SCHEDULE TIMELINE SECTION --- */}
        <div className="text-center">
          <div className="mb-14">
            <span className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-2 block">
              Wedding Itinerary
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2825] tracking-wide">
              The Celebration Schedule
            </h2>
            <div className="w-16 h-[1px] bg-[#C5A03E] mx-auto mt-4 opacity-50" />
          </div>

          <div className="relative mt-12 pl-6 md:pl-0">
            {/* Center Timeline line in desktop, side line on mobile */}
            <div className="absolute top-0 bottom-0 left-[26px] md:left-1/2 w-[1px] bg-[#C5A03E]/30" />

            {timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className={`relative mb-12 flex flex-col md:flex-row md:items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Time Indicator column */}
                <div className="w-full md:w-1/2 pr-0 md:pr-12 md:text-right flex items-center md:justify-end gap-x-4 mb-2 md:mb-0">
                  <span className={`font-cinzel text-xs font-bold tracking-widest text-[#C5A03E] bg-[#FAF6EE] px-3 py-1 rounded border border-[#EFE3C3]/50 shadow-sm ${idx % 2 === 1 ? 'md:order-last md:-mr-4' : ''}`}>
                    {item.time}
                  </span>
                </div>

                {/* Central Circle Pin */}
                <div className="absolute left-[8px] md:left-1/2 md:-translate-x-1/2 z-10 w-9 h-9 rounded-full bg-[#FDFBF7] border-2 border-[#C5A03E] flex items-center justify-center text-xs shadow-sm">
                  <span className="text-[#8E702D] font-bold">⚜</span>
                </div>

                {/* Description column */}
                <div className="w-full md:w-1/2 pl-12 md:pl-12 text-left">
                  <div className="bg-white/70 border border-[#EFE3C3]/60 p-5 rounded shadow-sm hover:border-[#C5A03E]/40 transition-colors">
                    <h4 className="font-serif text-base text-[#2A2825] font-semibold mb-1">
                      {item.title}
                    </h4>
                    <p className="font-sans text-xs text-gray-500 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
