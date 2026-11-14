import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#51247A",
          primaryDark: "#371555",
          primaryLight: "#6B35A0",
          secondary: "#A78BFA",
          secondaryDark: "#8B5CF6",
          secondaryLight: "#C4B5FD",
          bgLight: "#F8F5FC",
          text: "#252033",
          border: "#E9DFF7",
          muted: "#665E75",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Plus Jakarta Sans", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

