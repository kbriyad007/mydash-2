import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export type OrderData = {
  nameId: string;
  orderId: string;
  Time?: Timestamp;
  [key: string]: unknown;
};

export async function fetchNames(): Promise<OrderData[]> {
  const namesCollection = collection(db, "Names");
  const namesSnapshot = await getDocs(namesCollection);

  const allOrders: OrderData[] = [];

  for (const nameDoc of namesSnapshot.docs) {
    const ordersRef = collection(db, "Names", nameDoc.id, "orders");
    const ordersSnapshot = await getDocs(ordersRef);

    ordersSnapshot.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      allOrders.push({
        nameId: nameDoc.id,
        orderId: orderDoc.id,
        Time: orderData.Time,
        ...orderData,
      });
    });
  }

  // Filter orders that have a valid Timestamp in Time
  const sortedOrders = allOrders
    .filter((order) => order.Time instanceof Timestamp)
    .sort(
      (a, b) =>
        (b.Time as Timestamp).toMillis() - (a.Time as Timestamp).toMillis()
    );

  // Return the latest 2 orders only
  return sortedOrders.slice(0, 2);
}

