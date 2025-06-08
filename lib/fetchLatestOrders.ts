import { db } from './firebase';
import {
  collection,
  getDocs,
  Timestamp,
  doc,
} from 'firebase/firestore';

export interface OrderData {
  orderId: string;       // ID of the order document inside the subcollection
  name: string;
  productName: string;
  productPrice: string;
  address: string;
  mobile: string;
  createdAt: Timestamp;
}

export async function fetchLatestOrders(): Promise<OrderData[]> {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const allOrders: OrderData[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const ordersSnapshot = await getDocs(collection(db, `users/${userId}/orders`));

    for (const orderDoc of ordersSnapshot.docs) {
      // Replace 'orderDocs' with your actual subcollection name here:
      const subOrdersSnapshot = await getDocs(collection(db, `users/${userId}/orders/${orderDoc.id}/orderDocs`));

      subOrdersSnapshot.forEach((subDoc) => {
        const data = subDoc.data();

        // Firestore may return timestamp as plain object; convert if needed
        if (!(data.createdAt instanceof Timestamp) && data.createdAt?.seconds) {
          data.createdAt = new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds);
        }

        if (data.createdAt instanceof Timestamp) {
          allOrders.push({
            orderId: subDoc.id,
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
  }

  // Sort orders by createdAt descending (newest first)
  allOrders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  // Return top 3 latest orders
  return allOrders.slice(0, 3);
}
