import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function GET(req: Request) {
  try {
    // Standard security check to ensure external bots cannot hit this URL
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    const statsRef = doc(db, 'analytics', 'global_stats');
    
    // Reset today's views to exactly 0
    await updateDoc(statsRef, {
      todayCount: 0
    });

    return NextResponse.json({ success: true, message: 'Daily analytics cleared' });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: 'Cron execution failed' }, { status: 500 });
  }
}