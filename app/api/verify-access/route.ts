import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ hasAccess: false }, { status: 400 });
    }

    // Query Firebase for this specific email
    const accessCol = collection(db, 'lmsAccess');
    const q = query(accessCol, where('email', '==', email));
    const snapshot = await getDocs(q);

    // Check if the email exists AND has an 'Active' status
    const hasActiveAccess = snapshot.docs.some(doc => doc.data().status === 'Active');

    if (hasActiveAccess) {
      return NextResponse.json({ hasAccess: true });
    } else {
      return NextResponse.json({ hasAccess: false });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: 'Server error during verification' }, { status: 500 });
  }
}