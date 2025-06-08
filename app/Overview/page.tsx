"use client";

import { useEffect, useState } from "react";
import { fetchLatestOrders, OrderData } from "../../lib/fetchLatestOrders";
import { Timestamp } from "firebase/firestore";

export default function OverviewPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const latestOrders = await fetchLatestOrders();
      setOrders(latestOrders);
      setLoading(false);
    }
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10 md:py-16 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center">
        📦 Latest 3 Orders
      </h1>

      {loading ? (
        <p className="text-center text-slate-400 animate-pulse">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-slate-400">No orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md border border-slate-700">
          <table className="w-full text-left bg-slate-800">
            <thead className="bg-slate-700 text-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Address</th>
                <th className="px-4 py-3 font-semibold">Mobile</th>
                <th className="px-4 py-3 font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-t border-slate-600 hover:bg-slate-700/50 transition"
                >
                  <td className="px-4 py-3">{order.name || "N/A"}</td>
                  <td className="px-4 py-3">{order.productName || "N/A"}</td>
                  <td className="px-4 py-3">{order.productPrice || "N/A"}</td>
                  <td className="px-4 py-3">{order.address || "N/A"}</td>
                  <td className="px-4 py-3">{order.mobile || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {order.createdAt instanceof Timestamp
                      ? order.createdAt.toDate().toLocaleString()
                      : "No timestamp"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
