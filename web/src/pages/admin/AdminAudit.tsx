import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Panel,
  Select,
  Skeleton,
} from '../../components/ui';
import { ErrorBanner, Pager, formatDateTime, humanAction, timeAgo } from '../../components/admin/AdminBits';
import { IconArrowRight } from '../../components/icons';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatNumber } from '../../lib/format';
import type { AdminAuditEntry, AdminUserRow, Paginated } from '../../lib/types';

export default function AdminAudit() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);

  const actions = useAsync(() => api.get<{ actions: string[] }>('/api/admin/audit/actions'));
  const admins = useAsync(() => api.get<Paginated<AdminUserRow>>('/api/admin/users?role=admin&page=1'));

  const qs = (() => {
    const p = new URLSearchParams();
    if (submitted) p.set('q', submitted);
    if (action) p.set('action', action);
    p.set('page', String(page));
    return p.toString();
  })();

  const { data, loading, error } = useAsync(
    () => api.get<Paginated<AdminAuditEntry>>(`/api/admin/audit?${qs}`),
    [qs],
  );

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSubmitted(query);
  }

  const rows = data?.rows ?? [];
  const adminRows = admins.data?.rows ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Admin"
        title="Admin Roles & Audit Logs"
        description="Who has access, and every sensitive action they have taken. This log is append-only."
      />

      <Panel className="overflow-x-auto p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
          <h2 className="font-display text-lg leading-tight tracking-[-0.01em] text-text">
            Administrators
          </h2>
          <Link
            to="/admin/creators?q="
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent underline-offset-4 hover:underline"
          >
            Manage on Creators &amp; Users
            <IconArrowRight />
          </Link>
        </div>
        {admins.loading || !admins.data ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : adminRows.length === 0 ? (
          <p className="p-6 text-center text-sm text-text-muted">No administrators.</p>
        ) : (
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['Email', 'Status', 'Last sign-in', 'Registered'].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3">
                    <span className="label-mono text-[10px]">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {adminRows.map((a) => (
                <tr key={a.id} className="transition-colors duration-150 hover:bg-[#fbf7f0]">
                  <td className="px-4 py-3.5 font-semibold text-text">{a.email}</td>
                  <td className="px-4 py-3.5">
                    {a.status === 'active' ? (
                      <Badge tone="success" dot>Active</Badge>
                    ) : (
                      <Badge tone="danger" dot>Suspended</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-text-muted">{timeAgo(a.lastLoginAt)}</td>
                  <td className="px-4 py-3.5 text-text-muted">{formatDateTime(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <Panel className="p-5">
        <form onSubmit={onSearch} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Field label="Search" htmlFor="audit-search">
              <Input
                id="audit-search"
                type="search"
                placeholder="Actor email or target…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Action" htmlFor="audit-action">
            <Select
              id="audit-action"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All actions</option>
              {(actions.data?.actions ?? []).map((a) => (
                <option key={a} value={a}>
                  {humanAction(a)}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button type="submit">Search</Button>
            {(submitted || action) && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setQuery('');
                  setSubmitted('');
                  setAction('');
                  setPage(1);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </Panel>

      {error && <ErrorBanner message={error} />}

      <Panel className="overflow-x-auto p-0">
        {loading || !data ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No audit entries"
              hint="Administrative actions such as suspending an account are recorded here."
            />
          </div>
        ) : (
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['When', 'Action', 'Actor', 'Target', 'Details'].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3">
                    <span className="label-mono text-[10px]">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="align-top transition-colors duration-150 hover:bg-[#fbf7f0]">
                  <td className="whitespace-nowrap px-4 py-3.5 text-text-muted">{formatDateTime(r.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <Badge tone="info">{humanAction(r.action)}</Badge>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-text">{r.actorEmail}</td>
                  <td className="px-4 py-3.5 text-text">
                    {r.targetLabel ?? '—'}
                    {r.targetType && (
                      <span className="ml-1 text-[11px] text-text-muted">({r.targetType})</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-text-muted">
                    {r.metadata && typeof r.metadata.reason === 'string' ? String(r.metadata.reason) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {data && <Pager page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}

      <p className="text-xs text-text-muted">{data ? `${formatNumber(data.total)} entries` : ' '}</p>
    </div>
  );
}
