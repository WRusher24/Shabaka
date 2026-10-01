import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f1",
          100: "#d7ecdf",
          200: "#b0d9c2",
          300: "#7fbfa0",
          400: "#4da17c",
          500: "#2c8560",
          600: "#1e6a4c",
          700: "#18553e",
          800: "#144433",
          900: "#0f382a",
          950: "#081f18",
        },
        sand: {
          50: "#faf8f4",
          100: "#f3eee5",
          200: "#e5dcc9",
          300: "#d3c4a6",
          400: "#bfa883",
          500: "#a98f68",
          600: "#8f7452",
          700: "#745d44",
          800: "#5f4d3b",
          900: "#4f4133",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
