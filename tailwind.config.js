/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grayMinimal: {
          50:  '#F5F5F5',
          100: '#E0E0E0',
          200: '#CFCFCF',
          300: '#B0B0B0',
          400: '#7A7A7A',
          500: '#5A5A5A',
          600: '#3A3A3A',
          700: '#2A2A2A',
          800: '#1F1F1F',
          900: '#121212',
        },
        accent: {
          DEFAULT: '#2A2A2A',
          hover:   '#121212',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}

