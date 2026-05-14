/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // InnoGym brand — constant across themes
        brand: {
          yellow: '#F5D90A',
          'yellow-soft': '#FFF59D',
          purple: '#8E7CD9',
          'purple-soft': '#B5A8E8',
          lavender: '#E8E2FA',
          lime: '#D2FB52',
        },
        // semantic tokens — driven by CSS vars, flip with the theme
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        hairline: 'rgb(var(--border) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.08)',
        glow: '0 0 0 1px rgb(245 217 10 / 0.25), 0 8px 32px -8px rgb(245 217 10 / 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
