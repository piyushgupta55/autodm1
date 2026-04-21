"use client";

import { motion } from "framer-motion";

export default function Problem() {
  const problems = [
    {
      title: "Too many comments to reply manually.",
      description: "As your growth accelerates, replying to every single comment becomes impossible, leaving superfans unacknowledged.",
    },
    {
      title: "Missing potential customers.",
      description: "When people comment with hot intent, the window to convert them is tiny. Miss it, and the lead is gone.",
    },
    {
      title: "Slow engagement kills conversions.",
      description: "The algorithm rewards early velocity; failing to nurture instant engagement throttles post reach.",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-background-primary relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8 items-start">
        <div className="md:w-1/3">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
            The engagement paradox.
          </h2>
          <p className="text-xl text-text-body">
            You worked hard to get the audience to care. Now their engagement is overwhelming you.
          </p>
        </div>

        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              key={i} 
              className={`p-10 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] ${
                i === 2 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-sm font-medium mb-6 text-white border border-[rgba(255,255,255,0.2)]">
                {i + 1}
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">{problem.title}</h3>
              <p className="text-lg text-text-body">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
