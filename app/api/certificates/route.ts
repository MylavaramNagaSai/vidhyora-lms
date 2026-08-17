import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// --- READ: Fetch all certificates ---
export async function GET() {
  try {
    const certsRef = collection(db, 'certificates');
    // Order by newest first
    const q = query(certsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const certs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(certs);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

// --- CREATE: Issue a new certificate ---
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const docRef = await addDoc(collection(db, 'certificates'), {
      ...data,
      createdAt: serverTimestamp()
    });
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}

// --- UPDATE: Edit an existing certificate ---
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    const certRef = doc(db, 'certificates', id);
    await updateDoc(certRef, updateData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
  }
}

// --- DELETE: Revoke and remove a certificate ---
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Certificate ID is required for deletion' }, { status: 400 });
    }

    const certRef = doc(db, 'certificates', id);
    await deleteDoc(certRef);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}