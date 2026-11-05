import type { ReactNode } from 'react';
import { Brand } from './Brand';
import { IconLogo } from './icons';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const PROOF = [
  { n: '01', title: 'One page, every link', body: 'Links, products, WhatsApp and UPI in one place.' },
  { n: '02', title: 'Sell without a website', body: 'Digital products with prices in rupees.' },
  { n: '03', title: 'Yours to design', body: 'Nine templates, your colours, your type.' },
];

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 shrink-0 items-center px-5 sm:px-8 lg:px-12">
          <Brand size="sm" />
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[26rem]">
            <div className="rounded-2xl border border-border bg-elevated p-6 shadow-card sm:p-8">
              <h1 className="font-display text-[1.85rem] leading-[1.1] tracking-[-0.03em] text-text">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2.5 text-sm leading-relaxed text-text-muted">{subtitle}</p>
              )}
              <div className="mt-7">{children}</div>
            </div>
            {footer && (
              <div className="mt-6 text-center text-sm text-text-muted [&_a]:font-semibold [&_a]:text-text [&_a]:underline [&_a]:decoration-accent-line [&_a]:underline-offset-4 hover:[&_a]:text-accent">
                {footer}
              </div>
            )}
          </div>
        </main>

        <footer className="shrink-0 px-5 pb-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-1 border-t border-border pt-4 text-[11px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} BLACKFRAM</p>
            <p className="label-mono text-[9px]">Made for creators</p>
          </div>
        </footer>
      </div>

      {/* Editorial panel — brand statement only, no product data. */}
      <aside className="relative hidden overflow-hidden border-l border-border bg-ink text-on-ink lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-20 text-[26rem] leading-none text-[rgba(247,242,233,0.04)]"
        >
          <IconLogo />
        </span>

        <p className="label-mono relative text-[9px] text-[#b9ad9c]">The creator studio</p>

        <div className="relative max-w-[24rem]">
          <p className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1.06] tracking-[-0.03em]">
            Your work deserves a page as considered as it is.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-[#c9bfae]">
            One link for your links, digital products, WhatsApp and UPI — designed, published and
            entirely yours.
          </p>
        </div>

        <div className="relative space-y-4 border-t border-[rgba(247,242,233,0.16)] pt-8">
          {PROOF.map((item) => (
            <div key={item.n} className="flex gap-4">
              <span className="label-mono w-6 shrink-0 pt-1 text-[9px] text-[#b9ad9c]">{item.n}</span>
              <div>
                <p className="text-[13px] font-semibold text-on-ink">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#a99e8d]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
