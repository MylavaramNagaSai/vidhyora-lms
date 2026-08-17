import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const accessCol = collection(db, 'lmsAccess');
    const q = query(accessCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(records);
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const newRecord = await req.json();
    const accessCol = collection(db, 'lmsAccess');
    
    const docRef = await addDoc(accessCol, {
      ...newRecord,
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ id: docRef.id, ...newRecord });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save access record' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const docRef = doc(db, 'lmsAccess', id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update access record' }, { status: 500 });
  }
}