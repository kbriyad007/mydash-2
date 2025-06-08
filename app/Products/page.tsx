"use client";

import React, { useEffect, useState } from "react";
import { fetchNames, OrderData } from "../../lib/fetchNames";
import { Timestamp } from "firebase/firestore";

export default function ProductsPage() {
  const [allOrders, setAllOrders] = useState<OrderData[]>([]);
  const [latestTwoOrders, setLatestTwoOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const data = await fetchNames();

      const sorted = data
        .filter((order) => order.Time instanceof Timestamp)
        .sort(
          (a, b) =>
            (b.Time as Timestamp).toMillis() - (a.Time as Timestamp).toMillis()
        );

      setAllOrders(data);
      setLatestTwoOrders(sorted.slice(0, 2));
      setLoading(false);
    }

    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-lg animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-white">
        📦 Orders Overview
      </h1>

      {/* Block 1: All Orders */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">
          All Orders <span className="text-blue-400">({allOrders.length})</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allOrders.map((order, i) => (
            <div
              key={order.orderId || i}
              className="bg-slate-800 backdrop-blur-md p-5 rounded-xl shadow-md border border-slate-700 hover:border-blue-500 transition-all"
            >
              <p className="mb-1">
                <strong className="text-blue-300">Name:</strong>{" "}
                {typeof order.Name === "string" ? order.Name : "N/A"}
              </p>
              <p className="mb-1">
                <strong className="text-blue-300">Order ID:</strong>{" "}
                {order.orderId}
              </p>
              <p className="text-sm text-slate-400">
                <strong>Time:</strong>{" "}
                {order.Time instanceof Timestamp
                  ? order.Time.toDate().toLocaleString()
                  : "No timestamp"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Block 2: Latest 2 Orders */}
      <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">
          🚀 Latest 2 Orders
        </h2>
        <div className="space-y-6">
          {latestTwoOrders.length === 0 && (
            <p className="text-slate-400">No recent orders found.</p>
          )}
          {latestTwoOrders.map((order, i) => (
            <div
              key={order.orderId || i}
              className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg border-l-8 border-white/30"
            >
              <p className="text-xl font-semibold text-white mb-1">
                {typeof order.Name === "string" ? order.Name : "N/A"}
              </p>
              <p className="text-slate-100">
                <span className="text-sm text-slate-300">Order ID:</span>{" "}
                <span className="font-mono">{order.orderId}</span>
              </p>
              <p className="text-sm text-slate-300 mt-1">
                Time:{" "}
                {order.Time instanceof Timestamp
                  ? order.Time.toDate().toLocaleString()
                  : "No timestamp"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
