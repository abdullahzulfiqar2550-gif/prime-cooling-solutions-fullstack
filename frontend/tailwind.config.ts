import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F172A",
          cyan: "#06B6D4",
          teal: "#14B8A6",
          amber: "#F59E0B",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
        'glow-teal': '0 0 15px -3px rgba(20, 184, 166, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
