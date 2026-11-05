import { useLocation } from 'react-router-dom';
import { MkKicker } from '../../components/marketing/MarketingKit';

interface Section {
  heading?: string;
  body: string[];
}

interface Doc {
  title: string;
  intro: string;
  sections: Section[];
}

const DOCS: Record<string, Doc> = {
  '/privacy': {
    title: 'Privacy policy',
    intro:
      'This is a demonstration product. This policy explains, plainly, what a production BLACKFRAM would collect and why.',
    sections: [
      { heading: 'What we collect', body: ['Account email and a securely hashed password (we never store your password in plain text).', 'The profile content you enter: name, bio, links and products.', 'Basic usage counts, such as how many times your public page was viewed and which links were clicked.'] },
      { heading: 'How we use it', body: ['To run your creator page and show your analytics to you.', 'We do not sell your personal data.'] },
      { heading: 'Cookies', body: ['A single session cookie is used to keep you logged in. It is httpOnly and SameSite.', 'A small preference value remembers your chosen language.'] },
      { heading: 'Your choices', body: ['You can edit or delete your content at any time.', 'You can ask for your account to be removed.'] },
      { heading: 'Contact', body: ['For privacy questions once deployed, use the contact page.'] },
    ],
  },
  '/terms': {
    title: 'Terms of use',
    intro: 'Plain-language terms for using this demonstration of BLACKFRAM.',
    sections: [
      { heading: 'Your account', body: ['You are responsible for the content you publish and for keeping your password safe.', 'Do not use the service to share unlawful, harmful or misleading content.'] },
      { heading: 'Content', body: ['You keep ownership of everything you upload.', 'You grant us only the permission needed to display your page.'] },
      { heading: 'Payments', body: ['BLACKFRAM does not process payments. Any UPI id you display is your own and transactions happen directly between you and your buyer.'] },
      { heading: 'Availability', body: ['Offered as-is, without warranty.'] },
      { heading: 'Changes', body: ['A production version would give notice before these terms change.'] },
    ],
  },
  '/about': {
    title: 'About BLACKFRAM',
    intro:
      'BLACKFRAM (पहचान / ಗುರುತು) means “identity”. We built it as an original product so creators can have one clean, fast page for their whole presence.',
    sections: [
      { heading: 'Why we built it', body: ['Creators here juggle Instagram, YouTube, WhatsApp and a shop, and share a messy list of links.', 'BLACKFRAM puts those in one page that loads fast on a phone and on a slow connection.'] },
      { heading: 'Made for creators', body: ['Prices in rupees, WhatsApp first, UPI for payments, and a workspace in English, हिंदी and ಕನ್ನಡ.', 'Low-bandwidth friendly: small pages, no heavy scripts.'] },
      { heading: 'How this build was made', body: ['It is an independent implementation. No code, assets, copy or trademarks from any other product were copied or reused.'] },
    ],
  },
  '/contact': {
    title: 'Contact',
    intro: 'We would love to hear from you.',
    sections: [
      { heading: 'Support', body: ['For help with your page, email support@blackfram.example (a placeholder for this build).'] },
      { heading: 'Sales', body: ['For the Pro plan and bulk plans, email sales@blackfram.example.'] },
      { heading: 'Press & partnerships', body: ['Reach the team at hello@blackfram.example.'] },
      { heading: 'WhatsApp', body: ['Once you have a page, the WhatsApp button on it is the fastest way for your visitors to reach you.'] },
    ],
  },
};

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function StaticPage() {
  const { pathname } = useLocation();
  const doc = DOCS[pathname] ?? DOCS['/about'];
  const contents = doc.sections.filter((s) => s.heading);

  return (
    <div className="mk-root overflow-x-hidden">
      {/* HERO BAND */}
      <section className="mk-section mk-mesh mk-noise">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-grid-bg opacity-50" />
        <div aria-hidden="true" className="mk-orb -left-24 top-0 h-[20rem] w-[20rem] bg-[rgba(255,176,31,0.4)]" />
        <div aria-hidden="true" className="mk-orb -right-20 bottom-0 h-[18rem] w-[18rem] bg-[rgba(123,63,228,0.25)]" />

        <div className="container-page relative py-14 sm:py-20">
          <MkKicker>Legal &amp; company</MkKicker>
          <h1 className="mk-display mt-5 text-[2.4rem] sm:text-[3.4rem] lg:text-[4rem]">
            {doc.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#5d4c40] sm:text-lg">
            {doc.intro}
          </p>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
          {/* Contents rail */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7767]">
              On this page
            </p>
            <ul className="mt-4 space-y-2.5 border-l border-[rgba(26,18,11,0.1)] pl-4">
              {contents.map((s) => (
                <li key={s.heading}>
                  <a
                    href={`#${slug(s.heading as string)}`}
                    className="text-[13px] leading-snug text-[#6c5c50] transition-colors hover:text-[#e8420f]"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Document */}
          <div className="min-w-0">
            <div className="space-y-10">
              {doc.sections.map((s, i) => (
                <section
                  key={i}
                  id={s.heading ? slug(s.heading) : undefined}
                  className="scroll-mt-28 border-t border-[rgba(26,18,11,0.08)] pt-7"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] tabular-nums tracking-[0.12em] text-[#a89d8e]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.heading && (
                      <h2 className="mk-display text-xl sm:text-2xl">{s.heading}</h2>
                    )}
                  </div>
                  <div className="mt-3 space-y-3 pl-0 text-[15px] leading-relaxed text-[#6c5c50] sm:pl-8">
                    {s.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-12 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[12px] border border-[rgba(26,18,11,0.08)] bg-white px-4 py-3 text-xs text-[#6c5c50]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e8420f]" aria-hidden="true" />
              Last updated {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
