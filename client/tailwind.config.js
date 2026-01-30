export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#080808',      // Obsidian
        surface: '#121214', // Card
        border: '#27272A',  // Subtle Border
        primary: '#5E6AD2', // Linear Blue (Professional)
        text: '#EEEEF0',
        muted: '#8A8A93',
        success: '#2EB88A',
        warning: '#E5B946',
        danger: '#E54D2E',
      },
      fontFamily: {
        sans: ['Rajdhani', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      fontSize: {
        'xxs': '10px',
      }
    },
  },
  plugins: [],
}
