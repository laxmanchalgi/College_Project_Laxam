import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminSignup, setIsAdminSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(email, password, name, isAdminSignup ? "ADMIN" : "USER");
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
          <h2 className="text-4xl font-serif">Join ExploreSphere</h2>
          <p className="mt-2 text-sm text-black/50">Begin your journey to extraordinary destinations</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all" placeholder="John Doe" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all" placeholder="name@example.com" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-brand-paper rounded-2xl outline-none focus:ring-2 ring-brand-gold/20 transition-all" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                id="admin-signup"
                checked={isAdminSignup}
                onChange={(e) => setIsAdminSignup(e.target.checked)}
                className="w-4 h-4 rounded border-black/10 text-brand-gold focus:ring-brand-gold/20"
              />
              <label htmlFor="admin-signup" className="text-xs font-bold uppercase tracking-widest text-black/40 cursor-pointer">
                Sign up as Administrator
              </label>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-5 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-all flex items-center justify-center gap-3">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
        <p className="text-center text-sm text-black/40 mt-8">Already have an account? <Link to="/login" className="text-brand-gold font-bold uppercase tracking-widest hover:text-amber-600">Sign In</Link></p>
      </div>
    </div>
  );
}
