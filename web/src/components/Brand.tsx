import { Link } from 'react-router-dom';
import { IconLogo } from './icons';
import { cx } from './ui';

/**
 * The single brand lockup used by marketing, auth and the app shell.
 * A seal (the mark set in ink) + a Fraunces wordmark. One shape, everywhere.
 */
export function Brand({
  to = '/',
  size = 'md',
  tone = 'ink',
  className,
}: {
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ink' | 'accent';
  className?: string;
}) {
  const dimensions = size === 'sm' ? 26 : size === 'lg' ? 38 : 32;
  return (
    <Link
      to={to}
      aria-label="BLACKFRAM home"
      className={cx('group inline-flex items-center gap-2.5 text-text', className)}
    >
      <span
        className={cx(
          'grid shrink-0 place-items-center rounded-full transition-transform duration-300 ease-smooth group-hover:-rotate-6',
          tone === 'ink'
            ? 'bg-ink text-on-ink'
            : 'border border-accent-line bg-accent-soft text-accent',
        )}
        style={{ width: dimensions, height: dimensions, fontSize: dimensions * 0.55 }}
      >
        <IconLogo />
      </span>
      <span
        className={cx(
          'font-display leading-none tracking-[-0.03em]',
          size === 'sm' && 'text-[1.1rem]',
          size === 'md' && 'text-[1.35rem]',
          size === 'lg' && 'text-[1.6rem]',
        )}
      >
        BLACKFRAM
      </span>
    </Link>
  );
}
