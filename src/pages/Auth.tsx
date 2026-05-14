import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';
import { Key, User, ShieldAlert, Mail } from 'lucide-react';

export default function Auth() {
  const [authMode, setAuthMode] = useState<'google' | 'password' | 'admin'>('google');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfigError, setShowConfigError] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Successfully logged in with Google');
    } catch (error: any) {
      toast.error(error.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowConfigError(false);

    try {
      if (isLogin || authMode === 'admin') {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login Successful');
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords don't match");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account Created Successfully');
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error('Invalid Email Or Password');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('Account Not Found. Please Signup First.');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already registered. Please login.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setShowConfigError(true);
        toast.error('Authentication method not enabled.');
      } else {
        toast.error(error.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-dark-surface/80 backdrop-blur-xl p-8 rounded-2xl border border-neon-purple/20 shadow-[0_0_30px_rgba(176,38,255,0.1)] relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-purple/20 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-blue/20 rounded-full blur-[50px] pointer-events-none" />

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center glow-purple mb-4">
            <Key size={32} className="text-neon-purple" />
          </div>
          <h1 className="text-2xl font-bold font-sans text-glow-purple tracking-wider">SSPHERE PANEL</h1>
          <p className="text-sm text-gray-400 mt-2 font-mono">Premium Gaming Access</p>
        </div>

        {showConfigError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-left"
          >
            <div className="flex items-center gap-2 text-red-500 mb-2 font-bold font-mono">
              <ShieldAlert size={18} /> SETUP REQUIRED
            </div>
            <p className="text-xs text-red-200 mb-4 font-mono leading-relaxed">
              Email/Password login is currently disabled in your Firebase database. You must enable it to use this feature.
            </p>
            <div className="text-xs text-gray-300 font-mono space-y-1 pl-4 border-l-2 border-red-500/50">
              <p>1. Go to Firebase Console</p>
              <p>2. Open Authentication &gt; Sign-in method</p>
              <p>3. Click "Email/Password"</p>
              <p>4. Toggle it ON and save</p>
            </div>
          </motion.div>
        )}

        <div className="flex gap-2 mb-6 relative z-10">
          <button
            onClick={() => setAuthMode('google')}
            className={`flex-1 py-2 font-mono text-xs uppercase rounded transition-all flex items-center justify-center gap-2 ${authMode === 'google' ? 'bg-neon-purple/20 text-white border border-neon-purple' : 'opacity-50 hover:opacity-100 hover:bg-white/5'}`}
          >
            <User size={14} /> Users
          </button>
          <button
            onClick={() => setAuthMode('admin')}
            className={`flex-1 py-2 font-mono text-xs uppercase rounded transition-all flex items-center justify-center gap-2 ${authMode === 'admin' ? 'bg-neon-blue/20 text-white border border-neon-blue' : 'opacity-50 hover:opacity-100 hover:bg-white/5'}`}
          >
            <ShieldAlert size={14} /> Owner
          </button>
        </div>

        {authMode === 'google' ? (
          <div className="space-y-4 relative z-10">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition-all font-sans"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-mono text-gray-500 uppercase">Or use email</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            <button 
              onClick={() => setAuthMode('password')}
              className="w-full py-4 bg-transparent border border-white/20 text-white font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-white/5 transition-all font-mono text-sm uppercase"
            >
              <Mail size={18} /> Continue with Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {authMode === 'admin' && (
              <div className="mb-4 p-3 bg-neon-blue/10 border border-neon-blue/30 rounded text-xs font-mono text-neon-blue">
                OWNER PORTAL: Enter your admin credentials to access the SSphere Dashboard.
              </div>
            )}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${authMode === 'admin' ? 'border-neon-blue/30 focus:border-neon-blue' : 'border-white/10 focus:border-neon-purple'}`}
                placeholder={authMode === 'admin' ? "owner@gmail.com" : "user@example.com"}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${authMode === 'admin' ? 'border-neon-blue/30 focus:border-neon-blue' : 'border-white/10 focus:border-neon-purple'}`}
                placeholder="••••••••"
              />
            </div>

            <AnimatePresence>
              {(!isLogin && authMode === 'password') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider mt-4">Confirm Password</label>
                  <input 
                    type="password" 
                    required={!isLogin}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
                    placeholder="••••••••"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full p-4 mt-6 text-white font-bold rounded-lg transition-all disabled:opacity-50 ${authMode === 'admin' ? 'bg-neon-blue hover:bg-neon-blue/80 glow-blue text-black' : 'bg-neon-purple hover:bg-neon-purple/80 glow-purple'}`}
            >
              {loading ? 'Processing...' : (authMode === 'admin' || isLogin) ? 'ACCESS TERMINAL' : 'CREATE ACCOUNT'}
            </button>
          </form>
        )}

        {authMode === 'password' && (
          <div className="mt-6 text-center relative z-10 flex flex-col gap-3">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              type="button"
              className="text-sm text-gray-400 font-mono hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
            <button 
              onClick={() => setAuthMode('google')}
              type="button"
              className="text-xs text-gray-500 font-mono hover:text-white transition-colors"
            >
              ← Back to Google Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
