import { IconArrowRight, IconCheck } from '../../components/icons';
import { FAQ as LandingFAQ } from '../../components/marketing/FAQ';
import { MkButton, MkKicker } from '../../components/marketing/MarketingKit';
import { APP_URL } from '../../lib/appUrl';

interface Plan {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  cta: string;
  to: string;
  highlight?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '₹0',
    cadence: 'forever',
    blurb: 'For creators just getting started.',
    cta: 'Create your page',
    to: `${APP_URL}/register`,    features: [
      'Up to 10 links',
      'Up to 3 products',
      'All themes & layouts',
      'WhatsApp button',
      'UPI id & QR',
      '7-day analytics',
    ],
  },
  {
    name: 'Pro',
    price: '₹299',
    cadence: 'per month',
    blurb: 'For creators who are growing and selling.',
    cta: 'Start with Pro',
    to: `${APP_URL}/register?plan=pro`,    highlight: true,
    features: [
      'Unlimited links',
      'Unlimited products',
      'Custom accent colour',
      '90-day analytics',
      'Remove BLACKFRAM badge',
      'Priority email support',
    ],
  },
];

const COMPARISON = [
  { feature: 'Links', free: 'Up to 10', pro: 'Unlimited' },
  { feature: 'Products', free: 'Up to 3', pro: 'Unlimited' },
  { feature: 'Themes & layouts', free: 'All', pro: 'All' },
  { feature: 'Custom accent colour', free: '—', pro: 'Yes' },
  { feature: 'WhatsApp & UPI', free: 'Yes', pro: 'Yes' },
  { feature: 'Analytics window', free: '7 days', pro: '90 days' },
  { feature: 'Remove BLACKFRAM badge', free: '—', pro: 'Yes' },
  { feature: 'Priority email support', free: '—', pro: 'Yes' },
];

export default function Pricing() {
  return (
    <div className="mk-root overflow-x-hidden">
      {/* HERO */}
      <section className="mk-section mk-mesh mk-noise">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-grid-bg opacity-60" />
        <div aria-hidden="true" className="mk-orb -left-32 top-0 h-[26rem] w-[26rem] bg-[rgba(255,176,31,0.45)]" />
        <div aria-hidden="true" className="mk-orb -right-24 top-10 h-[24rem] w-[24rem] bg-[rgba(217,40,125,0.3)]" />

        <div className="container-page relative py-16 text-center lg:py-24">
          <MkKicker>Pricing</MkKicker>
          <h1 className="mk-display mx-auto mt-6 max-w-3xl text-[2.8rem] sm:text-[3.6rem] lg:text-[4.4rem]">
            Simple{' '}
            <span className="mk-gradient-text">pricing</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#5d4c40] sm:text-lg">
            Start building your creator brand today. Upgrade when you're ready for more. Prices in
            rupees.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MkButton href={`${APP_URL}/register`} arrow>
              Create your page — free
            </MkButton>
            <MkButton to="/features" variant="ghost">
              See all features
            </MkButton>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="mk-section bg-[#fffdf9] py-16 lg:py-24">
        <div className="container-page">
          <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col overflow-hidden rounded-[22px] border p-7 transition-transform duration-300 hover:-translate-y-2 sm:p-9 ${
                  plan.highlight
                    ? 'border-transparent text-[#fff6ea] shadow-[0_44px_90px_-40px_rgba(48,16,64,0.55)]'
                    : 'mk-card mk-card-lift'
                }`}
                style={
                  plan.highlight
                    ? { backgroundImage: 'var(--mk-grad-ink)' }
                    : undefined
                }
              >
                {plan.highlight && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 mk-noise"
                    />
                    <div
                      aria-hidden="true"
                      className="mk-orb -right-16 -top-16 h-[18rem] w-[18rem] bg-[rgba(232,66,15,0.5)]"
                    />
                    <div className="absolute right-6 top-6 rounded-full border border-[rgba(255,243,230,0.25)] bg-[rgba(255,243,230,0.1)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#fff6ea]">
                      Most popular
                    </div>
                  </>
                )}

                <div className="relative">
                  <div className="flex items-center gap-2">
                    <h2
                      className={`mk-display text-2xl leading-tight ${plan.highlight ? 'text-[#fff6ea]' : 'text-[#1a120b]'}`}
                    >
                      {plan.name}
                    </h2>
                    {plan.highlight && (
                      <span className="rounded-full bg-[var(--mk-coral)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
                        Pro
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1.5 text-sm leading-relaxed ${plan.highlight ? 'text-[#d9c3ad]' : 'text-[#6c5c50]'}`}
                  >
                    {plan.blurb}
                  </p>
                  <p className="mt-7 flex items-baseline gap-2">
                    <span
                      className={`mk-display text-[3.25rem] leading-none tracking-[-0.03em] ${
                        plan.highlight ? 'text-[#fff6ea]' : 'mk-gradient-text'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-xs ${plan.highlight ? 'text-[#d9c3ad]' : 'text-[#6c5c50]'}`}
                    >
                      / {plan.cadence}
                    </span>
                  </p>
                </div>

                <ul
                  className={`relative mt-8 flex-1 space-y-3 border-t pt-7 ${
                    plan.highlight ? 'border-[rgba(255,243,230,0.18)]' : 'border-[rgba(26,18,11,0.08)]'
                  }`}
                >
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                          plan.highlight
                            ? 'bg-[rgba(255,243,230,0.14)] text-[#fff6ea]'
                            : 'bg-[rgba(14,159,138,0.14)] text-[#0b7a69]'
                        }`}
                      >
                        <IconCheck />
                      </span>
                      <span className={plan.highlight ? 'text-[#efe7da]' : 'text-[#1a120b]'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.to}
                  className={`relative mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[12px] px-6 text-center text-sm font-semibold transition ${
                    plan.highlight
                      ? 'bg-[#fff9f2] text-[#1a120b] hover:bg-white'
                      : 'mk-btn mk-btn-primary'
                  }`}
                >
                  {plan.cta}
                  <IconArrowRight />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="mk-section bg-[#fffdf9] py-16">
        <div className="container-page">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[22px] border border-[rgba(26,18,11,0.08)] bg-white shadow-[0_30px_70px_-36px_rgba(48,16,64,0.42)]">
            <div className="border-b border-[rgba(26,18,11,0.08)] px-6 py-5">
              <MkKicker>Compare</MkKicker>
              <h2 className="mk-display mt-3 text-xl sm:text-2xl">Feature comparison</h2>
              <p className="mt-1 text-sm text-[#6c5c50]">See exactly what you get on Free vs Pro.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="bg-[#fff7ec]">
                  <tr>
                    <th scope="col" className="px-5 py-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a7767]">
                        Feature
                      </span>
                    </th>
                    <th scope="col" className="px-5 py-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a7767]">
                        Free
                      </span>
                    </th>
                    <th scope="col" className="px-5 py-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#e8420f]">
                        Pro
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,18,11,0.08)]">
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="transition-colors duration-150 hover:bg-[#fff7ec]">
                      <th scope="row" className="px-5 py-3.5 font-medium text-[#1a120b]">
                        {row.feature}
                      </th>
                      <td className="px-5 py-3.5 text-[#6c5c50]">{row.free}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#1a120b]">
                        <span className="inline-flex items-center gap-2">
                          {row.pro === 'Yes' && (
                            <span className="text-[#0e9f8a]">
                              <IconCheck />
                            </span>
                          )}
                          {row.pro}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mk-section bg-[#fffdf9] py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <MkKicker>FAQs</MkKicker>
            <h2 className="mk-display mt-4 text-[2rem] sm:text-[2.5rem]">Creator-focused FAQ</h2>
            <p className="mt-2 text-sm text-[#6c5c50]">Quick answers before you get started.</p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <LandingFAQ />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div
          className="relative overflow-hidden rounded-[28px] px-6 py-12 text-center text-[#fff6ea] sm:px-12 sm:py-16"
          style={{ backgroundImage: 'var(--mk-grad-ink)' }}
        >
          <div aria-hidden="true" className="mk-orb -left-20 top-0 h-[22rem] w-[22rem] bg-[rgba(232,66,15,0.55)]" />
          <div aria-hidden="true" className="mk-orb -right-16 bottom-0 h-[20rem] w-[20rem] bg-[rgba(123,63,228,0.5)]" />
          <div className="relative">
            <MkKicker dark>Get started</MkKicker>
            <h2 className="mk-display mx-auto mt-5 max-w-2xl text-[2.2rem] leading-[1.02] text-[#fff6ea] sm:text-[3.1rem]">
              Ready to grow your creator brand?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#d9c3ad]">
              Create your free BLACKFRAM page and share it in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <MkButton href={`${APP_URL}/register`} variant="light" arrow>
                Create your page — free
              </MkButton>
              <MkButton to="/features" variant="outlineLight">
                See all features
              </MkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
