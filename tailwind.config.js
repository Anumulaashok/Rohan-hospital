/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#7B1123', 600: '#8B1528', 700: '#6A0E1E', 800: '#560B18' },
        rose: { tint: '#FFF5F5', line: '#F6DADF' },
        wa: { DEFAULT: '#25D366', dark: '#1DA851' },
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.04), 0 8px 24px -12px rgba(123,17,35,.18)',
      },
    },
  },
  plugins: [],
};
