'use server';

import sgMail from '@sendgrid/mail';

import { ADMIN_EMAIL, EMAIL_FROM, SENDGRID_API_KEY } from '@/shared/config/env';

import type { CareerSchema } from '../model/schema';

sgMail.setApiKey(SENDGRID_API_KEY);

export const applyToJob = async ({
  email,
  fullName,
  position,
  resume,
  coverLetter,
  message,
}: CareerSchema) => {
  try {
    const attachments = await Promise.all([
      ...(resume
        ? resume.map(async (file: File) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return {
              content: buffer.toString('base64'),
              filename: file.name,
              type: file.type || 'application/octet-stream',
              disposition: 'attachment',
            };
          })
        : []),
      ...(coverLetter
        ? coverLetter.map(async (file: File) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return {
              content: buffer.toString('base64'),
              filename: file.name,
              type: file.type || 'application/octet-stream',
              disposition: 'attachment',
            };
          })
        : []),
    ]);

    const msg = {
      to: ADMIN_EMAIL,
      from: EMAIL_FROM,
      subject: `New Job Application`,
      html: `
      <h2>New Job Application</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
      attachments,
    };

    await sgMail.send(msg);

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to send email',
    };
  }
};
