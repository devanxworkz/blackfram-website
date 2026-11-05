import type { ReactNode } from 'react';
import {
  IconBag,
  IconCheck,
  IconGlobe,
  IconInstagram,
  IconLink,
  IconUser,
  IconWhatsapp,
  IconYoutube,
} from '../../components/icons';
import { MkButton, MkIconBadge, MkKicker } from '../../components/marketing/MarketingKit';

/* ------------------------------- mock screens ------------------------------ */
/* (unchanged SVG mocks from the previous design) */

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[300px] mk-phone">
      <span className="mk-phone-key" style={{ left: -2, top: 132, height: 44 }} aria-hidden="true" />
      <span className="mk-phone-key" style={{ left: -2, top: 188, height: 68 }} aria-hidden="true" />
      <span className="mk-phone-key" style={{ right: -2, top: 168, height: 78 }} aria-hidden="true" />
      <span className="mk-phone-notch" aria-hidden="true" />
      <div className="mk-phone-screen" style={{ aspectRatio: '9 / 19.1' }}>
        {children}
      </div>
    </div>
  );
}

/* Keep the original SVG mock screens. */
function LinkInBioMock() {
  return (
    <svg viewBox="0 0 320 560" className="h-full w-full" role="img" aria-label="Creator link-in-bio mobile preview">
      <defs>
        <linearGradient id="lib-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf4" />
          <stop offset="100%" stopColor="#f3e9dc" />
        </linearGradient>
      </defs>
      <rect width="320" height="560" fill="url(#lib-bg)" />
      <circle cx="160" cy="96" r="40" fill="#e8420f" />
      <circle cx="160" cy="96" r="40" fill="none" stroke="#f3e9dc" strokeWidth="3" />
      <rect x="108" y="154" width="104" height="10" rx="5" fill="#1a120b" />
      <rect x="88" y="178" width="144" height="8" rx="4" fill="#6c5c50" opacity="0.55" />
      <rect x="28" y="216" width="264" height="50" rx="10" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="28" y="278" width="264" height="50" rx="10" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="28" y="340" width="264" height="50" rx="10" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="28" y="402" width="264" height="50" rx="10" fill="#0e9f8a" />
      <circle cx="48" cy="241" r="9" fill="#e8420f" />
      <circle cx="48" cy="303" r="9" fill="#7b3fe4" />
      <circle cx="48" cy="365" r="9" fill="#d9287d" />
      <circle cx="48" cy="427" r="9" fill="#fffdfa" />
      <rect x="70" y="237" width="106" height="8" rx="4" fill="#1a120b" opacity="0.85" />
      <rect x="70" y="299" width="92" height="8" rx="4" fill="#1a120b" opacity="0.85" />
      <rect x="70" y="361" width="118" height="8" rx="4" fill="#1a120b" opacity="0.85" />
      <rect x="70" y="423" width="96" height="8" rx="4" fill="#fffdfa" opacity="0.9" />
      <rect x="100" y="492" width="120" height="8" rx="4" fill="#6c5c50" opacity="0.4" />
    </svg>
  );
}

function DigitalStorefrontMock() {
  return (
    <svg viewBox="0 0 320 560" className="h-full w-full" role="img" aria-label="Digital storefront mobile preview">
      <rect width="320" height="560" fill="#fffaf4" />
      <rect x="20" y="24" width="280" height="112" rx="14" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <circle cx="58" cy="80" r="24" fill="#d9287d" />
      <rect x="94" y="66" width="96" height="10" rx="5" fill="#1a120b" />
      <rect x="94" y="88" width="68" height="8" rx="4" fill="#6c5c50" opacity="0.55" />
      <rect x="20" y="156" width="132" height="160" rx="12" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="168" y="156" width="132" height="160" rx="12" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="32" y="168" width="108" height="94" rx="8" fill="#ffb01f" opacity="0.6" />
      <rect x="180" y="168" width="108" height="94" rx="8" fill="#0e9f8a" opacity="0.45" />
      <rect x="32" y="278" width="66" height="8" rx="4" fill="#1a120b" />
      <rect x="180" y="278" width="66" height="8" rx="4" fill="#1a120b" />
      <rect x="32" y="296" width="42" height="8" rx="4" fill="#e8420f" />
      <rect x="180" y="296" width="42" height="8" rx="4" fill="#e8420f" />
      <rect x="20" y="336" width="280" height="56" rx="10" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="34" y="352" width="60" height="24" rx="6" fill="#f3e9dc" />
      <rect x="106" y="352" width="100" height="8" rx="4" fill="#1a120b" />
      <rect x="106" y="368" width="72" height="6" rx="3" fill="#6c5c50" opacity="0.45" />
      <rect x="20" y="404" width="280" height="56" rx="10" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="34" y="420" width="60" height="24" rx="6" fill="#f3e9dc" />
      <rect x="106" y="420" width="84" height="8" rx="4" fill="#1a120b" />
      <rect x="106" y="436" width="58" height="6" rx="3" fill="#6c5c50" opacity="0.45" />
    </svg>
  );
}

function BrandBoardMock() {
  return (
    <svg viewBox="0 0 320 560" className="h-full w-full" role="img" aria-label="Brand identity board preview">
      <rect width="320" height="560" fill="#fffaf4" />
      <rect x="20" y="24" width="280" height="110" rx="14" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="40" y="44" width="62" height="62" rx="31" fill="#1a120b" />
      <rect x="118" y="56" width="118" height="10" rx="5" fill="#1a120b" />
      <rect x="118" y="80" width="86" height="8" rx="4" fill="#6c5c50" opacity="0.55" />
      <rect x="20" y="150" width="280" height="86" rx="14" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <circle cx="50" cy="193" r="15" fill="#e8420f" />
      <circle cx="88" cy="193" r="15" fill="#ffb01f" />
      <circle cx="126" cy="193" r="15" fill="#1a120b" />
      <circle cx="164" cy="193" r="15" fill="#0e9f8a" />
      <circle cx="202" cy="193" r="15" fill="#d9287d" />
      <circle cx="240" cy="193" r="15" fill="#f3e9dc" stroke="#d9cbb6" />
      <rect x="20" y="252" width="132" height="120" rx="14" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="168" y="252" width="132" height="120" rx="14" fill="#1a120b" />
      <rect x="36" y="272" width="100" height="44" rx="8" fill="#f3e9dc" />
      <rect x="36" y="326" width="72" height="8" rx="4" fill="#1a120b" />
      <rect x="36" y="342" width="52" height="6" rx="3" fill="#6c5c50" opacity="0.5" />
      <rect x="184" y="272" width="100" height="44" rx="8" fill="#e8420f" />
      <rect x="184" y="326" width="72" height="8" rx="4" fill="#fffdfa" />
      <rect x="184" y="342" width="52" height="6" rx="3" fill="#fffdfa" opacity="0.5" />
      <rect x="20" y="388" width="280" height="64" rx="14" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="36" y="404" width="120" height="10" rx="5" fill="#1a120b" />
      <rect x="36" y="424" width="88" height="8" rx="4" fill="#6c5c50" opacity="0.5" />
    </svg>
  );
}

function CalendarMock() {
  return (
    <svg viewBox="0 0 320 560" className="h-full w-full" role="img" aria-label="Content calendar preview">
      <rect width="320" height="560" fill="#fffaf4" />
      <rect x="20" y="24" width="280" height="54" rx="12" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="36" y="44" width="104" height="10" rx="5" fill="#1a120b" />
      <rect x="20" y="96" width="280" height="72" rx="12" fill="#fff6e6" stroke="#efdfbe" />
      <rect x="36" y="112" width="66" height="8" rx="4" fill="#a16207" />
      <rect x="36" y="132" width="180" height="8" rx="4" fill="#ffb01f" opacity="0.7" />
      <rect x="36" y="150" width="140" height="8" rx="4" fill="#ffb01f" opacity="0.4" />
      <rect x="20" y="184" width="280" height="72" rx="12" fill="#f0f8f3" stroke="#d5e4d1" />
      <rect x="36" y="200" width="72" height="8" rx="4" fill="#0b7a69" />
      <rect x="36" y="220" width="196" height="8" rx="4" fill="#0e9f8a" opacity="0.6" />
      <rect x="36" y="238" width="150" height="8" rx="4" fill="#0e9f8a" opacity="0.35" />
      <rect x="20" y="272" width="280" height="72" rx="12" fill="#fceeed" stroke="#eed9cd" />
      <rect x="36" y="288" width="60" height="8" rx="4" fill="#c2410c" />
      <rect x="36" y="308" width="186" height="8" rx="4" fill="#e8420f" opacity="0.6" />
      <rect x="36" y="326" width="128" height="8" rx="4" fill="#e8420f" opacity="0.35" />
      <rect x="20" y="360" width="280" height="72" rx="12" fill="#fffdfa" stroke="rgba(26,18,11,0.08)" />
      <rect x="36" y="376" width="58" height="8" rx="4" fill="#1a120b" />
      <rect x="36" y="396" width="170" height="8" rx="4" fill="#6c5c50" opacity="0.45" />
      <rect x="20" y="448" width="280" height="52" rx="10" fill="#1a120b" />
      <rect x="36" y="466" width="120" height="8" rx="4" fill="#fffdfa" />
    </svg>
  );
}

/* -------------------------------- page chrome ------------------------------ */

function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  media,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets?: { icon: ReactNode; label: string }[];
  media: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? 'min-w-0 lg:order-2' : 'min-w-0'}>
        <MkKicker>{eyebrow}</MkKicker>
        <h2 className="mk-display mt-5 text-[2rem] leading-[1.05] sm:text-[2.6rem]">{title}</h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[#6c5c50] sm:text-[1.0625rem]">{body}</p>
        {bullets && (
          <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {bullets.map((item) => (
              <div
                key={item.label}
                className="mk-card mk-card-lift flex items-center gap-3 px-3.5 py-2.5"
              >
                <MkIconBadge size={32} gradient="var(--mk-grad-warm)">
                  {item.icon}
                </MkIconBadge>
                <span className="text-[13px] font-semibold text-[#1a120b]">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={reverse ? 'min-w-0 lg:order-1' : 'min-w-0'}>{media}</div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function Features() {
  return (
    <div className="mk-root overflow-x-hidden">
      {/* HERO */}
      <section className="mk-section mk-mesh mk-noise">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-grid-bg opacity-60" />
        <div aria-hidden="true" className="mk-orb -left-40 top-0 h-[30rem] w-[30rem] bg-[rgba(255,176,31,0.45)]" />
        <div aria-hidden="true" className="mk-orb -right-32 bottom-0 h-[26rem] w-[26rem] bg-[rgba(217,40,125,0.3)]" />

        <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
          <div className="min-w-0">
            <MkKicker>Features</MkKicker>
            <h1 className="mk-display mt-6 text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem]">
              Everything you need to turn followers into{' '}
              <span className="mk-gradient-text">customers.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5d4c40] sm:text-lg">
              Build your creator page, showcase your work, and sell your digital products from one
              vivid place — no website, no app, no code.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MkButton to="/register" arrow>
                Start for free
              </MkButton>
              <MkButton to="/pricing" variant="ghost">
                View pricing
              </MkButton>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-[rgba(26,18,11,0.1)] pt-6 text-[13px] font-medium text-[#5d4c40]">
              {['Free forever plan', 'No app to install', 'Live in minutes'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[rgba(14,159,138,0.14)] text-[11px] text-[#0b7a69]">
                    <IconCheck />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[3rem] border border-[rgba(26,18,11,0.1)]" />
            <div className="mk-float-a relative">
              <Phone>
                <LinkInBioMock />
              </Phone>
            </div>
          </div>
        </div>
      </section>

      {/* ONE PAGE */}
      <section className="mk-section bg-[#fffdf9] py-20 lg:py-28">
        <div className="container-page">
          <FeatureRow
            eyebrow="One beautiful creator page"
            title="A home for your entire brand"
            body="Profile, bio, social links, products, WhatsApp and UPI all in one polished page. It is the only link you need in your Instagram bio."
            bullets={[
              { icon: <IconUser />, label: 'Profile & bio' },
              { icon: <IconLink />, label: 'Links with icons' },
              { icon: <IconInstagram />, label: 'Social ready' },
              { icon: <IconWhatsapp />, label: 'WhatsApp & UPI' },
            ]}
            media={
              <Phone>
                <LinkInBioMock />
              </Phone>
            }
          />
        </div>
      </section>

      {/* DIGITAL PRODUCTS */}
      <section
        className="mk-section py-20 lg:py-28"
        style={{ backgroundImage: 'var(--mk-grad-ink)' }}
      >
        <div aria-hidden="true" className="mk-orb -left-24 top-10 h-[22rem] w-[22rem] bg-[rgba(232,66,15,0.45)]" />
        <div className="container-page relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0 text-[#fff6ea]">
              <MkKicker dark>Sell digital products</MkKicker>
              <h2 className="mk-display mt-5 text-[2rem] leading-[1.05] text-[#fff6ea] sm:text-[2.6rem]">
                Turn your knowledge into income
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#d9c3ad] sm:text-[1.0625rem]">
                Showcase e-books, templates, planners and presets with beautiful product covers.
                Prices in rupees, a clean mobile-first layout, and a direct path to checkout.
              </p>
              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {[
                  { icon: <IconBag />, label: 'Physical or digital' },
                  { icon: <IconGlobe />, label: 'Prices in ₹' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="mk-prop flex items-center gap-3 px-3.5 py-2.5"
                    style={{
                      background: 'rgba(255,243,230,0.08)',
                      borderColor: 'rgba(255,243,230,0.18)',
                      color: '#fff6ea',
                    }}
                  >
                    <MkIconBadge size={32} gradient="var(--mk-grad-warm)">
                      {item.icon}
                    </MkIconBadge>
                    <span className="text-[13px] font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <Phone>
                <DigitalStorefrontMock />
              </Phone>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND */}
      <section className="mk-section mk-mesh-soft py-20 lg:py-28">
        <div className="container-page">
          <FeatureRow
            eyebrow="Your brand, your style"
            title="Make it unmistakably yours"
            body="Distinct colour palettes, typography and layouts to match your aesthetic. Change any colour, corner or spacing and watch the preview update as you go."
            media={
              <Phone>
                <BrandBoardMock />
              </Phone>
            }
          />
          <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            {['Saffron', 'Rose', 'Sage', 'Midnight', 'Paper'].map((c, i) => (
              <span
                key={c}
                className="mk-card mk-card-lift rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a120b]"
              >
                <span
                  aria-hidden="true"
                  className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                  style={{
                    background: ['#e8420f', '#d9287d', '#0e9f8a', '#7b3fe4', '#a89d8e'][i],
                  }}
                />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PLANNING */}
      <section className="mk-section bg-[#fffdf9] py-20 lg:py-28">
        <div className="container-page">
          <FeatureRow
            reverse
            eyebrow="Content planning"
            title="Plan, publish, grow"
            body="Stay on top of your content with a clean planning workflow built for creators — ideas in, published posts out, without another spreadsheet."
            media={
              <Phone>
                <CalendarMock />
              </Phone>
            }
          />
        </div>
      </section>

      {/* SOCIAL CTA */}
      <section
        className="mk-section relative overflow-hidden py-16 text-[#fff6ea] lg:py-24"
        style={{ backgroundImage: 'var(--mk-grad-ink)' }}
      >
        <div aria-hidden="true" className="mk-orb -right-24 top-0 h-[22rem] w-[22rem] bg-[rgba(123,63,228,0.45)]" />
        <div className="container-page relative">
          <div className="mx-auto max-w-2xl text-center">
            <MkKicker dark>Built for social creators</MkKicker>
            <h2 className="mk-display mt-5 text-[2rem] leading-[1.05] text-[#fff6ea] sm:text-[2.75rem]">
              Every kind of creator is welcome
            </h2>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[#d9c3ad]">
            Fashion, beauty, food, lifestyle and education creators are building
            vivid pages with BLACKFRAM.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: <IconInstagram />, label: 'Instagram' },
              { icon: <IconYoutube />, label: 'YouTube' },
              { icon: <IconWhatsapp />, label: 'WhatsApp' },
              { icon: <IconGlobe />, label: 'Share anywhere' },
            ].map((item) => (
              <span
                key={item.label}
                className="mk-prop inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-[#fff6ea]"
                style={{
                  background: 'rgba(255,243,230,0.08)',
                  borderColor: 'rgba(255,243,230,0.18)',
                }}
              >
                <span className="text-[#ffb01f]">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
          <div className="mt-9 flex justify-center">
            <MkButton to="/register" variant="light" arrow>
              Turn attention into income
            </MkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
