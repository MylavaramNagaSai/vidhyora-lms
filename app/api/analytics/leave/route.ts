import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const { visitorId } = JSON.parse(body);

    if (visitorId) {
      // 1. Remove from live pool
      await deleteDoc(doc(db, 'live_visitors', visitorId));
      
      // 2. Decrement the live counter
      await updateDoc(doc(db, 'analytics', 'global_stats'), {
        liveCount: increment(-1)
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Disconnection Error:", error);
    return NextResponse.json({ error: 'Failed to process exit' }, { status: 500 });
  }
}