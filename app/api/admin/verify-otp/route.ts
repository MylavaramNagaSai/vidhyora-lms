import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { otp } = await req.json();
    
    // AWAIT added here!
    const cookieStore = await cookies();
    const storedHash = cookieStore.get('admin_otp_hash')?.value;

    if (!storedHash) {
      return NextResponse.json({ success: false, message: 'OTP expired or not requested.' }, { status: 400 });
    }

    const [hash, expiresStr] = storedHash.split('.');
    const expires = parseInt(expiresStr, 10);

    // Check if expired
    if (Date.now() > expires) {
      return NextResponse.json({ success: false, message: 'OTP has expired.' }, { status: 400 });
    }

    // Hash the user's submitted OTP to see if it matches
    const secret = process.env.OTP_SECRET || 'fallback_dev_secret';
    const dataToHash = `${otp}.${expires}`;
    const calculatedHash = crypto.createHmac('sha256', secret).update(dataToHash).digest('hex');

    if (calculatedHash === hash) {
      // SUCCESS: Set an authenticated session cookie
      cookieStore.set('admin_session', 'authenticated_true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      });
      
      // Clear the OTP cookie
      cookieStore.delete('admin_otp_hash');

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid OTP code.' }, { status: 401 });
    }

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
