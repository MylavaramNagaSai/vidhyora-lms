import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const cohortsCol = collection(db, 'cohorts');
    // Fetch and order by creation date
    const q = query(cohortsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const cohorts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(cohorts);
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const newCohort = await req.json();
    const cohortsCol = collection(db, 'cohorts');
    
    const docRef = await addDoc(cohortsCol, {
      ...newCohort,
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ id: docRef.id, ...newCohort });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const docRef = doc(db, 'cohorts', id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}