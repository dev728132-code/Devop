import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { DEFAULT_PRODUCTS } from '../lib/defaultProducts';

export default function Payment() {
  const { productId, planId } = useParams<{productId: string, planId: string}>();
  const [product, setProduct] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const upiId = '7563075001@axl';

  useEffect(() => {
    if (!productId || !planId) return;
    const fetchDetails = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        let prod: any = null;
        
        if (docSnap.exists()) {
          prod = { id: docSnap.id, ...docSnap.data() };
        } else {
          prod = DEFAULT_PRODUCTS.find(p => p.id === productId);
        }

        if (prod) {
          setProduct(prod);
          const p = prod.plans?.find((x: any) => x.id === planId);
          if (p) {
            setPlan(p);
          } else {
            toast.error("Plan not found");
            navigate(-1);
          }
        } else {
          toast.error("Product not found");
          navigate(-1);
        }
      } catch (err) {
        console.error(err);
        const prod = DEFAULT_PRODUCTS.find(p => p.id === productId);
        if (prod) {
          setProduct(prod);
          const p = prod.plans?.find((x: any) => x.id === planId);
          if (p) {
            setPlan(p);
          } else {
            toast.error("Plan not found");
            navigate(-1);
          }
        } else {
          toast.error("Product not found");
          navigate(-1);
        }
      }
    };
    fetchDetails();
  }, [productId, planId, navigate]);

  if (!product || !plan) return null;

  const price = userData?.role === 'reseller' ? plan.resellerPrice : plan.price;
  const upiUrl = `upi://pay?pa=${upiId}&pn=Ssphere Panel&am=${price}&cu=INR&tn=Order for ${product.title}`;

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID Copied');
  };

  const handlePayFromWallet = async () => {
    if (!userData || !user) {
      toast.error('You must be logged in to pay with Wallet.');
      return;
    }
    
    if ((userData.walletBalance || 0) < price) {
      toast.error('Influencer balance, please add some funds');
      return;
    }

    setLoading(true);
    toast.info('Processing payment...');
    
    try {
      // Deduct from wallet
      const newBalance = userData.walletBalance - price;
      // In a real app we'd use a transaction or cloud function here
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'users', user.uid), { walletBalance: newBalance });

      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        productId: product.id,
        productTitle: product.title,
        planId: plan.id,
        planDays: plan.days,
        amount: price,
        transactionId: 'WALLET-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'success', 
        createdAt: serverTimestamp(),
      });
      
      toast.success('Payment successful! Order is confirmed.');
      navigate('/history');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Payment failed. Please contact support.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-sans uppercase glow-purple inline-block text-glow-purple px-4 py-2 border border-neon-purple/50 bg-neon-purple/10 rounded-lg">SECURE CHECKOUT</h1>
      </div>

      <div className="bg-dark-surface border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
          <div>
            <h3 className="font-bold text-lg">{product.title}</h3>
            <p className="text-gray-400 font-mono text-sm">{plan.days} DAYS ACCESS</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 uppercase tracking-wider block">Total Amount</span>
            <span className="text-2xl font-bold text-white">₹{price}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-black/50 border border-white/10 p-6 rounded-xl w-full max-w-sm mb-6 text-center">
            <span className="text-gray-400 block uppercase mb-2 text-sm">Wallet Balance</span>
            <span className="font-mono text-3xl font-bold text-white">₹{userData?.walletBalance?.toFixed(2) || '0.00'}</span>
          </div>
          

        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border border-neon-blue/30 rounded-2xl p-6"
      >
        <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-center text-gray-300">Wallet Payment</h3>
        <p className="text-xs text-center text-gray-400 mb-6 font-mono leading-relaxed">
         Your payment will be securely deducted from your wallet balance.
        </p>
        
        {userData && (userData.walletBalance || 0) < price ? (
          <button 
            onClick={() => navigate('/wallet')}
            className="w-full py-4 bg-orange-500/20 text-orange-400 font-bold border border-orange-500/50 font-mono tracking-widest uppercase rounded-lg flex justify-center items-center gap-2 hover:bg-orange-500/30 transition-all"
          >
            INFLUENCER BALANCE, PLEASE ADD SOME FUNDS
          </button>
        ) : (
          <button 
            onClick={handlePayFromWallet}
            disabled={loading}
            className="w-full py-4 bg-neon-blue text-black font-bold font-mono tracking-widest uppercase rounded-lg flex justify-center items-center gap-2 glow-blue hover:bg-neon-blue/80 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                 <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                 PROCESSING...
              </div>
            ) : (
              <><CheckCircle size={20} /> PAY WITH WALLET</>
            )}
          </button>
        )}
      </motion.div>
    </div>
  );
}
