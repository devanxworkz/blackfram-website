import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Tone = 'success' | 'error' | 'info';
interface ToastItem {
  id: number;
  tone: Tone;
  message: string;
}

interface ToastApi {
  push: (message: string, tone?: Tone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: Tone = 'info') => {
      const id = ++counter;
      setItems((prev) => [...prev, { id, tone, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  const api = useMemo(() => ({ push }), [push]);

  const tones: Record<Tone, string> = {
    success: 'border-[#bfd9c8] bg-success-soft text-success',
    error: 'border-[#e8c4bf] bg-danger-soft text-danger',
    info: 'border-border bg-elevated text-text',
  };
  const dots: Record<Tone, string> = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-text-muted',
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[10px] border px-4 py-3 text-sm font-medium shadow-raised ${tones[t.tone]}`}
          >
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dots[t.tone]}`} aria-hidden="true" />
            <span className="flex-1 leading-relaxed">{t.message}</span>
            <button
              type="button"
              onClick={() => remove(t.id)}
              aria-label="Dismiss notification"
              className="-mr-1 rounded-[6px] px-1.5 py-0.5 text-current opacity-60 transition-opacity hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
