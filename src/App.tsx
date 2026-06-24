import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SplashGates from "./components/SplashGates";
import Reveal from "./components/Reveal"; // Make sure this path is correct based on where you saved Reveal.tsx
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
          <SplashGates key="gates" onReveal={() => setHasRevealed(true)} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <main className="flex-1 w-full flex flex-col">
              <Reveal><HeroSection /></Reveal>
              <Reveal><CountdownSection /></Reveal>
              <Reveal><OurStory /></Reveal>
              <Reveal><EventAndTimeline /></Reveal>
              <Reveal><CelebrationSchedule /></Reveal>
              <Reveal><PhotoGallery /></Reveal>
              <Reveal><RSVPForm /></Reveal>
              <Reveal><OrganizerPortal /></Reveal>
            </main>
            <AudioPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
