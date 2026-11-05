import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/* ---------------------------------- Button --------------------------------- */

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'link';
export type Size = 'sm' | 'md' | 'lg' | 'icon';

const VARIANTS: Record<Variant, string> = {
  primary:
    'border border-transparent bg-accent text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(23,19,15,0.18)] hover:bg-accent-hover active:translate-y-px',
  secondary:
    'border border-border bg-elevated text-text shadow-[0_1px_2px_rgba(23,19,15,0.04)] hover:border-border-strong hover:bg-elevated active:translate-y-px',
  ghost:
    'border border-transparent bg-transparent text-text hover:bg-surface active:translate-y-px',
  danger:
    'border border-transparent bg-danger text-on-danger shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(23,19,15,0.16)] hover:brightness-95 active:translate-y-px',
  subtle:
    'border border-transparent bg-accent-soft text-accent hover:bg-[#f5e2d4] active:translate-y-px',
  link: 'border border-transparent bg-transparent px-0 text-accent underline-offset-4 hover:underline',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 gap-1.5 rounded-[7px] px-3 text-xs',
  md: 'h-10 gap-2 rounded-[9px] px-4 text-sm',
  lg: 'h-12 gap-2 rounded-[11px] px-5 text-[0.9375rem]',
  icon: 'h-9 w-9 rounded-[9px] p-0',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={cx(
        'inline-flex select-none items-center justify-center font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform,filter] duration-150 disabled:pointer-events-none disabled:opacity-50',
        size === 'icon' ? '' : 'whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
});

/* -------------------------------- IconButton ------------------------------- */

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'ghost' | 'secondary' | 'subtle';
  size?: 'sm' | 'md';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'ghost', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-[9px] transition-[background-color,border-color,color,transform] duration-150 disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'h-7 w-7 text-[15px]' : 'h-9 w-9 text-[17px]',
        variant === 'ghost' && 'text-text-muted hover:bg-surface hover:text-text',
        variant === 'secondary' && 'border border-border bg-elevated text-text hover:border-border-strong',
        variant === 'subtle' && 'bg-accent-soft text-accent hover:bg-[#f5e2d4]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

/* ---------------------------------- Spinner -------------------------------- */

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cx('animate-spin', className)} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/* ----------------------------------- Field --------------------------------- */

export function Field({
  label,
  hint,
  error,
  required,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-[0.8125rem] font-semibold tracking-[0.005em] text-text"
      >
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {hint && !error && <p className="text-xs leading-relaxed text-text-muted">{hint}</p>}
      {children}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full rounded-[9px] border bg-elevated px-3.5 py-2.5 text-sm text-text shadow-[inset_0_1px_2px_rgba(23,19,15,0.04)] transition-[border-color,box-shadow] duration-150 placeholder:text-[#a89d8e] focus:border-accent focus:outline-none focus:ring-4 focus:ring-[#c2410c]/15 disabled:opacity-60';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cx(inputBase, invalid ? 'border-danger' : 'border-border-input', className)}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && rest.id ? `${rest.id}-error` : undefined}
      {...rest}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function Textarea({ className, invalid, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cx(inputBase, 'min-h-24 resize-y', invalid ? 'border-danger' : 'border-border-input', className)}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cx(inputBase, 'border-border-input', className)} {...rest}>
        {children}
      </select>
    );
  },
);

/* ---------------------------------- Panel ---------------------------------- */

type PanelTone = 'default' | 'flat' | 'outline' | 'ink';

const PANEL_TONES: Record<PanelTone, string> = {
  default: 'border-border bg-elevated shadow-card',
  flat: 'border-transparent bg-surface',
  outline: 'border-border bg-transparent',
  ink: 'border-transparent bg-ink text-on-ink shadow-raised',
};

export function Panel({
  className,
  children,
  tone = 'default',
  tick = false,
}: {
  className?: string;
  children: ReactNode;
  tone?: PanelTone;
  tick?: boolean;
}) {
  return (
    <div className={cx('relative rounded-xl border p-5', PANEL_TONES[tone], tick && 'tick-corner', className)}>
      {children}
    </div>
  );
}

/* ----------------------------------- Card ---------------------------------- */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx('rounded-xl border border-border bg-elevated p-5 shadow-card', className)}>
      {children}
    </div>
  );
}

/* ------------------------------- PageHeader -------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cx(
        'flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="label-mono mb-2.5">{eyebrow}</p>}
        <h1 className="font-display text-[1.9rem] leading-[1.08] tracking-[-0.025em] text-text sm:text-[2.25rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
    </header>
  );
}

/* ------------------------------ SectionHeader ------------------------------ */

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="label-mono mb-2">{eyebrow}</p>}
        <h2 className="font-display text-xl leading-tight tracking-[-0.015em] text-text">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------------------------------- Badge ---------------------------------- */

type BadgeTone = 'muted' | 'info' | 'success' | 'danger' | 'warning';

export function Badge({
  tone = 'muted',
  children,
  dot = false,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  const tones: Record<BadgeTone, string> = {
    muted: 'bg-surface text-text-muted border-border',
    info: 'bg-accent-soft text-accent border-accent-line',
    success: 'bg-success-soft text-success border-[#bfd9c8]',
    danger: 'bg-danger-soft text-danger border-[#e8c4bf]',
    warning: 'bg-warning-soft text-warning border-[#e6cfae]',
  } as const;
  const dots: Record<BadgeTone, string> = {
    muted: 'bg-text-muted',
    info: 'bg-accent',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning',
  };
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-[0.01em]',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cx('h-1.5 w-1.5 rounded-full', dots[tone])} aria-hidden="true" />}
      {children}
    </span>
  );
}

/* ---------------------------------- Stat ----------------------------------- */

export function Stat({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <p className="label-mono pt-1">{label}</p>
        {icon && <span className="text-[18px] text-[#a79c8d]">{icon}</span>}
      </div>
      <p className="mt-3 font-display text-[2.1rem] leading-none tracking-[-0.03em] tabular-nums text-text">
        {value}
      </p>
      {hint && <p className="mt-2 text-xs leading-relaxed text-text-muted">{hint}</p>}
    </div>
  );
}

/* --------------------------------- Alert ----------------------------------- */

export function Alert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: 'info' | 'success' | 'danger' | 'warning';
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: 'border-[#c3d2e8] bg-info-soft text-info',
    success: 'border-[#bfd9c8] bg-success-soft text-success',
    danger: 'border-[#e8c4bf] bg-danger-soft text-danger',
    warning: 'border-[#e6cfae] bg-warning-soft text-warning',
  } as const;
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cx('rounded-[10px] border px-4 py-3 text-sm', tones[tone], className)}
    >
      {title && <p className="font-semibold">{title}</p>}
      <div className={cx(title && 'mt-0.5', 'leading-relaxed')}>{children}</div>
    </div>
  );
}

/* ---------------------------------- Toggle --------------------------------- */

export function Toggle({
  checked,
  onChange,
  label,
  busy,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  busy?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-busy={busy || undefined}
      disabled={disabled || busy}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 disabled:opacity-50',
        checked ? 'border-accent bg-accent' : 'border-border-strong bg-[#dcd1c0]',
      )}
    >
      <span
        className={cx(
          'inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-[0_1px_2px_rgba(23,19,15,0.28)] transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  );
}

/* --------------------------------- Skeleton -------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx('animate-pulse rounded-md bg-[#ece4d8]', className)}
      aria-hidden="true"
    />
  );
}

/* -------------------------------- EmptyState ------------------------------- */

export function EmptyState({
  title,
  hint,
  action,
  icon,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#d9cdbb] bg-[#f9f4ec] px-6 py-14 text-center">
      {icon && (
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-full border border-accent-line bg-accent-soft text-[20px] text-accent">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg leading-snug tracking-[-0.01em] text-text">{title}</h3>
      {hint && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-text-muted">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* --------------------------------- StatCard -------------------------------- */

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Panel className="p-5">
      <Stat label={label} value={value} hint={hint} />
    </Panel>
  );
}

/* ---------------------------------- Dialog --------------------------------- */

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Keep the latest onClose without making the effect depend on it. Parents pass an
  // inline arrow (new identity every render), which would otherwise re-run this
  // effect on every keystroke and re-focus the first field, stealing focus mid-typing.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key === 'Tab' && ref.current) {
        const focusables = ref.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    // Move focus into the dialog.
    setTimeout(() => {
      const el = ref.current?.querySelector<HTMLElement>(
        'input, textarea, select, button:not([disabled]), a[href]',
      );
      el?.focus();
    }, 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const dialogNode = (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-[rgba(23,19,15,0.45)] backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-elevated p-6 shadow-pop sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-xl leading-tight tracking-[-0.015em] text-text">
            {title}
          </h2>
          <IconButton label="Close dialog" size="sm" onClick={onClose} className="-mr-1 -mt-1">
            ✕
          </IconButton>
        </div>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(dialogNode, document.body) : dialogNode;
}

/* --------------------------------- Avatar ---------------------------------- */

export function Avatar({ src, name, size = 40 }: { src?: string | null; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const text = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover ring-1 ring-inset ring-[rgba(23,19,15,0.12)]"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-display font-medium text-accent ring-1 ring-inset ring-accent-line"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {text || '?'}
    </span>
  );
}

export { cx };
