import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RSVPResponse } from "../types";
import { supabase } from "../supabaseClient";
import { Users, Heart, Sparkles, ShieldCheck } from "lucide-react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState(false);

  const loadSubmissions = async () => {
    const { data, error } = await supabase.from('rsvps').select('*');
    if (error) {
      console.error("Error fetching:", error);
    } else {
      setSubmss(data || []);
    }
  };

  // This effect handles the live-updating logic
  useEffect(() => {
    if (isOpen && isUnlocked) {
      loadSubmissions(); // Load immediately when opened
      const interval = setInterval(loadSubmissions, 5000); // Check every 5 seconds
      return () => clearInterval(interval); // Cleanup when closed
    }
  }, [isOpen, isUnlocked, tick]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(true);
    } else {
      setIsUnlocked(true);
      setAuthError(false);
      loadSubmissions();
    }
  };

  const accepts = submss.filter((s) => s.attending === true);
  const declines = submss.filter((s) => s.attending === false);
  const totalAttendingGuests = accepts.reduce((acc, curr) => acc + (Number(curr.guestsCount) || 0), 0);

  return (
    <section className="bg-[#FAF6EE] py-12 px-6 sm:px-8 border-t border-[#F3EBDD]/60 max-w-md mx-auto">
      <div className="border border-[#C5A059]/40 rounded-xl bg-white/70 backdrop-blur-xs p-4 shadow-3xs">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider">Organizer Portal</h4>
            </div>
          </div>
          <span className="text-xs text-[#C5A059] font-semibold">{isOpen ? "Collapse" : "Access"}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="pt-4 mt-3 border-t border-[#F3EBDD] space-y-4">
                {!isUnlocked ? (
                  <form onSubmit={handleLogin} className="space-y-3">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white" />
                    <button type="submit" className="w-full py-1.5 bg-[#C5A059] text-white text-xs font-semibold rounded-lg">Login</button>
                    {authError && <p className="text-[10px] text-red-600">* Invalid credentials.</p>}
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#EBF0EA] rounded-lg p-2"><Users className="w-4 h-4 mx-auto text-[#5F6F5E]"/><span className="text-xs font-bold block">{totalAttendingGuests}</span></div>
                      <div className="bg-[#FDFBF7] rounded-lg p-2"><Heart className="w-4 h-4 mx-auto text-[#C5A059]"/><span className="text-xs font-bold block">{accepts.length}</span></div>
                      <div className="bg-red-50 rounded-lg p-2"><Sparkles className="w-4 h-4 mx-auto text-[#2C261F]/50"/><span className="text-xs font-bold block">{declines.length}</span></div>
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
