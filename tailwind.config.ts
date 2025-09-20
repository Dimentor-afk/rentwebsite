import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--color-base)",
        mist: "var(--color-mist)",
        accent: "var(--color-accent)",
        heading: "var(--color-heading)",
        body: "var(--color-body)",
      },
      backdropBlur: {
        glass: "10px",
      },
      fontFamily: {
        sans: ["'Inter var'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 20px 40px -20px rgba(36, 59, 85, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
