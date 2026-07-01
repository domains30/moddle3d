import { NextResponse } from 'next/server';

import sgMail from '@sendgrid/mail';

import { EMAIL_FROM } from '@/shared/config/env';

import { requestReceivedBody } from '@/featured/email-letters/request-received-body';

type ContactRequestData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
  estimatedBudget?: string;
  packageName?: string;
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const bodyJSON = (await request.json()) as ContactRequestData;
    console.log(bodyJSON);
    const { firstName, lastName, email, phone, message, estimatedBudget, packageName } = bodyJSON;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg = {
      to: [process.env.ADMIN_EMAIL!, 'support@moddle3d.com'],
      from: EMAIL_FROM,
      subject: 'New package request',
      html: `
        <h2>New package request</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Estimated Budget:</strong> ${estimatedBudget}</p>
        <p><strong>Package:</strong> ${packageName}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      `,
    };

    // Notify the admin of the new request.
    await sgMail.send(msg);

    // Confirm to the customer that we received their request and let them know
    // what details we need next. Isolated so a failed customer email never
    // breaks the admin notification above.
    try {
      await sgMail.send({
        to: email,
        from: EMAIL_FROM,
        subject: 'Moddle 3D: We have received your request',
        html: requestReceivedBody({
          username: firstName,
          packageName,
        }),
      });
    } catch (error) {
      console.error('Failed to send request confirmation email to customer:', error);
    }

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
