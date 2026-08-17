import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST() {
  try {
    // 1. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`\n========================================`);
    console.log(`🔐 VIDHYORA ADMIN OTP GENERATED: ${otp}`);
    console.log(`========================================\n`);

    // 2. Hash the OTP to store safely in a cookie
    const secret = process.env.OTP_SECRET || 'fallback_dev_secret';
    const expires = Date.now() + 5 * 60 * 1000; 
    const dataToHash = `${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', secret).update(dataToHash).digest('hex');
    const secureCookieValue = `${hash}.${expires}`;

    // 3. Set the HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_otp_hash', secureCookieValue, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 300, 
      path: '/'
    });

    // 4. Send the Highly Polished HTML Email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    
    // The HTML Template replicating the UI
    const emailHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a; line-height: 1.5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">

          <!-- Top Accent Bar -->
          <div style="height: 6px; background-color: #2563eb; width: 100%;"></div>

          <!-- Content Padding -->
          <div style="padding: 40px;">
            
            <!-- Brand Logo -->
            <h1 style="margin-top: 0; margin-bottom: 24px; color: #2563eb; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">Vidhyora</h1>
            
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; margin-top: 0;">Admin Authentication</h2>
            
            <p style="color: #64748b; font-size: 15px; margin-bottom: 32px;">
              A request has been made to access the Vidhyora Command Center. Please use the secure authorization code below to complete your login.
            </p>

            <!-- OTP Block -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px;">
              <span style="display: inline-block; font-family: monospace; font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #0f172a; margin-left: 12px;">${otp}</span>
            </div>

            <!-- Security Warning -->
            <div style="border-left: 4px solid #ef4444; padding-left: 16px;">
              <p style="color: #ef4444; font-size: 13px; font-weight: 700; margin-bottom: 4px; margin-top: 0; text-transform: uppercase; tracking: 1px;">
                Security Notice
              </p>
              <p style="color: #64748b; font-size: 13px; margin: 0;">
                This code expires in exactly 5 minutes. If you did not initiate this login attempt, please secure your server credentials immediately.
              </p>
            </div>

          </div>

          <!-- Footer Area -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #475569; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
              Designed & Developed by Mylavaram Naga sai
            </p>
            <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 500;">
              &copy; ${new Date().getFullYear()} Vidhyora&trade;. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Vidhyora Security" <security@vidhyora.com>',
      to: process.env.MASTER_ADMIN_EMAIL,
      subject: "🔒 Vidhyora Admin Console OTP",
      text: `Your Vidhyora Admin OTP is: ${otp}. It expires in 5 minutes.`,
      html: emailHTML // This line injects the beautiful UI
    });

    return NextResponse.json({ success: true, message: 'OTP sent to master email.' });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
  }
}
