import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { doc, getDocFromServer } from "firebase/firestore";
import { db } from "./firebase";

// Importing our modular wedding sections
import SplashGates from "./components/SplashGates";
import HeroSection from "./components/HeroSection";
import CountdownSection from "./components/CountdownSection";
import OurStory from "./components/OurStory";
import EventAndTimeline from "./components/EventAndTimeline";
import CelebrationSchedule from "./components/CelebrationSchedule"; // Added import
import PhotoGallery from "./components/PhotoGallery";
import RSVPForm from "./components/RSVPForm";
import AudioPlayer from "./components/AudioPlayer";

export default function App() {
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
      } catch (error) {
        console.log("Firestore initialization checked.");
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A2825] font-sans overflow-x-hidden selection:bg-[#C5A03E]/20 text-center">
      
      <AnimatePresence mode="wait">
        {!hasRevealed && (
          <SplashGates onReveal={() => setHasRevealed(true)} />
        )}
      </AnimatePresence>

      {hasRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col relative"
        >
          <header className="absolute top-0 left-0 right-0 z-30 h-24 flex items-center justify-between px-6 md:px-12 pointer-events-none">
            <div className="font-cinzel text-sm tracking-[0.3em] font-bold text-white/90">F & O</div>
            <div className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/75 bg-black/10 px-3 py-1 rounded backdrop-blur-[2px]">
              July 18, 2026
            </div>
          </header>

          <main className="flex-1 w-full flex flex-col">
            <HeroSection />
            <CountdownSection />
            <OurStory />
            <EventAndTimeline />
            <CelebrationSchedule /> {/* Integrated after EventAndTimeline */}
            <PhotoGallery />
            <RSVPForm />
          </main>

          <AudioPlayer />

          <footer className="bg-[#1E1C1A] text-white py-14 px-6 border-t border-[#C5A03E]/15 text-center relative">
            <div 
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=1200')`,
                backgroundSize: 'cover',
              }}
            />
            
            <div className="max-w-md mx-auto space-y-4 relative z-10">
              <span className="font-cinzel text-[10px] tracking-[0.35em] text-[#C5A03E] uppercase block">
                Happily Ever After
              </span>
              <h2 className="font-script text-5xl text-amber-50 font-normal leading-tight">
                Farah & Omar
              </h2>
              <p className="font-serif italic text-xs text-gray-400">
                “Two souls with but a single thought, two hearts that beat as one.”
              </p>
              <div className="w-12 h-[1px] bg-[#C5A03E]/40 mx-auto my-3" />
              <p className="text-[9px] text-gray-500 font-sans tracking-wide">
                © 2026 Farah & Omar Wedding. Designed with eternal love.
              </p>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
