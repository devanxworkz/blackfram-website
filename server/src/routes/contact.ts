import { Router } from 'express';
import { z } from 'zod';
import { wrap } from '../http/async.js';
import { badRequest } from '../http/errors.js';
import { rateLimit } from '../middleware/rate-limit.js';
import { contactSubmissionSchema, CONTACT_CATEGORIES } from '../validation/schemas.js';
import {
  createContactSubmission,
  routeRecipient,
  sendContactAcknowledgement,
  sendContactNotification,
  updateDeliveryStatus,
} from '../services/contact.js';

export const contactRouter = Router();

contactRouter.post(
  '/',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'contact' }),
  wrap(async (req, res) => {
    const parsed = contactSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      throw badRequest('Please check the form and try again.', details);
    }
    const data = parsed.data;

    // Honeypot: if filled, pretend success without storing/sending.
    if (data.website && data.website.trim() !== '') {
      res.status(200).json({ ok: true });
      return;
    }

    const submission = await createContactSubmission({
      name: data.name,
      email: data.email,
      category: data.category,
      subject: data.subject,
      message: data.message,
      creatorPageUrl: data.creatorPageUrl || undefined,
    });

    const recipient = routeRecipient(data.category);
    const notification = await sendContactNotification(
      { id: submission.id, name: data.name, email: data.email, category: data.category, subject: data.subject, message: data.message, creatorPageUrl: data.creatorPageUrl || undefined },
      recipient,
    );

    await updateDeliveryStatus(submission.id, notification.sent ? 'sent' : 'failed');

    // Acknowledgement to visitor (best-effort; failure does not fail the submission).
    await sendContactAcknowledgement(data.name, data.email).catch(() => undefined);

    res.status(200).json({ ok: true });
  }),
);
