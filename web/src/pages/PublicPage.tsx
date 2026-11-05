import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicView, type PublicViewData } from '../components/PublicView';
import { Brand } from '../components/Brand';
import { Spinner } from '../components/ui';
import { ApiError, api } from '../lib/api';
import type { Layout, ThemeKey } from '../lib/types';

interface ServerPage {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  whatsappNumber: string | null;
  upiId: string | null;
  upiQrUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  theme: { themeKey: ThemeKey; layout: Layout; accent: string };
  appearance: unknown;
  links: { id: string; title: string; url: string; icon: string; position: number }[];
  products: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    pricePaise: number | null;
    currency: string;
    destinationUrl: string;
    position: number;
  }[];
}

const viewed = new Set<string>();

export default function PublicPage() {
  const { username = '' } = useParams();
  const [page, setPage] = useState<ServerPage | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'missing'>('loading');
  const requestedRef = useRef(false);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api
      .get<{ page: ServerPage }>(`/api/public/${encodeURIComponent(username)}`)
      .then((res) => {
        if (!active) return;
        setPage(res.page);
        setStatus('ok');
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 404) setStatus('missing');
        else setStatus('missing');
      });
    return () => {
      active = false;
    };
  }, [username]);

  // Record a single view per page-load (StrictMode double-invoke safe).
  useEffect(() => {
    if (status !== 'ok' || requestedRef.current) return;
    requestedRef.current = true;
    const key = username.toLowerCase();
    if (viewed.has(key)) return;
    viewed.add(key);
    void api
      .post(`/api/public/${encodeURIComponent(username)}/view`, { referrer: document.referrer || undefined })
      .catch(() => undefined);
  }, [status, username]);

  useEffect(() => {
    if (page?.metaTitle) document.title = page.metaTitle;
    else if (page?.displayName) document.title = `${page.displayName} · BLACKFRAM`;
    return () => {
      document.title = 'BLACKFRAM';
    };
  }, [page]);

  function trackClick(linkId: string) {
    if (linkId === 'whatsapp') return;
    void api.post(`/api/public/${encodeURIComponent(username)}/click/${linkId}`).catch(() => undefined);
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-7 bg-bg px-6">
        <Brand to="/" size="md" />
        <div className="flex items-center gap-2.5 rounded-full border border-border bg-elevated px-4 py-2 text-xs font-medium text-text-muted shadow-card">
          <Spinner className="h-3.5 w-3.5" />
          Opening page…
          <span className="sr-only">Loading page</span>
        </div>
      </div>
    );
  }

  if (status === 'missing' || !page) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 py-16 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-[#dccdb8] to-transparent"
        />
        <Brand to="/" size="md" />
        <p className="label-mono mt-10">Page not found</p>
        <h1 className="mt-3 max-w-lg font-display text-[2rem] leading-[1.1] tracking-[-0.025em] text-text sm:text-[2.6rem]">
          This page is not available
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
          The creator may have unpublished it, or the link is wrong. Check the address and try
          again.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-[10px] border border-transparent bg-accent px-5 text-sm font-semibold text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(23,19,15,0.18)] transition-colors hover:bg-accent-hover"
        >
          Go to BLACKFRAM
        </Link>
        <p className="mt-8 text-xs text-text-muted">
          Want an address of your own?{' '}
          <Link to="/register" className="font-semibold text-accent underline-offset-4 hover:underline">
            Create your page — free
          </Link>
        </p>
      </div>
    );
  }

  const data: PublicViewData = {
    displayName: page.displayName,
    bio: page.bio,
    avatarUrl: page.avatarUrl,
    whatsappNumber: page.whatsappNumber,
    upiId: page.upiId,
    upiQrUrl: page.upiQrUrl,
    theme: page.theme,
    appearance: page.appearance,
    links: page.links.map((l) => ({ id: l.id, title: l.title, url: l.url, icon: l.icon })),
    products: page.products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      pricePaise: p.pricePaise,
      currency: p.currency,
      destinationUrl: p.destinationUrl,
    })),
  };

  return <PublicView data={data} onLinkClick={trackClick} />;
}
