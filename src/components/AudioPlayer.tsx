import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Corrected path to include your project subfolder for GitHub Pages
    audioRef.current = new Audio("/castlewedding/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setShowTooltip(false);
          })
          .catch((err) => {
            console.log("Playback failed or blocked:", err);
          });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Sound Waves animation */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-end gap-0.5 h-4 px-2 pb-0.5 border border-[#C5A03E]/20 bg-[#FDFBF7]/85 backdrop-blur-[2px] rounded-full"
          >
            {[0.4, 0.9, 0.5, 0.8, 0.3, 0.7].map((height, i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${height * 100}%`, "10%", `${height * 100}%`] }}
                transition={{ repeat: Infinity, duration: 1.2 + i * 0.15, ease: "easeInOut" }}
                className="w-0.5 bg-[#C5A03E] rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 1 }}
              className="absolute left-14 top-1/2 -translate-y-1/2 bg-white border border-[#EFE3C3] text-[#8E702D] text-[10px] tracking-wider uppercase font-cinzel w-36 px-3 py-2 rounded shadow-md pointer-events-none whitespace-normal leading-normal"
            >
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-white z-10" />
              Tap to play music
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music Action Button */}
        <motion.button
          onClick={togglePlayback}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer focus:outline-none ${
            isPlaying
              ? 'border-[#C5A03E] bg-[#FAF6EE] text-[#8E702D]'
              : 'border-gray-200 bg-[#FDFBF7] text-gray-400 hover:border-[#C5A03E]/50'
          }`}
        >
          {isPlaying ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
        </motion.button>
      </div>
    </div>
  );
}
