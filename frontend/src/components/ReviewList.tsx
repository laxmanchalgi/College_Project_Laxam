import React, { useEffect, useState } from 'react';
import { dataService, Review } from '../services/dataService';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToReviews((fetchedReviews) => {
      setReviews(fetchedReviews);
      setLoading(false);
    });
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" /></div>;
  if (reviews.length === 0) return <div className="text-center py-12 text-black/40 italic">No reviews yet. Be the first to share your journey!</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reviews.map((review, i) => (
        <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm relative overflow-hidden group">
          <Quote className="absolute -top-4 -right-4 w-24 h-24 text-black/[0.02] transition-transform group-hover:scale-110" />
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-brand-gold text-brand-gold' : 'text-black/10'}`} />)}
          </div>
          <p className="text-black/70 mb-6 line-clamp-4 italic leading-relaxed">"{review.comment}"</p>
          <div className="mt-auto">
            <h4 className="font-serif text-lg">{review.userName}</h4>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold"><span>{review.destination}</span></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
