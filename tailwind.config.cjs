/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2bee79",
        "background-light": "#f6f8f7",
        "background-dark": "#102217",
        "card-dark": "#15251c",
        "input-dark": "#0c1811",
        "text-dark": "#1a202c",
        "text-light": "#ffffff",
      },
      fontFamily: {
        sans: ['Spline Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(43, 238, 121, 0.15)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
