import { getDb } from '../db/index.js';
import { config } from '../config.js';
import { sendEmail } from './email.js';
import type { ContactCategory } from '../validation/schemas.js';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function routeRecipient(category: ContactCategory): string {
  const support = config.contactSupportTo;
  const sales = config.contactSalesTo;
  const press = config.contactPressTo;
  const fallback = config.contactDefaultTo;
  switch (category) {
    case 'sales':
      return sales || fallback || support;
    case 'press':
      return press || fallback || support;
    case 'account':
    case 'customization':
    case 'billing':
    case 'technical':
    case 'other':
    default:
      return support || fallback;
  }
}

export interface CreateContactInput {
  name: string;
  email: string;
  category: ContactCategory;
  subject: string;
  message: string;
  creatorPageUrl?: string;
}

export async function createContactSubmission(input: CreateContactInput): Promise<{ id: string }> {
  const db = await getDb();
  const { rows } = await db.query<{ id: string }>(
    `insert into contact_submissions (name, email, category, subject, message, creator_page_url, status, email_delivery_status)
     values ($1, $2, $3, $4, $5, $6, 'new', 'pending')
     returning id`,
    [input.name, input.email, input.category, input.subject, input.message, input.creatorPageUrl || null],
  );
  return { id: rows[0]!.id };
}

export async function updateDeliveryStatus(id: string, status: 'sent' | 'failed' | 'skipped'): Promise<void> {
  const db = await getDb();
  await db.query('update contact_submissions set email_delivery_status = $1, updated_at = now() where id = $2', [status, id]);
}

export async function sendContactNotification(
  submission: CreateContactInput & { id: string },
  recipient: string,
): Promise<{ sent: boolean; reason?: string }> {
  if (!recipient) return { sent: false, reason: 'not_configured' };
  const safeName = escapeHtml(submission.name);
  const safeEmail = escapeHtml(submission.email);
  const safeSubject = escapeHtml(submission.subject);
  const safeMessage = escapeHtml(submission.message).replace(/\n/g, '<br/>');
  const safeUrl = submission.creatorPageUrl ? escapeHtml(submission.creatorPageUrl) : '';
  const categoryLabel = submission.category;

  const html = `
    <h2>New contact submission</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Category:</strong> ${categoryLabel}</p>
    <p><strong>Subject:</strong> ${safeSubject}</p>
    ${safeUrl ? `<p><strong>Creator page:</strong> ${safeUrl}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${safeMessage}</p>
    <hr/>
    <p style="color:#666;font-size:12px;">Submitted ${new Date().toISOString()}</p>
  `.trim();

  const text = `New contact submission
Name: ${submission.name}
Email: ${submission.email}
Category: ${categoryLabel}
Subject: ${submission.subject}
${submission.creatorPageUrl ? `Creator page: ${submission.creatorPageUrl}\n` : ''}
Message:
${submission.message}

Submitted ${new Date().toISOString()}`;

  return sendEmail({
    to: recipient,
    subject: `[BLACKFRAM Contact] ${submission.subject}`,
    html,
    text,
    replyTo: submission.email,
  });
}

export async function sendContactAcknowledgement(
  name: string,
  email: string,
): Promise<{ sent: boolean; reason?: string }> {
  const safeName = escapeHtml(name);
  const html = `
    <p>Hi ${safeName},</p>
    <p>Thank you for contacting BLACKFRAM.</p>
    <p>We've received your message and our team will review it.</p>
    <p>We'll get back to you using this email address.</p>
    <p>Thanks,<br/>BLACKFRAM Team</p>
  `.trim();
  const text = `Hi ${name},

Thank you for contacting BLACKFRAM.

We've received your message and our team will review it.

We'll get back to you using this email address.

Thanks,
BLACKFRAM Team`;
  return sendEmail({
    to: email,
    subject: 'We received your message — BLACKFRAM',
    html,
    text,
  });
}
