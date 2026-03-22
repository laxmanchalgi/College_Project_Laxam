import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { dataService, Booking } from "../services/dataService";
import { Calendar, MapPin, Users, Compass } from "lucide-react";

export default function MyTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dataService.getUserBookings(user.uid).then(setTrips).finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-5xl font-serif mb-4">My Journeys</h1>
          <p className="text-black/50">Your collection of extraordinary escapes.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm">
            <Compass className="w-12 h-12 text-black/10 mx-auto mb-4" />
            <p className="text-black/40 italic">You haven't embarked on any journeys yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 hover:shadow-xl transition-shadow duration-500">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-serif">{trip.destination}</h2>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Confirmed</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-black/60">
                    <Users className="w-4 h-4 text-brand-gold" />
                    <span className="text-sm">{trip.travelers} Travelers</span>
                  </div>
                  <div className="flex items-center gap-3 text-black/60">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                    <span className="text-sm">{trip.startDate} → {trip.endDate}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">Booking ID: {trip.id}</span>
                  <button className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-amber-600">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
