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
  address: string;
  mobile: string;
  createdAt: Timestamp;
}

export async function fetchLatestOrders(): Promise<OrderData[]> {
  const q = query(
    collectionGroup(db, 'orders'), // Query all 'orders' subcollections
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
        address: data.address || '',
        mobile: data.mobile || '',
        createdAt: data.createdAt,
      });
    }
  });

  return orders;
}
