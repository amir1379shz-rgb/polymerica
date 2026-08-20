/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./polymarket-2.html",
    "./index.html",
    "./*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "-apple-system", "Segoe UI", "Tahoma", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#1B3358",
          dark: "#12233F",
        },
        gold: {
          DEFAULT: "#8A6220",
          strong: "#A9812F",
          bright: "#C9A94F",
        },
        cream: {
          DEFAULT: "#FAF6EC",
          deep: "#F3ECD9",
        },
      },
    },
  },
  plugins: [],
};
