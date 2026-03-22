import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, requestOTP, verifyOTP } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await requestOTP(email);
      setShowOTP(true);
      alert("OTP sent! Check the browser console (F12) to see it.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOTP(email, otp);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-black/5">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Compass className="w-10 h-10 text-brand-gold" />
            <span className="text-3xl font-serif font-bold tracking-tight">ExploreSphere</span>
          </Link>
          <h2 className="text-4xl font-serif">{showOTP ? "Verify OTP" : "Welcome Back"}</h2>
          <p className="mt-2 text-sm text-black/50">
            {showOTP ? "Enter the code sent to your email" : "Sign in to your luxury travel portal"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {!showOTP ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={loading}
                className="w-full py-4 border border-brand-dark/10 text-brand-dark rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-paper transition-all text-xs"
              >
                Sign in with OTP
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">OTP Code</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all text-center text-2xl tracking-[0.5em] font-bold"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify & Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowOTP(false)}
                className="text-center text-xs font-bold uppercase tracking-widest text-black/40 hover:text-brand-gold transition-colors"
              >
                Back to Password
              </button>
            </div>
          </form>
        )}

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-2 text-black/40">Or test with</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => {
            setEmail("admin@gmail.com");
            setPassword("admin");
          }}
          className="w-full py-4 border border-brand-dark/10 text-brand-dark rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-paper transition-all text-xs"
        >
          Sign in as Admin
        </button>

        <p className="text-center text-sm text-black/40 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-gold font-bold uppercase tracking-widest hover:text-amber-600">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
