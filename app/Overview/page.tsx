// app/Overview/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchLatestOrders, OrderData } from '@/lib/fetchLatestOrders';
import { Timestamp } from 'firebase/firestore';

export default function OverviewPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const latest = await fetchLatestOrders();
      setOrders(latest);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">📦 Latest 3 Orders</h1>

      {loading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-slate-400">No recent orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-slate-800 p-4 rounded-xl shadow border border-slate-700"
            >
              <p className="text-lg font-semibold">{order.name}</p>
              <p className="text-sm text-slate-300">{order.productName}</p>
              <p className="text-sm text-slate-400">{order.productPrice}</p>
              <p className="text-xs text-slate-500 mt-1">
                {order.createdAt instanceof Timestamp
                  ? order.createdAt.toDate().toLocaleString()
                  : 'Invalid date'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

