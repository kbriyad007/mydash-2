"use client";

import React, { useEffect, useState } from "react";
import { fetchLatestOrders, Order } from "@/lib/fetchLatestOrders";
import { Timestamp } from "firebase/firestore";

export default function ProductsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const latestOrders = await fetchLatestOrders();
        setOrders(latestOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-lg animate-pulse">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-lg">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center">
        📦 Latest 5 Orders
      </h1>

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
                  {order.createdAt instanceof Date
                    ? order.createdAt.toLocaleString()
                    : "No date"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
