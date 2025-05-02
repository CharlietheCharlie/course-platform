import type { Config } from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
          sm: "1500px"
      }
    },
    extend: {
      colors:{
        background: "var(--background)",
        foreground: "var(--foreground)"
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'), containerQueries
  ],
} satisfies Config;
