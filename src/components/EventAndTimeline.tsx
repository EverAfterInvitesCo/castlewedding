import { MapPin, Calendar, Shirt } from "lucide-react";

export default function EventAndTimeline() {
  return (
    <section id="event-details" className="py-24 px-6 bg-[#FAF6EE] text-center">
      <div className="max-w-5xl mx-auto">
        <span className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-2 block">
          Where & When
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-[#2A2825] mb-12">
          Event Details
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ceremony Card */}
          <div className="p-8 border border-[#EFE3C3] bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-serif text-2xl text-[#2A2825] mb-6">The Solemn Ceremony</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#C5A03E] shrink-0" />
                <div>
                  <p className="font-medium text-[#2A2825]">Saturday, July 18, 2026</p>
                  <p className="text-sm text-gray-600">5:00 PM – 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A03E] shrink-0" />
                <div>
                  <p className="font-medium text-[#2A2825]">The Nile Palace</p>
                  <p className="text-sm text-gray-600">Zamalek, Cairo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shirt className="w-5 h-5 text-[#C5A03E] shrink-0" />
                <div>
                  <p className="font-medium text-[#2A2825]">Attire Guidelines</p>
                  <p className="text-sm text-gray-600">Formal Black Tie / Elegant Tuxedos & Floor-length Gowns (Champagne and pastel theme)</p>
                </div>
              </div>
            </div>
            {/* Functional Link */}
            <a 
              href="https://maps.app.goo.gl/FszJt6Duzjihn3AJA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 block w-full py-3 border border-[#C5A03E] text-[#8E702D] hover:bg-[#C5A03E] hover:text-white transition-colors text-center text-sm uppercase tracking-wider"
            >
              View Location Map
            </a>
          </div>

          {/* Outing Card */}
          <div className="p-8 border border-[#EFE3C3] bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-serif text-2xl text-[#2A2825] mb-6">The Outing</h3> {/* Changed from Grand Reception */}
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#C5A03E] shrink-0" />
                <div>
                  <p className="font-medium text-[#2A2825]">Saturday, July 18, 2026</p>
                  <p className="text-sm text-gray-600">7:00 PM – 11:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A03E] shrink-0" />
                <div>
                  <p className="font-medium text-[#2A2825]">Nile View Lounge</p>
                  <p className="text-sm text-gray-600">Zamalek, Cairo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shirt className="w-5 h-5 text-[#C5A03E] shrink-0" />
                <div>
                  <p className="font-medium text-[#2A2825]">Attire Guidelines</p>
                  {/* Changed attire for outing */}
                  <p className="text-sm text-gray-600">Very casual, chill clothes. Bring your best dance moves with you!</p> 
                </div>
              </div>
            </div>
            {/* Functional Link */}
            <a 
              href="https://maps.app.goo.gl/rjZ37wcap2cdDBRC8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 block w-full py-3 border border-[#C5A03E] text-[#8E702D] hover:bg-[#C5A03E] hover:text-white transition-colors text-center text-sm uppercase tracking-wider"
            >
              View Location Map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
