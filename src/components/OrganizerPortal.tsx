import { useState } from "react";
import { Lock, Unlock, Users, CheckCircle, XCircle } from "lucide-react";

// Mock data structure - replace this with your actual Firestore fetch
const MOCK_GUESTS = [
  { id: 1, name: "Lady Eleanor Sterling", email: "eleanor@sterlingmanor.co.uk", status: "Attending", guests: 2, dietary: "Gluten-Free, Vegetarian preferred", message: "Wishing you both a lifetime of love!" },
  { id: 2, name: "Sir Charles Vance III", email: "charles.vance@vanceholdings.com", status: "Attending", guests: 1, dietary: "None", message: "" },
];

export default function OrganizerPortal() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return (
      <section className="py-20 bg-[#FDFBF7]">
        <div className="max-w-md mx-auto p-8 border border-[#C5A03E]/20 rounded-2xl bg-white shadow-xl">
          <h3 className="font-cinzel text-xl mb-6">Organizer Access</h3>
          <input
            type="password"
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg text-center"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => password === "EverAfter2026" && setIsUnlocked(true)}
            className="w-full bg-[#2A2825] text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Lock size={16} /> Unlock Portal
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#FDFBF7]">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-cinzel text-2xl uppercase tracking-widest">Guest Responses</h2>
          <button onClick={() => setIsUnlocked(false)} className="text-sm underline">Collapse</button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-[#F3EFE9] rounded-xl"><Users size={20} className="mb-2" /> 3 Attending</div>
          <div className="p-4 bg-[#F3EFE9] rounded-xl"><CheckCircle size={20} className="mb-2" /> 2 Replies</div>
          <div className="p-4 bg-[#F3E8C1]/20 rounded-xl"><XCircle size={20} className="mb-2" /> 1 Decline</div>
        </div>

        {/* Guest List */}
        <div className="space-y-4">
          {MOCK_GUESTS.map((guest) => (
            <div key={guest.id} className="p-6 bg-white border border-[#C5A03E]/20 rounded-xl text-left">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">{guest.name}</h4>
                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-full uppercase">{guest.status} ({guest.guests})</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">{guest.email}</p>
              <div className="text-xs border-t border-gray-100 pt-3">
                <span className="font-bold">Dietary:</span> {guest.dietary}
              </div>
              {guest.message && (
                <p className="text-xs italic text-gray-600 mt-2 bg-gray-50 p-2 rounded">"{guest.message}"</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
