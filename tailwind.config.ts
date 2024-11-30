import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        
      },
      colors: {
        primary: "#EBF5DF",   // Light greenish
        secondary: "#BAD4AA", // Soft green
        accent: "#D4D4AA",    // Pale yellow
        dark: "#3F4531",      // Dark olive
        muted: "#696047",     // Muted brownish
      },
    },
  },
  plugins: [],
} satisfies Config;
