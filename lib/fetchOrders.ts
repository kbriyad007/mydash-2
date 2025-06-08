import { db } from './firebase';
import { collectionGroup, getDocs, Timestamp } from 'firebase/firestore';

export type Order = {
  address: string;
  createdAt: Timestamp | null;
  mobile: string;
  name: string;
  productName: string;
  productPrice: string;
};

export async function fetchOrders(): Promise<Order[]> {
  const querySnapshot = await getDocs(collectionGroup(db, 'orders'));

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      address: data.address || '',
      createdAt: data.createdAt ?? null,
      mobile: data.mobile || '',
      name: data.name || '',
      productName: data.productName || '',
      productPrice: data.productPrice || '',
    };
  });
}
