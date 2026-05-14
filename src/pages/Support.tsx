import React from 'react';
import { Phone, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function Support() {
  const whatsappNumber = '9470851455';

  const copyNumber = () => {
    navigator.clipboard.writeText(whatsappNumber);
    toast.success('Number copied to clipboard');
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-dark-surface border border-white/10 rounded-2xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex flex-col items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl animate-pulse" />
          <Phone size={32} className="text-green-500 relative z-10" />
        </div>
        
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Contact Support</h1>
        <p className="text-gray-400 font-mono text-sm mb-8">
          Our support team is available 24/7 on WhatsApp.
        </p>

        <div className="space-y-4">
          <button 
            onClick={openWhatsApp}
            className="w-full py-4 bg-green-600 text-white font-bold font-mono tracking-widest uppercase rounded-lg flex justify-center items-center gap-2 hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
            <ExternalLink size={20} />
            Contact on WhatsApp
          </button>
          
          <button 
            onClick={copyNumber}
            className="w-full py-4 bg-white/5 text-white font-bold font-mono tracking-widest uppercase border border-white/10 rounded-lg hover:bg-white/10 transition-all"
          >
            Copy Number
          </button>
        </div>
      </motion.div>
    </div>
  );
}
