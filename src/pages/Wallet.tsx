import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Wallet as WalletIcon, Plus, CheckCircle, Clock, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function Wallet() {
  const { user, userData } = useAuth();
  const [amount, setAmount] = useState<number | ''>('');
  const [utr, setUtr] = useState('');
  const [step, setStep] = useState<'input' | 'payment' | 'processing'>('input');
  const [showUtrInput, setShowUtrInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const upiId = '7563075001@axl';

  const handleAddFunds = () => {
    if (!amount || amount < 10) {
      toast.error('Minimum add amount is ₹10');
      return;
    }
    setStep('payment');
  };

  const handleSubmitUtr = async () => {
    if (!utr || utr.length < 5) {
      toast.error('Please enter a valid UTR / Transaction Reference number.');
      return;
    }
    
    setLoading(true);
    
    try {
      if (user) {
        await addDoc(collection(db, 'wallet_requests'), {
          userId: user.uid,
          userEmail: user.email,
          amount: Number(amount),
          utr: utr,
          status: 'pending',
          createdAt: serverTimestamp()
        });
        toast.success(`Request submitted! Wait for admin verification.`);
        setStep('processing');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID Copied');
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2 flex items-center gap-2">
          <WalletIcon size={32} className="text-neon-purple" /> My Wallet
        </h1>
        <p className="text-gray-400 font-mono text-sm">Add funds safely and securely.</p>
      </div>

      <motion.div 
        className="bg-black/80 border border-neon-purple/30 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue glow-purple"></div>
        <p className="text-gray-400 font-mono text-sm mb-2 uppercase">Available Balance</p>
        <h2 className="text-5xl font-bold text-white tracking-widest">
          ₹{userData?.walletBalance?.toFixed(2) || '0.00'}
        </h2>
      </motion.div>

      {step === 'input' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-surface border border-white/10 rounded-xl p-6">
          <h3 className="font-bold uppercase tracking-wider mb-4">Add Funds</h3>
          <div className="flex bg-black border border-white/10 rounded-lg overflow-hidden mb-4 focus-within:border-neon-purple transition-colors">
            <div className="bg-white/5 px-4 flex items-center justify-center font-mono text-gray-400 border-r border-white/10">₹</div>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent px-4 py-3 outline-none font-mono text-xl"
              placeholder="100.00"
              min="10"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[100, 500, 1000, 2000].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val)}
                className="bg-white/5 hover:bg-neon-purple/20 border border-white/5 hover:border-neon-purple/30 rounded py-2 font-mono text-sm transition-colors text-gray-300"
              >
                +{val}
              </button>
            ))}
          </div>
          <button 
            onClick={handleAddFunds}
            className="w-full py-4 bg-neon-purple text-white font-bold font-mono tracking-widest uppercase rounded-lg flex justify-center items-center gap-2 glow-purple hover:bg-neon-purple/80 transition-all"
          >
            <Plus size={20} /> Proceed to Pay
          </button>
        </motion.div>
      )}

      {step === 'payment' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="bg-dark-surface border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-gray-400 text-sm font-mono uppercase mb-2">Amount to Pay</h3>
            <div className="text-4xl font-bold text-white mb-6">₹{amount}</div>

            <div className="bg-white p-4 rounded-xl mb-6 shadow-[0_0_20px_rgba(176,38,255,0.2)] inline-block w-[200px] h-[200px]">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=SSphere&am=${amount}&cu=INR`} 
                alt="UPI QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex items-center gap-3 bg-black border border-white/10 p-3 rounded-lg w-full justify-between mb-4">
              <div className="text-left">
                <span className="text-xs text-gray-400 block uppercase">Pay to UPI ID</span>
                <span className="font-mono text-sm">{upiId}</span>
              </div>
              <button onClick={copyUpi} className="p-2 hover:bg-white/10 rounded text-neon-purple transition-colors">
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="bg-black border border-neon-blue/30 rounded-2xl p-6">
            {!showUtrInput ? (
              <button 
                onClick={() => setShowUtrInput(true)}
                className="w-full py-4 bg-neon-blue text-black font-bold font-mono tracking-widest uppercase rounded-lg flex justify-center items-center gap-2 glow-blue hover:bg-neon-blue/80 transition-all"
              >
                <CheckCircle size={20} /> I HAVE PAID
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-center text-gray-300">Submit UTR Details</h3>
                <p className="text-xs text-center text-gray-400 mb-6 font-mono leading-relaxed">
                  Enter your 12-digit UTR process / Reference number to verify payment.
                </p>
                
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="Enter 12-digit UTR Number"
                  className="w-full bg-dark-surface border border-white/10 rounded-lg px-4 py-3 mb-4 font-mono text-center focus-within:border-neon-blue outline-none transition-colors"
                />

                <button 
                  onClick={handleSubmitUtr}
                  disabled={loading}
                  className="w-full py-4 bg-neon-blue text-black font-bold font-mono tracking-widest uppercase rounded-lg flex justify-center items-center gap-2 glow-blue hover:bg-neon-blue/80 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                       <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                       SUBMITTING...
                    </div>
                  ) : (
                    <><CheckCircle size={20} /> SUBMIT REQUEST</>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {step === 'processing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-surface border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Clock size={48} className="text-neon-blue mb-6" />
          <h3 className="text-xl font-bold mb-2">Pending Verification</h3>
          <p className="text-gray-400 font-mono text-sm max-w-[250px]">Wait 2 minutes or wait 5 minutes for admin verification. Your payment status is pending. Once activated, the balance will be added.</p>
        </motion.div>
      )}
    </div>
  );
}
