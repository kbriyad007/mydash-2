// lib/fetchLatestOrders.ts
import { db } from './firebase';
import {
  collectionGroup,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

export interface OrderData {
  orderId: string;
  name: string;
  productName: string;
  productPrice: string;
  createdAt: Timestamp;
}

export async function fetchLatestOrders(): Promise<OrderData[]> {
  const q = query(
    collectionGroup(db, 'orders'), // 🔥 query across all users
    orderBy('createdAt', 'desc'),
    limit(3)
  );

  const snapshot = await getDocs(q);

  const orders: OrderData[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.createdAt instanceof Timestamp) {
      orders.push({
        orderId: doc.id,
        name: data.name || '',
        productName: data.productName || '',
        productPrice: data.productPrice || '',
        createdAt: data.createdAt,
      });
    }
  });

  return orders;
}

