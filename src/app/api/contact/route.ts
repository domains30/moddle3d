import { NextResponse } from 'next/server';

import sgMail from '@sendgrid/mail';

import { EMAIL_FROM } from '@/shared/config/env';

type ContactRequestData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const bodyJSON = (await request.json()) as ContactRequestData;
    const { firstName, lastName, email, phone, message } = bodyJSON;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    // Create email content
    const msg = {
      to: process.env.ADMIN_EMAIL!,
      from: EMAIL_FROM,
      subject: 'New request',
      html: `
        <h2>New request</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      `,
    };

    // Send email
    await sgMail.send(msg);

    /*const clientMSG = {
      to: email, // Your admin email address
      from: process.env.FROM_EMAIL!, // Verified sender email
      subject: 'Tanzora Request Received',
      html: `
      `,
    };

    await sgMail.send(clientMSG);*/

    return NextResponse.json({ message: 'Fund access request sent successfully.' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending fund access request:', errorMessage);
    return NextResponse.json(
      { message: 'Failed to send fund access request.', error: errorMessage },
      { status: 500 }
    );
  }
}
