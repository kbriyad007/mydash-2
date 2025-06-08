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
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const allOrders: OrderData[] = [];

    console.log(`Found ${usersSnapshot.docs.length} users.`);

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const ordersSnapshot = await getDocs(collection(db, `users/${userId}/orders`));
      console.log(`User ${userId} has ${ordersSnapshot.docs.length} orders.`);

      for (const orderDoc of ordersSnapshot.docs) {
        const data = orderDoc.data();
        console.log(`OrderDoc ID: ${orderDoc.id}, data:`, data);

        // Fix for createdAt field type:
        if (!(data.createdAt instanceof Timestamp) && data.createdAt?.seconds) {
          data.createdAt = new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds);
          console.log(`Fixed createdAt to Timestamp for order ${orderDoc.id}`);
        }

        // TEMP: Remove filtering by createdAt to test if any orders show
        // if (data.createdAt instanceof Timestamp) {

        allOrders.push({
          orderId: orderDoc.id,
          name: data.name || '',
          productName: data.productName || '',
          productPrice: data.productPrice || '',
          address: data.address || '',
          mobile: data.mobile || '',
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
        });

        // }
      }
    }

    if (allOrders.length === 0) {
      console.warn('No orders found across all users.');
      return [];
    }

    // Sort by createdAt descending, latest first
    allOrders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    // Return top 3 latest orders
    return allOrders.slice(0, 3);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
