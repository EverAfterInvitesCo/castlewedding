import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RSVPResponse } from "../types";
import { supabase } from "../supabaseClient"; // Ensure this path is correct
import { 
  Users, 
  Heart, 
  Sparkles, 
  ShieldCheck 
} from "lucide-react";

interface OrganizerDashboardProps {
  tick: number;
  onReset: () => void;
  uploadUrl: string;
  onUpdateUploadUrl: (url: string) => void;
}

export default function OrganizerDashboard({ 
  tick, 
  onReset, 
  uploadUrl, 
  onUpdateUploadUrl 
}: OrganizerDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submss, setSubmss] = useState<RSVPResponse[]>([]);
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [tempUrl, setTempUrl] = useState(uploadUrl);

  useEffect(() => {
    setTempUrl(uploadUrl);
  }, [uploadUrl]);

  // Updated to fetch from Supabase
  const loadSubmissions = async () => {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*');
    
    if (error) {
      console.error("Error fetching RSVPs:", error);
    } else {
      setSubmss(data || []);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSubmissions();
    }
  }, [tick, isOpen]);

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === "villa2027" || passcode === "1234") {
      setIsUnlocked(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const accepts = submss.filter((s) => s.attending === "yes");
  const declines = submss.filter((s) => s.attending === "no");
  const totalAttendingGuests = accepts.reduce((acc, curr) => acc + (curr.guestsCount || 0), 0);

  return (
    <section id="organizer-dashboard-section" className="bg-[#FAF6EE] py-12 px-6 sm:px-8 border-t border-[#F3EBDD]/60 max-w-md mx-auto">
      <div className="border border-[#C5A059]/40 rounded-xl bg-white/70 backdrop-blur-xs p-4 shadow-3xs">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h4 className="font-sans font-semibold text-xs text-[#2C261F] uppercase tracking-wider">Organizer Portal</h4>
              <p className="text-[10px] text-[#2C261F]/50">Monitor RSVPs.</p>
            </div>
          </div>
          <span className="text-xs text-[#C5A059] font-semibold">{isOpen ? "Collapse" : "Access"}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="pt-4 mt-3 border-t border-[#F3EBDD] space-y-4">
                {!isUnlocked ? (
                  <form onSubmit={handleUnlock} className="space-y-3">
                    <input type="password" placeholder="Passcode" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#F3EBDD] bg-white outline-none" />
                    <button type="submit" className="w-full px-4 py-1.5 bg-[#C5A059] text-white text-xs font-semibold rounded-lg">Unlock</button>
                    {authError && <p className="text-[10px] text-red-600">* Invalid passcode.</p>}
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-[#EBF0EA] rounded-lg p-2.5 text-center">
                        <Users className="w-4 h-4 text-[#5F6F5E] mx-auto mb-1" />
                        <span className="text-xs font-bold text-[#5F6F5E] block">{totalAttendingGuests}</span>
                        <span className="text-[9px] text-[#5F6F5E]/80 uppercase">Attending</span>
                      </div>
                      <div className="bg-[#FDFBF7] border border-[#F3EBDD] rounded-lg p-2.5 text-center">
                        <Heart className="w-4 h-4 text-[#C5A059] mx-auto mb-1" />
                        <span className="text-xs font-bold text-[#C5A059] block">{accepts.length}</span>
                        <span className="text-[9px] text-[#C5A059]/80 uppercase">Yes</span>
                      </div>
                      <div className="bg-red-50/50 rounded-lg p-2.5 text-center">
                        <Sparkles className="w-4 h-4 text-[#2C261F]/50 mx-auto mb-1" />
                        <span className="text-xs font-bold text-[#2C261F]/60 block">{declines.length}</span>
                        <span className="text-[9px] text-[#2C261F]/40 uppercase">No</span>
                      </div>
                    </div>

                    <div className="bg-[#FAF6EE] border border-[#C5A059]/20 rounded-xl p-3.5 space-y-3">
                      <h5 className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">Photo Album Link</h5>
                      <div className="flex gap-1.5">
                        <input type="text" value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} className="flex-1 px-2.5 py-1.5 text-[11px] rounded-lg border" />
                        <button onClick={() => onUpdateUploadUrl(tempUrl)} className="px-3 py-1.5 bg-[#C5A059] text-white text-[11px] font-semibold rounded-lg">Save</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
