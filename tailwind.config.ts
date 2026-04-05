import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        char: "#1a1208",
        ember: "#c94b0a",
        flame: "#e8702a",
        cream: "#f5efe6",
        smoke: "#9e9289",
        gold: "#d4a84b",
      },
      fontFamily: {
        head: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
