import { useState, FormEvent } from "react";
import { supabase } from "../supabaseClient";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" placeholder="Full Name" required value={fullName} 
        onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border rounded" 
      />
      <input 
        type="email" placeholder="Email" required value={email} 
        onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" 
      />
      <select value={attending} onChange={(e) => setAttending(e.target.value as "yes" | "no")} className="w-full p-2 border rounded">
        <option value="yes">Will Attend</option>
        <option value="no">Regretfully Cannot Attend</option>
      </select>
      {attending === "yes" && (
        <input 
          type="number" min="1" value={guestsCount} 
          onChange={(e) => setGuestsCount(parseInt(e.target.value))} className="w-full p-2 border rounded" 
        />
      )}
      <textarea 
        placeholder="Dietary Notes" value={dietaryNotes} 
        onChange={(e) => setDietaryNotes(e.target.value)} className="w-full p-2 border rounded" 
      />
      <textarea 
        placeholder="Well Wishes" value={wellWishes} 
        onChange={(e) => setWellWishes(e.target.value)} className="w-full p-2 border rounded" 
      />
      <button type="submit" className="w-full p-2 bg-pink-500 text-white rounded">
        {status === "submitting" ? "Sending..." : "Submit RSVP"}
      </button>
      {status === "success" && <p className="text-green-600">RSVP Submitted successfully!</p>}
      {status === "error" && <p className="text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}
