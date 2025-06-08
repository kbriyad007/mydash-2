import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type OrderData = {
  userId: string;            // ID of user who placed order
  orderId: string;           // Order document ID
  createdAt?: Timestamp;     // Firestore Timestamp of order creation
  name?: string;             // Customer name
  productName?: string;      // Name of the product ordered
  productPrice?: string;     // Price info as string
  address?: string;          // Shipping address
  mobile?: string;           // Customer mobile number
};

export async function fetchLatestOrders(): Promise<OrderData[]> {
  // Reference the "users" collection
  const usersCollection = collection(db, "users");
  
  // Fetch all user documents
  const usersSnapshot = await getDocs(usersCollection);

  const allOrders: OrderData[] = [];

  // Loop through each user document
  for (const userDoc of usersSnapshot.docs) {
    // Reference this user's "orders" subcollection
    const ordersRef = collection(db, "users", userDoc.id, "orders");
    
    // Fetch all orders for this user
    const ordersSnapshot = await getDocs(ordersRef);

    // Iterate orders, build order objects
    ordersSnapshot.forEach((orderDoc) => {
      const data = orderDoc.data();

      allOrders.push({
        userId: userDoc.id,
        orderId: orderDoc.id,
        createdAt: data.createdAt,       // Firestore Timestamp expected here
        name: data.name,
        productName: data.productName,
        productPrice: data.productPrice,
        address: data.address,
        mobile: data.mobile,
      });
    });
  }

  // 1. Filter orders where createdAt is a valid Firestore Timestamp
  // 2. Sort orders descending by createdAt (most recent first)
  // 3. Return only the first 5 orders from sorted list (latest 5 orders)
  const latestOrders = allOrders
    .filter(order => order.createdAt instanceof Timestamp)
    .sort((a, b) => b.createdAt!.toMillis() - a.createdAt!.toMillis())
    .slice(0, 5);

  return latestOrders;
}
