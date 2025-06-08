import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const userIds = usersSnapshot.docs.map(doc => doc.id);
    const totalCustomers = userIds.length;

    return NextResponse.json({ totalCustomers });
  } catch (error) {
    console.error('Error fetching total customers:', error);
    return NextResponse.json({ totalCustomers: 0 }, { status: 500 });
  }
}
