import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          purple: "#8B5CF6",
          emerald: "#10B981",
          gold: "#F59E0B",
          violet: "#7C3AED"
        }
      },
      boxShadow: {
        glow: "0 0 10px rgba(139, 92, 246, 0.6)"
      },
      animation: {
        pulseFast: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate")
  ]
};

export default config;
