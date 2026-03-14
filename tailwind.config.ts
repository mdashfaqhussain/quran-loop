import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        arabic: ["var(--font-amiri)", "serif"],
      },
      colors: {
        parchment: {
          50:  "#fdfbf5",
          100: "#f7f2e5",
          200: "#ede5cc",
          300: "#ddd4b0",
          400: "#c9bc8e",
        },
        emerald: {
          DEFAULT: "#1D9E75",
          dark:    "#14795a",
          light:   "#d4f0e4",
          muted:   "#0a6b44",
        },
        ink: {
          DEFAULT: "#1a1a18",
          muted:   "#5a5a55",
          faint:   "#9a9890",
        },
      },
      animation: {
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
        "fade-in":   "fadeIn 0.4s ease forwards",
        "slide-up":  "slideUp 0.35s ease forwards",
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { opacity: "1",   transform: "scale(1)" },
          "50%":     { opacity: "0.3", transform: "scale(0.75)" },
        },
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
