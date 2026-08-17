import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const examsCol = collection(db, 'exams');
    const q = query(examsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const exams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(exams);
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const newExam = await req.json();
    const examsCol = collection(db, 'exams');
    
    const docRef = await addDoc(examsCol, {
      ...newExam,
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ id: docRef.id, ...newExam });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save exam' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const docRef = doc(db, 'exams', id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}