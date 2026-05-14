import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders');
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-sans uppercase text-glow-purple glow-purple inline-block">OWNER DASHBOARD</h1>
      
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {['orders', 'products', 'users', 'wallet funds'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-mono text-sm uppercase rounded-lg border transition-all whitespace-nowrap
              ${activeTab === tab ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(176,38,255,0.3)]' : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'}`}
          >
            Manage {tab}
          </button>
        ))}
      </div>

      <div className="bg-dark-surface border border-white/10 rounded-2xl p-6 min-h-[500px]">
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'users' && <UsersManager />}
        {activeTab === 'wallet funds' && <WalletFundsManager />}
      </div>
    </div>
  );
}

function WalletFundsManager() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, 'wallet_requests'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({id: d.id, ...d.data()}));
        data.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleStatus = async (reqId: string, userId: string, amount: number, status: string) => {
    try {
      if (status === 'approved') {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDocs(query(collection(db, 'users')));
        const userDoc = userSnap.docs.find(d => d.id === userId);
        if (userDoc) {
          const u = userDoc.data();
          await updateDoc(userRef, { walletBalance: (u.walletBalance || 0) + amount });
        }
      }
      await updateDoc(doc(db, 'wallet_requests', reqId), { status });
      setRequests(requests.map(r => r.id === reqId ? {...r, status} : r));
      toast.success(`Request ${status}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold uppercase mb-4">Wallet Fund Requests</h2>
      {requests.length === 0 ? <p className="text-gray-500">No requests.</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-mono whitespace-nowrap">
          <thead className="bg-black/50 text-gray-400">
            <tr>
              <th className="p-3 uppercase">User</th>
              <th className="p-3 uppercase">Amount</th>
              <th className="p-3 uppercase">UTR</th>
              <th className="p-3 uppercase">Status</th>
              <th className="p-3 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="p-3">{r.userEmail}</td>
                <td className="p-3">₹{r.amount}</td>
                <td className="p-3 font-mono text-neon-blue">{r.utr}</td>
                <td className="p-3 uppercase font-bold">
                  <span className={r.status === 'pending' ? 'text-yellow-500' : r.status === 'approved' ? 'text-neon-blue' : 'text-red-500'}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatus(r.id, r.userId, r.amount, 'approved')} className="bg-neon-blue/20 text-neon-blue px-2 py-1 rounded hover:bg-neon-blue/40 border border-neon-blue/50">Approve</button>
                      <button onClick={() => handleStatus(r.id, r.userId, r.amount, 'rejected')} className="bg-red-500/20 text-red-500 px-2 py-1 rounded hover:bg-red-500/40 border border-red-500/50">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({id: d.id, ...d.data()}));
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const seedProducts = async () => {
    setLoading(true);
    const defaultProducts = [
      { title: "BR MOD FF \u2013 PC VERSION", platform: "PC" },
      { title: "BR MOD FF \u2013 ROOT + VPHONE", platform: "ROOT + VPHONE" },
      { title: "DRIPCLIENT FF \u2013 PC AIMKILL", platform: "PC" },
      { title: "DRIPCLIENT \u2013 NONROOT FF", platform: "NONROOT" },
      { title: "DRIPCLIENT \u2013 ROOT FF", platform: "ROOT" },
      { title: "HG CHEATS FF \u2013 NONROOT + ROOT", platform: "NONROOT + ROOT" },
      { title: "IOS FF PANEL \u2013 ALL", platform: "IOS" },
      { title: "PATO TEAM FF \u2013 NONROOT + ROOT", platform: "NONROOT + ROOT" },
      { title: "PRIME HOOK FF \u2013 NONROOT", platform: "NONROOT" },
      { title: "XYZ CHEATS FF \u2013 ROOT + VPHONE", platform: "ROOT + VPHONE" }
    ];
    
    // Default plans
    const plans = [
      { id: 'p1', days: 1, price: 50, resellerPrice: 30 },
      { id: 'p3', days: 3, price: 100, resellerPrice: 70 },
      { id: 'p7', days: 7, price: 200, resellerPrice: 150 },
      { id: 'p15', days: 15, price: 350, resellerPrice: 280 },
      { id: 'p30', days: 30, price: 600, resellerPrice: 500 }
    ];

    try {
      for (const p of defaultProducts) {
        await addDoc(collection(db, 'products'), {
          ...p,
          description: "Premium augmentation featuring aimbot, ESP, spoofer and more. 100% undetected.",
          isActive: true,
          plans,
          createdAt: serverTimestamp()
        });
      }
      toast.success("Products seeded successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to seed products");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold uppercase">Marketplace Products</h2>
        {products.length === 0 && (
          <button onClick={seedProducts} className="bg-neon-purple text-white px-4 py-2 font-mono text-sm uppercase rounded shadow-[0_0_15px_rgba(176,38,255,0.4)]">
            Seed Default Products
          </button>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="p-4 border border-white/10 rounded bg-black/40">
              <h3 className="font-bold">{p.title}</h3>
              <span className="text-xs text-gray-400 font-mono">{p.platform}</span>
              <div className="mt-2 text-xs text-neon-blue">{p.plans.length} Pricing Plans active</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found. Click seed button.</p>
      )}
    </div>
  )
}

function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({id: d.id, ...d.data()}));
        data.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleStatus = async (orderId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'approved') {
        updateData.key = 'SSPHERE-' + Math.random().toString(36).substring(2, 12).toUpperCase();
      }
      await updateDoc(doc(db, 'orders', orderId), updateData);
      setOrders(orders.map(o => o.id === orderId ? {...o, ...updateData} : o));
      toast.success(`Order ${status}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold uppercase mb-4">Latest Orders</h2>
      {orders.length === 0 ? <p className="text-gray-500">No Data Available Yet</p> : null}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-mono whitespace-nowrap">
          <thead className="bg-black/50 text-gray-400">
            <tr>
              <th className="p-3 uppercase">User</th>
              <th className="p-3 uppercase">Product</th>
              <th className="p-3 uppercase">Plan</th>
              <th className="p-3 uppercase">Amount</th>
              <th className="p-3 uppercase">TxN ID</th>
              <th className="p-3 uppercase">Status</th>
              <th className="p-3 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-white/5">
                <td className="p-3 truncate max-w-[150px]">{o.userEmail}</td>
                <td className="p-3">{o.productTitle}</td>
                <td className="p-3">{o.planDays}D</td>
                <td className="p-3">₹{o.amount}</td>
                <td className="p-3 font-mono text-neon-blue">{o.transactionId}</td>
                <td className="p-3 uppercase font-bold">
                  <span className={o.status === 'pending' ? 'text-yellow-500' : o.status === 'approved' ? 'text-neon-blue' : 'text-red-500'}>
                    {o.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  {o.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatus(o.id, 'approved')} className="bg-neon-blue/20 text-neon-blue px-2 py-1 rounded hover:bg-neon-blue/40 border border-neon-blue/50">Approve</button>
                      <button onClick={() => handleStatus(o.id, 'rejected')} className="bg-red-500/20 text-red-500 px-2 py-1 rounded hover:bg-red-500/40 border border-red-500/50">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
       try {
         const q = query(collection(db, 'users'));
         const snap = await getDocs(q);
         const data = snap.docs.map(d => ({id: d.id, ...d.data()}));
         data.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
         setUsers(data);
       } catch (err) {
         console.error(err);
       } finally {
         setLoading(false);
       }
    };
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update role');
    }
  };

  const handleUpdateBanStatus = async (userId: string, isBanned: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isBanned });
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned } : u));
      toast.success(isBanned ? 'User has been banned' : 'User ban removed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update ban status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold uppercase mb-4">User Management</h2>
      {users.length === 0 ? <p className="text-gray-500">No Users Available</p> : null}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-mono whitespace-nowrap">
          <thead className="bg-black/50 text-gray-400">
            <tr>
              <th className="p-3 uppercase">Email</th>
              <th className="p-3 uppercase">Signup Date</th>
              <th className="p-3 uppercase">Role</th>
              <th className="p-3 uppercase">Status</th>
              <th className="p-3 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/5">
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-gray-400">
                  {u.createdAt ? new Date(u.createdAt.toMillis()).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-3 uppercase">
                  <span className={u.role === 'admin' ? 'text-neon-blue font-bold' : u.role === 'reseller' ? 'text-purple-400' : 'text-gray-300'}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 uppercase font-bold">
                  {u.isBanned ? (
                     <span className="text-red-500">Banned</span>
                  ) : (
                     <span className="text-green-500">Active</span>
                  )}
                </td>
                <td className="p-3 text-right space-x-2">
                  {u.role !== 'admin' && (
                    <>
                      {u.role === 'user' ? (
                         <button onClick={() => handleUpdateRole(u.id, 'reseller')} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded hover:bg-purple-500/40 border border-purple-500/50">Make Reseller</button>
                      ) : (
                         <button onClick={() => handleUpdateRole(u.id, 'user')} className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded hover:bg-gray-500/40 border border-gray-500/50">Demote</button>
                      )}
                      
                      {u.isBanned ? (
                         <button onClick={() => handleUpdateBanStatus(u.id, false)} className="bg-green-500/20 text-green-500 px-2 py-1 rounded hover:bg-green-500/40 border border-green-500/50">Unban</button>
                      ) : (
                         <button onClick={() => handleUpdateBanStatus(u.id, true)} className="bg-red-500/20 text-red-500 px-2 py-1 rounded hover:bg-red-500/40 border border-red-500/50">Ban</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

