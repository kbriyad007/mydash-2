import { NextResponse } from 'next/server';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const snapshot = await getDocs(collectionGroup(db, 'orders'));

    let totalSales = 0;
    let orderCount = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const productPrice: string = data.productPrice;

      // Extract only the final price after '='
      const match = productPrice.match(/=\s*৳?(\d+(?:\.\d+)?)/);
      if (match && match[1]) {
        const price = parseFloat(match[1]);
        if (!isNaN(price)) {
          totalSales += price;
          orderCount += 1;
        }
      }
    });

    return NextResponse.json({ totalSales, orderCount });
  } catch (error) {
    console.error('Error calculating total sales:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

