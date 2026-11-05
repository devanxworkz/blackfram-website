/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        elevated: 'var(--color-elevated)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        'border-input': 'var(--color-border-input)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        'on-ink': 'var(--color-on-ink)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-soft': 'var(--color-accent-soft)',
        'accent-line': 'var(--color-accent-line)',
        'on-accent': 'var(--color-on-accent)',
        gold: 'var(--color-gold)',
        danger: 'var(--color-danger)',
        'danger-soft': 'var(--color-danger-soft)',
        'on-danger': 'var(--color-on-danger)',
        success: 'var(--color-success)',
        'success-soft': 'var(--color-success-soft)',
        warning: 'var(--color-warning)',
        'warning-soft': 'var(--color-warning-soft)',
        info: 'var(--color-info)',
        'info-soft': 'var(--color-info-soft)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
        pop: 'var(--shadow-pop)',
        focus: 'var(--shadow-focus)',
      },
      maxWidth: {
        content: 'var(--content-width)',
      },
      transitionTimingFunction: {
        smooth: 'var(--ease-smooth)',
      },
      keyframes: {
        'page-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'drawer-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'none' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'page-in': 'page-in var(--dur-layout) var(--ease-smooth) both',
        'drawer-in': 'drawer-in var(--dur-layout) var(--ease-smooth) both',
        'toast-in': 'toast-in var(--dur-layout) var(--ease-smooth) both',
      },
    },
  },
  plugins: [],
};
