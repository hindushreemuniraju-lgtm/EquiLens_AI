/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: {
          DEFAULT: '#0A0A0A',
          900: '#0A0A0A',
          800: '#121217',
          700: '#181822',
          600: '#22222F',
          500: '#2E2E3E',
          border: '#252536',
          muted: '#8A8A9E'
        },
        cerulean: {
          DEFAULT: '#007BA7',
          glow: 'rgba(0, 123, 167, 0.35)',
          light: '#2898C4',
          dark: '#005D80',
          hover: '#0090C4'
        },
        rose: {
          DEFAULT: '#FF2D95',
          glow: 'rgba(255, 45, 149, 0.35)',
          light: '#FF59AC',
          dark: '#C81B70',
          hover: '#FF45A3'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        'cerulean-glow': '0 0 20px -3px rgba(0, 123, 167, 0.4)',
        'rose-glow': '0 0 20px -3px rgba(255, 45, 149, 0.4)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.7)'
      }
    },
  },
  plugins: [],
}
