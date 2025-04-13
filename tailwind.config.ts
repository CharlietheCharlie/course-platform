import type { Config } from "tailwindcss";

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
  plugins: [],
} satisfies Config;
