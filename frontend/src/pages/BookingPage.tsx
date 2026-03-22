import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CreditCard, Calendar, Users, MapPin, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 1, title: 'Travelers', icon: Users },
  { id: 2, title: 'Dates', icon: Calendar },
  { id: 3, title: 'Payment', icon: CreditCard },
  { id: 4, title: 'Confirm', icon: CheckCircle2 },
];

const DESTINATIONS = [
  "Bali", "Singapore", "Paris", "Maldives", "Amalfi Coast", "Kyoto"
];

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destinationFromHome = location.state?.destination || "";
  const today = new Date().toISOString().split("T")[0];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    destination: destinationFromHome,
    travelers: 2,
    startDate: '',
    endDate: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!formData.destination) return setError("Please select a destination.");
    }
    if (step === 2) {
      if (!formData.startDate || !formData.endDate) return setError("Please select travel dates.");
      if (formData.endDate < formData.startDate) return setError("End date must be after start date.");
    }
    if (step === 3) {
      if (!formData.cardName.trim()) return setError("Cardholder name required.");
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g,''))) return setError("Card number must be 16 digits.");
      if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) return setError("Expiry must be MM/YY format.");
      if (!/^\d{3}$/.test(formData.cvv)) return setError("CVV must be 3 digits.");

      setLoading(true);
      try {
        await dataService.bookTour({
          uid: user?.uid,
          ...formData,
        });
        setStep(4);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-12">
          <h1 className="text-5xl font-serif mb-4">Complete Your Booking</h1>
          <p className="text-black/50">Secure your luxury escape in just a few steps.</p>
        </div>

        <div className="flex justify-between items-center mb-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black/5 -translate-y-1/2 z-0" />
          {STEPS.map((s) => {
            const Icon = s.icon;
            const active = step >= s.id;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${active ? 'bg-brand-dark text-white' : 'bg-white text-black/20 border border-black/5'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-black' : 'text-black/20'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-black/5 min-h-[500px] flex flex-col justify-between">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-medium">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              {step === 1 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Destination
                    </label>
                    <select
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all appearance-none"
                    >
                      <option value="">Select Destination</option>
                      {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                      <Users className="w-3 h-3" /> Travelers
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <button
                          key={n}
                          onClick={() => setFormData({ ...formData, travelers: n })}
                          className={`py-4 rounded-xl font-bold transition-all ${
                            formData.travelers === n 
                              ? 'bg-brand-dark text-white shadow-lg' 
                              : 'bg-brand-paper text-black/40 hover:bg-black/5'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-serif">Select Travel Dates</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Check-in</label>
                      <input
                        type="date"
                        min={today}
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Check-out</label>
                      <input
                        type="date"
                        min={formData.startDate || today}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-serif">Secure Payment</h2>
                  <div className="space-y-4">
                    <input
                      placeholder="Cardholder Name"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20"
                    />
                    <input
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20"
                      />
                      <input
                        placeholder="CVV"
                        type="password"
                        maxLength={3}
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-serif">Journey Confirmed!</h2>
                  <p className="text-black/60 max-w-sm mx-auto">
                    Your luxury escape to <span className="font-bold text-black">{formData.destination}</span> has been secured.
                  </p>
                  <div className="pt-8">
                    <button 
                      onClick={() => navigate('/my-trips')}
                      className="px-10 py-4 bg-brand-dark text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-gold transition-all"
                    >
                      View My Trips
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="flex justify-between mt-12 pt-8 border-t border-black/5">
              <button 
                onClick={handleBack} 
                disabled={step === 1}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black disabled:opacity-0 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={handleNext}
                disabled={loading}
                className="px-10 py-4 bg-brand-dark text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-gold transition-all flex items-center gap-2 shadow-lg shadow-black/10"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 3 ? 'Confirm Booking' : 'Continue'} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
