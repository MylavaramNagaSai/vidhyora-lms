import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure Nodemailer with your .env credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465, 
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });

    // Premium Vidhyora Auto-Responder Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-top: 6px solid #2563eb; }
          .header { padding: 30px 40px; text-align: left; border-bottom: 1px solid #f1f5f9; }
          .header h1 { margin: 0; color: #0f172a; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .content { padding: 40px; color: #334155; font-size: 15px; line-height: 1.7; }
          .highlight { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 20px 0; border-radius: 0 4px 4px 0; color: #0f172a; font-weight: 500; }
          .footer { padding: 24px 40px; background-color: #f8fafc; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vidhyora Corporate Training</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to Vidhyora. We have successfully received your corporate training request.</p>
            <div class="highlight">
              Our enterprise team is reviewing your specific requirements and will contact you within the next 24 hours to discuss a customized curriculum and deployment strategy for your workforce.
            </div>
            <p>If you have any immediate questions or additional details to share, please reply directly to this email.</p>
            <p>Best regards,<br><strong>The Vidhyora Enterprise Team</strong></p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Vidhyora Platform. All rights reserved.<br>
            Secure automated transmission.
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the email to the client, and blind-copy (BCC) the master admin so you get a copy too!
    await transporter.sendMail({
      from: `"Vidhyora Enterprise" <${process.env.SMTP_USER}>`,
      to: email,
      bcc: process.env.MASTER_ADMIN_EMAIL || process.env.SMTP_USER, 
      subject: "Your Corporate Training Request - Vidhyora",
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: 'Failed to send automated response' }, { status: 500 });
  }
}