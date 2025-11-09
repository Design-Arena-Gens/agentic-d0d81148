import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#0b0f1a",
          800: "#111929",
          700: "#1a2736"
        },
        fog: {
          500: "#74808f",
          300: "#9aa4b1"
        }
      },
      fontFamily: {
        display: ["'Source Sans Pro'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        cinematic: "0 25px 80px rgba(12, 20, 32, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
