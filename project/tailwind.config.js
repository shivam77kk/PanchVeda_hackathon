/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0f9f0',
          100: '#dcf4dc',
          200: '#bde8bd',
          300: '#91d891',
          400: '#5fc05f',
          500: '#2E7D32',
          600: '#2E7D32',
          700: '#1b5e1f',
          800: '#184e1b',
          900: '#164118',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
};