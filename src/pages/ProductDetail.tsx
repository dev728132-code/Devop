import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ArrowRight, Settings, Smartphone, Apple, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_PRODUCTS } from '../lib/defaultProducts';

export default function ProductDetail() {
  const { id } = useParams<{id: string}>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Check DEFAULT_PRODUCTS
          const defaultProduct = DEFAULT_PRODUCTS.find(p => p.id === id);
          if (defaultProduct) {
            setProduct(defaultProduct);
          } else {
            toast.error("Product not found");
            navigate('/buy');
          }
        }
      } catch (err) {
        console.error(err);
        const defaultProduct = DEFAULT_PRODUCTS.find(p => p.id === id);
        if (defaultProduct) {
          setProduct(defaultProduct);
        } else {
          toast.error("Product not found");
          navigate('/buy');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('root') && p.includes('android')) return <Settings size={32} className="text-neon-blue" />;
    if (p.includes('android')) return <Smartphone size={32} className="text-green-400" />;
    if (p.includes('ios')) return <Apple size={32} className="text-white" />;
    if (p.includes('pc')) return <Monitor size={32} className="text-neon-purple" />;
    return <Shield size={32} className="text-neon-purple" />;
  };

  if (loading) {
    return <div className="animate-spin w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full mx-auto mt-20" />;
  }
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 rpunded-full blur-[80px]" />
        
        <div className="flex items-center gap-6 mb-8 relative z-10">
          <div className="w-20 h-20 bg-black/50 border border-neon-purple/30 rounded-xl flex items-center justify-center glow-purple overflow-hidden p-1">
            {product.logo ? (
              <img src={product.logo} alt={product.title} className="w-full h-full object-contain" />
            ) : (
              getPlatformIcon(product.platform)
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight">{product.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-mono bg-white/10 px-3 py-1 rounded text-gray-300">
                {product.platform}
              </span>
              {product.isActive && (
                <span className="text-sm font-mono text-neon-blue border border-neon-blue/30 bg-neon-blue/10 px-3 py-1 rounded glow-blue">
                  OPERATIONAL
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none relative z-10">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{product.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-mono tracking-widest text-gray-400 mb-6">SELECT PLAN</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {product.plans?.map((plan: any) => {
            const isReseller = userData?.role === 'reseller';
            const price = isReseller ? plan.resellerPrice : plan.price;
            
            return (
              <div 
                key={plan.id}
                onClick={() => navigate(`/pay/${product.id}/${plan.id}`)}
                className="bg-black border border-white/10 hover:border-neon-purple p-6 rounded-xl cursor-pointer transition-all hover:bg-neon-purple/5 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase">{plan.days} DAYS</h3>
                    {isReseller && <span className="text-xs text-neon-purple font-mono">Reseller Pricing Active</span>}
                  </div>
                  <ArrowRight className="text-gray-600 group-hover:text-neon-purple transition-colors" />
                </div>
                <div className="mt-8 flex items-end gap-1">
                  <span className="text-gray-400 text-lg">₹</span>
                  <span className="text-4xl font-bold text-white group-hover:text-glow-purple">{price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
