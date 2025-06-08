import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // update path as needed

export interface Order {
  userId: string;
  orderId: string;
  name: string;
  productName: string;
  address: string;
  mobile: string;
  productPrice: string;
  createdAt: Date;
}

export async function getLatestFiveOrdersFromAllUsers(): Promise<Order[]> {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const allOrders: Order[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;

    const ordersSnapshot = await getDocs(
      collection(db, "users", userId, "orders")
    );

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.();

      if (createdAt) {
        allOrders.push({
          userId,
          orderId: doc.id,
          name: data.name || "",
          productName: data.productName || "",
          address: data.address || "",
          mobile: data.mobile || "",
          productPrice: data.productPrice || "",
          createdAt,
        });
      }
    });
  }

  // Sort by createdAt descending
  allOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Return the latest 5
  return allOrders.slice(0, 5);
}
