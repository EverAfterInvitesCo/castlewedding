// ... (keep all your imports)

export default function App() {
  const [hasRevealed, setHasRevealed] = useState(false);

  // ... (keep your useEffect)

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
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col relative"
          >
            {/* Header and Main content remain exactly as you had them */}
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
              <CelebrationSchedule />
              <PhotoGallery />
              <RSVPForm />
            </main>

            {/* Moved inside the revealed block to prevent interference */}
            <AudioPlayer />

            <footer className="bg-[#1E1C1A] text-white py-14 px-6 border-t border-[#C5A03E]/15 text-center relative">
               {/* ... footer content ... */}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
