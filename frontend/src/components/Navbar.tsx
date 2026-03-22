import React from 'react';
import { Compass, User, Menu, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-black/5">
      <Link to="/" className="flex items-center gap-2">
        <Compass className="w-8 h-8 text-brand-gold" />
        <span className="text-2xl font-serif font-bold tracking-tight">ExploreSphere</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
        <a href="#" className="hover:text-brand-gold transition-colors">Destinations</a>
        <a href="#" className="hover:text-brand-gold transition-colors">Experiences</a>
        <a href="#reviews-section" className="hover:text-brand-gold transition-colors">Reviews</a>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin" className="p-2 hover:bg-brand-gold/10 rounded-full text-brand-gold transition-colors" title="Admin Dashboard">
                <ShieldCheck className="w-5 h-5" />
              </Link>
            )}
            <div onClick={() => navigate("/my-trips")} className="flex items-center gap-2 cursor-pointer">
              <img src={`https://ui-avatars.com/api/?name=${user.displayName || user.email}`} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-brand-gold/20" referrerPolicy="no-referrer" />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest text-black/60">{user.displayName?.split(' ')[0] || 'User'}</span>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/40 hover:text-red-500" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 hover:bg-black/5 rounded-full transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4" /> Sign In
            </Link>
          </div>
        )}
        <button className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors"><Menu className="w-5 h-5" /></button>
        <Link to="/booking" className="hidden md:block px-6 py-2 bg-brand-dark text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">Plan Your Trip</Link>
      </div>
    </nav>
  );
}
