import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#a8a8a8',
          400: '#888888',
          500: '#6b6b6b',
          600: '#525252',
          700: '#404040',
          800: '#2d2d2d',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        graphite: {
          50: '#fafafa',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#c8c8c8',
          400: '#a0a0a0',
          500: '#808080',
          600: '#666666',
          700: '#505050',
          800: '#3d3d3d',
          900: '#2a2a2a',
          950: '#151515',
        },
        accent: {
          navy: '#0d1b2a',
          teal: '#1b998b',
          turquoise: '#2ec4b6',
          orange: '#e87d0e',
          coral: '#ff6b6b',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      backgroundImage: {
        'geometric-pattern': "url('/branding/geometric-pattern.svg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;