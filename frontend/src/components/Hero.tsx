import React from 'react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506929113675-b55f9d3bb55c?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury travel" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 text-center px-6">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/80 uppercase tracking-[0.3em] text-xs font-bold mb-4 block"
        >
          Curated Luxury Experiences
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl text-white font-serif mb-8 leading-tight"
        >
          Craft Your Perfect <br /> <span className="italic">Escape</span>
        </motion.h1>
      </div>
    </section>
  );
}
