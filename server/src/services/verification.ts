import { getDb } from '../db/index.js';
import { config } from '../config.js';
import { sendEmail } from './email.js';
import { newVerificationToken, hashToken } from '../auth/verification-tokens.js';

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function createEmailVerification(
  userId: string,
  email: string,
): Promise<{ token: string; sent: boolean; reason?: string }> {
  const db = await getDb();
  const token = newVerificationToken();
  const expiresAt = new Date(Date.now() + VERIFY_TTL_MS);

  // Invalidate previous unused tokens for this user.
  await db.query(
    'update email_verification_tokens set used_at = now() where user_id = $1 and used_at is null and expires_at > now()',
    [userId],
  );
  await db.query(
    'insert into email_verification_tokens (user_id, token_hash, expires_at) values ($1, $2, $3)',
    [userId, hashToken(token), expiresAt],
  );

  const verifyUrl = `${config.appBaseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const result = await sendEmail({
    to: email,
    subject: 'Verify your BLACKFRAM email',
    text: `Verify your email: ${verifyUrl}\n\nThis link expires in 24 hours and can only be used once.`,
    html: `<p>Verify your email:</p><p><a href="${verifyUrl}">Verify email</a></p><p>This link expires in 24 hours and can only be used once.</p>`,
  });

  if (!result.sent && config.nodeEnv !== 'production') {
    console.warn(`[auth] DEV VERIFY URL (do not share): ${verifyUrl}`);
  }
  return { token, sent: result.sent, reason: result.reason };
}

export async function consumeEmailVerification(token: string): Promise<string | null> {
  const db = await getDb();
  const tokenHash = hashToken(token);
  const { rows } = await db.query<{ user_id: string }>(
    `select user_id from email_verification_tokens
     where token_hash = $1 and used_at is null and expires_at > now()
     limit 1`,
    [tokenHash],
  );
  const row = rows[0];
  if (!row) return null;
  await db.query('update email_verification_tokens set used_at = now() where token_hash = $1', [tokenHash]);
  await db.query('update users set email_verified_at = now() where id = $1 and email_verified_at is null', [row.user_id]);
  return row.user_id;
}

export async function isEmailVerified(userId: string): Promise<boolean> {
  const db = await getDb();
  const { rows } = await db.query<{ email_verified_at: string | null }>(
    'select email_verified_at from users where id = $1',
    [userId],
  );
  return !!rows[0]?.email_verified_at;
}
