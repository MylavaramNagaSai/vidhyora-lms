import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc } from 'firebase/firestore';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { pathname } = await req.json();

    // Extract real network data (Vercel provides these headers natively)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'Unknown IP';
    const userAgent = req.headers.get('user-agent') || '';
    const device = /mobile/i.test(userAgent) ? 'mobile' : 'desktop';
    
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';
    const country = req.headers.get('x-vercel-ip-country') || '';
    const location = city !== 'Unknown' ? `${city}, ${country}` : 'Global Network';

    const visitorId = crypto.randomUUID();

    // 1. Initialize global_stats if it doesn't exist to prevent errors on first load
    const statsRef = doc(db, 'analytics', 'global_stats');
    const statsSnap = await getDoc(statsRef);
    
    if (!statsSnap.exists()) {
      await setDoc(statsRef, { liveCount: 0, todayCount: 0, totalCount: 0 });
    }

    // 2. Add visitor to live pool
    await setDoc(doc(db, 'live_visitors', visitorId), {
      ip,
      location,
      device,
      page: pathname || '/',
      lastActive: serverTimestamp()
    });

    // 3. Increment counters
    await updateDoc(statsRef, {
      liveCount: increment(1),
      todayCount: increment(1),
      totalCount: increment(1)
    });

    return NextResponse.json({ success: true, visitorId });
  } catch (error) {
    console.error("Tracking Error:", error);
    return NextResponse.json({ error: 'Failed to initialize telemetry' }, { status: 500 });
  }
}