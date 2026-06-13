import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { doc, getDocFromServer } from "firebase/firestore";
import { db } from "./firebase";

import SplashGates from "./components/SplashGates";
import HeroSection from "./components/HeroSection";
import CountdownSection from "./components/CountdownSection";
import OurStory from "./components/OurStory";
import EventAndTimeline from "./components/EventAndTimeline";
import CelebrationSchedule from "./components/CelebrationSchedule";
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
        console.log("Firestore check completed.");
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A2825] font-sans overflow-x-hidden selection:bg-[#C5A03E]/20 text-center">
      <AnimatePresence mode="wait">
        {!hasRevealed ? (
          <SplashGates key="gates" onReveal={() => setHasRevealed(true)} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            className="flex flex-col relative"
          >
            <main className="flex-1 w-full flex flex-col">
              <HeroSection />
              <CountdownSection />
              <OurStory />
              <EventAndTimeline />
              <CelebrationSchedule />
              <PhotoGallery />
              <RSVPForm />
            </main>
            <AudioPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
