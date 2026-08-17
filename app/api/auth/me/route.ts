import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // FIXED: Await the cookies() function for Next.js 15+
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('vidhyora_lms_session')?.value;

  // If no cookie exists, they are an intruder. Kick them out!
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If the cookie exists, return their email so the Portal can fetch their specific courses
  return NextResponse.json({ email: sessionEmail });
}