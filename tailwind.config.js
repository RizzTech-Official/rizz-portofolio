/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#00b4d8', // Vibrant Cyan-Blue
          600: '#0096c7',
          700: '#0077b6',
          800: '#023e8a',
          900: '#03045e',
        },
        // Custom dark mode palette - Lighter, cleaner
        dark: {
          bg: '#0f0f0f',         // Slightly lighter than pure black for depth
          card: '#18181b',       // Zinc-900 equivalent
          surface: '#27272a',    // Zinc-800 equivalent
          border: '#3f3f46',     // Zinc-700
          text: '#f4f4f5',       // Zinc-100
          muted: '#a1a1aa',      // Zinc-400
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
