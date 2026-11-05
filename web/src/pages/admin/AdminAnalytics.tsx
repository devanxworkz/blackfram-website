import { Link } from 'react-router-dom';
import {
  Badge,
  EmptyState,
  PageHeader,
  Panel,
  SectionHeader,
  Skeleton,
  Stat,
} from '../../components/ui';
import { BarChart, ErrorBanner, formatDateTime } from '../../components/admin/AdminBits';
import { IconArrowRight } from '../../components/icons';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatNumber } from '../../lib/format';
import type { AdminAnalyticsData } from '../../lib/types';

export default function AdminAnalytics() {
  const { data, loading, error } = useAsync(() => api.get<AdminAnalyticsData>('/api/admin/analytics'));

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Admin"
        title="Analytics"
        description="Platform-wide reach, measured from real page views and clicks."
      />

      {error && <ErrorBanner message={error} />}

      {loading || !data ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="h-56" />
        </div>
      ) : (
        <>
          <Panel className="p-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
              <Stat
                label="Total views"
                value={formatNumber(data.totals.views)}
                hint={`${formatNumber(data.totals.views_7d)} this week`}
              />
              <Stat label="Views · 30 days" value={formatNumber(data.totals.views_30d)} hint="Rolling window" />
              <Stat label="Link clicks" value={formatNumber(data.totals.clicks)} hint="All time" />
              <Stat label="Published pages" value={formatNumber(data.totals.published)} hint="Visible to visitors" />
            </div>
          </Panel>

          <Panel className="p-6">
            <SectionHeader
              eyebrow="Reach"
              title="Page views · last 30 days"
              description="Aggregated across every storefront."
            />
            {data.totals.views === 0 ? (
              <p className="mt-5 text-sm text-text-muted">No page views recorded yet.</p>
            ) : (
              <div className="mt-6">
                <BarChart series={data.series} ariaLabel="Page views over the last 30 days" height={200} />
              </div>
            )}
          </Panel>

          <Panel className="overflow-x-auto p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-display text-lg leading-tight tracking-[-0.01em] text-text">
                Top storefronts by views
              </h2>
            </div>
            {data.topCreators.length === 0 ? (
              <div className="p-6">
                <EmptyState title="No storefronts yet" hint="Creator pages will rank here once they get views." />
              </div>
            ) : (
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {['#', 'Storefront', 'Status', 'Views', 'Clicks', 'Links', 'Products'].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3">
                        <span className="label-mono text-[10px]">{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.topCreators.map((c, i) => (
                    <tr key={c.tenantId} className="transition-colors duration-150 hover:bg-[#fbf7f0]">
                      <td className="px-4 py-3.5 font-mono text-xs text-text-muted">{i + 1}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-text">{c.displayName ?? 'Untitled'}</p>
                        <p className="font-mono text-[11px] text-text-muted">
                          {c.username ? `/u/${c.username}` : '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        {c.isPublished ? <Badge tone="success" dot>Live</Badge> : <Badge tone="muted">Draft</Badge>}
                      </td>
                      <td className="px-4 py-3.5 font-semibold tabular-nums text-text">{formatNumber(c.views)}</td>
                      <td className="px-4 py-3.5 tabular-nums text-text-muted">{formatNumber(c.clicks)}</td>
                      <td className="px-4 py-3.5 tabular-nums text-text-muted">{formatNumber(c.links)}</td>
                      <td className="px-4 py-3.5 tabular-nums text-text-muted">{formatNumber(c.products)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
            Snapshot generated {formatDateTime(new Date().toISOString())} from live data.
            <Link
              to="/admin/storefronts"
              className="inline-flex items-center gap-1 font-semibold text-accent underline-offset-4 hover:underline"
            >
              Browse all storefronts
              <IconArrowRight />
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
