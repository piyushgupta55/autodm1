export default function Features() {
  const cards = [
    {
      title: "Comment → DM Automation",
      description: "Instantly reply to a post comment with a predefined or AI-generated direct message.",
      icon: "⚡️",
    },
    {
      title: "Keyword Triggers",
      description: "Trigger exactly the right conversation when users comment specific keywords like 'LINK'.",
      icon: "🎯",
    },
    {
      title: "AI Message Generation",
      description: "Let our context-aware AI build personalized, human-like responses.",
      icon: "🧠",
    },
    {
      title: "Lead Capture",
      description: "Collect emails and seamlessly integrate them right into your CRM from the DMs.",
      icon: "🎣",
    },
    {
      title: "Analytics Dashboard",
      description: "Track conversions, engagement rates, and monitor all active DM flows in real-time.",
      icon: "📊",
    },
    {
      title: "Human Takeover",
      description: "Jump in whenever necessary. Pause the bot unconditionally whenever a human intervenes.",
      icon: "🤝",
    },
  ];

  return (
    <section id="features" className="py-32 px-6 md:px-12 bg-background-primary relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-6">
            Automation without <br /> compromise.
          </h2>
          <p className="text-xl text-text-body max-w-2xl">
            Everything you need to turn your Instagram audience into loyal customers, bundled into an elegant experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl bg-background-secondary border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-300 group hover:bg-[rgba(255,255,255,0.02)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{card.title}</h3>
              <p className="text-text-body leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
