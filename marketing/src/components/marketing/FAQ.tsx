export function FAQ() {
  const faqs = [
    {
      q: 'Is BLACKFRAM free to use?',
      a: 'Yes. You can create your page for free. Check the pricing page for details on plans.',
    },
    {
      q: 'Can I sell products on BLACKFRAM?',
      a: 'You can showcase products on your page. For payments, you can share your UPI details or direct customers to WhatsApp depending on your setup.',
    },
    {
      q: 'Do I need a website?',
      a: 'No. BLACKFRAM gives you a beautiful link-in-bio page you can share in your Instagram bio.',
    },
    {
      q: 'Will this work on mobile?',
      a: 'Yes. Your page is mobile-first and looks great on any device.',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-[16px] border border-border bg-elevated shadow-card">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-border last:border-b-0">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface sm:px-6 sm:py-5">
            <span className="font-display text-[1.0625rem] leading-snug tracking-[-0.01em] text-text sm:text-lg">
              {f.q}
            </span>
            <span
              aria-hidden="true"
              className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-sm text-text-muted transition group-open:rotate-45 group-open:border-accent-line group-open:bg-accent-soft group-open:text-accent"
            >
              +
            </span>
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-text-muted sm:px-6 sm:pb-6">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
