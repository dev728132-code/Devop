import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="relative text-center py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-neon-blue/30 bg-neon-blue/10 rounded-full text-neon-blue font-mono text-sm uppercase mb-8 glow-blue"
        >
          <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          SYSTEM LIVE // SECURE
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 uppercase"
        >
          SSPHERE <span className="text-neon-purple text-glow-purple">PANEL</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl text-lg md:text-xl font-light mb-10"
        >
          The most secure, high-performance augmentation suite on the market. 
          Premium gaming mods built for dominance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/buy" className="inline-flex px-8 py-4 bg-neon-purple text-white font-bold font-mono tracking-widest uppercase rounded-lg glow-purple hover:scale-105 transition-all">
            Access Products
          </Link>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-dark-surface border border-white/5 rounded-xl hover:border-neon-purple/30 transition-all group">
          <div className="w-12 h-12 bg-neon-purple/10 border border-neon-purple/20 rounded-lg flex items-center justify-center mb-4 group-hover:glow-purple transition-all">
            <Crosshair className="text-neon-purple" />
          </div>
          <h3 className="text-xl font-bold mb-2">Premium Aimbot</h3>
          <p className="text-gray-400 text-sm">Precise bone targeting, customizable FOV for a natural look.</p>
        </div>
        <div className="p-6 bg-dark-surface border border-white/5 rounded-xl hover:border-neon-blue/30 transition-all group">
          <div className="w-12 h-12 bg-neon-blue/10 border border-neon-blue/20 rounded-lg flex items-center justify-center mb-4 group-hover:glow-blue transition-all">
            <Zap className="text-neon-blue" />
          </div>
          <h3 className="text-xl font-bold mb-2">Advanced ESP</h3>
          <p className="text-gray-400 text-sm">Total situational awareness. See enemies through geometry.</p>
        </div>
        <div className="p-6 bg-dark-surface border border-white/5 rounded-xl hover:border-neon-pink/30 transition-all group">
          <div className="w-12 h-12 bg-neon-pink/10 border border-[#ff0055]/20 rounded-lg flex items-center justify-center mb-4 transition-all" style={{boxShadow: '0 0 15px rgba(255,0,85,0.2)'}}>
            <Shield className="text-[#ff0055]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Undetected Spoofer</h3>
          <p className="text-gray-400 text-sm">Integrated dynamic hardware ID spoofing.</p>
        </div>
      </section>
    </div>
  );
}
