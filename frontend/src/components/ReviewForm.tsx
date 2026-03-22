import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [destination, setDestination] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to leave a review.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await dataService.addReview({
        uid: user.uid,
        userName: user.displayName || 'Anonymous Traveler',
        destination,
        rating,
        comment,
      });
      setDestination('');
      setRating(5);
      setComment('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-2xl font-serif">Share Your Experience</h3>
        <p className="text-sm text-black/40">Tell us about your recent luxury escape.</p>
      </div>
      {error && <div className="text-red-500 text-xs font-medium">{error}</div>}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Destination</label>
          <input type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Amalfi Coast, Italy" className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} className="p-1 transition-transform hover:scale-110">
                <Star className={`w-6 h-6 ${star <= rating ? 'fill-brand-gold text-brand-gold' : 'text-black/10'}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Your Review</label>
          <textarea required value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Describe your journey..." rows={4} className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all resize-none" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold transition-all flex items-center justify-center gap-3 disabled:opacity-50">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Submit Review <Send className="w-4 h-4" /></>}
      </button>
    </form>
  );
}
