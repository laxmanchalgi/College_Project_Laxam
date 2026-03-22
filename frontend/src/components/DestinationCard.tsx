import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface DestinationCardProps {
  name: string;
  image: string;
  description: string;
  onClick?: () => void;
}

export default function DestinationCard({ name, image, description, onClick }: DestinationCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg cursor-pointer"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <h3 className="text-3xl font-serif mb-2">{name}</h3>
        <p className="text-sm text-white/80 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {description}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick();
          }}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group/btn"
        >
          Explore Destination
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
        </button>
      </div>
    </motion.div>
  );
}
