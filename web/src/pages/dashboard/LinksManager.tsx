import { useState, type FormEvent } from 'react';
import {
  Badge,
  Button,
  Dialog,
  EmptyState,
  Field,
  IconButton,
  Input,
  PageHeader,
  Panel,
  Select,
  Skeleton,
  Toggle,
  cx,
} from '../../components/ui';
import {
  IconDown,
  IconGrip,
  IconLink,
  IconPlus,
  IconTrash,
  IconUp,
} from '../../components/icons';
import { ICON_KEYS, LinkIcon } from '../../components/LinkIcon';
import { useToast } from '../../components/Toast';
import { ApiError, api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { hostOf } from '../../lib/format';
import type { LinkItem } from '../../lib/types';

interface Draft {
  id?: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
}

const EMPTY: Draft = { title: '', url: '', icon: 'link', isActive: true };

export default function LinksManager() {
  const toast = useToast();
  const { data, loading, setData, reload } = useAsync(() => api.get<{ links: LinkItem[] }>('/api/links'));
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const links = data?.links ?? [];

  function openAdd() {
    setErrors({});
    setDraft({ ...EMPTY });
  }

  function openEdit(link: LinkItem) {
    setErrors({});
    setDraft({ id: link.id, title: link.title, url: link.url, icon: link.icon, isActive: link.isActive });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setErrors({});
    try {
      if (draft.id) {
        const { link } = await api.put<{ link: LinkItem }>(`/api/links/${draft.id}`, {
          title: draft.title,
          url: draft.url,
          icon: draft.icon,
          isActive: draft.isActive,
        });
        setData((prev) => ({
          links: (prev?.links ?? []).map((l) => (l.id === link.id ? link : l)),
        }));
      } else {
        const { link } = await api.post<{ link: LinkItem }>('/api/links', {
          title: draft.title,
          url: draft.url,
          icon: draft.icon,
          isActive: draft.isActive,
        });
        setData((prev) => ({ links: [...(prev?.links ?? []), link] }));
      }
      setDraft(null);
      toast.push('Link saved.', 'success');
    } catch (err) {
      if (err instanceof ApiError) {
        const fe: Record<string, string> = {};
        for (const d of err.details ?? []) {
          const key = d.path.split('.').pop() ?? d.path;
          if (!fe[key]) fe[key] = d.message;
        }
        setErrors(fe);
        if (Object.keys(fe).length === 0) toast.push(err.message, 'error');
      } else {
        toast.push('Could not save the link.', 'error');
      }
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(link: LinkItem) {
    try {
      const { link: updated } = await api.put<{ link: LinkItem }>(`/api/links/${link.id}`, {
        isActive: !link.isActive,
      });
      setData((prev) => ({ links: (prev?.links ?? []).map((l) => (l.id === updated.id ? updated : l)) }));
    } catch {
      toast.push('Could not update the link.', 'error');
    }
  }

  async function remove(link: LinkItem) {
    if (!window.confirm(`Delete “${link.title}”?`)) return;
    try {
      await api.delete(`/api/links/${link.id}`);
      setData((prev) => ({ links: (prev?.links ?? []).filter((l) => l.id !== link.id) }));
      toast.push('Link deleted.', 'success');
    } catch {
      toast.push('Could not delete the link.', 'error');
    }
  }

  async function move(index: number, delta: number) {
    const next = [...links];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    const reordered = next.map((l, i) => ({ ...l, position: i }));
    setData({ links: reordered });
    try {
      const { links: saved } = await api.put<{ links: LinkItem[] }>('/api/links/reorder', {
        ids: reordered.map((l) => l.id),
      });
      setData({ links: saved });
    } catch {
      toast.push('Could not save the new order.', 'error');
      await reload();
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Your page"
        title="Links"
        description="Add anywhere you exist online. Use the arrows to change the order visitors see."
        actions={
          <Button onClick={openAdd}>
            <IconPlus />
            Add link
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px]" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <EmptyState
          icon={<IconLink />}
          title="No links yet"
          hint="Add your first link — Instagram is a good start. Every link becomes a button on your page."
          action={
            <Button onClick={openAdd}>
              <IconPlus />
              Add link
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="label-mono">{links.length} link{links.length === 1 ? '' : 's'}</p>
            <p className="text-xs text-text-muted">Top of the list appears first</p>
          </div>

          <Panel className="overflow-hidden p-0">
            <ul className="divide-y divide-border">
              {links.map((link, i) => (
                <li
                  key={link.id}
                  className={cx(
                    'group transition-colors duration-150 hover:bg-[#fbf7f0]',
                    !link.isActive && 'bg-[#f9f5ee]',
                  )}
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="hidden cursor-grab text-[#b3a795] sm:block" aria-hidden="true">
                        <IconGrip />
                      </span>
                      <span
                        className={cx(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border text-[18px]',
                          link.isActive
                            ? 'border-accent-line bg-accent-soft text-accent'
                            : 'border-border bg-surface text-text-muted',
                        )}
                      >
                        <LinkIcon name={link.icon} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cx(
                              'truncate text-sm font-semibold',
                              !link.isActive && 'text-text-muted line-through',
                            )}
                          >
                            {link.title}
                          </p>
                          {!link.isActive && <Badge>Hidden</Badge>}
                        </div>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-text-muted">
                          {hostOf(link.url)}
                        </p>
                        <p className="mt-1 text-[11px] text-text-muted sm:hidden">
                          {link.clickCount} clicks
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pl-[52px] sm:justify-end sm:pl-0">
                      <span className="hidden w-20 text-right text-[11px] text-text-muted sm:block">
                        {link.clickCount} clicks
                      </span>
                      <div className="flex items-center gap-0.5">
                        <IconButton
                          size="sm"
                          label={`Move ${link.title} up`}
                          disabled={i === 0}
                          onClick={() => void move(i, -1)}
                        >
                          <IconUp />
                        </IconButton>
                        <IconButton
                          size="sm"
                          label={`Move ${link.title} down`}
                          disabled={i === links.length - 1}
                          onClick={() => void move(i, 1)}
                        >
                          <IconDown />
                        </IconButton>
                        <IconButton
                          size="sm"
                          label={`Delete ${link.title}`}
                          className="hover:text-danger"
                          onClick={() => void remove(link)}
                        >
                          <IconTrash />
                        </IconButton>
                      </div>
                      <Toggle
                        checked={link.isActive}
                        onChange={() => void toggleActive(link)}
                        label={`${link.isActive ? 'Hide' : 'Show'} ${link.title}`}
                      />
                      <button
                        type="button"
                        onClick={() => openEdit(link)}
                        className="ml-1 rounded-[6px] px-2 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent-soft"
                      >
                        Edit details
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}

      <Dialog
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? 'Edit link' : 'Add link'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button form="link-form" type="submit" loading={busy}>
              Save
            </Button>
          </>
        }
      >
        <form id="link-form" onSubmit={save} noValidate className="space-y-4">
          <Field label="Title" htmlFor="link-title" error={errors.title} required>
            <Input
              id="link-title"
              value={draft?.title ?? ''}
              onChange={(e) => setDraft((d) => (d ? { ...d, title: e.target.value } : d))}
              maxLength={80}
              required
            />
          </Field>
          <Field label="URL" htmlFor="link-url" error={errors.url} required hint="Must start with http:// or https://">
            <Input
              id="link-url"
              type="url"
              placeholder="https://instagram.com/…"
              value={draft?.url ?? ''}
              onChange={(e) => setDraft((d) => (d ? { ...d, url: e.target.value } : d))}
              required
            />
          </Field>
          <Field label="Icon" htmlFor="link-icon">
            <Select
              id="link-icon"
              value={draft?.icon ?? 'link'}
              onChange={(e) => setDraft((d) => (d ? { ...d, icon: e.target.value } : d))}
            >
              {ICON_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </Field>
          <label className="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-bg px-3.5 py-3">
            <span>
              <span className="block text-sm font-semibold text-text">Visible on my page</span>
              <span className="mt-0.5 block text-xs text-text-muted">Hidden links keep their clicks.</span>
            </span>
            <Toggle
              checked={draft?.isActive ?? true}
              onChange={(v) => setDraft((d) => (d ? { ...d, isActive: v } : d))}
              label="Visible on my page"
            />
          </label>
        </form>
      </Dialog>
    </div>
  );
}
