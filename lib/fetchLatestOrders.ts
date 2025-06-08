import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type OrderData = {
  userId: string;
  orderId: string;
  createdAt?: Timestamp;
  name?: string;
  productName?: string;
  productPrice?: string;
  address?: string;
  mobile?: string;
};

export async function fetchLatestOrders(): Promise<OrderData[]> {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);

  const allOrders: OrderData[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const ordersRef = collection(db, "users", userDoc.id, "orders");
    const ordersSnapshot = await getDocs(ordersRef);

    ordersSnapshot.forEach((orderDoc) => {
      const data = orderDoc.data();
      allOrders.push({
        userId: userDoc.id,
        orderId: orderDoc.id,
        createdAt: data.createdAt,
        name: data.name,
        productName: data.productName,
        productPrice: data.productPrice,
        address: data.address,
        mobile: data.mobile,
      });
    });
  }

  const latestOrders = allOrders
    .filter((order) => order.createdAt instanceof Timestamp)
    .sort((a, b) => (b.createdAt!.toMillis() - a.createdAt!.toMillis()));

  return latestOrders.slice(0, 5);
}
