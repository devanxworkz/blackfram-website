import { beforeEach, describe, expect, it } from 'vitest';
import { getDb } from '../src/db/index.js';
import { agent, getApp, resetDb } from './helpers.js';

beforeEach(resetDb);

describe('contact submissions', () => {
  it('stores a valid submission and returns ok', async () => {
    const app = await getApp();
    const res = await agent(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        category: 'technical',
        subject: 'Help needed',
        message: 'This is a test message with enough length.',
      })
      .expect(200);
    expect(res.body.ok).toBe(true);

    const db = await getDb();
    const { rows } = await db.query<{ name: string; email: string; category: string; email_delivery_status: string }>(
      'select name, email, category, email_delivery_status from contact_submissions',
    );
    expect(rows.length).toBe(1);
    expect(rows[0]!.email).toBe('test@example.com');
    expect(rows[0]!.category).toBe('technical');
  });

  it('rejects missing required fields', async () => {
    const app = await getApp();
    const res = await agent(app).post('/api/contact').send({}).expect(400);
    expect(res.body.error.code).toBe('bad_request');
  });

  it('rejects invalid email', async () => {
    const app = await getApp();
    const res = await agent(app)
      .post('/api/contact')
      .send({ name: 'T', email: 'not-an-email', category: 'other', subject: 'subj', message: 'long enough message here' })
      .expect(400);
    expect(res.body.error.details.some((d: { path: string }) => d.path === 'email')).toBe(true);
  });

  it('rejects invalid category', async () => {
    const app = await getApp();
    const res = await agent(app)
      .post('/api/contact')
      .send({ name: 'T', email: 't@example.com', category: 'nope', subject: 'subj', message: 'long enough message here' })
      .expect(400);
    expect(res.body.error.details.some((d: { path: string }) => d.path === 'category')).toBe(true);
  });

  it('rejects oversized message', async () => {
    const app = await getApp();
    const res = await agent(app)
      .post('/api/contact')
      .send({ name: 'T', email: 't@example.com', category: 'other', subject: 'subj', message: 'x'.repeat(5001) })
      .expect(400);
    expect(res.body.error.details.some((d: { path: string }) => d.path === 'message')).toBe(true);
  });

  it('honeypot submission returns ok without storing', async () => {
    const app = await getApp();
    const res = await agent(app)
      .post('/api/contact')
      .send({ name: 'Bot', email: 'bot@example.com', category: 'other', subject: 'spam', message: 'spammy message here', website: 'http://spam.com' })
      .expect(200);
    expect(res.body.ok).toBe(true);
    const db = await getDb();
    const { rows } = await db.query<{ n: number }>('select count(*)::int as n from contact_submissions');
    expect(rows[0]!.n).toBe(0);
  });

  it('rate limits repeated submissions', async () => {
    const app = await getApp();
    for (let i = 0; i < 5; i++) {
      await agent(app)
        .post('/api/contact')
        .send({ name: 'T', email: 't@example.com', category: 'other', subject: 'subj', message: 'long enough message here' })
        .expect(200);
    }
    await agent(app)
      .post('/api/contact')
      .send({ name: 'T', email: 't@example.com', category: 'other', subject: 'subj', message: 'long enough message here' })
      .expect(429);
  });

  it('stores creator page url when provided', async () => {
    const app = await getApp();
    await agent(app)
      .post('/api/contact')
      .send({
        name: 'T',
        email: 't@example.com',
        category: 'other',
        subject: 'subj',
        message: 'long enough message here',
        creatorPageUrl: 'https://app.blackfram.com/u/test',
      })
      .expect(200);
    const db = await getDb();
    const { rows } = await db.query<{ creator_page_url: string }>("select creator_page_url from contact_submissions order by created_at desc limit 1");
    expect(rows[0]!.creator_page_url).toBe('https://app.blackfram.com/u/test');
  });
});
