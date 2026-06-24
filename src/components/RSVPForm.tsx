import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../supabaseClient";
import { Heart, Sparkles, Check, AlertCircle } from "lucide-react";

export default function RSVPForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestsCount, setGuestsCount] = useState(1);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [wellWishes, setWellWishes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const { error } = await supabase.from('rsvps').insert([
      {
        fullName: fullName.trim(),
        email: email.trim(),
        attending: attending === "yes",
        guestsCount: attending === "yes" ? guestsCount : 0,
        dietaryNotes: dietaryNotes.trim(),
        wellWishes: wellWishes.trim(),
      }
    ]);

    if (error) {
      console.error("Supabase Error:", error);
      setStatus("error");
    } else {
      setStatus("success");
      setFullName("");
      setEmail("");
      setGuestsCount(1);
      setDietaryNotes("");
      setWellWishes("");
    }
  };

  return (
    <section className="bg-[#FCFAF6] py-20 px-6 sm:px-8 border-b border-[#F3EBDD]/70">
      <div className="max-w-xl mx-auto">
        {status === "success" ? (
          <div className="bg-white rounded-2xl p-8 border border-[#C5A059] shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF0EA] flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-[#5F6F5E]" />
            </div>
            <h3 className="text-2xl font-serif text-[#2C261F]">Thank You!</h3>
            <p className="text-sm text-gray-600">Your RSVP has been submitted successfully.</p>
            <button onClick={() => setStatus("idle")} className="text-[#C5A059] underline text-xs">Submit another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 sm:p-10 border border-[#F3EBDD] shadow-sm space-y-6">
            
            {/* Attendance Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setAttending("yes")} className={`py-3 rounded-xl border text-xs font-semibold transition-all ${attending === "yes" ? "border-[#C5A059] bg-[#FAF6EE] text-[#AF853E]" : "border-[#F3EBDD] text-gray-500"}`}>
                <Heart className="w-4 h-4 mx-auto mb-1" /> Joyfully Accept
              </button>
              <button type="button" onClick={() => setAttending("no")} className={`py-3 rounded-xl border text-xs font-semibold transition-all ${attending === "no" ? "border-[#C5A059] bg-[#FAF6EE] text-[#AF853E]" : "border-[#F3EBDD] text-gray-500"}`}>
                <Sparkles className="w-4 h-4 mx-auto mb-1" /> Regretfully Decline
              </button>
            </div>

            {/* Inputs */}
            <input type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-[#C5A059]" />
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-[#C5A059]" />
            
            {attending === "yes" && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Guests in your party</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))} className="w-10 h-10 border rounded-full">-</button>
                  <span className="text-lg font-bold w-6 text-center">{guestsCount}</span>
                  <button type="button" onClick={() => setGuestsCount(Math.min(6, guestsCount + 1))} className="w-10 h-10 border rounded-full">+</button>
                </div>
              </div>
            )}

            <textarea placeholder="Dietary Notes" value={dietaryNotes} onChange={(e) => setDietaryNotes(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-[#C5A059]" />
            <textarea placeholder="Well Wishes" value={wellWishes} onChange={(e) => setWellWishes(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-[#C5A059]" />

            <button type="submit" className="w-full py-4 bg-[#C5A059] text-white rounded-xl font-semibold uppercase tracking-widest text-xs hover:bg-[#AF853E] transition-all">
              {status === "submitting" ? "Sending..." : "Send Invitation Reply"}
            </button>

            {status === "error" && <p className="text-red-600 text-xs flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Something went wrong.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
