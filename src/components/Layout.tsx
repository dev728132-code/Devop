import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Clock, Phone, Key, Shield, LogOut, Link2, User, Wallet, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function Layout() {
  const { pathname } = useLocation();
  const { userData, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/wallet', icon: <Wallet size={20} />, label: 'Wallet' },
    { to: '/buy', icon: <Key size={20} />, label: 'Buy Key' },
    { to: '/history', icon: <Clock size={20} />, label: 'History' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
    { to: '/support', icon: <Phone size={20} />, label: 'Support' },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', icon: <Shield size={20} />, label: 'Admin' });
  }

  const handleLinkKey = () => {
    navigate('/');
    toast('Buy Key For A Link', {
      icon: '🔗',
      style: { background: '#121214', border: '1px solid #b026ff', color: '#fff' }
    });
  };

  const handleGoBack = () => {
    if (pathname === '/') return;
    
    // Check if we have history to go back to, otherwise fallback to home
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-16 bg-dark-bg/80 backdrop-blur-md border-b border-neon-purple/20 z-50 flex items-center justify-between px-3 lg:px-8">
        <div className="flex items-center gap-2">
          {pathname !== '/' && (
            <button 
              onClick={handleGoBack}
              className="mr-1 sm:mr-3 px-2 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 transition-all flex items-center justify-center gap-1 glow-purple font-mono text-sm uppercase tracking-wider"
              title="Go Back"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div className="w-8 h-8 rounded bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center glow-purple">
            <Key size={16} className="text-neon-purple line-glow" />
          </div>
          <span className="font-sans font-bold tracking-wider text-glow-purple lg:text-lg hidden sm:inline-block">SSPHERE PANEL</span>
        </div>
        <div className="flex items-center gap-4">
          {userData && (
            <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded font-mono text-sm hidden sm:flex">
              <Wallet size={16} /> ₹{userData.walletBalance?.toFixed(2) || '0.00'}
            </div>
          )}
          <button 
            onClick={handleLinkKey}
            className="flex items-center gap-2 text-sm text-neon-blue font-mono hover:text-white transition-colors uppercase border border-neon-blue/30 px-3 py-1 rounded bg-neon-blue/10"
          >
            <Link2 size={16} /> Link Key
          </button>
        </div>
      </header>

      <main className="flex-1 mt-16 p-4 lg:p-8 max-w-7xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-dark-surface/90 backdrop-blur-xl border-t border-neon-purple/20 z-50 flex items-center justify-around px-2 sm:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center w-full h-full text-xs gap-1 transition-all duration-300 ${isActive ? 'text-neon-purple text-glow-purple' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <div className={`${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]' : ''} transition-all`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar for Desktop */}
      <nav className="hidden sm:flex fixed left-0 top-16 bottom-0 w-20 lg:w-48 bg-dark-surface/50 border-r border-neon-purple/10 flex-col py-4 px-2 items-center lg:items-start gap-2 z-40">
        {navItems.map((item) => {
          const isActive = pathname === item.to || (pathname.startsWith(item.to) && item.to !== '/');
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/30 glow-purple' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
            >
              <div className={`${isActive ? 'drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]' : ''}`}>
                {item.icon}
              </div>
              <span className="hidden lg:inline font-medium text-sm tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Adjust main content margin for desktop */}
      <style>{`
        @media (min-width: 640px) {
          main { margin-left: 5rem; padding-bottom: 0; }
        }
        @media (min-width: 1024px) {
          main { margin-left: 12rem; }
        }
      `}</style>
    </div>
  );
}
