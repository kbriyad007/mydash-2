"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase"; // adjust this path

type Order = {
  id: string;
  name: string;
  productName: string;
  createdAt: Timestamp;
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const allOrders: Order[] = [];

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const ordersSnapshot = await getDocs(collection(db, `users/${userId}/orders`));

          ordersSnapshot.forEach(orderDoc => {
            const data = orderDoc.data();
            if (
              data.name &&
              data.productName &&
              data.createdAt instanceof Timestamp
            ) {
              allOrders.push({
                id: orderDoc.id,
                name: data.name,
                productName: data.productName,
                createdAt: data.createdAt,
              });
            }
          });
        }

        // Sort latest first
        allOrders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map(({ id, name, productName, createdAt }) => (
          <li key={id}>
            <strong>{name}</strong> ordered <em>{productName}</em> on{" "}
            {createdAt.toDate().toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

