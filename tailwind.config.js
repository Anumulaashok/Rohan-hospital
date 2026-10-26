/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,js}'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#6B0F24', 600: '#7E1430', 700: '#5A0C1E', 800: '#3F0815', 900: '#2A0510' },
        lotus: { DEFAULT: '#C8336A', soft: '#F6C6D7' },
        blush: { DEFAULT: '#FCEFF3', line: '#F1D3DE' },
        turmeric: '#E39B2D',
        ink: '#2A1A22',
        wa: { DEFAULT: '#25D366', dark: '#1DA851' },
      },
      fontFamily: {
        display: ['"Anek Latin"', 'system-ui', 'sans-serif'],
        telugu: ['"Anek Telugu"', '"Noto Sans Telugu"', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(42,26,34,.05), 0 12px 32px -16px rgba(107,15,36,.28)',
      },
      borderRadius: {
        arch: '999px 999px 28px 28px',
      },
    },
  },
  plugins: [],
};
