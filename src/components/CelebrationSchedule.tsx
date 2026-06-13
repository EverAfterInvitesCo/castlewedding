const timeline = [
  { time: "4:30 PM", title: "Welcome & Traditional Refreshments", description: "Guests are welcomed with aromatic Arabic coffee, dates, and refreshing seasonal juices in the Garden Pavilion.", icon: "Ambient" },
  { time: "5:00 PM", title: "The Wedding Vows (Nikkah)", description: "Under the beautiful blossom arch, Farah and Omar solemnize their union with their sacred Nikkah ceremony.", icon: "Ceremony" },
  { time: "6:15 PM", title: "Sunset Social Hour", description: "Enjoy a variety of gourmet mocktails and hors d'oeuvres on the terrace as the sun sets over the Nile.", icon: "Toast" },
  { time: "7:30 PM", title: "Grand Entrance", description: "Welcome the bride and groom with Zaffah music as they make their grand entrance into the ballroom.", icon: "Dance" },
  { time: "8:15 PM", title: "Royal Feast & Dinner", description: "A celebratory multi-course dinner featuring traditional Egyptian fusion cuisine and fine halal delicacies.", icon: "Feast" },
  { time: "9:30 PM", title: "Cake Cutting & Dessert", description: "The cake cutting ceremony followed by a selection of oriental sweets, kunafa, and premium coffee stations.", icon: "Slice" },
  { time: "11:30 PM", title: "Sparkler Send-off", description: "A spectacular sparkler exit to bid Farah and Omar farewell as they begin their journey together.", icon: "Spark" }
];

export default function CelebrationSchedule() {
  return (
    <section className="py-24 px-6 bg-[#FDFBF7] border-b border-[#EFE3C3]/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl text-center text-[#2A2825] mb-16">The Celebration Schedule</h2>
        <div className="space-y-12">
          {timeline.map((event, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
              <div className="font-cinzel text-[#8E702D] font-bold w-full md:w-32 shrink-0">{event.time}</div>
              <div className="border-l border-[#EFE3C3] pl-6 pb-8 text-left">
                <h3 className="font-serif text-xl text-[#2A2825] mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
