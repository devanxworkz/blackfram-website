import { useState, type FormEvent } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Field,
  Input,
  PageHeader,
  Panel,
  SectionHeader,
  Textarea,
} from '../../components/ui';
import { IconExternal, IconGlobe, IconUser } from '../../components/icons';
import { useAuth } from '../../context/AuthProvider';
import { useToast } from '../../components/Toast';
import { ApiError, api } from '../../lib/api';
import type { Profile } from '../../lib/types';

interface FormState {
  displayName: string;
  bio: string;
  avatarUrl: string;
  whatsappNumber: string;
  upiId: string;
  upiQrUrl: string;
  metaTitle: string;
  metaDescription: string;
}

function toForm(p: Profile | null): FormState {
  return {
    displayName: p?.displayName ?? '',
    bio: p?.bio ?? '',
    avatarUrl: p?.avatarUrl ?? '',
    whatsappNumber: p?.whatsappNumber ?? '',
    upiId: p?.upiId ?? '',
    upiQrUrl: p?.upiQrUrl ?? '',
    metaTitle: p?.metaTitle ?? '',
    metaDescription: p?.metaDescription ?? '',
  };
}

export default function ProfileEditor() {
  const { profile, setProfile, refresh } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState<FormState>(() => toForm(profile));
  const [username, setUsername] = useState(profile?.username ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setBusy(true);
    try {
      const { profile: updated } = await api.put<{ profile: Profile }>('/api/profile', form);
      setProfile(updated);
      toast.push('Profile saved.', 'success');
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  async function onUsernameBlur() {
    if (!profile || username === profile.username) return;
    try {
      const { profile: updated } = await api.put<{ profile: Profile }>('/api/profile/username', {
        username,
      });
      setProfile(updated);
      toast.push('Username updated.', 'success');
    } catch (err) {
      setErrors((e) => ({
        ...e,
        username: err instanceof ApiError ? err.fieldError('username') ?? err.message : 'Could not update username.',
      }));
      setUsername(profile.username);
    }
  }

  function handleError(err: unknown) {
    if (err instanceof ApiError) {
      const fe: Record<string, string> = {};
      for (const d of err.details ?? []) {
        const key = d.path.split('.').pop() ?? d.path;
        if (!fe[key]) fe[key] = d.message;
      }
      setErrors(fe);
      if (Object.keys(fe).length === 0) toast.push(err.message, 'error');
    } else {
      toast.push('Could not save. Please try again.', 'error');
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Identity"
        title="Profile"
        description="This is what visitors see at the top of your page. Keep it short, warm and recognisable."
        actions={
          profile && (
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-border bg-elevated px-3.5 text-sm font-semibold text-text transition-colors hover:border-border-strong"
            >
              View page
              <IconExternal />
            </a>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <Panel className="space-y-5 p-6">
            <SectionHeader
              eyebrow="01"
              title="The essentials"
              description="Your name, a short bio and a square photo."
            />
            <Field label="Display name" htmlFor="displayName" error={errors.displayName}>
              <Input
                id="displayName"
                value={form.displayName}
                onChange={(e) => set('displayName', e.target.value)}
                required
              />
            </Field>
            <Field
              label="Bio"
              htmlFor="bio"
              error={errors.bio}
              hint={`${form.bio.length}/500 characters`}
            >
              <Textarea
                id="bio"
                rows={3}
                maxLength={500}
                value={form.bio}
                onChange={(e) => set('bio', e.target.value)}
              />
            </Field>
            <Field label="Avatar image URL" htmlFor="avatarUrl" error={errors.avatarUrl} hint="A direct link to a square image.">
              <Input
                id="avatarUrl"
                placeholder="https://…"
                value={form.avatarUrl}
                onChange={(e) => set('avatarUrl', e.target.value)}
              />
            </Field>
          </Panel>

          <Panel className="space-y-5 p-6">
            <SectionHeader
              eyebrow="02"
              title="Contact & payments"
              description="Let people message you on WhatsApp or pay you with UPI."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="WhatsApp number"
                htmlFor="whatsappNumber"
                error={errors.whatsappNumber}
                hint="Include the country code, for example 91."
              >
                <Input
                  id="whatsappNumber"
                  inputMode="tel"
                  placeholder="919876543210"
                  value={form.whatsappNumber}
                  onChange={(e) => set('whatsappNumber', e.target.value)}
                />
              </Field>
              <Field label="UPI id" htmlFor="upiId" error={errors.upiId} hint="For example name@bank.">
                <Input
                  id="upiId"
                  placeholder="name@bank"
                  value={form.upiId}
                  onChange={(e) => set('upiId', e.target.value)}
                />
              </Field>
            </div>
            <Field label="UPI QR image URL" htmlFor="upiQrUrl" error={errors.upiQrUrl} hint="Optional. A screenshot of your UPI QR.">
              <Input
                id="upiQrUrl"
                placeholder="https://…"
                value={form.upiQrUrl}
                onChange={(e) => set('upiQrUrl', e.target.value)}
              />
            </Field>
          </Panel>

          <Panel className="space-y-5 p-6">
            <SectionHeader
              eyebrow="03"
              title="Search & sharing"
              description="How your page appears when the link is shared."
            />
            <Field
              label="Meta title"
              htmlFor="metaTitle"
              error={errors.metaTitle}
              hint={`${form.metaTitle.length}/70 characters`}
            >
              <Input
                id="metaTitle"
                maxLength={70}
                value={form.metaTitle}
                onChange={(e) => set('metaTitle', e.target.value)}
              />
            </Field>
            <Field
              label="Meta description"
              htmlFor="metaDescription"
              error={errors.metaDescription}
              hint={`${form.metaDescription.length}/160 characters`}
            >
              <Textarea
                id="metaDescription"
                rows={2}
                maxLength={160}
                value={form.metaDescription}
                onChange={(e) => set('metaDescription', e.target.value)}
              />
            </Field>
          </Panel>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={busy}>
              Save profile
            </Button>
            <Button type="button" variant="ghost" onClick={() => setForm(toForm(profile))}>
              Reset
            </Button>
            <span className="text-xs text-text-muted">Changes go live immediately after saving.</span>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Panel className="overflow-hidden p-0">
            <div className="border-b border-border px-5 py-3">
              <p className="label-mono text-[10px]">Card preview</p>
            </div>
            <div className="px-5 py-7 text-center">
              <div className="flex justify-center">
                <Avatar src={form.avatarUrl || null} name={form.displayName || '?'} size={84} />
              </div>
              <p className="mt-4 font-display text-xl leading-tight tracking-[-0.02em]">
                {form.displayName || 'Your name'}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {form.bio || 'Your bio goes here.'}
              </p>
              <div className="mt-4 flex justify-center">
                {form.whatsappNumber ? (
                  <Badge tone="success" dot>
                    WhatsApp connected
                  </Badge>
                ) : (
                  <Badge dot>No WhatsApp yet</Badge>
                )}
              </div>
            </div>
          </Panel>

          <Panel className="space-y-4 p-5">
            <div className="flex items-center gap-2">
              <span className="text-[17px] text-accent">
                <IconGlobe />
              </span>
              <h2 className="font-display text-lg leading-tight tracking-[-0.01em]">Your address</h2>
            </div>
            <Field label="Your page address" htmlFor="username" error={errors.username}>
              <div className="flex items-center rounded-[9px] border border-border-input bg-elevated shadow-[inset_0_1px_2px_rgba(23,19,15,0.04)] transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-4 focus-within:ring-[#c2410c]/15">
                <span className="pl-3.5 pr-1 font-mono text-sm text-text-muted">/u/</span>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  onBlur={onUsernameBlur}
                  className="w-full min-w-0 bg-transparent py-2.5 pr-3.5 font-mono text-sm text-text outline-none"
                />
              </div>
            </Field>
            <p className="text-xs leading-relaxed text-text-muted">
              Changing this updates your public link. Old links will stop working.
            </p>
            <Button size="sm" variant="ghost" onClick={() => void refresh()}>
              <IconUser />
              Refresh profile
            </Button>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
