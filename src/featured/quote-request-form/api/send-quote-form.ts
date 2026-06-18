'use server';

import sgMail from '@sendgrid/mail';

import { ADMIN_EMAIL, EMAIL_FROM, SENDGRID_API_KEY } from '@/shared/config/env';

import type { QuoteRequestFormSchema } from '../model/schema';

import { requestFormBody } from '@/featured/email-letters/request-form-body';

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendQuoteForm = async (data: QuoteRequestFormSchema) => {
  const {
    email,
    firstName,
    lastName,
    phone,
    budget,
    contactMethod,
    description,
    fileFormat,
    projectDeadline,
    projectType,
    revision,
    service,
    urgencyLevel,
    wouldCall,
    files,
    otherService,
  } = data;

  const attachments = files
    ? await Promise.all(
        files.map(async (file: File) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return {
            content: buffer.toString('base64'),
            filename: file.name,
            type: file.type || 'application/octet-stream',
            disposition: 'attachment',
          };
        })
      )
    : [];

  const msg = {
    to: ADMIN_EMAIL,
    from: EMAIL_FROM,
    subject: `New Contact Request`,
    html: `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${description}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Contact Method:</strong> ${contactMethod}</p>
      <p><strong>File Format:</strong> ${fileFormat}</p>
      <p><strong>Project Deadline:</strong> ${projectDeadline}</p>
      <p><strong>Project Type:</strong> ${projectType}</p>
      <p><strong>Revision:</strong> ${revision}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Urgency Level:</strong> ${urgencyLevel}</p>
      <p><strong>Would Call:</strong> ${wouldCall}</p>
      <p><strong>Other Service:</strong> ${otherService}</p>
    `,
    attachments,
  };

  const userMsg = {
    to: email,
    from: EMAIL_FROM,
    subject: `We Got Your Request! Time to Make Some Magic – Moddle 3D`,
    html: requestFormBody({ username: firstName }),
  };

  await sgMail.send(msg);
  await sgMail.send(userMsg);

  return {
    success: true,
  };
};
