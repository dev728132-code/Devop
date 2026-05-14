import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Shield, Settings, Monitor, Smartphone, Apple } from 'lucide-react';
import { motion } from 'motion/react';
import { DEFAULT_PRODUCTS, DEFAULT_PLANS } from '../lib/defaultProducts';

interface Product {
  id: string;
  title: string;
  platform: string;
  description: string;
  isActive: boolean;
  logo?: string;
  plans: any[];
}

export default function Buy() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        const dbProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        // Merge DB products with Default Products
        const dbMap = new Map(dbProducts.map(p => [p.id, p]));
        
        const mergedProducts = DEFAULT_PRODUCTS.map(defaultProd => {
          return dbMap.get(defaultProd.id) || defaultProd;
        });
        
        // Add any DB products that aren't in DEFAULT_PRODUCTS
        dbProducts.forEach(dbProd => {
          if (!DEFAULT_PRODUCTS.some(dp => dp.id === dbProd.id)) {
            mergedProducts.push(dbProd);
          }
        });

        setProducts(mergedProducts.filter(p => p.isActive));
      } catch (error) {
        console.error("Error fetching products", error);
        setProducts(DEFAULT_PRODUCTS.filter(p => p.isActive));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('root') && p.includes('android')) return <Settings className="text-neon-blue" />;
    if (p.includes('android')) return <Smartphone className="text-green-400" />;
    if (p.includes('ios')) return <Apple className="text-white" />;
    if (p.includes('pc')) return <Monitor className="text-neon-purple" />;
    return <Shield className="text-neon-purple" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-sans uppercase">Products Marketplace</h1>
        <p className="text-gray-400 font-mono text-sm max-w-xl">
          Purchase premium access keys below. All products feature instant delivery upon payment verification.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full" />
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-dark-surface border border-white/5 rounded-xl">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Data Available Yet</h2>
          <p className="text-gray-500">Products will be listed here soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-dark-surface border border-white/10 rounded-xl p-6 hover:border-neon-purple/50 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center group-hover:glow-purple transition-all overflow-hidden p-1">
                  {product.logo ? (
                    <img src={product.logo} alt={product.title} className="w-full h-full object-contain" />
                  ) : (
                    getPlatformIcon(product.platform)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight uppercase">{product.title}</h3>
                  <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">{product.platform}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                {product.description}
              </p>
              <button className="w-full py-3 bg-white/5 border border-white/10 text-white font-mono text-sm rounded-lg group-hover:bg-neon-purple/10 group-hover:border-neon-purple/50 group-hover:text-neon-purple transition-all">
                VIEW OPTIONS
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
