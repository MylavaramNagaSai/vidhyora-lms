import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // 1. Verify LMS Access First (Security Check)
    // FIXED: Changed 'lmsAccess' to 'lms_students' to match the Admin Panel
    const accessCol = collection(db, 'lms_students');
    const q = query(accessCol, where('email', '==', email));
    const snapshot = await getDocs(q);
    const hasActiveAccess = snapshot.docs.some(doc => doc.data().status === 'Active');

    if (!hasActiveAccess) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
    }

    // 2. Generate 4-Digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const formattedOtp = otp.split('').join('&nbsp;&nbsp;&nbsp;');

    // 3. Save OTP to Firebase
    await addDoc(collection(db, 'otps'), {
      email,
      otp,
      createdAt: serverTimestamp(),
    });

    // 4. Send the Email using your specific .env variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Vidhyora Security" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Vidhyora Student Portal OTP', 
      html: `
        <div style="background-color: #f8fafc; padding: 60px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <div style="height: 6px; background-color: #2563eb; width: 100%;"></div>
            <div style="padding: 48px 40px;">
              <h1 style="color: #2563eb; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 32px; letter-spacing: -0.5px;">Vidhyora</h1>
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 16px; margin-top: 0;">Student Portal Authentication</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">A request has been made to access the Vidhyora Student Portal. Please use the secure authorization code below to complete your login.</p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 32px 24px; text-align: center; margin-bottom: 40px;">
                <span style="font-size: 36px; font-weight: 700; color: #0f172a; font-family: monospace, sans-serif;">${formattedOtp}</span>
              </div>
              <div style="border-left: 3px solid #ef4444; padding-left: 16px; margin-bottom: 48px;">
                <p style="color: #ef4444; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Security Notice</p>
                <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">This code expires in exactly 5 minutes. If you did not initiate this login attempt, please secure your credentials immediately.</p>
              </div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 24px 0;" />
              <p style="color: #94a3b8; font-size: 11px; font-weight: 700; text-align: center; margin: 0 0 8px 0; letter-spacing: 0.05em; text-transform: uppercase;">Designed & Developed by Mylavaram Naga Sai</p>
              <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">&copy; 2026 Vidhyora&trade;. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP Generation Error:", error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}