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
  
  // This status is what drives the UI
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // YOUR ORIGINAL WORKING LOGIC
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
    <section className="py-12 px-6">
      <div className="max-w-xl mx-auto">
        {status === "success" ? (
          <div className="bg-white rounded-2xl p-8 border border-[#C5A059] text-center space-y-4">
            <Check className="w-12 h-12 text-[#5F6F5E] mx-auto" />
            <h3 className="text-xl font-serif">Thank You!</h3>
            <p className="text-sm text-gray-600">RSVP Submitted successfully!</p>
            <button onClick={() => setStatus("idle")} className="text-[#C5A059] underline text-xs">Submit another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#F3EBDD] space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setAttending("yes")} className={`py-3 rounded-xl border text-xs font-semibold ${attending === "yes" ? "border-[#C5A059] bg-[#FAF6EE] text-[#AF853E]" : "border-[#F3EBDD]"}`}>
                <Heart className="w-4 h-4 mx-auto mb-1" /> Joyfully Accept
              </button>
              <button type="button" onClick={() => setAttending("no")} className={`py-3 rounded-xl border text-xs font-semibold ${attending === "no" ? "border-[#C5A059] bg-[#FAF6EE] text-[#AF853E]" : "border-[#F3EBDD]"}`}>
                <Sparkles className="w-4 h-4 mx-auto mb-1" /> Regretfully Decline
              </button>
            </div>

            <input type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border rounded-xl" />
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-xl" />
            
            {attending === "yes" && (
              <input type="number" min="1" value={guestsCount} onChange={(e) => setGuestsCount(parseInt(e.target.value))} className="w-full p-3 border rounded-xl" placeholder="Guest Count" />
            )}

            <textarea placeholder="Dietary Notes" value={dietaryNotes} onChange={(e) => setDietaryNotes(e.target.value)} className="w-full p-3 border rounded-xl" />
            <textarea placeholder="Well Wishes" value={wellWishes} onChange={(e) => setWellWishes(e.target.value)} className="w-full p-3 border rounded-xl" />

            <button type="submit" disabled={status === "submitting"} className="w-full py-4 bg-[#C5A059] text-white rounded-xl text-xs uppercase tracking-widest">
              {status === "submitting" ? "Sending..." : "Submit RSVP"}
            </button>
            
            {status === "error" && <p className="text-red-600 text-xs flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
