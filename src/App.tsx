/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';

// Mock imports for pages (we will create them next)
import Home from './pages/Home';
import Auth from './pages/Auth';
import Buy from './pages/Buy';
import ProductDetail from './pages/ProductDetail';
import Payment from './pages/Payment';
import History from './pages/History';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

import Wallet from './pages/Wallet';

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState('Authenticating Process...');

  useEffect(() => {
    const texts = [
      'Authenticating Process...',
      'Loading Secure System...',
      'Connecting Database...',
      'Welcome To Ssphere Panel'
    ];
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      if (step < texts.length) {
        setText(texts[step]);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 bg-[#09090b] flex flex-col items-center justify-center z-[100]"
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative w-32 h-32 mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-neon-purple shadow-[0_0_30px_rgba(176,38,255,0.4)]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-l-2 border-neon-blue shadow-[0_0_30px_rgba(0,240,255,0.4)]"
        />
        <div className="absolute inset-0 flex items-center justify-center text-neon-purple font-mono font-bold text-2xl glow-purple text-glow-purple">
          SP
        </div>
      </div>
      <motion.h2 
        key={text}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="text-white font-mono text-xl tracking-widest text-center"
      >
        {text}
      </motion.h2>
    </motion.div>
  );
}

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return null; // let global loading handle it if needed
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}


function AppRoutes() {
  const { user, loading } = useAuth();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  if (loading) {
    return <div className="min-h-screen bg-dark-bg" />;
  }

  return (
    <>
      <AnimatePresence>
        {showLoadingScreen && (
          <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />
        )}
      </AnimatePresence>

      {!showLoadingScreen && (
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Auth />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="buy" element={<Buy />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="pay/:productId/:planId" element={<Payment />} />
            <Route path="history" element={<History />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster theme="dark" position="top-center" toastOptions={{
          style: { background: '#121214', border: '1px solid rgba(176,38,255,0.3)', color: '#fff' }
        }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
