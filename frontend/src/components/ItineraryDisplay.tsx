import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Download, Share2, Map, Bookmark, Check } from 'lucide-react';

interface ItineraryDisplayProps {
  itinerary: string;
  onSave?: () => Promise<void>;
  isSaved?: boolean;
  onBook?: () => void;
}

export default function ItineraryDisplay({ itinerary, onSave, isSaved, onBook }: ItineraryDisplayProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave || isSaved) return;
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-black/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-dark/5 rounded-2xl">
            <Map className="w-6 h-6 text-brand-dark" />
          </div>
          <h2 className="text-3xl font-serif">Your Bespoke Journey</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSave}
            disabled={saving || isSaved}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
              isSaved ? 'bg-green-50 text-green-600' : 'hover:bg-black/5 text-black/60'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />}
            {isSaved ? 'Saved' : 'Save to Profile'}
          </button>
          <button className="p-3 hover:bg-black/5 rounded-xl transition-colors"><Share2 className="w-5 h-5" /></button>
          <button className="p-3 hover:bg-black/5 rounded-xl transition-colors"><Download className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-normal prose-p:text-black/70 prose-li:text-black/70">
        <Markdown>{itinerary}</Markdown>
      </div>
      <div className="mt-12 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-black/40 italic">This itinerary was crafted by our AI Concierge based on your unique preferences.</p>
        <button onClick={onBook} className="px-10 py-4 bg-brand-gold text-white rounded-full font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-brand-gold/20">
          Book This Experience
        </button>
      </div>
    </div>
  );
}
