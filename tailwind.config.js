/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50:  '#fff0f6',
          100: '#ffe4ef',
          200: '#ffc9df',
          300: '#ffa0c5',
          400: '#ff69b4',
          500: '#ff3d9a',
          600: '#f0177a',
          700: '#d10d64',
          800: '#ad0f54',
          900: '#8f1148',
        },
        pastel: {
          pink:   '#FFB6C1',
          lavender: '#E6D5F5',
          peach:  '#FFDAB9',
          mint:   '#C8F5E0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(255,105,180,0.15)',
        'card-hover': '0 8px 30px -2px rgba(255,105,180,0.30)',
      },
    },
  },
  plugins: [],
}

