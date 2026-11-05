import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, EmptyState, PageHeader, Panel, Skeleton, Stat } from '../../components/ui';
import { ErrorBanner, formatDate, timeAgo } from '../../components/admin/AdminBits';
import { IconArrowRight } from '../../components/icons';
import { useToast } from '../../components/Toast';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatNumber } from '../../lib/format';
import type { AdminStorefrontRow, AdminUserRow, Paginated } from '../../lib/types';

export default function AdminModeration() {
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const suspended = useAsync(() =>
    api.get<Paginated<AdminUserRow>>('/api/admin/users?status=suspended&page=1'),
  );
  const drafts = useAsync(() =>
    api.get<Paginated<AdminStorefrontRow>>('/api/admin/storefronts?published=false&page=1'),
  );

  async function reactivate(row: AdminUserRow) {
    setBusy(row.id);
    try {
      await api.put(`/api/admin/users/${row.id}/status`, { status: 'active' });
      toast.push('Account reactivated.', 'success');
      await suspended.reload();
    } catch {
      toast.push('Could not reactivate this account.', 'error');
    } finally {
      setBusy(null);
    }
  }

  const suspendedRows = suspended.data?.rows ?? [];
  const draftRows = drafts.data?.rows ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Admin"
        title="Reports & Moderation"
        description="A queue of accounts and pages that may need attention. Actions here are recorded in the audit log."
      />

      <Panel className="p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          <Stat
            label="Suspended accounts"
            value={formatNumber(suspended.data?.total ?? 0)}
            hint="Waiting for review"
          />
          <Stat
            label="Draft storefronts"
            value={formatNumber(drafts.data?.total ?? 0)}
            hint="Not yet published"
          />
        </div>
      </Panel>

      {suspended.error && <ErrorBanner message={suspended.error} />}
      <Panel className="overflow-x-auto p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="font-display text-lg leading-tight tracking-[-0.01em] text-text">
            Suspended accounts
          </h2>
          <Link
            to="/admin/creators?q="
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent underline-offset-4 hover:underline"
          >
            All accounts
            <IconArrowRight />
          </Link>
        </div>
        {suspended.loading || !suspended.data ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : suspendedRows.length === 0 ? (
          <div className="p-6">
            <EmptyState title="Nothing to review" hint="No accounts are currently suspended." />
          </div>
        ) : (
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['Account', 'Username', 'Registered', 'Last sign-in', 'Action'].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3">
                    <span className="label-mono text-[10px]">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {suspendedRows.map((r) => (
                <tr key={r.id} className="transition-colors duration-150 hover:bg-[#fbf7f0]">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-text">{r.displayName ?? '—'}</p>
                    <p className="font-mono text-[11px] text-text-muted">{r.email}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-text-muted">
                    {r.username ? `/u/${r.username}` : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-text-muted">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3.5 text-text-muted">{timeAgo(r.lastLoginAt)}</td>
                  <td className="px-4 py-3.5">
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={busy === r.id}
                      onClick={() => void reactivate(r)}
                    >
                      Reactivate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {drafts.error && <ErrorBanner message={drafts.error} />}
      <Panel className="overflow-x-auto p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="font-display text-lg leading-tight tracking-[-0.01em] text-text">
            Draft storefronts
          </h2>
          <Link
            to="/admin/storefronts"
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent underline-offset-4 hover:underline"
          >
            All storefronts
            <IconArrowRight />
          </Link>
        </div>
        {drafts.loading || !drafts.data ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : draftRows.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No drafts" hint="Every storefront is currently live." />
          </div>
        ) : (
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['Storefront', 'State', 'Links', 'Products'].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3">
                    <span className="label-mono text-[10px]">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {draftRows.map((r) => (
                <tr key={r.tenantId} className="transition-colors duration-150 hover:bg-[#fbf7f0]">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-text">{r.displayName ?? 'Untitled'}</p>
                    <p className="font-mono text-[11px] text-text-muted">
                      {r.username ? `/u/${r.username}` : '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge tone="muted">Draft</Badge>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-text-muted">{formatNumber(r.links)}</td>
                  <td className="px-4 py-3.5 tabular-nums text-text-muted">{formatNumber(r.products)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
