import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Field,
  Input,
  PageHeader,
  Panel,
  SectionHeader,
  Select,
} from '../../components/ui';
import { IconGlobe, IconLogout } from '../../components/icons';
import { useAuth } from '../../context/AuthProvider';
import { useI18n } from '../../components/I18nProvider';
import { useToast } from '../../components/Toast';
import { ApiError, api } from '../../lib/api';
import { LOCALES, LOCALE_LABELS, type Locale } from '../../lib/i18n';

export default function Account() {
  const { user, logout } = useAuth();
  const { locale, setLocale } = useI18n();
  const toast = useToast();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      toast.push('Password changed. Other sessions were signed out.', 'success');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change your password.');
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Settings"
        title="Account"
        description="How you sign in, what language the workspace speaks, and where you are signed in."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {/* Sign-in details */}
          <Panel className="p-6">
            <SectionHeader
              eyebrow="01 — Identity"
              title="Sign-in details"
              description="The address and role attached to this account."
            />
            <div className="mt-5 flex items-center gap-4 rounded-[10px] border border-border bg-bg px-4 py-4">
              <Avatar name={user?.email ?? '?'} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text">{user?.email}</p>
                <p className="mt-0.5 text-xs text-text-muted">Signed in on this device</p>
              </div>
              <Badge tone="info" className="capitalize">
                {user?.role}
              </Badge>
            </div>
            <dl className="mt-4 divide-y divide-border text-sm">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-text-muted">Email</dt>
                <dd className="min-w-0 truncate text-right font-medium text-text">{user?.email}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-text-muted">Role</dt>
                <dd className="font-medium capitalize text-text">{user?.role}</dd>
              </div>
            </dl>
          </Panel>

          {/* Password */}
          <Panel className="p-6">
            <SectionHeader
              eyebrow="02 — Security"
              title="Change password"
              description="Changing it signs out every other session."
            />
            <form onSubmit={changePassword} noValidate className="mt-5 max-w-md space-y-4">
              {error && <Alert tone="danger">{error}</Alert>}
              <Field label="Current password" htmlFor="currentPassword">
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Field>
              <Field label="New password" htmlFor="newPassword" hint="At least 8 characters.">
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Field>
              <Button type="submit" loading={busy}>
                Update password
              </Button>
            </form>
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <Panel className="p-6">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-accent-line bg-accent-soft text-[17px] text-accent">
                <IconGlobe />
              </span>
              <div>
                <h2 className="font-display text-lg leading-tight tracking-[-0.01em] text-text">
                  Language
                </h2>
                <p className="text-xs text-text-muted">Interface language</p>
              </div>
            </div>
            <div className="mt-5">
              <Field label="Preferred language" htmlFor="locale-pref">
                <Select
                  id="locale-pref"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                >
                  {LOCALES.map((l) => (
                    <option key={l} value={l}>
                      {LOCALE_LABELS[l]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Panel>

          {/* Session */}
          <Panel tone="ink" tick className="p-6">
            <p className="label-mono text-[#b9ad9c]">Session</p>
            <h2 className="mt-3 font-display text-xl leading-tight tracking-[-0.015em] text-on-ink">
              Done for now?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#b9ad9c]">
              Sign out of this device. Your page stays live for visitors.
            </p>
            <button
              type="button"
              onClick={signOut}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-[9px] border border-[rgba(247,242,233,0.3)] bg-[rgba(247,242,233,0.14)] px-4 text-sm font-semibold text-[#f7f2e9] transition-colors hover:bg-[rgba(247,242,233,0.22)]"
            >
              <IconLogout />
              Log out
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
