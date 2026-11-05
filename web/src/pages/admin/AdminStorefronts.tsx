import { useState, type FormEvent } from 'react';
import {
  Avatar,
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
import { ErrorBanner, Pager, formatDate } from '../../components/admin/AdminBits';
import { IconExternal } from '../../components/icons';
import { api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatNumber } from '../../lib/format';
import type { AdminStorefrontRow, Paginated } from '../../lib/types';

type PublishedFilter = '' | 'true' | 'false';

export default function AdminStorefronts() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [published, setPublished] = useState<PublishedFilter>('');
  const [page, setPage] = useState(1);

  const qs = (() => {
    const p = new URLSearchParams();
    if (submitted) p.set('q', submitted);
    if (published) p.set('published', published);
    p.set('page', String(page));
    return p.toString();
  })();

  const { data, loading, error } = useAsync(
    () => api.get<Paginated<AdminStorefrontRow>>(`/api/admin/storefronts?${qs}`),
    [qs],
  );

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSubmitted(query);
  }

  const rows = data?.rows ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Admin"
        title="Storefronts"
        description="Every creator page on the platform, ranked by reach."
      />

      <Panel className="p-5">
        <form onSubmit={onSearch} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Field label="Search" htmlFor="storefront-search">
              <Input
                id="storefront-search"
                type="search"
                placeholder="Username or name…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Field>
          </div>
          <Field label="State" htmlFor="storefront-state">
            <Select
              id="storefront-state"
              value={published}
              onChange={(e) => {
                setPublished(e.target.value as PublishedFilter);
                setPage(1);
              }}
            >
              <option value="">Any state</option>
              <option value="true">Live</option>
              <option value="false">Draft</option>
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button type="submit">Search</Button>
            {(submitted || published) && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setQuery('');
                  setSubmitted('');
                  setPublished('');
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
            <EmptyState title="No storefronts match" hint="Try a different search term or clear the filters." />
          </div>
        ) : (
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['Storefront', 'State', 'Published', 'Views', 'Links', 'Products', 'Open'].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3">
                    <span className="label-mono text-[10px]">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.tenantId} className="transition-colors duration-150 hover:bg-[#fbf7f0]">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar src={r.avatarUrl} name={r.displayName ?? r.username ?? '?'} size={32} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text">{r.displayName ?? 'Untitled'}</p>
                        <p className="font-mono text-[11px] text-text-muted">
                          {r.username ? `/u/${r.username}` : '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {r.isPublished ? <Badge tone="success" dot>Live</Badge> : <Badge tone="muted">Draft</Badge>}
                  </td>
                  <td className="px-4 py-3.5 text-text-muted">{formatDate(r.publishedAt)}</td>
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-text">{formatNumber(r.views)}</td>
                  <td className="px-4 py-3.5 tabular-nums text-text-muted">{formatNumber(r.links)}</td>
                  <td className="px-4 py-3.5 tabular-nums text-text-muted">{formatNumber(r.products)}</td>
                  <td className="px-4 py-3.5">
                    {r.username && r.isPublished ? (
                      <a
                        href={`/u/${r.username}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open /u/${r.username}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent underline-offset-4 hover:underline"
                      >
                        <IconExternal /> Visit
                      </a>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {data && <Pager page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}
    </div>
  );
}
