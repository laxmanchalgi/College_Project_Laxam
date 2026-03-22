import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import DestinationCard from '../components/DestinationCard';
import ItineraryForm from '../components/ItineraryForm';
import ItineraryDisplay from '../components/ItineraryDisplay';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ErrorBoundary from '../components/ErrorBoundary';
import { generateItinerary } from '../services/gemini';
import { dataService } from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURED_DESTINATIONS = [
  {
    name: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    description: "Lush tropical jungles, spiritual temples, and pristine beaches in the heart of Indonesia."
  },
  {
    name: "Singapore",
    image: "https://images.unsplash.com/photo-1525625239513-99733285526e?auto=format&fit=crop&q=80&w=800",
    description: "A futuristic city-state blending ultra-modern architecture with vibrant hawker centers."
  },
  {
    name: "Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    description: "The City of Light, offering timeless romance, world-class art, and culinary experiences."
  },
  {
    name: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
    description: "Overwater bungalows and crystal-clear lagoons in the world's most exclusive island paradise."
  },
  {
    name: "Amalfi Coast",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
    description: "Dramatic cliffs, turquoise waters, and pastel villages along Italy's iconic coastline."
  },
  {
    name: "Kyoto",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    description: "Ancient temples, tea houses, and serene zen gardens in Japan's cultural heart."
  }
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [currentPlanData, setCurrentPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await dataService.searchDestinations(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handlePlan = async (data: { destination: string; duration: number; preferences: string }) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setIsSaved(false);
    setCurrentPlanData(data);
    try {
      const result = await generateItinerary(data.destination, data.duration, data.preferences);
      setItinerary(result || "Failed to generate itinerary.");
      setTimeout(() => {
        document.getElementById('itinerary-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Error generating itinerary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!user || !itinerary || !currentPlanData) return;
    try {
      await dataService.saveItinerary({
        uid: user.uid,
        destination: currentPlanData.destination,
        duration: currentPlanData.duration,
        content: itinerary
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save itinerary:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
          {/* Search Section */}
          <section className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-black/5 -mt-40 relative z-20">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations (e.g. Italy, Bali, Paris...)"
                  className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={searching}
                className="px-10 py-4 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold transition-all disabled:opacity-50"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-serif mb-6">Search Results</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {searchResults.map((dest, i) => (
                    <DestinationCard
                      key={i}
                      {...dest}
                      onClick={() => navigate('/booking', { state: { destination: dest.name } })}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-2 block">Discovery</span>
                <h2 className="text-5xl font-serif">Featured Escapes</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {FEATURED_DESTINATIONS.map((dest, i) => (
                <DestinationCard
                  key={i}
                  {...dest}
                  onClick={() => navigate('/booking', { state: { destination: dest.name } })}
                />
              ))}
            </div>
          </section>

          <section className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-2 block">Bespoke Planning</span>
                <h2 className="text-5xl font-serif leading-tight">Your Journey,<br /><span className="italic">Perfectly Tailored</span></h2>
              </div>
              <p className="text-lg text-black/60 leading-relaxed">
                Our AI-powered concierge combines local expertise with your personal tastes to create one-of-a-kind travel experiences.
              </p>
            </div>
            <div className="lg:col-span-3">
              <ItineraryForm onPlan={handlePlan} loading={loading} />
            </div>
          </section>

          {itinerary && (
            <section id="itinerary-section" className="pt-12">
              <ItineraryDisplay
                itinerary={itinerary}
                onSave={handleSaveItinerary}
                isSaved={isSaved}
                onBook={() => navigate('/booking')}
              />
            </section>
          )}

          <section id="reviews-section" className="space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold block">Testimonials</span>
              <h2 className="text-5xl font-serif">Stories from the Journey</h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2">
                <ReviewList />
              </div>
              <div className="lg:col-span-1 sticky top-32">
                {user ? <ReviewForm /> : (
                  <button onClick={() => navigate('/login')} className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-widest">
                    Sign In to Review
                  </button>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}
