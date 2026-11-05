import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useI18n } from './I18nProvider';
import { Brand } from './Brand';
import { IconArrowRight, IconClose, IconMenu } from './icons';
import { LOCALES, LOCALE_LABELS, type Locale } from '../lib/i18n';

export function MarketingLayout({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home', 'Home') },
    { to: '/features', label: t('nav.features', 'Features') },
    { to: '/pricing', label: t('nav.pricing', 'Pricing') },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-[rgba(26,18,11,0.08)] bg-[rgba(255,249,242,0.82)] backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="h-[3px] w-full"
          style={{
            background:
              'linear-gradient(90deg,#ffb01f,#ff5533 32%,#d9287d 58%,#7b3fe4 82%,#3b4fe0)',
          }}
        />
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Brand size="sm" />

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `nav-underline text-[13px] font-medium transition-colors ${
                    isActive ? 'text-text' : 'text-text-muted hover:text-text'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <label className="sr-only" htmlFor="locale">
              Language
            </label>
            <select
              id="locale"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="h-8 appearance-none rounded-full border border-border bg-elevated px-3 text-[11px] font-medium text-text-muted transition-colors hover:border-border-strong focus:border-accent focus:outline-none focus:ring-4 focus:ring-[#c2410c]/15"
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  {LOCALE_LABELS[l]}
                </option>
              ))}
            </select>
            <Link
              to="/login"
              className="text-[13px] font-semibold text-text transition-colors hover:text-accent"
            >
              {t('nav.login', 'Log in')}
            </Link>
            <Link
              to="/register"
              className="mk-btn mk-btn-sm mk-btn-primary"
            >
              {t('nav.signup', 'Start free')}
              <span className="text-[14px]">
                <IconArrowRight />
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="rounded-[8px] border border-border p-2 text-text transition-colors hover:border-border-strong md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-[20px]">{open ? <IconClose /> : <IconMenu />}</span>
          </button>
        </div>

        {open && (
          <div id="mobile-menu" className="animate-page-in border-t border-border bg-bg md:hidden">
            <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-[8px] px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-accent-soft text-accent' : 'text-text hover:bg-surface'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              <div className="mt-3 flex items-center gap-2 border-t border-border pt-4">
                <label className="sr-only" htmlFor="locale-mobile">
                  Language
                </label>
                <select
                  id="locale-mobile"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="h-9 rounded-[8px] border border-border bg-elevated px-2 text-xs text-text"
                >
                  {LOCALES.map((l) => (
                    <option key={l} value={l}>
                      {LOCALE_LABELS[l]}
                    </option>
                  ))}
                </select>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="ml-auto inline-flex h-9 items-center rounded-[8px] border border-border px-3 text-xs font-semibold text-text"
                >
                  {t('nav.login', 'Log in')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="mk-btn mk-btn-sm mk-btn-primary"
                >
                  {t('nav.signup', 'Start free')}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="relative overflow-hidden border-t border-[rgba(26,18,11,0.08)] bg-[#fdf6ec]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[rgba(255,176,31,0.22)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[rgba(123,63,228,0.14)] blur-3xl"
        />
        <div className="container-page relative py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
            <div>
              <Brand size="sm" />
              <p className="mt-4 max-w-[16rem] text-[13px] leading-relaxed text-text-muted">
                One link for everything you make. Links, products, WhatsApp and UPI
                on one page.
              </p>
              <p className="label-mono mt-6 text-[9px]">Built for creators</p>
            </div>
            <FooterCol
              title="Product"
              links={[
                { to: '/features', label: 'Features' },
                { to: '/pricing', label: 'Pricing' },
                { to: '/register', label: 'Create a page' },
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                { to: '/privacy', label: 'Privacy policy' },
                { to: '/terms', label: 'Terms of use' },
              ]}
            />
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-[11px] text-text-muted sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} BLACKFRAM. An original work.</p>
            <p className="label-mono text-[9px]">Made for creators</p>
          </div>

          <p
            aria-hidden="true"
            className="mt-10 select-none font-display text-[clamp(3.5rem,12vw,9rem)] leading-[0.78] tracking-[-0.055em] text-[#e7ddcd]"
          >
            BLACKFRAM
          </p>
        </div>
      </footer>
      <ScrollToTop pathname={location.pathname} />
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="label-mono text-[10px]">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-[13px] text-text-muted transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScrollToTop({ pathname }: { pathname: string }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
