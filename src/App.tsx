import React from "react";
import HeroSection from "./components/HeroSection";
import CountdownSection from "./components/CountdownSection";
import OurStory from "./components/OurStory";
import EventAndTimeline from "./components/EventAndTimeline";
import CelebrationSchedule from "./components/CelebrationSchedule";
import PhotoGallery from "./components/PhotoGallery";
import RSVPForm from "./components/RSVPForm";
import AudioPlayer from "./components/AudioPlayer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A2825] font-sans overflow-x-hidden selection:bg-[#C5A03E]/20 text-center">
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
    </div>
  );
}
