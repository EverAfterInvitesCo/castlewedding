import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ClipboardCheck, Sparkles, Send, Users, AlertCircle } from "lucide-react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { RSVPInput } from "../types";

export default function RSVPForm() {
  const [formData, setFormData] = useState<RSVPInput>({
    name: "",
    email: "",
    attending: true,
    guestsCount: 1,
    dietary: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errorText) setErrorText(null);
  };

  const handleAttendingChange = (status: boolean) => {
    setFormData(prev => ({
      ...prev,
      attending: status,
      // If declining, force guest counts to 1
      guestsCount: status ? prev.guestsCount : 1
    }));
    if (errorText) setErrorText(null);
  };

  const handleGuestCountChange = (val: number) => {
    if (val >= 1 && val <= 10) {
      setFormData(prev => ({
        ...prev,
        guestsCount: val
      }));
    }
  };

  const submitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorText("Please enter your name");
      return;
    }

    setIsLoading(true);
    setErrorText(null);

    const rsvpsPath = "rsvps";
    try {
      // Create a unique auto-id for this rsvp response
      const rsvpRef = doc(collection(db, rsvpsPath));
      const rsvpId = rsvpRef.id;

      // Prepare firestore document adhering perfectly to our constraints (e.g. server timestamps)
      const rsvpData = {
        name: formData.name.trim(),
        email: formData.email?.trim() || null,
        attending: formData.attending,
        guestsCount: formData.guestsCount,
        dietary: formData.dietary?.trim() || null,
        message: formData.message?.trim() || null,
        createdAt: new Date(), // This will be matched by request.time in firestore rules
      };

      // Write document
      await setDoc(rsvpRef, rsvpData);
      setCompleted(true);
    } catch (err) {
      console.error("RSVP writing failed: ", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, `${rsvpsPath}/[generatedId]`);
      } catch (formattedError: any) {
        // Display a helpful descriptive message
        setErrorText("Server permission denied or configuration issue. Please double check values or try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="rsvp-section" className="py-24 px-6 bg-[#FAF6EE] text-[#2A2825] relative overflow-hidden flex justify-center">
      <div className="absolute inset-4 border border-[#C5A03E]/10 pointer-events-none" />

      {/* Decorative vector arches */}
      <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-[#C5A03E]/15 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-[#C5A03E]/15 rounded-tr-full pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Headings */}
        <div className="text-center mb-16">
          <span className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-2 block">
            RSVP
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2825] tracking-wide mb-3">
            Will You Join Us?
          </h2>
          <p className="font-script text-3xl text-[#B08E35]">Please respond by June 30, 2026</p>
          <div className="w-16 h-[1px] bg-[#C5A03E] mx-auto mt-4 opacity-50" />
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#EFE3C3] p-8 md:p-12 rounded shadow-md relative">
          <div className="absolute inset-1.5 border border-[#C5A03E]/5 pointer-events-none" />

          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.form 
                key="rsvp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={submitRSVP}
                className="space-y-6"
              >
                {/* Attendance selection cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleAttendingChange(true)}
                    className={`p-5 rounded border text-center transition-all duration-300 relative group flex flex-col items-center justify-center cursor-pointer ${
                      formData.attending 
                        ? 'border-[#C5A03E] bg-[#FAF6EE] text-[#8E702D]' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="font-serif text-lg font-medium">Accept with Pleasure</span>
                    <span className="text-[10px] uppercase font-cinzel mt-1 tracking-wider text-gray-500">I will attend</span>
                    {formData.attending && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C5A03E] flex items-center justify-center text-white text-[10px]">
                        ✓
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAttendingChange(false)}
                    className={`p-5 rounded border text-center transition-all duration-300 relative group flex flex-col items-center justify-center cursor-pointer ${
                      !formData.attending 
                        ? 'border-[#C5A03E] bg-[#FAF6EE] text-[#8E702D]' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="font-serif text-lg font-medium">Decline with Regret</span>
                    <span className="text-[10px] uppercase font-cinzel mt-1 tracking-wider text-gray-500">Cannot join you</span>
                    {!formData.attending && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C5A03E] flex items-center justify-center text-white text-[10px]">
                        ✓
                      </div>
                    )}
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-4 text-left">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label htmlFor="name-input" className="font-cinzel text-[10px] tracking-wider uppercase text-gray-500 mb-1.5 font-semibold">Your Name *</label>
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full text-sm p-3 bg-[#FDFBF7] border border-gray-200 rounded focus:ring-1 focus:ring-[#C5A03E] focus:border-[#C5A03E] outline-none transition-all placeholder-gray-400 font-sans"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label htmlFor="email-input" className="font-cinzel text-[10px] tracking-wider uppercase text-gray-500 mb-1.5 font-semibold">Email Address (Optional)</label>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className="w-full text-sm p-3 bg-[#FDFBF7] border border-gray-200 rounded focus:ring-1 focus:ring-[#C5A03E] focus:border-[#C5A03E] outline-none transition-all placeholder-gray-400 font-sans"
                    />
                  </div>

                  {/* Attending guests count */}
                  {formData.attending && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAF6EE] rounded border border-[#EFE3C3]/50">
                      <div className="mb-3 sm:mb-0">
                        <span className="font-cinzel text-[10px] tracking-wider uppercase text-gray-500 font-semibold block mb-0.5">Total Party Size</span>
                        <span className="text-xs text-gray-400">Including yourself</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleGuestCountChange(formData.guestsCount - 1)}
                          disabled={formData.guestsCount <= 1}
                          className="w-10 h-10 rounded border border-gray-200 bg-white flex items-center justify-center text-lg hover:border-[#C5A03E]/50 disabled:opacity-40 select-none cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-serif text-lg font-semibold w-6 text-center text-[#8E702D]">{formData.guestsCount}</span>
                        <button
                          type="button"
                          onClick={() => handleGuestCountChange(formData.guestsCount + 1)}
                          disabled={formData.guestsCount >= 10}
                          className="w-10 h-10 rounded border border-gray-200 bg-white flex items-center justify-center text-lg hover:border-[#C5A03E]/50 disabled:opacity-40 select-none cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dietary Requirements */}
                  {formData.attending && (
                    <div className="flex flex-col font-sans">
                      <label htmlFor="dietary-input" className="font-cinzel text-[10px] tracking-wider uppercase text-gray-500 mb-1.5 font-semibold">Dietary Restrictions (Optional)</label>
                      <textarea
                        id="dietary-input"
                        name="dietary"
                        rows={2}
                        value={formData.dietary}
                        onChange={handleInputChange}
                        placeholder="e.g. Vegetarian, Gluten-Free, Nut Allergies..."
                        className="w-full text-sm p-3 bg-[#FDFBF7] border border-gray-200 rounded focus:ring-1 focus:ring-[#C5A03E] focus:border-[#C5A03E] outline-none transition-all placeholder-gray-400 font-sans"
                      />
                    </div>
                  )}

                  {/* Wishes / Message */}
                  <div className="flex flex-col">
                    <label htmlFor="wishes-input" className="font-cinzel text-[10px] tracking-wider uppercase text-gray-500 mb-1.5 font-semibold">Wishes to the Couple</label>
                    <textarea
                      id="wishes-input"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your wishes or leave a sweet note..."
                      className="w-full text-sm p-3 bg-[#FDFBF7] border border-gray-200 rounded focus:ring-1 focus:ring-[#C5A03E] focus:border-[#C5A03E] outline-none transition-all placeholder-gray-400 font-sans"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorText && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded text-red-600 flex items-center gap-2.5 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorText}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C5A03E] text-white hover:bg-[#8E702D] disabled:bg-gray-300 py-3.5 rounded font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit RSVP Response
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#C5A03E]/10 text-[#C5A03E] border border-[#C5A03E]/30 flex items-center justify-center shadow-inner">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="font-cinzel text-xs tracking-widest text-[#C5A03E] font-semibold uppercase">Thank You</span>
                  <h3 className="font-serif text-3xl font-light text-[#2A2825]">
                    {formData.attending ? "We Can't Wait to Celebrate!" : "Warmly Received"}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 max-w-sm mx-auto leading-relaxed mt-2">
                    {formData.attending 
                      ? `Your RSVP response has been recorded successfully. We have reserved ${formData.guestsCount} seat(s) for your party. See you on Saturday, July 18, 2026!`
                      : "Regretfully received. Thank you so much for your warm thoughts and wishes!"}
                  </p>
                </div>

                <div className="w-16 h-[1px] bg-[#C5A03E] opacity-30 my-2" />

                {formData.message && (
                  <div className="p-4 bg-[#FAF6EE] rounded border border-[#EFE3C3]/40 max-w-sm italic text-gray-600 font-serif text-xs leading-relaxed">
                    “{formData.message}”
                  </div>
                )}

                <button
                  onClick={() => {
                    setCompleted(false);
                    setFormData({
                      name: "",
                      email: "",
                      attending: true,
                      guestsCount: 1,
                      dietary: "",
                      message: ""
                    });
                  }}
                  className="px-6 py-2 border border-[#C5A03E]/40 text-[#8E702D] bg-[#C5A03E]/5 hover:bg-[#C5A03E] hover:text-white transition-all duration-300 font-cinzel text-[10px] tracking-widest uppercase rounded cursor-pointer mt-4"
                >
                  Submit Another RSVP
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
