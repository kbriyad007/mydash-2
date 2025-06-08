
// lib/fetchLatestOrders.ts
import {
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust based on your setup

export interface Order {
  id: string;
  userId: string;
  orderId: string;
  name: string;
  address: string;
  mobile: string;
  productName: string;
  productPrice: string;
  createdAt: number;
}

export async function fetchLatestOrders(): Promise<Order[]> {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const allOrders: Order[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const ordersSnapshot = await getDocs(
      collection(db, `users/${userId}/orders`)
    );

    for (const orderDoc of ordersSnapshot.docs) {
      const data = orderDoc.data();
      allOrders.push({
        id: `${userId}_${orderDoc.id}`,
        userId,
        orderId: orderDoc.id,
        name: data.name || "",
        address: data.address || "",
        mobile: data.mobile || "",
        productName: data.productName || "",
        productPrice: data.productPrice || "",
        createdAt: data.createdAt?.toMillis?.() || 0,
      });
    }
  }

  // Sort by createdAt descending and return top 3
  return allOrders
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);
}
