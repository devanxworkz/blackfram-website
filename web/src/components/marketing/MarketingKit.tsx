import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  IconArrowRight,
  IconBag,
  IconCheck,
  IconExternal,
  IconGlobe,
  IconInstagram,
  IconWhatsapp,
  IconYoutube,
} from '../icons';

/* ------------------------------------------------------------------ type */

export function MkKicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={`mk-kicker ${dark ? 'mk-kicker-dark' : 'mk-kicker-light'}`}>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: dark ? '#ffb01f' : 'var(--mk-coral)' }}
      />
      {children}
    </span>
  );
}

export function MkSectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = 'center',
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  dark?: boolean;
  align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <MkKicker dark={dark}>{eyebrow}</MkKicker>
      <h2
        className={`mk-display mt-5 text-[2.1rem] sm:text-[2.8rem] lg:text-[3.25rem] ${
          dark ? 'text-[#fff6ea]' : ''
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-[1.0625rem] ${
            dark ? 'text-[#e6cdb8]' : 'text-[#6c5c50]'
          } ${align === 'center' ? 'mx-auto max-w-xl' : 'max-w-xl'}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- controls */

type ButtonVariant = 'primary' | 'ghost' | 'light' | 'outlineLight';

export function MkButton({
  to,
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  arrow = false,
  onClick,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
}) {
  const cls = [
    'mk-btn',
    size === 'sm' && 'mk-btn-sm',
    variant === 'primary' && 'mk-btn-primary',
    variant === 'ghost' && 'mk-btn-ghost',
    variant === 'light' && 'mk-btn-light',
    variant === 'outlineLight' && 'mk-btn-outline-light',
    'group',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {children}
      {arrow && (
        <span className="text-[15px] transition-transform duration-200 group-hover:translate-x-0.5">
          <IconArrowRight />
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------- storefront */

interface StoreLink {
  label: string;
  icon: ReactNode;
  tint: string;
  highlight?: boolean;
}

export interface StoreVariant {
  id: string;
  name: string;
  handle: string;
  tagline: string;
  cover: string;
  avatar: string;
  accent: string;
  accentSoft: string;
  links: StoreLink[];
  products: { name: string; price: string; from: string; to: string }[];
}

export const STOREFRONTS: Record<'meera' | 'ananya' | 'katha', StoreVariant> = {
  meera: {
    id: 'meera',
    name: 'Meera Sarees',
    handle: 'meera-sarees',
    tagline: 'Handloom sarees · Bengaluru',
    cover: '/assets/creators/creator-1.jpg',
    avatar: '/assets/creators/creator-1.jpg',
    accent: '#e8420f',
    accentSoft: 'rgba(232, 66, 15, 0.10)',
    links: [
      { label: 'Shop the collection', icon: <IconBag />, tint: '#e8420f' },
      { label: 'New arrivals', icon: <IconGlobe />, tint: '#7b3fe4' },
      { label: 'WhatsApp orders', icon: <IconWhatsapp />, tint: '#0e9f8a', highlight: true },
      { label: 'Instagram', icon: <IconInstagram />, tint: '#d9287d' },
    ],
    products: [
      { name: 'Kanjeevaram silk', price: '₹8,400', from: '#ffb01f', to: '#e8420f' },
      { name: 'Cotton drape', price: '₹2,950', from: '#f472b6', to: '#be185d' },
    ],
  },
  ananya: {
    id: 'ananya',
    name: 'Glow by Ananya',
    handle: 'glowbyananya',
    tagline: 'Clean skincare · Mumbai',
    cover: '/assets/creators/creator-2.jpg',
    avatar: '/assets/creators/creator-2.jpg',
    accent: '#d9287d',
    accentSoft: 'rgba(217, 40, 125, 0.10)',
    links: [
      { label: 'Shop skincare', icon: <IconBag />, tint: '#d9287d' },
      { label: 'Read the journal', icon: <IconGlobe />, tint: '#7b3fe4' },
      { label: 'Book a consult', icon: <IconWhatsapp />, tint: '#0e9f8a', highlight: true },
    ],
    products: [
      { name: 'Vitamin C serum', price: '₹899', from: '#fbbf24', to: '#f59e0b' },
      { name: 'Night cream', price: '₹1,240', from: '#a78bfa', to: '#7b3fe4' },
    ],
  },
  katha: {
    id: 'katha',
    name: 'Kitchen Katha',
    handle: 'kitchen-katha',
    tagline: 'Home chef · Kochi',
    cover: '/assets/creators/creator-3.jpg',
    avatar: '/assets/creators/creator-4.jpg',
    accent: '#0e9f8a',
    accentSoft: 'rgba(14, 159, 138, 0.10)',
    links: [
      { label: "Today's menu", icon: <IconBag />, tint: '#0e9f8a' },
      { label: 'Order on WhatsApp', icon: <IconWhatsapp />, tint: '#25d366', highlight: true },
      { label: 'YouTube', icon: <IconYoutube />, tint: '#e8420f' },
      { label: 'Instagram', icon: <IconInstagram />, tint: '#d9287d' },
    ],
    products: [
      { name: 'Weekend tiffin', price: '₹320', from: '#34d399', to: '#0e9f8a' },
      { name: 'Filter coffee', price: '₹180', from: '#d97706', to: '#78350f' },
    ],
  },
};

/** Gradient product tile: coherent art for a demo storefront at any size. */
export function ProductTile({
  from,
  to,
  label,
  className = '',
}: {
  from: string;
  to: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      <span className="absolute -bottom-3 -right-1 select-none font-display text-[2.6rem] leading-none text-white/25">
        {label.slice(0, 1)}
      </span>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,0.35),transparent_58%)]" />
    </div>
  );
}

/**
 * A miniature BLACKFRAM storefront, built from the same ingredients as the real
 * public page: cover, avatar, bio, social row, link buttons, product rail.
 * Rendered as HTML so it stays crisp at any scale inside the 3D device.
 */
export function StorefrontScreen({ variant }: { variant: StoreVariant }) {
  return (
    <div className="mk-store flex h-full flex-col bg-[#fffaf4] text-[#1a120b]">
      {/* Cover */}
      <div className="relative h-[30%] shrink-0 overflow-hidden">
        <img
          src={variant.cover}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, rgba(26,18,11,0.10) 0%, ${variant.accent}55 55%, ${variant.accent}cc 100%)`,
          }}
        />
        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/22 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
          <span className="h-1 w-1 rounded-full bg-white" />
          BLACKFRAM
        </span>
      </div>

      {/* Identity */}
      <div className="relative z-10 -mt-7 px-3.5">
        <div className="flex items-end gap-2.5">
          <span
            className="h-14 w-14 shrink-0 rounded-full border-[3px] border-[#fffaf4] bg-cover shadow-md"
            style={{
              backgroundImage: `url(${variant.avatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 28%',
              backgroundColor: variant.accent,
            }}
            aria-hidden="true"
          />
          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[7px] font-semibold text-[#4a3a2e] shadow-sm">
            <span style={{ color: variant.accent }}>
              <IconCheck />
            </span>
            Verified creator
          </span>
        </div>

        <p className="mt-2 font-display text-[15px] leading-tight tracking-[-0.02em]">{variant.name}</p>
        <p className="mt-0.5 text-[8.5px] leading-snug text-[#7c6a5a]">{variant.tagline}</p>

        <div className="mk-store-socials mt-2 flex items-center gap-1.5">
          {[<IconInstagram key="ig" />, <IconYoutube key="yt" />, <IconWhatsapp key="wa" />, <IconGlobe key="wb" />].map(
            (icon, i) => (
              <span
                key={i}
                className="grid h-5 w-5 place-items-center rounded-full text-[9px]"
                style={{ background: `${variant.accent}16`, color: variant.accent }}
              >
                {icon}
              </span>
            ),
          )}
          <span className="mk-store-handle ml-auto truncate font-mono text-[7px] tracking-[0.1em] text-[#a08e7c]">
            blackfram.co/u/{variant.handle}
          </span>
        </div>
      </div>

      {/* Links */}
      <div className="mt-2.5 space-y-1.5 px-3.5">
        {variant.links.map((l) => (
          <div
            key={l.label}
            className="flex items-center gap-2 rounded-[9px] border px-2.5 py-2"
            style={{
              borderColor: l.highlight ? `${l.tint}55` : 'rgba(26,18,11,0.08)',
              background: l.highlight ? l.tint : '#fff',
              color: l.highlight ? '#fff' : '#1a120b',
              boxShadow: l.highlight ? `0 6px 14px -8px ${l.tint}` : '0 1px 2px rgba(26,18,11,0.04)',
            }}
          >
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-[5px] text-[10px]"
              style={{
                background: l.highlight ? 'rgba(255,255,255,0.22)' : `${l.tint}18`,
                color: l.highlight ? '#fff' : l.tint,
              }}
            >
              {l.icon}
            </span>
            <span className="truncate text-[9px] font-semibold">{l.label}</span>
            <span className="ml-auto text-[8px] opacity-60">→</span>
          </div>
        ))}
      </div>

      {/* Product rail */}
      <div className="mk-store-products mt-2.5 px-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#8a7767]">Shop</p>
          <p className="text-[7.5px] font-semibold" style={{ color: variant.accent }}>
            View all
          </p>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {variant.products.map((p) => (
            <div
              key={p.name}
              className="overflow-hidden rounded-[8px] border border-[rgba(26,18,11,0.07)] bg-white shadow-sm"
            >
              <ProductTile from={p.from} to={p.to} label={p.name} className="h-14 w-full" />
              <div className="p-1.5">
                <p className="truncate text-[7.5px] font-semibold leading-tight">{p.name}</p>
                <p className="mt-0.5 text-[8px] font-bold" style={{ color: variant.accent }}>
                  {p.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center gap-1 border-t border-[rgba(26,18,11,0.06)] py-1.5">
        <span className="h-1 w-1 rounded-full" style={{ background: variant.accent }} />
        <span className="text-[6.5px] font-semibold uppercase tracking-[0.16em] text-[#a08e7c]">
          Made with BLACKFRAM
        </span>
      </div>
    </div>
  );
}

/** Device frame: bevel, rim light, notch, hardware keys. */
export function PhoneFrame({
  children,
  className = '',
  width = 300,
}: {
  children: ReactNode;
  className?: string;
  width?: number;
}) {
  return (
    <div className={`mk-phone ${className}`} style={{ width }}>
      <span className="mk-phone-key" style={{ left: -2, top: 132, height: 44 }} aria-hidden="true" />
      <span className="mk-phone-key" style={{ left: -2, top: 188, height: 68 }} aria-hidden="true" />
      <span className="mk-phone-key" style={{ right: -2, top: 168, height: 78 }} aria-hidden="true" />
      <span className="mk-phone-notch" aria-hidden="true" />
      <div className="mk-phone-screen h-full w-full" style={{ aspectRatio: '9 / 19.1' }}>
        {children}
      </div>
    </div>
  );
}

/** Floating glass chip used around the hero device. */
export function FloatingCard({
  children,
  className = '',
  tone = 'light',
  style,
}: {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
  style?: CSSProperties;
}) {
  return (
    <div
      className={`mk-prop ${className}`}
      style={{
        ...style,
        ...(tone === 'dark'
          ? {
              background: 'rgba(26,18,11,0.9)',
              borderColor: 'rgba(255,243,230,0.18)',
              color: '#fff6ea',
            }
          : null),
      }}
    >
      {children}
    </div>
  );
}

/** Small round icon badge, used in feature grids. */
export function MkIconBadge({
  children,
  gradient = 'var(--mk-grad-warm)',
  size = 44,
}: {
  children: ReactNode;
  gradient?: string;
  size?: number;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[13px] text-white shadow-[0_10px_24px_-12px_rgba(48,16,64,0.6)]"
      style={{ width: size, height: size, backgroundImage: gradient }}
    >
      {children}
    </span>
  );
}

/** Tiny arrow used inside link lists. */
export function MkArrow() {
  return (
    <span aria-hidden="true" className="text-[13px]">
      <IconExternal />
    </span>
  );
}
