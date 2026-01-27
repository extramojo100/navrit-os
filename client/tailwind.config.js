/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cosmic: {
          DEFAULT: '#FF6B35',
          50: '#FFF2ED', 100: '#FFE4D9', 200: '#FFC9B3',
          300: '#FFAE8C', 400: '#FF8C5E', 500: '#FF6B35',
          600: '#E85A24', 700: '#CC4A17', 800: '#A63D13', 900: '#7F300F'
        },
        dark: {
          50: '#2A2A2A', 100: '#1F1F1F', 200: '#1A1A1A',
          300: '#151515', 400: '#121212', 500: '#0F0F0F'
        },
        gate: { green: '#22C55E', yellow: '#F59E0B', red: '#EF4444' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } }
      }
    }
  },
  plugins: []
}
