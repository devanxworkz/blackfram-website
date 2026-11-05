import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { Brand } from './Brand';
import { Avatar, Badge, IconButton, Input, cx } from './ui';
import {
  IconBag,
  IconCard,
  IconChart,
  IconClose,
  IconExternal,
  IconEye,
  IconFlag,
  IconGear,
  IconGlobe,
  IconHome,
  IconLink,
  IconLogout,
  IconMegaphone,
  IconMenu,
  IconPalette,
  IconSearch,
  IconShield,
  IconUser,
  IconUsers,
} from './icons';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Overview',
  admin: 'Overview',
  profile: 'Profile',
  links: 'Links',
  products: 'Products',
  appearance: 'Appearance',
  preview: 'Preview & publish',
  account: 'Account',
  creators: 'Creators & users',
  storefronts: 'Storefronts',
  themes: 'Templates & themes',
  content: 'Products & content',
  moderation: 'Reports & moderation',
  billing: 'Plans & billing',
  analytics: 'Analytics',
  announcements: 'Announcements',
  roles: 'Roles & audit',
  settings: 'Settings',
};

export function AppShell({ variant = 'creator' }: { variant?: 'creator' | 'admin' }) {
  const { user, logout, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [adminQuery, setAdminQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const publicHref = profile ? `/u/${profile.username}` : '/';

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const creatorNav: NavGroup[] = [
    {
      label: 'Your page',
      items: [
        { to: '/dashboard', label: 'Overview', icon: <IconHome />, end: true },
        { to: '/dashboard/profile', label: 'Profile', icon: <IconUser /> },
        { to: '/dashboard/links', label: 'Links', icon: <IconLink /> },
        { to: '/dashboard/products', label: 'Products', icon: <IconBag /> },
      ],
    },
    {
      label: 'Design & publish',
      items: [
        { to: '/dashboard/appearance', label: 'Appearance', icon: <IconPalette /> },
        { to: '/dashboard/preview', label: 'Preview & publish', icon: <IconEye /> },
      ],
    },
    {
      label: 'Settings',
      items: [{ to: '/dashboard/account', label: 'Account', icon: <IconGear /> }],
    },
  ];

  const adminNav: NavGroup[] = [
    {
      label: 'Platform',
      items: [
        { to: '/admin', label: 'Overview', icon: <IconHome />, end: true },
        { to: '/admin/creators', label: 'Creators & users', icon: <IconUsers /> },
        { to: '/admin/storefronts', label: 'Storefronts', icon: <IconGlobe /> },
        { to: '/admin/themes', label: 'Templates & themes', icon: <IconPalette /> },
      ],
    },
    {
      label: 'Trust & safety',
      items: [
        { to: '/admin/content', label: 'Products & content', icon: <IconBag /> },
        { to: '/admin/moderation', label: 'Reports & moderation', icon: <IconFlag /> },
      ],
    },
    {
      label: 'Growth',
      items: [
        { to: '/admin/billing', label: 'Plans & billing', icon: <IconCard /> },
        { to: '/admin/analytics', label: 'Analytics', icon: <IconChart /> },
        { to: '/admin/announcements', label: 'Announcements', icon: <IconMegaphone /> },
      ],
    },
    {
      label: 'System',
      items: [
        { to: '/admin/roles', label: 'Roles & audit', icon: <IconShield /> },
        { to: '/admin/settings', label: 'Settings', icon: <IconGear /> },
      ],
    },
  ];

  const isAdmin = variant === 'admin' && user?.role === 'admin';
  const groups = isAdmin ? adminNav : creatorNav;

  const segments = location.pathname.split('/').filter(Boolean);
  const pageLabel = SEGMENT_LABELS[segments[segments.length - 1] ?? ''] ?? 'Overview';
  const sectionLabel = isAdmin ? 'Admin console' : 'Creator studio';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function onAdminSearch(e: FormEvent) {
    e.preventDefault();
    const q = adminQuery.trim();
    navigate(q ? `/admin/creators?q=${encodeURIComponent(q)}` : '/admin/creators');
  }

  const navItem = (item: NavItem) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cx(
          'group relative flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-colors duration-150',
          isActive
            ? 'bg-accent-soft text-accent'
            : 'text-text-muted hover:bg-surface hover:text-text',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={cx(
              'absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent transition-opacity duration-150',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
          <span
            className={cx(
              'grid h-6 w-6 shrink-0 place-items-center text-[16px] transition-colors',
              isActive ? 'text-accent' : 'text-[#9b9083] group-hover:text-text',
            )}
          >
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col bg-elevated">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
        <Brand size="sm" />
        {isAdmin && (
          <span className="ml-auto">
            <Badge tone="info">Admin</Badge>
          </span>
        )}
      </div>

      <nav
        aria-label={isAdmin ? 'Admin' : 'Dashboard'}
        className="flex-1 overflow-y-auto px-3 py-5"
      >
        {groups.map((group, index) => (
          <div key={group.label} className={cx(index > 0 && 'mt-6')}>
            <p className="label-mono px-2.5 pb-2 text-[10px]">{group.label}</p>
            <div className="space-y-0.5">{group.items.map(navItem)}</div>
          </div>
        ))}

        {user?.role === 'admin' && !isAdmin && (
          <div className="mt-6">
            <p className="label-mono px-2.5 pb-2 text-[10px]">Platform</p>
            <NavLink
              to="/admin"
              className="group relative flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center text-[16px] text-[#9b9083] group-hover:text-text">
                <IconShield />
              </span>
              Admin console
            </NavLink>
          </div>
        )}
      </nav>

      <div className="shrink-0 space-y-3 border-t border-border p-3">
        <a
          href={publicHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-2 rounded-[9px] border border-border bg-bg px-3 py-2.5 text-xs font-semibold text-text transition-colors hover:border-border-strong"
        >
          <span className="flex items-center gap-2">
            <span className="text-[15px] text-text-muted">
              <IconGlobe />
            </span>
            Your page
          </span>
          {profile?.isPublished ? (
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-success"
              title="Published"
            />
          ) : (
            <Badge dot>Draft</Badge>
          )}
        </a>

        <div className="flex items-center gap-2.5 rounded-[9px] px-1 py-0.5">
          <Avatar
            src={profile?.avatarUrl}
            name={profile?.displayName ?? user?.email ?? 'You'}
            size={32}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight text-text">
              {profile?.displayName ?? 'Creator'}
            </p>
            <p className="truncate text-[11px] leading-tight text-text-muted" title={user?.email}>
              {user?.email}
            </p>
          </div>
          <IconButton label="Log out" size="sm" onClick={handleLogout}>
            <IconLogout />
          </IconButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] border-r border-border lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[rgba(23,19,15,0.45)] backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="animate-drawer-in absolute inset-y-0 left-0 w-[17.5rem] max-w-[86vw] border-r border-border shadow-pop">
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-[rgba(251,248,243,0.85)] px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <IconButton label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen((v) => !v)} className="lg:hidden">
            {open ? <IconClose /> : <IconMenu />}
          </IconButton>

          <div className="min-w-0">
            <p className="label-mono hidden text-[9px] sm:block">{sectionLabel}</p>
            <p className="truncate text-[13px] font-semibold leading-tight text-text sm:mt-1">
              {pageLabel}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {isAdmin ? (
              <form onSubmit={onAdminSearch} className="relative hidden sm:block" role="search">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-text-muted">
                  <IconSearch />
                </span>
                <Input
                  type="search"
                  aria-label="Search creators"
                  placeholder="Search creators…"
                  value={adminQuery}
                  onChange={(e) => setAdminQuery(e.target.value)}
                  className="h-9 w-52 py-0 pl-8 text-xs xl:w-64"
                />
              </form>
            ) : (
              <>
                <span className="hidden sm:inline-flex">
                  {profile?.isPublished ? (
                    <Badge tone="success" dot>
                      Published
                    </Badge>
                  ) : (
                    <Badge dot>Draft</Badge>
                  )}
                </span>
                <a
                  href={publicHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-[7px] border border-border bg-elevated px-2.5 text-xs font-semibold text-text transition-colors hover:border-border-strong"
                >
                  <span className="text-[14px] text-text-muted">
                    <IconExternal />
                  </span>
                  <span className="hidden sm:inline">View page</span>
                </a>
              </>
            )}
          </div>
        </header>

        <main
          className={cx(
            'mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10',
            isAdmin ? 'max-w-[1320px]' : 'max-w-[1080px]',
          )}
        >
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
