import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { Field, Input } from '../../components/ui';
import { MkKicker } from '../../components/marketing/MarketingKit';
import { IconArrowRight } from '../../components/icons';
import { ApiError, api } from '../../lib/api';

const CATEGORIES = [
  { value: 'account', label: 'Account & login problems' },
  { value: 'customization', label: 'Creator page & customization' },
  { value: 'billing', label: 'Payments & billing' },
  { value: 'technical', label: 'Technical issues' },
  { value: 'sales', label: 'Sales & Pro plans' },
  { value: 'press', label: 'Press & partnerships' },
  { value: 'other', label: 'Other' },
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('other');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [creatorPageUrl, setCreatorPageUrl] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setFieldErrors({});
    setBusy(true);
    try {
      await api.post('/api/contact', {
        name,
        email,
        category,
        subject,
        message,
        creatorPageUrl: creatorPageUrl.trim() || undefined,
        website,
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        const fe: Record<string, string> = {};
        for (const d of err.details ?? []) {
          const key = d.path.split('.').pop() ?? d.path;
          if (!fe[key]) fe[key] = d.message;
        }
        setFieldErrors(fe);
        if (Object.keys(fe).length === 0) {
          setError(err.status === 0 || err.status >= 500 ? 'Something went wrong. Please try again.' : err.message);
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mk-root overflow-x-hidden">
      <section className="mk-section mk-mesh mk-noise">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 mk-grid-bg opacity-60" />
        <div aria-hidden="true" className="mk-orb -left-24 top-0 h-[22rem] w-[22rem] bg-[rgba(255,176,31,0.4)]" />
        <div aria-hidden="true" className="mk-orb -right-20 bottom-0 h-[20rem] w-[20rem] bg-[rgba(123,63,228,0.25)]" />
        <div className="container-page relative py-14 sm:py-20">
          <MkKicker>Contact</MkKicker>
          <h1 className="mk-display mt-5 text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem]">Let's talk.</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#5d4c40] sm:text-lg">
            Have a question, need help with your creator page, or interested in working with us? We'd
            love to hear from you.
          </p>
        </div>
      </section>

      <section className="mk-section bg-[#fffdf9] py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <div className="mk-card p-6 sm:p-8">
            {success ? (
              <div role="status" className="space-y-4">
                <h2 className="mk-display text-2xl">Message received.</h2>
                <p className="text-[#5d4c40]">
                  Thank you for contacting BLACKFRAM. We've received your message and our team will
                  review it. We'll get back to you using the email you provided.
                </p>
                <Link to="/" className="mk-btn mk-btn-ghost">Back to home</Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                {error && (
                  <div role="alert" className="rounded-[10px] border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger">
                    {error}
                  </div>
                )}

                {/* honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name" error={fieldErrors.name} required>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
                  </Field>
                  <Field label="Email address" htmlFor="email" error={fieldErrors.email} required>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Contact reason" htmlFor="category" error={fieldErrors.category} required>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-11 w-full rounded-[10px] border border-border bg-elevated px-3 text-sm text-text"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Subject" htmlFor="subject" error={fieldErrors.subject} required>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required maxLength={200} />
                  </Field>
                </div>

                <Field label="Message" htmlFor="message" error={fieldErrors.message} required>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={6}
                    className="w-full rounded-[10px] border border-border bg-elevated px-3 py-2.5 text-sm text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  />
                </Field>

                <Field label="Creator page URL (optional)" htmlFor="creatorPageUrl" error={fieldErrors.creatorPageUrl} hint="If you have a BLACKFRAM page, paste the link.">
                  <Input id="creatorPageUrl" value={creatorPageUrl} onChange={(e) => setCreatorPageUrl(e.target.value)} placeholder="https://app.blackfram.com/u/yourname" />
                </Field>

                <button
                  type="submit"
                  disabled={busy}
                  className="mk-btn mk-btn-primary group"
                >
                  {busy ? 'Sending…' : 'Send message'}
                  <span className="text-[15px] transition-transform duration-200 group-hover:translate-x-0.5">
                    <IconArrowRight />
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="mk-card p-6">
              <MkKicker>Other ways to reach us</MkKicker>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a7767]">Support</p>
                  <a href="mailto:support@blackfram.com" className="text-sm font-semibold text-[#1a120b] hover:text-[#e8420f]">
                    support@blackfram.com
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a7767]">Sales</p>
                  <a href="mailto:sales@blackfram.com" className="text-sm font-semibold text-[#1a120b] hover:text-[#e8420f]">
                    sales@blackfram.com
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a7767]">Press &amp; partnerships</p>
                  <a href="mailto:hello@blackfram.com" className="text-sm font-semibold text-[#1a120b] hover:text-[#e8420f]">
                    hello@blackfram.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mk-card p-6">
              <MkKicker>Helpful links</MkKicker>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="/privacy" className="font-semibold text-[#1a120b] hover:text-[#e8420f]">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="font-semibold text-[#1a120b] hover:text-[#e8420f]">
                    Terms of service
                  </Link>
                </li>
                <li>
                  <Link to="/" className="font-semibold text-[#1a120b] hover:text-[#e8420f]">
                    Back to home
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
