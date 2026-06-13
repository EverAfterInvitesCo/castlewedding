import { motion } from "motion/react";

export default function OurStory() {
  const chapters = [
    {
      title: "Where It All Began",
      date: "October 14, 2021",
      subtitle: "A London Autumn Greeting",
      description: "It was a crisp golden afternoon in Hyde Park when Farah and Omar's paths first crossed. Farah was hunting for a quiet reading spot under the amber trees, and Omar was searching for his lost sketch directory. A simple recommendation of coffee led to a three-hour conversation, sharing dreams, favorite playlists, and discovering that their childhood homes were just streets apart.",
      // Using the absolute path for GitHub Pages
      image: "/castlewedding/hand.png",
    },
    {
      title: "The Blossoming Chapters",
      date: "May 2023",
      subtitle: "Letters, Flights, and Endures",
      description: "Over written notebooks, long evening walks near the Thames, and flights across oceans, their hearts grew inextricably linked. Together they scaled hills, tasted local bakeries, supported each other's career strides, and realized that home wasn't a static coordinate. Home was anywhere they stood together.",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "The Italian Promise",
      date: "August 24, 2025",
      subtitle: "Amalfi Coast Proposal",
      description: "Under a blanket of twinkling stars on a private balcony overlooking the Amalfi sea, Omar bent down on one knee. With the sound of classical guitar floating in the warm sea breeze, he held out a simple gold ring. Through joyful tears and inexpressible happiness, Farah said yes — beginning their march to Forever.",
      image: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=600",
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.3 } 
    }
  };

  const articleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  };

  return (
    <section 
      id="our-story" 
      className="py-24 px-6 bg-[#FAF6EE] text-[#2A2825] relative overflow-hidden text-center"
    >
      <div className="absolute inset-4 border border-[#C5A03E]/10 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-16">
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-2 block">
            Love Story
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2825] tracking-wide mb-3">
            Our Story
          </h2>
          <span className="font-script text-3xl text-[#B08E35]">A beautiful lifetime ahead</span>
          <div className="w-16 h-[1px] bg-[#C5A03E] mx-auto mt-4 opacity-50" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-16 md:gap-24"
        >
          {chapters.map((chapter, i) => (
            <motion.article 
              key={i} 
              variants={articleVariants}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-14 text-left ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative p-1.5 bg-white border border-[#EFE3C3] rounded shadow-lg overflow-hidden group max-w-sm">
                  <div className="absolute inset-2 border border-[#C5A03E]/10 pointer-events-none group-hover:border-[#C5A03E]/30 transition-all duration-300 z-10" />
                  
                  <div className="w-full aspect-[4/3] rounded overflow-hidden">
                    <img 
                      key={chapter.image}
                      src={chapter.image} 
                      alt={chapter.title} 
                      className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 hover:scale-105 transition-all duration-1000"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <span className="font-cinzel text-[10px] tracking-widest text-[#B08E35] font-semibold uppercase block mb-1">
                  {chapter.date}
                </span>
                
                <h3 className="font-serif text-2xl font-light text-[#2A2825] tracking-wide mb-1">
                  {chapter.title}
                </h3>
                
                <p className="font-serif italic text-xs text-[#8E702D] mb-4">
                  “{chapter.subtitle}”
                </p>
                
                <p className="font-sans text-xs md:text-sm text-gray-600 leading-relaxed font-light">
                  {chapter.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mt-20 px-4 md:px-12 py-10 bg-white/40 border border-[#C5A03E]/15 rounded shadow-sm max-w-2xl mx-auto"
        >
          <p className="font-serif italic text-base md:text-lg text-[#8E702D] leading-relaxed">
            “Love is not about looking at each other, but looking outward together in the same direction.”
          </p>
          <span className="font-cinzel text-[10px] tracking-widest uppercase text-gray-400 mt-4 block">— Antoine de Saint-Exupéry</span>
        </motion.div>
      </div>
    </section>
  );
}
