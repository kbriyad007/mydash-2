
// app/overview/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchLatestOrders, Order } from "@/lib/fetchLatestOrders";

export default function OverviewPage() {
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const orders = await fetchLatestOrders();
      setLatestOrders(orders);
      setLoading(false);
    };
    loadOrders();
  }, []);

  if (loading) return <p>Loading latest orders...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Latest 3 Orders</h1>
      <div className="space-y-4">
        {latestOrders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Mobile:</strong> {order.mobile}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Product:</strong> {order.productName}</p>
            <p><strong>Price:</strong> {order.productPrice}</p>
            <p>
              <strong>Ordered At:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
