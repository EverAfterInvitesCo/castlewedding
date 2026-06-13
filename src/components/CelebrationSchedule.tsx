import { motion } from "motion/react";

// Use the data structure you provided
const timeline = [
  { time: "4:30 PM", title: "Welcome & Ambient Tea", description: "Guests arrive at the Garden Pavilion. Soft classical string quartets and warm welcome refreshments are served.", icon: "Ambient" },
  { time: "5:00 PM", title: "The Wedding Vows (Nikkah)", description: "Under the blossom arch, Farah and Omar exchanges vows, solemnizing their lifelong promise.", icon: "Ceremony" },
  { time: "6:15 PM", title: "Twilight Cocktail Hour", description: "Sip on signature mocktails and canapés on the sunset terrace. A perfect opportunity for photos and greetings.", icon: "Toast" },
  { time: "7:30 PM", title: "Grand Ballroom Entrance", description: "Welcome the newly wed couples with a grand entrance, followed by the first dance and emotional bridal toasts.", icon: "Dance" },
  { time: "8:15 PM", title: "Elysian Feast & Dinner", description: "A seated multi-course luxury dinner featuring custom fusion culinary options and romantic backing harp music.", icon: "Feast" },
  { time: "9:30 PM", title: "Cake Cutting & Sweet Delights", description: "The sweet cutting ceremony, followed by gourmet dessert layouts, coffee stations, and dancing.", icon: "Slice" },
  { time: "11:30 PM", title: "Sparkler Send-off", description: "Gather with golden sparklers outside the mansion facade to bid a spectacular farewell to Farah and Omar.", icon: "Spark" }
];

export default function CelebrationSchedule() {
  return (
    <section className="py-24 px-6 bg-[#FDFBF7] border-b border-[#EFE3C3]/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl text-center text-[#2A2825] mb-16">The Celebration Schedule</h2>
        <div className="space-y-12">
          {timeline.map((event, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-4 md:gap-8 items-start"
            >
              <div className="font-cinzel text-[#8E702D] font-bold w-full md:w-32 shrink-0">{event.time}</div>
              <div className="border-l border-[#EFE3C3] pl-6 pb-8">
                <h3 className="font-serif text-xl text-[#2A2825] mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
