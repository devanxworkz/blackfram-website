import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Panel,
  Select,
  Skeleton,
  Textarea,
} from '../../components/ui';
import { Pager, ErrorBanner, formatDate, formatDateTime, timeAgo } from '../../components/admin/AdminBits';
import { IconExternal } from '../../components/icons';
import { useToast } from '../../components/Toast';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatNumber } from '../../lib/format';
import type { AdminUserDetail, AdminUserRow, Paginated } from '../../lib/types';

type StatusFilter = '' | 'active' | 'suspended';
type RoleFilter = '' | 'creator' | 'admin';
type PublishedFilter = '' | 'true' | 'false';

export default function AdminUsers() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const submitted = params.get('q') ?? '';

  const [query, setQuery] = useState(submitted);
  const [status, setStatus] = useState<StatusFilter>('');
  const [role, setRole] = useState<RoleFilter>('');
  const [published, setPublished] = useState<PublishedFilter>('');
  const [page, setPage] = useState(1);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ row: AdminUserRow; next: 'active' | 'suspended' } | null>(null);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setQuery(submitted);
  }, [submitted]);

  const qs = (() => {
    const p = new URLSearchParams();
    if (submitted) p.set('q', submitted);
    if (status) p.set('status', status);
    if (role) p.set('role', role);
    if (published) p.set('published', published);
    p.set('page', String(page));
    return p.toString();
  })();

  const { data, loading, error, reload } = useAsync(
    () => api.get<Paginated<AdminUserRow>>(`/api/admin/users?${qs}`),
    [qs],
  );

  function applyFilter<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    setParams(next);
  }

  function clearSearch() {
    setQuery('');
    setPage(1);
    setParams(new URLSearchParams());
  }

  async function confirmStatus() {
    if (!confirm) return;
    setSaving(true);
    try {
      await api.put(`/api/admin/users/${confirm.row.id}/status`, {
        status: confirm.next,
        reason: reason.trim() || undefined,
      });
      toast.push(confirm.next === 'suspended' ? 'Account suspended.' : 'Account reactivated.', 'success');
      setConfirm(null);
      setReason('');
      await reload();
    } catch {
      toast.push('Could not update this account.', 'error');
    } finally {
      setSaving(false);
    }
  }

  const rows = data?.rows ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Admin"
        title="Creators & Users"
        description="Search, inspect and manage every account on the platform."
      />

      <Panel className="p-5">
        <form onSubmit={onSearch} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Field label="Search" htmlFor="admin-user-search">
              <Input
                id="admin-user-search"
                type="search"
                placeholder="Email, username or name…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Status" htmlFor="admin-user-status">
            <Select
              id="admin-user-status"
              value={status}
              onChange={(e) => applyFilter(setStatus, e.target.value as StatusFilter)}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </Select>
          </Field>
          <Field label="Role" htmlFor="admin-user-role">
            <Select
              id="admin-user-role"
              value={role}
              onChange={(e) => applyFilter(setRole, e.target.value as RoleFilter)}
            >
              <option value="">All roles</option>
              <option value="creator">Creator</option>
              <option value="admin">Administrator</option>
            </Select>
          </Field>
          <Field label="Page" htmlFor="admin-user-published">
            <Select
              id="admin-user-published"
              value={published}
              onChange={(e) => applyFilter(setPublished, e.target.value as PublishedFilter)}
            >
              <option value="">Any page</option>
              <option value="true">Live</option>
              <option value="false">Draft</option>
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button type="submit">Search</Button>
            {(submitted || status || role || published) && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  clearSearch();
                  setStatus('');
                  setRole('');
                  setPublished('');
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
            <EmptyState title="No accounts match" hint="Try a different search term or clear the filters." />
          </div>
        ) : (
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['Account', 'Username', 'Page', 'Views', 'Last sign-in', 'Status', 'Actions'].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3">
                    <span className="label-mono text-[10px]">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="transition-colors duration-150 hover:bg-[#fbf7f0]">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text">{r.displayName ?? '—'}</p>
                      {r.role === 'admin' && <Badge tone="info">Admin</Badge>}
                    </div>
                    <p className="font-mono text-[11px] text-text-muted">{r.email}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-text-muted">
                    {r.username ? `/u/${r.username}` : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    {r.isPublished ? <Badge tone="success" dot>Live</Badge> : <Badge tone="muted">Draft</Badge>}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-text">{formatNumber(r.views)}</td>
                  <td className="px-4 py-3.5 text-text-muted" title={formatDateTime(r.lastLoginAt)}>
                    {timeAgo(r.lastLoginAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    {r.status === 'active' ? (
                      <Badge tone="success" dot>Active</Badge>
                    ) : (
                      <Badge tone="danger" dot>Suspended</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setDetailId(r.id)}>
                        Details
                      </Button>
                      {r.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setConfirm({ row: r, next: 'suspended' });
                            setReason('');
                          }}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setConfirm({ row: r, next: 'active' });
                            setReason('');
                          }}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {data && (
        <Pager page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
      )}

      {detailId && <UserDetailDialog userId={detailId} onClose={() => setDetailId(null)} />}

      <Dialog
        open={confirm !== null}
        onClose={() => {
          setConfirm(null);
          setReason('');
        }}
        title={confirm?.next === 'suspended' ? 'Suspend this account?' : 'Reactivate this account?'}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setConfirm(null);
                setReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant={confirm?.next === 'suspended' ? 'danger' : 'primary'}
              loading={saving}
              onClick={() => void confirmStatus()}
            >
              {confirm?.next === 'suspended' ? 'Suspend account' : 'Reactivate account'}
            </Button>
          </>
        }
      >
        {confirm && (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-text">
              {confirm.next === 'suspended'
                ? 'The account and its storefront are hidden and all active sessions are signed out immediately.'
                : 'The account will be able to sign in again and its storefront restored.'}
            </p>
            <p className="text-sm font-semibold">{confirm.row.displayName ?? confirm.row.email}</p>
            {confirm.next === 'suspended' && (
              <Field label="Reason (optional)" htmlFor="admin-suspend-reason" hint="Recorded in the audit log.">
                <Textarea
                  id="admin-suspend-reason"
                  value={reason}
                  maxLength={300}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Spam links, phishing report"
                />
              </Field>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}

function UserDetailDialog({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setDetail(null);
    setError(null);
    api
      .get<{ user: AdminUserDetail }>(`/api/admin/users/${userId}`)
      .then((res) => {
        if (alive) setDetail(res.user);
      })
      .catch(() => {
        if (alive) setError('Could not load this account.');
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  return (
    <Dialog open onClose={onClose} title="Account details" footer={<Button onClick={onClose}>Close</Button>}>
      {error && <ErrorBanner message={error} />}
      {!detail && !error && <Skeleton className="h-48" />}
      {detail && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Avatar src={detail.profile?.avatarUrl ?? null} name={detail.profile?.displayName ?? detail.email} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{detail.profile?.displayName ?? '—'}</p>
              <p className="truncate text-sm text-text-muted">{detail.email}</p>
            </div>
            {detail.role === 'admin' && <Badge tone="info">Admin</Badge>}
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm">
            <Row label="Status">
              {detail.status === 'active' ? <Badge tone="success" dot>Active</Badge> : <Badge tone="danger" dot>Suspended</Badge>}
            </Row>
            <Row label="Page">
              {detail.profile?.isPublished ? <Badge tone="success" dot>Live</Badge> : <Badge tone="muted">Draft</Badge>}
            </Row>
            <Row label="Username">{detail.profile ? `/u/${detail.profile.username}` : '—'}</Row>
            <Row label="Registered">{formatDate(detail.createdAt)}</Row>
            <Row label="Last sign-in">{timeAgo(detail.lastLoginAt)}</Row>
            <Row label="Active sessions">{formatNumber(detail.counts.sessions)}</Row>
            <Row label="Page views">{formatNumber(detail.counts.views)}</Row>
            <Row label="Link clicks">{formatNumber(detail.counts.clicks)}</Row>
            <Row label="Links">{formatNumber(detail.counts.links)}</Row>
            <Row label="Products">{formatNumber(detail.counts.products)}</Row>
          </dl>

          {detail.profile?.bio && (
            <div className="border-t border-border pt-4">
              <p className="label-mono">Bio</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text">{detail.profile.bio}</p>
            </div>
          )}

          {detail.profile?.isPublished && (
            <a
              href={`/u/${detail.profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              <IconExternal /> View public storefront
            </a>
          )}
        </div>
      )}
    </Dialog>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="label-mono text-[10px]">{label}</dt>
      <dd className="mt-1 text-text">{children}</dd>
    </div>
  );
}
