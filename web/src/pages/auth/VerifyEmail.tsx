import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout';

import { ApiError, api } from '../../lib/api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let active = true;
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }
    api
      .get<{ ok: boolean }>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => {
        if (!active) return;
        setStatus('success');
        setMessage('Your email has been verified. You can now log in.');
      })
      .catch((err) => {
        if (!active) return;
        setStatus('error');
        setMessage(err instanceof ApiError ? err.message : 'Verification failed. The link may be invalid or expired.');
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthLayout
      title="Email verification"
      subtitle="Confirming your email address."
      footer={
        <Link to="/login" className="font-semibold text-accent hover:underline">
          Go to log in
        </Link>
      }
    >
      {status === 'loading' && <p className="text-sm text-text-muted">Verifying…</p>}
      {status === 'success' && (
        <div role="status" className="space-y-4">
          <p className="rounded-md border border-border bg-surface px-3 py-3 text-sm text-text">
            {message}
          </p>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-[10px] border border-transparent bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Log in
          </Link>
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="space-y-4">
          <p className="rounded-md border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger">
            {message}
          </p>
          <Link to="/verify-pending" className="text-sm font-semibold text-accent hover:underline">
            Request a new verification link
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
