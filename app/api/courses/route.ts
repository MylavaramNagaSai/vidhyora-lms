import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// --- READ: Fetch all courses ---
export async function GET() {
  try {
    const coursesRef = collection(db, 'courses');
    // Orders courses by newest first
    const q = query(coursesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// --- CREATE: Add a new course ---
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const docRef = await addDoc(collection(db, 'courses'), {
      ...data,
      createdAt: serverTimestamp()
    });
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

// --- UPDATE: Edit an existing course ---
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const courseRef = doc(db, 'courses', id);
    await updateDoc(courseRef, updateData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

// --- DELETE: Remove a course ---
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required for deletion' }, { status: 400 });
    }

    const courseRef = doc(db, 'courses', id);
    await deleteDoc(courseRef);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}