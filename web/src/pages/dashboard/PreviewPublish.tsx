import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  PageHeader,
  Panel,
  SectionHeader,
  Toggle,
} from '../../components/ui';
import {
  IconArrowRight,
  IconCheck,
  IconCopy,
  IconExternal,
  IconEye,
  IconPalette,
} from '../../components/icons';
import { PublicView, type PublicViewData } from '../../components/PublicView';
import { useAuth } from '../../context/AuthProvider';
import { useToast } from '../../components/Toast';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { copyText } from '../../lib/format';
import type { LinkItem, ProductItem } from '../../lib/types';

export default function PreviewPublish() {
  const { profile, refresh } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const linksAsync = useAsync(() => api.get<{ links: LinkItem[] }>('/api/links'));
  const productsAsync = useAsync(() => api.get<{ products: ProductItem[] }>('/api/products'));

  const activeLinks = (linksAsync.data?.links ?? []).filter((l) => l.isActive);
  const activeProducts = (productsAsync.data?.products ?? []).filter((p) => p.isActive);

  const publicUrl = profile ? `${window.location.origin}/u/${profile.username}` : '';

  const data: PublicViewData = {
    displayName: profile?.displayName ?? 'Your name',
    bio: profile?.bio ?? '',
    avatarUrl: profile?.avatarUrl ?? null,
    whatsappNumber: profile?.whatsappNumber ?? null,
    upiId: profile?.upiId ?? null,
    upiQrUrl: profile?.upiQrUrl ?? null,
    appearance: profile?.appearance ?? null,
    theme: profile?.theme ?? { themeKey: 'saffron', layout: 'classic', accent: '#c2410c' },
    links: activeLinks.map((l) => ({ id: l.id, title: l.title, url: l.url, icon: l.icon })),
    products: activeProducts.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      pricePaise: p.pricePaise,
      currency: p.currency,
      destinationUrl: p.destinationUrl,
    })),
  };

  async function togglePublish(next: boolean) {
    setBusy(true);
    try {
      await api.post('/api/profile/publish', { isPublished: next });
      await refresh();
      toast.push(next ? 'Your page is live.' : 'Your page is hidden.', 'success');
    } catch {
      toast.push('Could not update publish status.', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    const ok = await copyText(publicUrl);
    if (ok) {
      setCopied(true);
      toast.push('Link copied.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.push('Could not copy the link.', 'error');
    }
  }

  const live = Boolean(profile?.isPublished);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Go live"
        title="Preview & publish"
        description="This is exactly what visitors see. Publish when the page feels right."
        actions={
          <div className="flex items-center gap-3 rounded-full border border-border bg-elevated py-1.5 pl-3.5 pr-2 shadow-card">
            <span className="text-sm font-semibold text-text">
              {live ? 'Published' : 'Unpublished'}
            </span>
            {live ? <Badge tone="success" dot>Live</Badge> : <Badge tone="muted">Draft</Badge>}
            <Toggle
              checked={live}
              onChange={(v) => void togglePublish(v)}
              busy={busy}
              label="Publish my page"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-5">
          {/* Publish state, as a clear decision rather than a switch in a corner. */}
          <Panel tone={live ? 'default' : 'flat'} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${live ? 'bg-success' : 'bg-[#b9ad9c]'}`}
                  />
                  <p className="label-mono">{live ? 'Your page is live' : 'Your page is private'}</p>
                </div>
                <h2 className="mt-3 font-display text-2xl leading-tight tracking-[-0.02em] text-text">
                  {live ? 'Anyone with the link can see you.' : 'Only you can see this page.'}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-text-muted">
                  {live
                    ? 'Share your address everywhere you create. Changes you save appear here straight away.'
                    : 'Turn on “Publish my page” to make it visible. You can hide it again at any time.'}
                </p>
              </div>
              <Button
                variant={live ? 'secondary' : 'primary'}
                onClick={() => void togglePublish(!live)}
                loading={busy}
              >
                {live ? 'Hide page' : 'Publish page'}
              </Button>
            </div>
          </Panel>

          {/* The address, with copy and open. */}
          <Panel className="space-y-4 p-6">
            <SectionHeader
              eyebrow="Address"
              title="Your public link"
              description="Everything a visitor needs, in one address."
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[9px] border border-border bg-bg px-3.5 py-2.5">
                <span className="font-mono text-[11px] text-[#a89d8e]">/u/</span>
                <span className="truncate font-mono text-xs text-text">
                  {profile?.username ?? '—'}
                </span>
              </div>
              <Button size="sm" variant="secondary" onClick={copy} disabled={!publicUrl}>
                <span className="flex items-center gap-1.5">
                  {copied ? <IconCheck /> : <IconCopy />}
                  Copy link
                </span>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {profile && (
                <a
                  href={`/u/${profile.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                >
                  Open public page
                  <IconExternal />
                </a>
              )}
              <span className="text-xs text-text-muted">
                {live ? 'The link works for everyone.' : 'Publish to make the link work for visitors.'}
              </span>
            </div>
          </Panel>

          {/* What the page contains right now. */}
          <Panel className="p-6">
            <SectionHeader eyebrow="Right now" title="On your page" />
            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-[10px] border border-border bg-bg px-4 py-3">
                <dt className="label-mono">Links</dt>
                <dd className="mt-1 font-display text-2xl leading-none tabular-nums text-text">
                  {activeLinks.length}
                </dd>
              </div>
              <div className="rounded-[10px] border border-border bg-bg px-4 py-3">
                <dt className="label-mono">Products</dt>
                <dd className="mt-1 font-display text-2xl leading-none tabular-nums text-text">
                  {activeProducts.length}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap items-center gap-1">
              <Link
                to="/dashboard/links"
                className="inline-flex h-8 items-center rounded-[7px] px-3 text-xs font-semibold text-text transition-colors hover:bg-surface"
              >
                Edit links
              </Link>
              <Link
                to="/dashboard/products"
                className="inline-flex h-8 items-center rounded-[7px] px-3 text-xs font-semibold text-text transition-colors hover:bg-surface"
              >
                Edit products
              </Link>
              <Link
                to="/dashboard/appearance"
                className="inline-flex h-8 items-center gap-1.5 rounded-[7px] px-3 text-xs font-semibold text-accent transition-colors hover:bg-accent-soft"
              >
                <IconPalette />
                Change the design
                <IconArrowRight />
              </Link>
            </div>
          </Panel>
        </div>

        {/* Device-framed preview. */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="label-mono inline-flex items-center gap-1.5">
              <IconEye />
              Visitor view
            </p>
            <Badge tone={live ? 'success' : 'muted'} dot>
              {live ? 'Published' : 'Draft'}
            </Badge>
          </div>
          <div className="mx-auto w-full max-w-[400px] rounded-[2.25rem] border-[6px] border-ink bg-ink p-1 shadow-pop">
            <div className="relative overflow-hidden rounded-[1.75rem]">
              <div className="absolute left-1/2 top-0 z-10 h-1.5 w-16 -translate-x-1/2 rounded-b-full bg-ink" />
              <div className="max-h-[60vh] overflow-y-auto bg-white pt-2">
                <PublicView data={data} compact />
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-text-muted">
            Scaled down for preview. Your page adapts to every screen.
          </p>
        </aside>
      </div>
    </div>
  );
}
