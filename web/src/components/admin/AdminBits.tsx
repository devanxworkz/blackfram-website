import type { ReactNode } from 'react';
import { Alert, Badge, Button, Panel, Stat as StatBlock, cx } from '../ui';
import { formatNumber } from '../../lib/format';

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return 'never';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'never';
  const secs = Math.round((Date.now() - then) / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

/** Turns a dotted action like `user.suspend` into `User · suspend`. */
export function humanAction(action: string): string {
  const [scope, verb] = action.split('.');
  if (!verb) return action;
  return `${scope.charAt(0).toUpperCase()}${scope.slice(1)} · ${verb}`;
}

/* --------------------------------- Banner ---------------------------------- */

export function ErrorBanner({ message }: { message: string }) {
  return <Alert tone="danger">{message}</Alert>;
}

/* ---------------------------------- Bars ----------------------------------- */

export function BarChart({
  series,
  ariaLabel,
  height = 160,
}: {
  series: { day: string; count: number }[];
  ariaLabel: string;
  height?: number;
}) {
  const max = Math.max(1, ...series.map((s) => s.count));
  const total = series.reduce((sum, s) => sum + s.count, 0);
  const labelEvery = series.length > 16 ? 5 : 3;
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {series.map((s, i) => {
          const pct = Math.round((s.count / max) * 100);
          return (
            <div
              key={s.day}
              className="group relative flex flex-1 items-end"
              style={{ height: '100%' }}
              title={`${s.day}: ${formatNumber(s.count)}`}
            >
              <div
                className={cx(
                  'w-full rounded-t-[3px] transition-colors duration-150',
                  s.count > 0 ? 'bg-accent group-hover:bg-accent-hover' : 'bg-[#e7dccc]',
                )}
                style={{ height: `${Math.max(s.count > 0 ? 4 : 2, pct)}%` }}
              />
              {i % labelEvery === 0 && (
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-text-muted">
                  {s.day.slice(5)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-7 text-xs text-text-muted">
        {series[0]?.day} → {series[series.length - 1]?.day} · {formatNumber(total)} total
      </p>
    </div>
  );
}

/* ---------------------------------- Pager ---------------------------------- */

export function Pager({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (next: number) => void;
}) {
  if (total <= pageSize) return null;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-text-muted">
        Page {page} of {totalPages} · {formatNumber(total)} total
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => onPage(Math.max(1, page - 1))}>
          Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------- Stat block ------------------------------- */

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Panel className="p-5">
      <StatBlock label={label} value={value} hint={hint} />
    </Panel>
  );
}

/* ------------------------------ Planned panel ------------------------------ */

export function PlannedPanel({
  title,
  phase,
  description,
  bullets,
}: {
  title: string;
  phase: string;
  description: string;
  bullets: string[];
}) {
  return (
    <Panel className="p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-xl leading-tight tracking-[-0.015em] text-text">{title}</h2>
        <Badge tone="warning" dot>
          {phase}
        </Badge>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">{description}</p>
      <ul className="mt-5 space-y-2.5 text-sm text-text">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
        This section is intentionally not wired up yet — no placeholder data is shown.
      </p>
    </Panel>
  );
}
