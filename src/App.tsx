import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SplashGates from "./components/SplashGates";
import HeroSection from "./components/HeroSection";
import CountdownSection from "./components/CountdownSection";
import OurStory from "./components/OurStory";
import EventAndTimeline from "./components/EventAndTimeline";
import CelebrationSchedule from "./components/CelebrationSchedule";
import PhotoGallery from "./components/PhotoGallery";
import RSVPForm from "./components/RSVPForm";
import OrganizerPortal from "./components/OrganizerPortal";
import AudioPlayer from "./components/AudioPlayer";

export default function App() {
  const [hasRevealed, setHasRevealed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A2825] font-sans overflow-x-hidden selection:bg-[#C5A03E]/20 text-center">
      <AnimatePresence mode="wait">
        {!hasRevealed ? (
          <motion.div key="gates" exit={{ opacity: 0 }}>
            <SplashGates onReveal={() => setHasRevealed(true)} />
            
            {/* Skip Intro Button */}
            <button
              onClick={() => setHasRevealed(true)}
              className="fixed top-8 right-8 z-50 px-6 py-2 bg-transparent border border-[#C5A03E] text-[#C5A03E] hover:bg-[#C5A03E] hover:text-white transition-all duration-300 font-serif tracking-widest text-sm uppercase"
            >
              Skip Intro
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <main className="flex-1 w-full flex flex-col">
              <HeroSection />
              <CountdownSection />
              <OurStory />
              <EventAndTimeline />
              <CelebrationSchedule />
              <PhotoGallery />
              <RSVPForm />
              <OrganizerPortal />
            </main>
            <AudioPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
