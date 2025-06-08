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
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const allOrders: OrderData[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const ordersSnapshot = await getDocs(collection(db, `users/${userId}/orders`));

    for (const orderDoc of ordersSnapshot.docs) {
      // Replace 'orderDocs' with your actual subcollection name here
      const subOrdersSnapshot = await getDocs(collection(db, `users/${userId}/orders/${orderDoc.id}/orderDocs`));

      subOrdersSnapshot.forEach((subDoc) => {
        const data = subDoc.data();

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

  allOrders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return allOrders.slice(0, 3);
}
