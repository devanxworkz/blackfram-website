import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  EmptyState,
  PageHeader,
  Panel,
  SectionHeader,
  Skeleton,
  Stat,
  cx,
} from '../../components/ui';
import {
  IconArrowRight,
  IconBag,
  IconCheck,
  IconCopy,
  IconExternal,
  IconEye,
  IconLink,
  IconPalette,
} from '../../components/icons';
import { useAuth } from '../../context/AuthProvider';
import { useToast } from '../../components/Toast';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatNumber } from '../../lib/format';
import type { OwnerStats } from '../../lib/types';
import { useState, type ReactNode } from 'react';

export default function Overview() {
  const { profile, refresh } = useAuth();
  const toast = useToast();
  const { data, loading, error } = useAsync(() => api.get<{ stats: OwnerStats }>('/api/stats'));
  const [copied, setCopied] = useState(false);

  const publicUrl = profile ? `${window.location.origin}/u/${profile.username}` : '';

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.push('Link copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.push('Could not copy. Select the link manually.', 'error');
    }
  }

  async function togglePublish() {
    if (!profile) return;
    try {
      await api.post('/api/profile/publish', { isPublished: !profile.isPublished });
      await refresh();
      toast.push(profile.isPublished ? 'Your page is now hidden.' : 'Your page is live.', 'success');
    } catch {
      toast.push('Could not update publish status.', 'error');
    }
  }

  const stats = data?.stats;
  const live = Boolean(profile?.isPublished);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={<>Hi {profile?.displayName ?? 'there'}</>}
        description="Here is how your BLACKFRAM page is doing."
        actions={
          <Button variant={live ? 'secondary' : 'primary'} onClick={togglePublish}>
            {live ? 'Hide page' : 'Publish page'}
          </Button>
        }
      />

      {error && (
        <div role="alert" className="rounded-[10px] border border-[#e8c4bf] bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Public address — the one thing a creator shares most. */}
      <Panel tone="ink" tick className="overflow-hidden p-6 sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cx('h-2 w-2 rounded-full', live ? 'bg-[#7ad3a0]' : 'bg-[#b9ad9c]')}
              />
              <p className="label-mono text-[#b9ad9c]">Public address</p>
              <Badge tone={live ? 'success' : 'muted'} className="border-[rgba(247,242,233,0.18)] bg-[rgba(247,242,233,0.08)] text-on-ink">
                {live ? 'Live' : 'Draft'}
              </Badge>
            </div>
            <p className="mt-4 truncate font-mono text-sm text-[#efe7da]">
              {publicUrl || 'Your page is being set up…'}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#a99e8d]">
              {live
                ? 'Anyone with this link can see your page.'
                : 'Publish your page to make this link work for visitors.'}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyUrl}
              disabled={!publicUrl}
              className="inline-flex h-9 items-center gap-2 rounded-[9px] border border-[rgba(247,242,233,0.22)] px-3.5 text-xs font-semibold text-on-ink transition-colors hover:bg-[rgba(247,242,233,0.08)] disabled:opacity-40"
            >
              {copied ? <IconCheck /> : <IconCopy />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            {live && (
              <a
                href={`/u/${profile?.username}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-[9px] bg-on-ink px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-white"
              >
                Open page
                <IconExternal />
              </a>
            )}
          </div>
        </div>
      </Panel>

      {/* Numbers as specimens, in one ruled panel. */}
      <Panel className="p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {loading || !stats ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : (
            <>
              {[
                { label: 'Page views', value: stats.views, hint: 'All time' },
                { label: 'Last 7 days', value: stats.views_7d, hint: 'Views' },
                { label: 'Link clicks', value: stats.clicks, hint: 'All time' },
                { label: 'Links', value: stats.links, hint: 'On your page' },
                { label: 'Products', value: stats.products, hint: 'Listed' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={cx(
                    'min-w-0',
                    i > 0 && 'lg:border-l lg:border-border lg:pl-6',
                  )}
                >
                  <Stat
                    label={item.label}
                    value={formatNumber(item.value)}
                    hint={item.hint}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </Panel>

      {/* Activity */}
      <Panel className="p-6">
        <SectionHeader
          eyebrow="Activity"
          title="Views, last 14 days"
          description="Every visit to your public page."
          action={
            stats ? (
              <Badge tone="muted">
                {formatNumber(stats.views_7d)} this week
              </Badge>
            ) : null
          }
        />
        {loading || !stats ? (
          <Skeleton className="mt-6 h-44" />
        ) : stats.series.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon={<IconEye />}
              title="No views yet"
              hint="Publish your page and share the link to start seeing activity here."
            />
          </div>
        ) : (
          <BarChart series={stats.series} />
        )}
      </Panel>

      {/* Shortcuts */}
      <section>
        <SectionHeader eyebrow="Next" title="Keep building" className="mb-4" />
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickLink
            to="/dashboard/links"
            icon={<IconLink />}
            title="Manage links"
            body="Add, reorder and hide links."
          />
          <QuickLink
            to="/dashboard/products"
            icon={<IconBag />}
            title="Manage products"
            body="Add items with ₹ prices."
          />
          <QuickLink
            to="/dashboard/appearance"
            icon={<IconPalette />}
            title="Change the look"
            body="Pick a template and fine-tune it."
          />
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  to,
  title,
  body,
  icon,
}: {
  to: string;
  title: string;
  body: string;
  icon: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col rounded-xl border border-border bg-elevated p-5 shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-raised"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full border border-accent-line bg-accent-soft text-[18px] text-accent">
        {icon}
      </span>
      <p className="mt-4 font-display text-lg leading-tight tracking-[-0.01em] text-text">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-text-muted">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
        Open
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          <IconArrowRight />
        </span>
      </span>
    </Link>
  );
}

function BarChart({ series }: { series: { day: string; count: number }[] }) {
  const max = Math.max(1, ...series.map((s) => s.count));
  return (
    <div className="mt-7" role="img" aria-label="Daily page views bar chart">
      <div className="flex items-end gap-1.5 sm:gap-2">
        {series.map((s, i) => {
          const height = Math.round((s.count / max) * 100);
          return (
            <div key={s.day} className="group relative flex flex-1 flex-col items-center justify-end">
              <span className="pointer-events-none absolute -top-8 z-10 hidden whitespace-nowrap rounded-[6px] bg-ink px-2 py-1 text-[10px] font-semibold text-on-ink group-hover:block">
                {s.count} · {s.day.slice(5)}
              </span>
              <div className="flex h-40 w-full items-end">
                <div
                  className="w-full rounded-t-[3px] transition-colors duration-150"
                  style={{
                    height: `${Math.max(height, s.count > 0 ? 6 : 2)}%`,
                    backgroundColor: s.count > 0 ? 'var(--color-accent)' : '#e7dccc',
                  }}
                />
              </div>
              <span
                className={cx(
                  'mt-2 text-[9px] font-medium tracking-wide text-text-muted',
                  i % 3 === 0 ? 'opacity-100' : 'opacity-0',
                )}
              >
                {s.day.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
