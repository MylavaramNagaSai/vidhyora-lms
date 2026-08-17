import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
    }

    const otpsCol = collection(db, 'otps');
    // Check if a record exists with BOTH the correct email and correct OTP
    const q = query(otpsCol, where('email', '==', email), where('otp', '==', otp));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 401 });
    }

    // Delete the OTP document so it cannot be used again
    const docRef = snapshot.docs[0].ref;
    await deleteDoc(docRef);

    // --- FIXED: Await the cookies() function for Next.js 15+ ---
    const cookieStore = await cookies();
    cookieStore.set('vidhyora_lms_session', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // Keeps them logged in for 7 Days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}