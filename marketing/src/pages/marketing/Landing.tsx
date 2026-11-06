import { APP_URL } from '../../lib/appUrl';
import { Reveal } from '../../components/marketing/Reveal';
import { CreatorMarquee, ProductMarquee, BrandStrip } from '../../components/marketing/ScrollStrips';
import { CreatorPagePreviews } from '../../components/marketing/CreatorPagePreviews';
import { DigitalProductShowcase } from '../../components/marketing/DigitalProductShowcase';
import { FAQ } from '../../components/marketing/FAQ';
import {
  FloatingCard,
  MkButton,
  MkIconBadge,
  MkKicker,
  MkSectionHeading,
  PhoneFrame,
  ProductTile,
  STOREFRONTS,
  StorefrontScreen,
} from '../../components/marketing/MarketingKit';
import {
  IconBag,
  IconCard,
  IconChart,
  IconCheck,
  IconExternal,
  IconEye,
  IconPalette,
  IconUsers,
  IconWhatsapp,
} from '../../components/icons';

const SAMPLES = [
  { name: 'Aarti', handle: 'aarti', tagline: 'Food creator · Bengaluru', color: '#e8420f' },
  { name: 'Cafe Mocha', handle: 'cafe-mocha', tagline: 'Café · Pune', color: '#0e9f8a' },
  { name: 'DevStudio', handle: 'devstudio', tagline: 'Freelance web dev · remote', color: '#7b3fe4' },
];

/* ------------------------------------------------------------------ hero */

function HeroStage() {
  return (
    <div className="mk-stage relative mx-auto w-full max-w-[540px]">
      {/* Rings + colour bloom behind the device */}
      <div
        aria-hidden="true"
        className="mk-halo left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 opacity-60 sm:h-[500px] sm:w-[500px]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,85,51,0.28),rgba(217,40,125,0.16)_45%,transparent_70%)] blur-2xl sm:h-[440px] sm:w-[440px]"
      />
      <div
        aria-hidden="true"
        className="mk-spin-slow absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[rgba(26,18,11,0.15)] sm:h-[470px] sm:w-[470px]"
      />

      {/* Second storefront, recessed behind the hero device */}
      <div
        aria-hidden="true"
        className="mk-3d absolute left-0 top-[86px] hidden w-[188px] sm:block"
        style={{ transform: 'rotateY(16deg) rotateX(5deg) rotateZ(-3deg)' }}
      >
        <div className="opacity-[0.92]">
          <PhoneFrame width={188}>
            <StorefrontScreen variant={STOREFRONTS.ananya} />
          </PhoneFrame>
        </div>
      </div>

      {/* Hero device */}
      <div className="relative z-10 ml-auto w-[286px] sm:w-[300px]">
        <div className="mk-3d mk-tilt">
          <PhoneFrame width={300}>
            <StorefrontScreen variant={STOREFRONTS.meera} />
          </PhoneFrame>
        </div>
      </div>

      {/* Floating props */}
      <FloatingCard className="mk-float-a absolute -left-1 top-2 z-20 w-[186px] px-3 py-2.5 sm:-left-2 sm:top-2 sm:w-[196px]">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[rgba(37,211,102,0.14)] text-[15px] text-[#128c7e]">
            <IconWhatsapp />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-[#1a120b]">New WhatsApp order</p>
            <p className="truncate text-[10px] text-[#6c5c50]">Kanjeevaram · ₹8,400</p>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="mk-float-b absolute -right-2 top-[24%] z-20 hidden w-[152px] px-3 py-2.5 sm:-right-5 sm:block">
        <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#8a7767]">UPI received</p>
        <p className="mt-1 flex items-baseline gap-1 font-display text-lg leading-none text-[#1a120b]">
          ₹2,950
          <span className="text-[9px] font-semibold text-[#0e9f8a]">paid</span>
        </p>
      </FloatingCard>

      <FloatingCard className="mk-float-c absolute -left-1 bottom-6 z-20 hidden w-[176px] px-3.5 py-3 sm:-left-4 sm:block">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#8a7767]">Page views</p>
            <p className="mt-1 font-display text-xl leading-none text-[#1a120b]">12,480</p>
          </div>
          <div className="flex h-8 items-end gap-[3px]" aria-hidden="true">
            {[40, 58, 46, 72, 88, 64, 100].map((h, i) => (
              <span
                key={i}
                className="w-[4px] rounded-full"
                style={{
                  height: `${h}%`,
                  background:
                    i > 4 ? 'var(--mk-grad-warm)' : 'rgba(26,18,11,0.16)',
                }}
              />
            ))}
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="mk-float-a absolute right-4 -top-2 z-20 hidden items-center gap-2 px-3 py-2 sm:flex">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[rgba(255,176,31,0.18)] text-[11px] text-[#b26a00]">
          <IconCheck />
        </span>
        <p className="text-[10px] font-bold text-[#1a120b]">
          Published <span className="font-normal text-[#6c5c50]">· 2 min ago</span>
        </p>
      </FloatingCard>
    </div>
  );
}

/* --------------------------------------------------------------- helpers */

function GradientRule() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full"
      style={{
        background:
          'linear-gradient(90deg, transparent, rgba(232,66,15,0.35), rgba(217,40,125,0.35), rgba(59,79,224,0.3), transparent)',
      }}
    />
  );
}

/* ------------------------------------------------------------------ page */

export default function Landing() {
  return (
    <div className="mk-root overflow-x-hidden">
      {/* ============================== HERO ============================== */}
      <section className="mk-section mk-mesh mk-noise">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-grid-bg opacity-70" />
        <div
          aria-hidden="true"
          className="mk-orb -left-24 -top-24 h-[26rem] w-[26rem] bg-[rgba(255,176,31,0.55)]"
        />
        <div
          aria-hidden="true"
          className="mk-orb -right-28 top-10 h-[30rem] w-[30rem] bg-[rgba(217,40,125,0.35)]"
        />
        <div
          aria-hidden="true"
          className="mk-orb -bottom-28 left-[22%] h-[24rem] w-[24rem] bg-[rgba(59,79,224,0.28)]"
        />

        <div className="container-page relative grid items-center gap-16 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-6 lg:pb-28 lg:pt-24">
          <div className="min-w-0">
            <Reveal variant="fade">
              <MkKicker>Built for creators everywhere</MkKicker>
            </Reveal>

            <Reveal variant="up" delay={60}>
              <h1 className="mk-display mt-6 text-[3rem] leading-[0.92] sm:text-[4rem] lg:text-[4.8rem] xl:text-[5.35rem]">
                One link for{' '}
                <span className="relative inline-block">
                  <span className="mk-gradient-text">everything</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 260 14"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-3 w-full"
                  >
                    <defs>
                      <linearGradient id="hero-stroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ffb01f" />
                        <stop offset="55%" stopColor="#ff5533" />
                        <stop offset="100%" stopColor="#d9287d" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M3 9c52-7 128-9 254-5"
                      fill="none"
                      stroke="url(#hero-stroke)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{' '}
                you create.
              </h1>
            </Reveal>

            <Reveal variant="up" delay={130}>
              <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-[#5d4c40] sm:text-lg">
                BLACKFRAM gives Instagram creators, fashion sellers, home chefs and digital makers a
                vivid home for links, products, WhatsApp orders and UPI payments — without building a
                website.
              </p>
            </Reveal>

            <Reveal variant="up" delay={200}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <MkButton href={`${APP_URL}/register`} arrow className="w-full sm:w-auto">
                  Create your page — free
                </MkButton>
                <MkButton to="/pricing" variant="ghost" className="w-full sm:w-auto">
                  See pricing
                </MkButton>
              </div>
            </Reveal>

            <Reveal variant="up" delay={270}>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                {['Free forever plan', 'No app to install', 'Your own /u/ page'].map((t) => (
                  <span key={t} className="flex items-center gap-2 text-[13px] font-medium text-[#5d4c40]">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[rgba(14,159,138,0.14)] text-[11px] text-[#0b7a69]">
                      <IconCheck />
                    </span>
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal variant="up" delay={330}>
              <div className="mt-9 flex items-center gap-3 border-t border-[rgba(26,18,11,0.10)] pt-6">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`/assets/creators/creator-${i}.jpg`}
                      alt=""
                      aria-hidden="true"
                      className="h-9 w-9 rounded-full border-2 border-[#fff9f2] object-cover shadow-sm"
                      loading="lazy"
                    />
                  ))}
                </div>
                <p className="text-[12.5px] leading-snug text-[#6c5c50]">
                  <span className="font-semibold text-[#1a120b]">Made for the way you sell.</span>{' '}
                  Share one link, take orders on WhatsApp, get paid on UPI.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={140} className="min-w-0">
            <HeroStage />
          </Reveal>
        </div>
      </section>

      {/* ============================ TICKER ============================= */}
      <section
        className="mk-section relative py-12 text-[#fff6ea] sm:py-14"
        style={{ backgroundImage: 'var(--mk-grad-ink)' }}
      >
        <div
          aria-hidden="true"
          className="mk-orb -left-32 top-0 h-[24rem] w-[24rem] bg-[rgba(232,66,15,0.45)]"
        />
        <div
          aria-hidden="true"
          className="mk-orb -right-24 bottom-0 h-[22rem] w-[22rem] bg-[rgba(123,63,228,0.45)]"
        />
        <div className="relative">
          <div className="container-page mb-6 flex flex-col items-center gap-3 text-center">
            <MkKicker dark>Creators building with BLACKFRAM</MkKicker>
            <p className="max-w-lg text-sm text-[#d9c3ad]">
              Real pages from fashion, beauty, food and digital creators everywhere.
            </p>
          </div>
          <CreatorMarquee />
          <ProductMarquee />
          <div className="mt-6">
            <BrandStrip />
          </div>
        </div>
      </section>

      {/* ======================= CREATOR STOREFRONTS ===================== */}
      <section className="mk-section mk-mesh-soft py-20 lg:py-28">
        <div className="container-page relative">
          <Reveal variant="up">
            <MkSectionHeading
              eyebrow="Creator pages that pop"
              title={
                <>
                  Every creator deserves a page as{' '}
                  <span className="mk-gradient-text">vivid</span> as their work
                </>
              }
              description="Pick a palette, arrange your links, showcase products, and send followers straight to WhatsApp or your shop."
            />
          </Reveal>
          <div className="mt-14">
            <CreatorPagePreviews />
          </div>
          <Reveal variant="up" delay={100}>
            <div className="mt-12 flex justify-center">
              <MkButton href={`${APP_URL}/register`} arrow>
                Create your page — free
              </MkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ FEATURES =========================== */}
      <section className="mk-section bg-[#fffdf9] py-20 lg:py-28">
        <div className="container-page">
          <Reveal variant="up">
            <MkSectionHeading
              eyebrow="Everything in one place"
              title={
                <>
                  Built to help creators{' '}
                  <span className="mk-gradient-text-cool">grow and get paid</span>
                </>
              }
              description="No clutter, no code, no plugins. Just the tools that actually move the needle on Instagram."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            {/* One link — hero card */}
            <Reveal variant="up" delay={40} className="lg:col-span-7">
              <div
                className="mk-card mk-card-lift relative h-full overflow-hidden p-7 sm:p-9"
                style={{ backgroundImage: 'var(--mk-grad-warm)' }}
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-noise" />
                <div
                  aria-hidden="true"
                  className="absolute -right-14 -top-14 h-52 w-52 rounded-full bg-white/15 blur-2xl"
                />
                <div className="relative flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-center">
                  <div className="max-w-sm">
                    <span className="mk-kicker mk-kicker-dark">One address</span>
                    <h3 className="mk-display mt-4 text-[1.9rem] leading-[1.02] text-white sm:text-[2.25rem]">
                      One link for everything you make
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#ffe7dc] sm:text-[15px]">
                      Bring Instagram, YouTube, your shop and WhatsApp together on one beautiful page
                      that fits in a bio.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {['Instagram', 'YouTube', 'Shop', 'WhatsApp'].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[rgba(255,255,255,0.34)] bg-[rgba(255,255,255,0.16)] px-3 py-1 text-[11px] font-semibold text-white backdrop-blur"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full max-w-[224px] shrink-0 rounded-[16px] bg-[#fffaf4] p-3.5 shadow-[0_24px_50px_-24px_rgba(48,16,64,0.6)] sm:rotate-2">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(232,66,15,0.12)] font-display text-sm text-[#e8420f]">
                        M
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-[13px] leading-tight">Meera Sarees</p>
                        <p className="truncate text-[9.5px] text-[#7c6a5a]">Handloom · Bengaluru</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {[
                        ['Shop the collection', '#e8420f'],
                        ['New arrivals', '#7b3fe4'],
                        ['WhatsApp', '#0e9f8a'],
                      ].map(([label, tint]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-[7px] border border-[rgba(26,18,11,0.08)] bg-white px-2.5 py-1.5"
                        >
                          <span className="text-[9.5px] font-semibold text-[#1a120b]">{label}</span>
                          <span className="text-[9px]" style={{ color: tint }}>
                            →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Sell anything */}
            <Reveal variant="up" delay={90} className="lg:col-span-5">
              <div className="mk-card mk-card-lift relative h-full overflow-hidden p-7 sm:p-8">
                <MkIconBadge gradient="var(--mk-grad-gold)">
                  <IconBag />
                </MkIconBadge>
                <h3 className="mk-display mt-5 text-[1.6rem] leading-[1.05]">Sell anything you make</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#6c5c50]">
                  Sarees, serums, e-books, presets or 1:1 sessions. One product card works for all of
                  them, priced in ₹.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { name: 'Kanjeevaram silk', price: '₹8,400', from: '#ffb01f', to: '#e8420f' },
                    { name: 'Vitamin C serum', price: '₹899', from: '#a78bfa', to: '#7b3fe4' },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="overflow-hidden rounded-[12px] border border-[rgba(26,18,11,0.07)] bg-[#fffaf4]"
                    >
                      <ProductTile from={p.from} to={p.to} label={p.name} className="h-20 w-full" />
                      <div className="p-2.5">
                        <p className="truncate text-[10.5px] font-semibold">{p.name}</p>
                        <p className="mt-0.5 text-[11px] font-bold text-[#e8420f]">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* WhatsApp */}
            <Reveal variant="up" delay={140} className="lg:col-span-4">
              <div className="mk-card mk-card-lift relative h-full overflow-hidden p-7">
                <MkIconBadge gradient="linear-gradient(135deg,#25d366,#0e9f8a)">
                  <IconWhatsapp />
                </MkIconBadge>
                <h3 className="mk-display mt-5 text-[1.45rem] leading-[1.08]">Orders on WhatsApp</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#6c5c50]">
                  Customers ask questions and order in the app they already use.
                </p>
                <div className="mt-5 rounded-[12px] bg-[#f2fbf6] p-3">
                  <div className="w-fit max-w-[92%] rounded-[10px] rounded-bl-[3px] bg-white px-3 py-2 text-[10.5px] leading-snug text-[#1a120b] shadow-sm">
                    Is the Kanjeevaram still available? 😍
                  </div>
                  <div className="ml-auto mt-1.5 w-fit max-w-[92%] rounded-[10px] rounded-br-[3px] bg-[#dcf8c6] px-3 py-2 text-[10.5px] leading-snug text-[#1a120b]">
                    Yes! Sending you the UPI link now.
                  </div>
                </div>
              </div>
            </Reveal>

            {/* UPI */}
            <Reveal variant="up" delay={190} className="lg:col-span-4">
              <div
                className="mk-card mk-card-lift relative h-full overflow-hidden p-7 text-white"
                style={{ backgroundImage: 'var(--mk-grad-cool)' }}
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-noise" />
                <div className="relative">
                  <span className="grid h-11 w-11 place-items-center rounded-[13px] bg-white/20 text-white">
                    <IconCard />
                  </span>
                  <h3 className="mk-display mt-5 text-[1.45rem] leading-[1.08] text-white">
                    Get paid on UPI
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#e7ddff]">
                    Share your UPI ID or QR. Money lands directly in your account, no middleman.
                  </p>
                  <div className="mt-5 flex items-center gap-3 rounded-[12px] bg-white/14 p-3 backdrop-blur">
                    <div className="grid h-12 w-12 shrink-0 grid-cols-4 gap-[2px] rounded-[6px] bg-white p-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span
                          key={i}
                          className={`rounded-[1px] ${i % 3 === 0 || i === 5 ? 'bg-[#1a120b]' : 'bg-white'}`}
                        />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#d9cdff]">
                        UPI ID
                      </p>
                      <p className="truncate text-[12px] font-semibold">meera@blackfram</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Analytics */}
            <Reveal variant="up" delay={240} className="lg:col-span-4">
              <div className="mk-card mk-card-lift relative h-full overflow-hidden p-7">
                <MkIconBadge gradient="linear-gradient(135deg,#7b3fe4,#d9287d)">
                  <IconChart />
                </MkIconBadge>
                <h3 className="mk-display mt-5 text-[1.45rem] leading-[1.08]">Know what works</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#6c5c50]">
                  See views, clicks and where your audience comes from.
                </p>
                <div className="mt-5 flex h-24 items-end gap-1.5">
                  {[34, 52, 40, 66, 48, 78, 58, 92, 70, 100].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-t-[3px]"
                      style={{
                        height: `${h}%`,
                        background:
                          i > 6 ? 'var(--mk-grad-warm)' : 'rgba(123,63,228,0.16)',
                      }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[rgba(26,18,11,0.08)] pt-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#8a7767]">
                    Last 7 days
                  </span>
                  <span className="text-[10px] font-bold text-[#0e9f8a]">+18.4%</span>
                </div>
              </div>
            </Reveal>

            {/* Themes */}
            <Reveal variant="up" delay={290} className="lg:col-span-12">
              <div className="mk-card mk-card-lift grid items-center gap-6 p-7 sm:grid-cols-[1fr_auto] sm:p-8">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3">
                    <MkIconBadge gradient="var(--mk-grad-fresh)" size={40}>
                      <IconPalette />
                    </MkIconBadge>
                    <div>
                      <h3 className="mk-display text-[1.4rem] leading-tight">Looks like you, not a template</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#6c5c50]">
                        Templates, palettes, cover art and type — change everything from one screen.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {['#fff3e0', '#1a120b', '#e8420f', '#ffb01f', '#d9287d', '#7b3fe4', '#0e9f8a', '#b7d431'].map(
                    (c) => (
                      <span
                        key={c}
                        className="h-9 w-9 rounded-full border-2 border-white shadow-[0_6px_14px_-6px_rgba(48,16,64,0.5)] transition-transform duration-200 hover:-translate-y-1"
                        style={{ background: c }}
                        aria-hidden="true"
                      />
                    ),
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ======================= DIGITAL PRODUCTS ======================== */}
      <section className="mk-section mk-mesh-soft border-y border-[rgba(26,18,11,0.07)] py-20 lg:py-28">
        <div className="container-page">
          <Reveal variant="up">
            <MkSectionHeading
              eyebrow="Monetize with digital products"
              title={
                <>
                  E-books, templates, presets{' '}
                  <span className="mk-gradient-text">and more</span>
                </>
              }
              description="Turn your knowledge into income with product pages that look as good as your feed."
            />
          </Reveal>
          <div className="mt-14">
            <DigitalProductShowcase />
          </div>
        </div>
      </section>

      {/* ========================== HOW IT WORKS ========================= */}
      <section className="mk-section bg-[#fffdf9] py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="mk-orb -right-24 top-10 h-[22rem] w-[22rem] bg-[rgba(255,176,31,0.28)]"
        />
        <div className="container-page relative">
          <Reveal variant="up">
            <MkSectionHeading
              eyebrow="How it works"
              title={
                <>
                  From profile to <span className="mk-gradient-text-cool">paid</span> in three steps
                </>
              }
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create your page',
                body: 'Sign up free and pick a palette that fits your brand. Your page is live on /u/yourname.',
                icon: <IconEye />,
                grad: 'var(--mk-grad-warm)',
              },
              {
                step: '02',
                title: 'Add links & products',
                body: 'Drop in Instagram, YouTube, WhatsApp, your shop and digital products with prices in ₹.',
                icon: <IconBag />,
                grad: 'linear-gradient(135deg,#ffb01f,#e8420f)',
              },
              {
                step: '03',
                title: 'Share & earn',
                body: 'Put the link in your bio. Followers browse, ask on WhatsApp, and pay you on UPI.',
                icon: <IconUsers />,
                grad: 'linear-gradient(135deg,#7b3fe4,#d9287d)',
              },
            ].map((s, i) => (
              <Reveal key={s.step} variant="up" delay={i * 80}>
                <div className="group relative h-full overflow-hidden rounded-[20px] border border-[rgba(26,18,11,0.07)] bg-white p-7 shadow-[0_24px_60px_-40px_rgba(48,16,64,0.45)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-40px_rgba(48,16,64,0.5)]">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-display text-[3.25rem] leading-none tracking-[-0.06em]"
                      style={{
                        backgroundImage: s.grad,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {s.step}
                    </span>
                    <span
                      className="grid h-10 w-10 place-items-center rounded-[11px] text-white shadow-[0_10px_22px_-12px_rgba(48,16,64,0.7)]"
                      style={{ backgroundImage: s.grad }}
                    >
                      {s.icon}
                    </span>
                  </div>
                  <h3 className="mk-display mt-6 text-[1.4rem] leading-[1.1]">{s.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#6c5c50]">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= STATS ============================= */}
      <section
        className="mk-section relative py-14 text-white sm:py-16"
        style={{ backgroundImage: 'var(--mk-grad-warm)' }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-noise" />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-[rgba(255,255,255,0.35)]"
        />
        <div className="container-page relative grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[
            { value: '1 link', label: 'instead of six in your bio' },
            { value: '₹0', label: 'to start, forever' },
            { value: '3 min', label: 'to a page that is live' },
            { value: '24/7', label: 'orders on autopilot' },
          ].map((s, i) => (
            <Reveal key={s.label} variant="up" delay={i * 60}>
              <div>
                <p className="mk-display text-[2.4rem] leading-none text-white sm:text-[3rem]">{s.value}</p>
                <p className="mx-auto mt-2 max-w-[11rem] text-[12px] leading-snug text-[#ffe7dc]">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================== CREATOR WALL ========================= */}
      <section className="mk-section mk-mesh-soft py-20 lg:py-28">
        <div className="container-page">
          <Reveal variant="up">
            <MkSectionHeading
              eyebrow="Built for every kind of creator"
              title={
                <>
                  Fashion, beauty, food, digital{' '}
                  <span className="mk-gradient-text">and more</span>
                </>
              }
              description="Join creators building beautiful pages with BLACKFRAM."
            />
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              'Sarees & fashion',
              'Beauty & skincare',
              'Jewellery & handmade',
              'Food & home chefs',
              'Digital products',
              'Coaches & freelancers',
            ].map((c) => (
              <span
                key={c}
                className="rounded-full border border-[rgba(26,18,11,0.09)] bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#5d4c40] shadow-[0_2px_8px_-4px_rgba(48,16,64,0.3)] backdrop-blur transition-colors hover:border-[rgba(232,66,15,0.35)] hover:text-[#e8420f]"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { i: 1, grad: 'from-[#ffb01f] to-[#ff5533]' },
              { i: 2, grad: 'from-[#d9287d] to-[#7b3fe4]' },
              { i: 3, grad: 'from-[#0e9f8a] to-[#3b4fe0]' },
              { i: 4, grad: 'from-[#e8420f] to-[#d9287d]' },
            ].map(({ i, grad }, idx) => (
              <Reveal key={i} variant="up" delay={idx * 70}>
                <div
                  className={`group relative overflow-hidden rounded-[18px] bg-gradient-to-br ${grad} p-1.5 shadow-[0_30px_60px_-36px_rgba(48,16,64,0.6)] transition duration-300 hover:-translate-y-1.5`}
                >
                  <img
                    src={`/assets/creators/creator-${i}.jpg`}
                    alt={`Creator portrait ${i}`}
                    className="h-56 w-full rounded-[13px] object-cover transition duration-500 group-hover:scale-[1.03] sm:h-72"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-4 left-4 rounded-full bg-[rgba(26,18,11,0.72)] px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                    {['Fashion & sarees', 'Beauty & skincare', 'Food & home chefs', 'Digital products'][idx]}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= PRICING TEASER ======================== */}
      <section className="container-page pb-20 lg:pb-28">
        <Reveal variant="up">
          <div
            className="relative overflow-hidden rounded-[28px] px-6 py-12 text-center text-white sm:px-12 sm:py-16"
            style={{ backgroundImage: 'var(--mk-grad-ink)' }}
          >
            <div
              aria-hidden="true"
              className="mk-orb -left-20 top-0 h-[22rem] w-[22rem] bg-[rgba(232,66,15,0.55)]"
            />
            <div
              aria-hidden="true"
              className="mk-orb -right-16 bottom-0 h-[20rem] w-[20rem] bg-[rgba(123,63,228,0.5)]"
            />
            <div className="relative">
              <MkKicker dark>Pricing</MkKicker>
              <h2 className="mk-display mx-auto mt-5 max-w-2xl text-[2.2rem] leading-[1.02] text-white sm:text-[3.1rem]">
                Start free. Upgrade when you{' '}
                <span className="mk-gradient-text">outgrow</span> it.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#d9c3ad]">
                Simple pricing that grows with you — no lock-in, no surprise fees. See full details on
                the pricing page.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <MkButton href={`${APP_URL}/register`} variant="light" arrow>
                  Create your page — free
                </MkButton>
                <MkButton to="/pricing" variant="outlineLight">
                  View pricing
                </MkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =============================== FAQ ============================= */}
      <section className="mk-section bg-[#fffdf9] py-20 lg:py-28">
        <div className="container-page">
          <Reveal variant="up">
            <MkSectionHeading
              eyebrow="FAQs"
              title={
                <>
                  Questions? We’ve got{' '}
                  <span className="mk-gradient-text-cool">answers</span>
                </>
              }
            />
          </Reveal>
          <div className="mt-10">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ============================ FINAL CTA ========================== */}
      <section className="container-page pb-20 lg:pb-28">
        <Reveal variant="up">
          <div className="relative overflow-hidden rounded-[30px]">
            <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: 'var(--mk-grad-warm)' }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-noise" />
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-white/20 blur-2xl"
            />
            <div className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-16">
              <div>
                <MkKicker dark>Your turn</MkKicker>
                <h2 className="mk-display mt-5 max-w-xl text-[2.2rem] leading-[0.98] text-white sm:text-[3.1rem]">
                  Your audience is waiting. Give them a beautiful place to land.
                </h2>
                <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#ffe7dc]">
                  Create your free BLACKFRAM page and start sharing your links, products and WhatsApp in
                  minutes.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <MkButton href={`${APP_URL}/register`} variant="light" arrow>
                    Create your page — free
                  </MkButton>
                  <MkButton to="/pricing" variant="outlineLight">
                    View pricing
                  </MkButton>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[rgba(255,255,255,0.24)] pt-5 text-xs text-[#ffe7dc]">
                  {['Free forever', 'No app to install', 'Your own /u/ page'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <span className="text-[#c9f5e4]">
                        <IconCheck />
                      </span>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative hidden justify-center lg:flex">
                <div className="mk-3d" style={{ transform: 'rotateY(-10deg) rotateX(4deg) rotateZ(2deg)' }}>
                  <PhoneFrame width={300}>
                    <StorefrontScreen variant={STOREFRONTS.katha} />
                  </PhoneFrame>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute -bottom-6 left-0 rounded-[12px] border border-[rgba(255,255,255,0.3)] bg-[rgba(26,18,11,0.5)] px-4 py-2.5 backdrop-blur"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#ffd9c7]">
                    Page views
                  </p>
                  <p className="mt-1 font-display text-xl leading-none text-white">12,480</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <GradientRule />

      {/* ============================= SAMPLES =========================== */}
      <section className="container-page py-14">
        <Reveal variant="up">
          <div className="flex flex-col items-center gap-5 text-center">
            <MkKicker>Try a sample page</MkKicker>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {SAMPLES.map((s) => (
                <a
                  key={s.handle}
                  href={`${APP_URL}/u/${s.handle}`}
                  className="group inline-flex items-center gap-3 rounded-full border border-[rgba(26,18,11,0.09)] bg-white py-1.5 pl-1.5 pr-4 shadow-[0_10px_24px_-18px_rgba(48,16,64,0.5)] transition hover:-translate-y-0.5 hover:border-[rgba(26,18,11,0.18)] hover:shadow-[0_18px_34px_-18px_rgba(48,16,64,0.45)]"
                >
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full font-display text-sm text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.name[0]}
                  </span>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-[#1a120b]">{s.name}</p>
                    <p className="text-[11px] text-[#6c5c50]">{s.tagline}</p>
                  </div>
                  <span className="text-[11px] text-[#8a7767] transition-colors group-hover:text-[#e8420f]">
                    <IconExternal />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
