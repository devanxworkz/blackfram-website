import { Link } from 'react-router-dom';
import { IconArrowRight, IconCheck, IconExternal } from '../../components/icons';
import { ProductTile, STOREFRONTS, type StoreVariant } from './MarketingKit';

const ORDER: StoreVariant[] = [STOREFRONTS.meera, STOREFRONTS.ananya, STOREFRONTS.katha];

function StoreCard({ page, index }: { page: StoreVariant; index: number }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-[rgba(26,18,11,0.07)] bg-white shadow-[0_28px_60px_-40px_rgba(48,16,64,0.55)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_44px_80px_-40px_rgba(48,16,64,0.55)]"
      style={{ transitionDelay: '0ms' }}
    >
      {/* Cover */}
      <div className="relative h-[132px] overflow-hidden">
        <img
          src={page.cover}
          alt={`${page.name} creator cover`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(150deg, ${page.accent}22 0%, ${page.accent}88 58%, ${page.accent}dd 100%)`,
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 mk-noise" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/24 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live page
        </span>
      </div>

      {/* Avatar */}
      <div className="relative -mt-9 px-5">
        <div className="flex items-end gap-3">
          <span
            className="h-[68px] w-[68px] shrink-0 rounded-full border-[4px] border-white bg-cover shadow-lg"
            style={{
              backgroundImage: `url(${page.avatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 28%',
              backgroundColor: page.accent,
            }}
            aria-hidden="true"
          />
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-[#5d4c40] shadow-sm">
            <span style={{ color: page.accent }}>
              <IconCheck />
            </span>
            Verified
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="mt-2.5 font-display text-[1.2rem] leading-tight tracking-[-0.02em] text-[#1a120b]">
          {page.name}
        </p>
        <p className="mt-0.5 text-[11.5px] text-[#7c6a5a]">{page.tagline}</p>

        {/* Links */}
        <div className="mt-4 space-y-1.5">
          {page.links.slice(0, 3).map((l) => (
            <div
              key={l.label}
              className="flex items-center gap-2.5 rounded-[9px] border px-3 py-2 transition-colors"
              style={{
                borderColor: l.highlight ? `${l.tint}55` : 'rgba(26,18,11,0.08)',
                background: l.highlight ? l.tint : '#fffaf4',
                color: l.highlight ? '#fff' : '#1a120b',
              }}
            >
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] text-[11px]"
                style={{
                  background: l.highlight ? 'rgba(255,255,255,0.2)' : `${l.tint}16`,
                  color: l.highlight ? '#fff' : l.tint,
                }}
              >
                {l.icon}
              </span>
              <span className="truncate text-[11.5px] font-semibold">{l.label}</span>
              <span className="ml-auto text-[10px] opacity-60">→</span>
            </div>
          ))}
        </div>

        {/* Product rail */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          {page.products.map((p) => (
            <div
              key={p.name}
              className="overflow-hidden rounded-[10px] border border-[rgba(26,18,11,0.07)] bg-white"
            >
              <ProductTile from={p.from} to={p.to} label={p.name} className="h-16 w-full" />
              <div className="p-2">
                <p className="truncate text-[10px] font-semibold text-[#1a120b]">{p.name}</p>
                <p className="mt-0.5 text-[10.5px] font-bold" style={{ color: page.accent }}>
                  {p.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[rgba(26,18,11,0.07)] pt-4">
          <Link
            to={`/u/${page.handle}`}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#1a120b] underline-offset-4 hover:underline"
            style={{ color: page.accent }}
          >
            View page
            <IconArrowRight />
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4e8] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#8a7767]">
            <IconExternal />
            blackfram.co/u/{page.handle}
          </span>
        </div>
      </div>

      {/* Accent bookmark */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: `linear-gradient(90deg, ${page.accent}, ${index % 2 ? '#7b3fe4' : '#ffb01f'})` }}
      />
    </div>
  );
}

export function CreatorPagePreviews() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ORDER.map((page, i) => (
        <StoreCard key={page.id} page={page} index={i} />
      ))}
    </div>
  );
}
