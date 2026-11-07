import { beforeEach, describe, expect, it } from 'vitest';
process.env.TEST_RATE_LIMIT = '1';
import { getDb } from '../src/db/index.js';
import { agent, getApp, registerUser, resetDb } from './helpers.js';
import { createEmailVerification, consumeEmailVerification } from '../src/services/verification.js';

beforeEach(resetDb);

describe('email verification', () => {
  it('marks existing users verified via migration (smoke)', async () => {
    const app = await getApp();
    const { user } = await registerUser(app, { email: 'v@example.com', username: 'vuser' });
    const db = await getDb();
    const { rows } = await db.query<{ email_verified_at: string | null }>(
      'select email_verified_at from users where id = $1',
      [user.id],
    );
    // In test mode registration auto-verifies.
    expect(rows[0]!.email_verified_at).not.toBeNull();
  });

  it('blocks unverified users from protected endpoints', async () => {
    const app = await getApp();
    const { agent: ag, user } = await registerUser(app, { email: 'u@example.com', username: 'uuser' });
    const db = await getDb();
    await db.query('update users set email_verified_at = null where id = $1', [user.id]);

    const res = await ag.get('/api/links').expect(403);
    expect(res.body.error.code).toBe('email_not_verified');
  });

  it('allows verified users to access protected endpoints', async () => {
    const app = await getApp();
    const { agent: ag } = await registerUser(app, { email: 'ok@example.com', username: 'okuser' });
    await ag.get('/api/links').expect(200);
  });

  it('returns email_not_verified on login for unverified users', async () => {
    const app = await getApp();
    const { user } = await registerUser(app, { email: 'loginu@example.com', username: 'loginu' });
    const db = await getDb();
    await db.query('update users set email_verified_at = null where id = $1', [user.id]);

    const res = await agent(app)
      .post('/api/auth/login')
      .send({ email: 'loginu@example.com', password: 'Password@123' })
      .expect(403);
    expect(res.body.error.code).toBe('email_not_verified');
  });

  it('verifies email with a valid single-use token', async () => {
    const app = await getApp();
    const { user } = await registerUser(app, { email: 've@example.com', username: 'veuser' });
    const db = await getDb();
    await db.query('update users set email_verified_at = null where id = $1', [user.id]);

    const { token } = await createEmailVerification(user.id, 've@example.com');

    const res = await agent(app).get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`).expect(200);
    expect(res.body.ok).toBe(true);

    const { rows } = await db.query<{ email_verified_at: string | null }>(
      'select email_verified_at from users where id = $1',
      [user.id],
    );
    expect(rows[0]!.email_verified_at).not.toBeNull();
  });

  it('rejects a reused verification token', async () => {
    const app = await getApp();
    const { user } = await registerUser(app, { email: 'reuse@example.com', username: 'reuseuser' });
    const db = await getDb();
    await db.query('update users set email_verified_at = null where id = $1', [user.id]);

    const { token } = await createEmailVerification(user.id, 'reuse@example.com');
    await agent(app).get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`).expect(200);
    await agent(app).get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`).expect(400);
  });

  it('rejects an expired verification token', async () => {
    const app = await getApp();
    const { user } = await registerUser(app, { email: 'exp@example.com', username: 'expuser' });
    const db = await getDb();
    await db.query('update users set email_verified_at = null where id = $1', [user.id]);

    const { token } = await createEmailVerification(user.id, 'exp@example.com');
    await db.query("update email_verification_tokens set expires_at = now() - interval '1 hour' where user_id = $1", [user.id]);

    const res = await agent(app).get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`).expect(400);
    expect(res.body.error.code).toBe('bad_request');
  });

  it('rejects a missing token', async () => {
    const app = await getApp();
    await agent(app).get('/api/auth/verify-email').expect(400);
  });

  it('resend-verification returns ok and is rate limited', async () => {
    const app = await getApp();
    const { user } = await registerUser(app, { email: 'resend@example.com', username: 'resenduser' });
    const db = await getDb();
    await db.query('update users set email_verified_at = null where id = $1', [user.id]);

    for (let i = 0; i < 5; i++) {
      await agent(app).post('/api/auth/resend-verification').send({ email: 'resend@example.com' }).expect(200);
    }
    await agent(app).post('/api/auth/resend-verification').send({ email: 'resend@example.com' }).expect(429);
  });

  it('resend-verification is generic (no enumeration)', async () => {
    const app = await getApp();
    const res = await agent(app).post('/api/auth/resend-verification').send({ email: 'nobody@example.com' }).expect(200);
    expect(res.body.ok).toBe(true);
  });

  it('consumeEmailVerification returns null for unknown token', async () => {
    const r = await consumeEmailVerification('not-a-real-token');
    expect(r).toBeNull();
  });
});
