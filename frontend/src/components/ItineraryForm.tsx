import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Heart } from 'lucide-react';

interface ItineraryFormProps {
  onPlan: (data: { destination: string; duration: number; preferences: string }) => void;
  loading: boolean;
}

export default function ItineraryForm({ onPlan, loading }: ItineraryFormProps) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlan({ destination, duration, preferences });
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-black/5">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-gold/10 rounded-2xl"><Sparkles className="w-6 h-6 text-brand-gold" /></div>
        <div>
          <h2 className="text-3xl font-serif">AI Travel Concierge</h2>
          <p className="text-sm text-black/50">Personalized itineraries in seconds</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2"><MapPin className="w-3 h-3" /> Destination</label>
            <input required type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Amalfi Coast, Italy" className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2"><Calendar className="w-3 h-3" /> Duration (Days)</label>
            <input required type="number" min="1" max="14" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2"><Heart className="w-3 h-3" /> Your Preferences</label>
          <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} placeholder="e.g. Luxury dining, hidden gems, art galleries, slow travel..." rows={4} className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all resize-none" />
        </div>
        <button disabled={loading} type="submit" className="w-full py-5 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-all disabled:opacity-50 flex items-center justify-center gap-3">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Generate My Itinerary <Sparkles className="w-5 h-5" /></>}
        </button>
      </form>
    </div>
  );
}
