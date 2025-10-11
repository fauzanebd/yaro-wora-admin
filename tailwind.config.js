/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        serif: ["Geist", "serif"],
        mono: ["Geist", "monospace"],
      },
    },
  },
  plugins: [],
};
