const chapters = [
  {
    title: "Where It All Began",
    date: "October 14, 2021",
    subtitle: "A London Autumn Greeting",
    description: "It was a crisp golden afternoon in Hyde Park when Farah and Omar’s paths first crossed. Farah was hunting for a quiet reading spot under the amber trees, and Omar was searching for his lost sketch directory. A simple recommendation of coffee led to a three-hour conversation, sharing dreams, favorite playlists, and discovering that their childhood homes were just streets apart in Cairo.",
    image: "/hand.png",
  },
  {
    title: "The Blossoming Chapters",
    date: "May 2023",
    subtitle: "From London to Cairo",
    description: "Over written notebooks, long evening walks along the Thames, and flights across oceans, their hearts grew inextricably linked. Together they scaled hills, tasted local bakeries, supported each other's career strides, and realized that home wasn't a static coordinate. Home was the vibrant streets of Zamalek and the warmth of the Nile breeze where they finally settled.",
    image: "/couple.png",
  },
  {
    title: "The Cairo Promise",
    date: "August 24, 2025",
    subtitle: "A Sunset Proposal",
    description: "Under a blanket of twinkling stars on a private balcony overlooking the shimmering Nile at the Nile Palace, Omar bent down on one knee. With the gentle sound of the city fading into the night and a warm breeze coming off the river, he held out a simple gold ring. Through joyful tears and inexpressible happiness, Farah said yes — beginning their march to Forever.",
    image: "/proposal.png",
  }
];

export default function OurStory() {
  return (
    <section className="py-24 px-6 bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto">
        <span className="font-cinzel text-xs tracking-[0.3em] text-[#8E702D] uppercase font-semibold mb-4 block">
          Love Story
        </span>
        <h2 className="font-serif text-4xl text-[#2A2825] mb-4">Our Story</h2>
        <p className="font-serif italic text-gray-500 mb-16">A beautiful lifetime ahead</p>
        
        <div className="space-y-16">
          {chapters.map((chapter, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-12 items-center">
              <div className={index % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <img 
                  src={chapter.image} 
                  alt={chapter.title} 
                  className="w-full h-64 object-cover shadow-lg"
                  onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800")}
                />
              </div>
              <div className={index % 2 === 0 ? "md:order-2 text-left" : "md:order-1 text-left"}>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8E702D] font-bold">{chapter.date}</span>
                <h3 className="text-2xl font-serif text-[#2A2825] my-2">{chapter.title}</h3>
                <p className="text-sm italic text-gray-500 mb-4">{chapter.subtitle}</p>
                <p className="text-gray-600 leading-relaxed">{chapter.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
