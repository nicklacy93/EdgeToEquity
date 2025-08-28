const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
  extend: {
  colors: {
    gray: colors.zinc,
    primary: '#8B5CF6',   // Electric Purple
    accent: '#10B981',    // Emerald Green
    warning: '#F59E0B',   // Amber Gold
    danger: '#F43F5E',    // Red Alert
  },
  animation: {
    'spin-slow': 'spin 6s linear infinite',
    'pulse-fade': 'pulse-fade 2.5s ease-in-out infinite',
  },
  keyframes: {
    'pulse-fade': {
      '0%, 100%': { opacity: '0.4' },
      '50%': { opacity: '1' },
    },
  },
},
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
}
