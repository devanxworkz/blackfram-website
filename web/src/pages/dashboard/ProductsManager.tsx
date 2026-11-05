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
  Skeleton,
  Textarea,
  Toggle,
  cx,
} from '../../components/ui';
import { IconBag, IconDown, IconGrip, IconPlus, IconTrash, IconUp } from '../../components/icons';
import { useToast } from '../../components/Toast';
import { ApiError, api } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { formatINR, hostOf } from '../../lib/format';
import type { ProductItem } from '../../lib/types';

interface Draft {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  destinationUrl: string;
  isActive: boolean;
}

const EMPTY: Draft = {
  title: '',
  description: '',
  imageUrl: '',
  price: '',
  destinationUrl: '',
  isActive: true,
};

export default function ProductsManager() {
  const toast = useToast();
  const { data, loading, setData, reload } = useAsync(() =>
    api.get<{ products: ProductItem[] }>('/api/products'),
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const products = data?.products ?? [];

  function openAdd() {
    setErrors({});
    setDraft({ ...EMPTY });
  }

  function openEdit(p: ProductItem) {
    setErrors({});
    setDraft({
      id: p.id,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl ?? '',
      price: p.pricePaise === null ? '' : String(p.pricePaise / 100),
      destinationUrl: p.destinationUrl,
      isActive: p.isActive,
    });
  }

  function pricePayload(): number | null {
    if (!draft || draft.price.trim() === '') return null;
    const rupees = Number(draft.price);
    if (!Number.isFinite(rupees) || rupees < 0) return null;
    return Math.round(rupees * 100);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setErrors({});
    const payload = {
      title: draft.title,
      description: draft.description,
      imageUrl: draft.imageUrl,
      pricePaise: pricePayload(),
      destinationUrl: draft.destinationUrl,
      isActive: draft.isActive,
    };
    try {
      if (draft.id) {
        const { product } = await api.put<{ product: ProductItem }>(`/api/products/${draft.id}`, payload);
        setData((prev) => ({
          products: (prev?.products ?? []).map((p) => (p.id === product.id ? product : p)),
        }));
      } else {
        const { product } = await api.post<{ product: ProductItem }>('/api/products', payload);
        setData((prev) => ({ products: [...(prev?.products ?? []), product] }));
      }
      setDraft(null);
      toast.push('Product saved.', 'success');
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
        toast.push('Could not save the product.', 'error');
      }
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(p: ProductItem) {
    try {
      const { product } = await api.put<{ product: ProductItem }>(`/api/products/${p.id}`, {
        isActive: !p.isActive,
      });
      setData((prev) => ({
        products: (prev?.products ?? []).map((x) => (x.id === product.id ? product : x)),
      }));
    } catch {
      toast.push('Could not update the product.', 'error');
    }
  }

  async function remove(p: ProductItem) {
    if (!window.confirm(`Delete “${p.title}”?`)) return;
    try {
      await api.delete(`/api/products/${p.id}`);
      setData((prev) => ({ products: (prev?.products ?? []).filter((x) => x.id !== p.id) }));
      toast.push('Product deleted.', 'success');
    } catch {
      toast.push('Could not delete the product.', 'error');
    }
  }

  async function move(index: number, delta: number) {
    const next = [...products];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    const reordered = next.map((p, i) => ({ ...p, position: i }));
    setData({ products: reordered });
    try {
      const { products: saved } = await api.put<{ products: ProductItem[] }>('/api/products/reorder', {
        ids: reordered.map((p) => p.id),
      });
      setData({ products: saved });
    } catch {
      toast.push('Could not save the new order.', 'error');
      await reload();
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Your page"
        title="Products"
        description="List what you sell with a price in ₹ and a destination link. Buyers tap through to pay or enquire."
        actions={
          <Button onClick={openAdd}>
            <IconPlus />
            Add product
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<IconBag />}
          title="No products yet"
          hint="Add a product so visitors know what you sell — a digital download, a service, or a physical item."
          action={
            <Button onClick={openAdd}>
              <IconPlus />
              Add product
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="label-mono">{products.length} product{products.length === 1 ? '' : 's'}</p>
            <p className="text-xs text-text-muted">Top of the list appears first</p>
          </div>

          <Panel className="overflow-hidden p-0">
            <ul className="divide-y divide-border">
              {products.map((p, i) => (
                <li
                  key={p.id}
                  className={cx(
                    'group transition-colors duration-150 hover:bg-[#fbf7f0]',
                    !p.isActive && 'bg-[#f9f5ee]',
                  )}
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="hidden cursor-grab text-[#b3a795] sm:block" aria-hidden="true">
                        <IconGrip />
                      </span>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-[10px] border border-border object-cover"
                        />
                      ) : (
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[10px] border border-accent-line bg-accent-soft font-display text-xl text-accent">
                          {p.title.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cx(
                              'truncate text-sm font-semibold',
                              !p.isActive && 'text-text-muted line-through',
                            )}
                          >
                            {p.title}
                          </p>
                          {!p.isActive && <Badge>Hidden</Badge>}
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-text-muted">
                          {formatINR(p.pricePaise) ?? 'No price'} · {hostOf(p.destinationUrl)}
                        </p>
                        {p.description && (
                          <p className="mt-1 line-clamp-1 text-[11px] text-text-muted">{p.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pl-[68px] sm:justify-end sm:pl-0">
                      <div className="flex items-center gap-0.5">
                        <IconButton
                          size="sm"
                          label={`Move ${p.title} up`}
                          disabled={i === 0}
                          onClick={() => void move(i, -1)}
                        >
                          <IconUp />
                        </IconButton>
                        <IconButton
                          size="sm"
                          label={`Move ${p.title} down`}
                          disabled={i === products.length - 1}
                          onClick={() => void move(i, 1)}
                        >
                          <IconDown />
                        </IconButton>
                        <IconButton
                          size="sm"
                          label={`Delete ${p.title}`}
                          className="hover:text-danger"
                          onClick={() => void remove(p)}
                        >
                          <IconTrash />
                        </IconButton>
                      </div>
                      <Toggle
                        checked={p.isActive}
                        onChange={() => void toggleActive(p)}
                        label={`${p.isActive ? 'Hide' : 'Show'} ${p.title}`}
                      />
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
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
        title={draft?.id ? 'Edit product' : 'Add product'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button form="product-form" type="submit" loading={busy}>
              Save
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={save} noValidate className="space-y-4">
          <Field label="Title" htmlFor="product-title" error={errors.title} required>
            <Input
              id="product-title"
              value={draft?.title ?? ''}
              onChange={(e) => setDraft((d) => (d ? { ...d, title: e.target.value } : d))}
              maxLength={120}
              required
            />
          </Field>
          <Field label="Description" htmlFor="product-desc" error={errors.description}>
            <Textarea
              id="product-desc"
              rows={2}
              maxLength={1000}
              value={draft?.description ?? ''}
              onChange={(e) => setDraft((d) => (d ? { ...d, description: e.target.value } : d))}
            />
          </Field>
          <Field label="Price (₹)" htmlFor="product-price" error={errors.pricePaise} hint="Leave blank if there is no fixed price.">
            <Input
              id="product-price"
              inputMode="decimal"
              placeholder="250"
              value={draft?.price ?? ''}
              onChange={(e) => setDraft((d) => (d ? { ...d, price: e.target.value } : d))}
            />
          </Field>
          <Field label="Image URL" htmlFor="product-image" error={errors.imageUrl}>
            <Input
              id="product-image"
              placeholder="https://…"
              value={draft?.imageUrl ?? ''}
              onChange={(e) => setDraft((d) => (d ? { ...d, imageUrl: e.target.value } : d))}
            />
          </Field>
          <Field label="Destination URL" htmlFor="product-url" error={errors.destinationUrl} required hint="Where the button takes buyers.">
            <Input
              id="product-url"
              type="url"
              placeholder="https://…"
              value={draft?.destinationUrl ?? ''}
              onChange={(e) => setDraft((d) => (d ? { ...d, destinationUrl: e.target.value } : d))}
              required
            />
          </Field>
          <label className="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-bg px-3.5 py-3">
            <span>
              <span className="block text-sm font-semibold text-text">Visible on my page</span>
              <span className="mt-0.5 block text-xs text-text-muted">Hidden products stay saved.</span>
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
