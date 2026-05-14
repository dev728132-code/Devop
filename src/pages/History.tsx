import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Key as KeyIcon, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function History() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const docsSnap = await getDocs(q);
        const fetched = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Manual sort since composite index might not exist yet
        fetched.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setOrders(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Key copied to clipboard');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-8">Purchase History</h1>

      {orders.length === 0 ? (
        <div className="text-center p-12 bg-dark-surface border border-white/5 rounded-xl">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No transaction history</h2>
          <p className="text-gray-500">You haven't made any purchases yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-dark-surface border border-white/10 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg uppercase">{order.productTitle}</h3>
                <div className="flex gap-4 mt-2 text-sm font-mono">
                  <span className="text-gray-400">Plan: {order.planDays} Days</span>
                  <span className="text-gray-400">₹{order.amount}</span>
                  <span className="text-gray-500">{order.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">TxN: {order.transactionId}</div>
              </div>

              <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
                {order.status === 'pending' && <span className="flex items-center gap-2 text-yellow-500 text-sm font-mono font-bold bg-yellow-500/10 px-3 py-1 rounded"><Clock size={16}/> PENDING</span>}
                {order.status === 'rejected' && <span className="flex items-center gap-2 text-red-500 text-sm font-mono font-bold bg-red-500/10 px-3 py-1 rounded"><XCircle size={16}/> REJECTED</span>}
                {order.status === 'approved' && (
                  <>
                    <span className="flex items-center gap-2 text-neon-blue text-sm font-mono font-bold bg-neon-blue/10 px-3 py-1 rounded glow-blue"><CheckCircle size={16}/> APPROVED</span>
                    {order.key && (
                      <button 
                        onClick={() => copyKey(order.key)}
                        className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white font-mono text-xs font-bold rounded hover:bg-neon-purple/80 transition-colors mt-2"
                      >
                        <KeyIcon size={14} /> COPY KEY
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
