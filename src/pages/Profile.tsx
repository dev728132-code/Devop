import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User as UserIcon, Mail, Shield, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">My Profile</h1>
        <p className="text-gray-400 font-mono text-sm">Account details and settings.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-surface/50 border border-white/10 rounded-xl p-6 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple group-hover:glow-purple transition-all"></div>
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center glow-purple flex-shrink-0">
            <UserIcon size={32} className="text-neon-purple" />
          </div>
          <div className="flex-grow min-w-0">
            <h2 className="text-xl font-bold truncate">{user?.email || 'Guest User'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${isAdmin ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                {isAdmin ? 'OWNER' : 'MEMBER'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8 bg-black/30 p-4 rounded-lg border border-white/5 relative z-10">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <Mail size={16} className="text-gray-500" />
            <span className="font-mono truncate">{user?.email || 'N/A'}</span>
          </div>
          {isAdmin ? (
             <div className="flex items-center gap-3 text-sm text-gray-300">
               <ShieldAlert size={16} className="text-neon-blue" />
               <span className="font-mono text-neon-blue uppercase">Full Admin Permissions</span>
             </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Shield size={16} className="text-green-500" />
              <span className="font-mono text-green-500 uppercase">Standard User Access</span>
            </div>
         )}
        </div>

        <button 
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 py-4 rounded-lg font-bold text-sm tracking-widest transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
        >
          <LogOut size={18} />
          <span>TERMINATE SESSION (LOGOUT)</span>
        </button>
      </motion.div>
    </div>
  );
}
