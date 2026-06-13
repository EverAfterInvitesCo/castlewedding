import { useState } from "react";

export default function RSVPForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mvznvlje", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-20 bg-[#FDFBF7]">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="font-cinzel text-2xl uppercase tracking-widest mb-8">RSVP</h2>
        
        {status === "success" ? (
          <div className="p-8 border border-[#C5A03E]/30 rounded-xl bg-white text-center">
            <h3 className="font-cinzel text-lg">Thank you!</h3>
            <p>Your response has been sent to the couple.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input type="text" name="name" placeholder="Your Name *" required className="w-full p-3 border border-[#C5A03E]/20 rounded-lg" />
            <input type="email" name="email" placeholder="Email Address (Optional)" className="w-full p-3 border border-[#C5A03E]/20 rounded-lg" />
            <input type="number" name="party_size" placeholder="Total Party Size" min="1" className="w-full p-3 border border-[#C5A03E]/20 rounded-lg" />
            <textarea name="dietary" placeholder="Dietary Restrictions (Optional)" className="w-full p-3 border border-[#C5A03E]/20 rounded-lg h-24"></textarea>
            <textarea name="message" placeholder="Wishes to the couple" className="w-full p-3 border border-[#C5A03E]/20 rounded-lg h-24"></textarea>
            
            <button 
              type="submit" 
              disabled={status === "submitting"}
              className="w-full bg-[#2A2825] text-white py-4 rounded-lg hover:bg-[#C5A03E] transition-colors"
            >
              {status === "submitting" ? "Sending..." : "SUBMIT RSVP RESPONSE"}
            </button>
            
            {status === "error" && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
