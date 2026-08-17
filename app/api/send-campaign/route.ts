import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { subject, message, imageUrl, recipients } = await req.json();

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients provided' }, { status: 400 });
    }

    // 1. Configure Nodemailer with your .env credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465, // Secure SSL
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });

    // 2. Build the Official Vidhyora Custom HTML Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border-top: 6px solid #2563eb; }
          .header { padding: 30px 40px; text-align: left; border-bottom: 1px solid #f1f5f9; }
          .header h1 { margin: 0; color: #0f172a; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .content { padding: 40px; color: #334155; font-size: 15px; line-height: 1.7; }
          .hero-image { width: 100%; max-height: 350px; object-fit: cover; border-radius: 6px; margin-bottom: 24px; border: 1px solid #e2e8f0; }
          .message-box { white-space: pre-wrap; }
          .footer { padding: 24px 40px; background-color: #f8fafc; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vidhyora Admin Notification</h1>
          </div>
          <div class="content">
            ${imageUrl ? `<img src="${imageUrl}" alt="Campaign Reference" class="hero-image" />` : ''}
            <div class="message-box">${message}</div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Vidhyora Platform. All rights reserved.<br>
            Secure automated transmission.
          </div>
        </div>
      </body>
      </html>
    `;

    // 3. Dispatch the emails using Blind Carbon Copy (BCC) to protect user privacy
    await transporter.sendMail({
      from: `"Vidhyora Admin" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send one copy to the admin
      bcc: recipients.join(','), // BCC all selected students
      subject: subject,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true, message: 'Campaign dispatched successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: 'Failed to dispatch campaign' }, { status: 500 });
  }
}