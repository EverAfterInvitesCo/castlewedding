import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RSVPResponse } from "../types";
import { 
  Users, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  Smile, 
  UtensilsCrossed,
  Camera,
  QrCode,
  Save,
  Link2,
  Download
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
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [candids, setCandids] = useState<any[]>([]);

  useEffect(() => {
    setTempUrl(uploadUrl);
  }, [uploadUrl]);

  const loadSubmissions = async () => {
    try {
      const res = await fetch("/api/rsvps");
      if (res.ok) {
        const data = await res.json();
        setSubmss(data);
        localStorage.setItem("wedding_rsvps", JSON.stringify(data));
      }
    } catch (e) {
      const stored = localStorage.getItem("wedding_rsvps");
      setSubmss(stored ? JSON.parse(stored) : []);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [tick, isOpen]);

  const loadCandids = async () => {
    try {
      const res = await fetch("/api/candids");
      if (res.ok) {
        const data = await res.json();
        setCandids(data);
        localStorage.setItem("wedding_guest_candids", JSON.stringify(data));
      }
    } catch (e) {
      const stored = localStorage.getItem("wedding_guest_candids");
      setCandids(stored ? JSON.parse(stored) : []);
    }
  };

  useEffect(() => {
    loadCandids();
    const handleStorageChange = () => loadCandids();
    window.addEventListener("storage", handleStorageChange);
    const timer = setInterval(loadCandids, 4000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(timer);
    };
  }, [tick, isOpen]);

  const handleToggleApprove = async (id: string) => {
    const updated = candids.map(c => c.id === id ? { ...c, approved: !c.approved } : c);
    localStorage.setItem("wedding_guest_candids", JSON.stringify(updated));
    setCandids(updated);
    window.dispatchEvent(new Event("storage"));
  };

  const handleDeleteCandid = async (id: string) => {
    if (confirm("Delete this photo permanently?")) {
      const updated = candids.filter(c => c.id !== id);
      localStorage.setItem("wedding_guest_candids", JSON.stringify(updated));
      setCandids(updated);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleDownloadCandid = (c: any) => {
    const link = document.createElement("a");
    link.href = c.imgData;
    link.download = `candid_${c.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
  const totalAttendingGuests = accepts.reduce((acc, curr) => acc + curr.guestsCount, 0);

  return (
    <section id="organizer-dashboard-section" className="bg-[#FAF6EE] py-12 px-6 sm:px-8 border-t border-[#F3EBDD]/60 max-w-md mx-auto">
      <div className="border border-[#C5A059]/40 rounded-xl bg-white/70 backdrop-blur-xs p-4 shadow-3xs">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h4 className="font-sans font-semibold text-xs text-[#2C261F] uppercase tracking-wider">Organizer Portal</h4>
              <p className="text-[10px] text-[#2C261F]/50">Monitor RSVPs and Guest Photos.</p>
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
                    {/* Summary Counters */}
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

                    {/* Album Setup */}
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
