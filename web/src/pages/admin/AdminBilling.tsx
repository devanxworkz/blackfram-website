import { Link } from 'react-router-dom';
import { Badge, PageHeader, Panel, Skeleton, Stat } from '../../components/ui';
import { IconArrowRight } from '../../components/icons';
import { ErrorBanner } from '../../components/admin/AdminBits';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatNumber } from '../../lib/format';
import type { AdminOverviewData } from '../../lib/types';

export default function AdminBilling() {
  const { data, loading, error } = useAsync(() => api.get<AdminOverviewData>('/api/admin/overview'));

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Admin"
        title="Plans & Billing"
        description="The commercial state of the platform."
        actions={<Badge tone="warning" dot>No payment provider</Badge>}
      />

      {error && <ErrorBanner message={error} />}

      <Panel className="p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {loading || !data ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : (
            <>
              <Stat label="Creators on free plan" value={formatNumber(data.totals.creators)} hint="Every account" />
              <Stat label="Paid subscriptions" value="0" hint="No payment provider connected" />
              <Stat label="Live storefronts" value={formatNumber(data.totals.published)} hint="Visible today" />
              <Stat label="Suspended" value={formatNumber(data.totals.suspended)} hint="Accounts on hold" />
            </>
          )}
        </div>
      </Panel>

      <Panel tone="flat" className="p-6">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-elevated font-display text-lg text-text-muted"
          >
            ₹
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-xl leading-tight tracking-[-0.015em] text-text">
              Billing is not enabled
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
              BLACKFRAM does not currently collect payments. Every creator is on the single free plan,
              so there is no revenue, invoice or subscription data to display — and none is invented
              here.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
              When a payment provider is added, plan management, invoices and revenue reporting will
              appear on this page.
            </p>
            <Link
              to="/admin/creators"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              Manage creators
              <IconArrowRight />
            </Link>
          </div>
        </div>
      </Panel>
    </div>
  );
}
