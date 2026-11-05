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
} from '../../components/ui';
import { BarChart, ErrorBanner, humanAction, timeAgo } from '../../components/admin/AdminBits';
import { IconArrowRight, IconRefresh } from '../../components/icons';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatNumber } from '../../lib/format';
import type { AdminOverviewData } from '../../lib/types';

export default function AdminOverview() {
  const { data, loading, error, reload } = useAsync(() =>
    api.get<AdminOverviewData>('/api/admin/overview'),
  );

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Admin"
        title="Platform overview"
        description="A live snapshot across every creator and tenant."
        actions={
          <Button variant="secondary" size="sm" onClick={() => void reload()} loading={loading}>
            <IconRefresh /> Refresh
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      {loading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <>
          <Panel className="p-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3">
              <Stat
                label="Creators"
                value={formatNumber(data.totals.creators)}
                hint={`${formatNumber(data.activity.newUsers7d)} joined in the last 7 days`}
              />
              <Stat label="Administrators" value={formatNumber(data.totals.admins)} hint="With console access" />
              <Stat
                label="Published pages"
                value={formatNumber(data.totals.published)}
                hint={`${formatNumber(data.totals.drafts)} still in draft`}
              />
              <Stat
                label="Suspended accounts"
                value={formatNumber(data.totals.suspended)}
                hint={data.totals.suspended > 0 ? 'Review in Moderation' : 'All clear'}
              />
              <Stat
                label="Page views"
                value={formatNumber(data.activity.views)}
                hint={`${formatNumber(data.activity.views7d)} in the last 7 days`}
              />
              <Stat
                label="Links & products"
                value={`${formatNumber(data.totals.links)} / ${formatNumber(data.totals.products)}`}
                hint="Across all storefronts"
              />
            </div>
          </Panel>

          <Panel className="p-6">
            <SectionHeader
              eyebrow="Activity"
              title="Page views · last 14 days"
              description="Every visit across every published storefront."
              action={<Badge tone="muted">{formatNumber(data.activity.views)} all time</Badge>}
            />
            {data.activity.views === 0 ? (
              <p className="mt-5 text-sm text-text-muted">No page views recorded yet.</p>
            ) : (
              <div className="mt-6">
                <BarChart series={data.series} ariaLabel="Page views over the last 14 days" />
              </div>
            )}
          </Panel>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel className="overflow-hidden p-0">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <h2 className="font-display text-lg leading-tight tracking-[-0.01em] text-text">
                  Newest accounts
                </h2>
                <Link
                  to="/admin/creators"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent underline-offset-4 hover:underline"
                >
                  View all
                  <IconArrowRight />
                </Link>
              </div>
              {data.recentUsers.length === 0 ? (
                <p className="p-6 text-center text-sm text-text-muted">No accounts yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {data.recentUsers.map((u) => (
                    <li key={u.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text">
                          {u.displayName ?? u.username ?? u.email}
                        </p>
                        <p className="truncate font-mono text-[11px] text-text-muted">{u.email}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {u.role === 'admin' && <Badge tone="info">Admin</Badge>}
                        {u.status === 'active' ? (
                          <Badge tone="success" dot>Active</Badge>
                        ) : (
                          <Badge tone="danger" dot>Suspended</Badge>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel className="overflow-hidden p-0">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <h2 className="font-display text-lg leading-tight tracking-[-0.01em] text-text">
                  Recent admin activity
                </h2>
                <Link
                  to="/admin/roles"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent underline-offset-4 hover:underline"
                >
                  Audit log
                  <IconArrowRight />
                </Link>
              </div>
              {data.recentAudit.length === 0 ? (
                <div className="p-5">
                  <EmptyState title="No admin activity yet" hint="Actions like suspending an account will appear here." />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {data.recentAudit.map((a) => (
                    <li key={a.id} className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-text">{humanAction(a.action)}</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">
                        {a.actorEmail}
                        {a.targetLabel ? ` → ${a.targetLabel}` : ''} · {timeAgo(a.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
