// lib/fetchLatestOrders.ts
import { db } from './firebase';
import {
  collection,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

export interface OrderData {
  orderId: string;
  name: string;
  productName: string;
  productPrice: string;
  address: string;
  mobile: string;
  createdAt: Timestamp;
}

export async function fetchLatestOrders(): Promise<OrderData[]> {
  // Step 1: Get all users
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const allOrders: OrderData[] = [];

  // Step 2: For each user, fetch orders
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const ordersRef = collection(db, `users/${userId}/orders`);
    const ordersSnapshot = await getDocs(ordersRef);

    ordersSnapshot.forEach((orderDoc) => {
      const data = orderDoc.data();
      if (data.createdAt instanceof Timestamp) {
        allOrders.push({
          orderId: orderDoc.id,
          name: data.name || '',
          productName: data.productName || '',
          productPrice: data.productPrice || '',
          address: data.address || '',
          mobile: data.mobile || '',
          createdAt: data.createdAt,
        });
      }
    });
  }

  // Step 3: Sort all orders by createdAt descending
  allOrders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  // Step 4: Return top 3 latest orders
  return allOrders.slice(0, 3);
}
