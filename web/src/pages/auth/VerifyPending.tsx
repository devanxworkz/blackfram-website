import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout';
import { Button, Field, Input } from '../../components/ui';
import { ApiError, api } from '../../lib/api';

export default function VerifyPending() {
  const [params] = useSearchParams();
  const initialEmail = params.get('email') ?? '';
  const emailSent = params.get('sent');
  const [email, setEmail] = useState(initialEmail);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.post('/api/auth/resend-verification', { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend verification email.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We sent a verification link to your inbox."
      footer={
        <Link to="/login" className="font-semibold text-accent hover:underline">
          Back to log in
        </Link>
      }
    >
      {emailSent === '0' && (
        <div role="alert" className="mb-4 rounded-md border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger">
          We could not send the verification email. Please use the button below to try again.
        </div>
      )}
      <div role="status" className="space-y-3 text-sm">
        <p className="rounded-md border border-border bg-surface px-3 py-3 text-text">
          Check your inbox for a verification link. The link expires in 24 hours and can only be used
          once.
        </p>
        {initialEmail && (
          <p className="text-text-muted">
            We sent it to <strong>{initialEmail}</strong>. Didn't get it? Resend below.
          </p>
        )}
      </div>

      {sent && (
        <div role="status" className="mt-4 rounded-md border border-border bg-surface px-3 py-3 text-sm text-text">
          If an account exists for <strong>{email}</strong>, a new verification link has been sent.
        </div>
      )}

      {error && (
        <div role="alert" className="mt-4 rounded-md border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
        {!initialEmail && (
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        )}
        <Button type="submit" className="w-full" disabled={busy || !email}>
          {busy ? 'Sending…' : 'Resend verification email'}
        </Button>
      </form>
    </AuthLayout>
  );
}
