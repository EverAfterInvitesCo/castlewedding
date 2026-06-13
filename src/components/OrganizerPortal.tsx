import { useState } from "react";
import { Lock, Unlock, FileText } from "lucide-react";

export default function OrganizerPortal() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace "YourSecretPassword" with your desired password
    if (password === "EverAfter2026") {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <section className="py-20 bg-[#FDFBF7] border-t border-[#C5A03E]/20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-cinzel text-3xl mb-8 tracking-[0.2em] uppercase">Organizer Portal</h2>
        
        {!isUnlocked ? (
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-4">
            <input
              type="password"
              placeholder="Enter Access Password"
              className="p-3 border border-[#C5A03E]/30 rounded-lg w-64 text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="flex items-center gap-2 bg-[#2A2825] text-white px-6 py-2 rounded-full hover:bg-[#4a4742]">
              <Lock size={16} /> Access RSVP Data
            </button>
            {error && <p className="text-red-500 text-sm">Incorrect Password</p>}
          </form>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#C5A03E]/10">
            <div className="flex items-center justify-center gap-2 mb-6 text-[#C5A03E]">
              <Unlock size={24} /> <span className="font-semibold uppercase tracking-widest">Access Granted</span>
            </div>
            <p className="mb-6">Here is your collected RSVP data:</p>
            {/* Placeholder for your data fetching logic */}
            <button className="flex items-center gap-2 mx-auto border border-[#2A2825] px-6 py-2 rounded-full hover:bg-[#2A2825] hover:text-white transition-all">
              <FileText size={16} /> Export RSVP List (CSV)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
