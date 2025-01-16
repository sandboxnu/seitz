// custom colors
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFEDE9",
          100: "#FF8773",
          200: "#EB4D38",
          300: "#C82610",
          400: "#8C1B0B",
          500: "#5C0D02",
        },
        accent: {
          100: "#A4804A",
          300: "#7B6038",
          500: "#524025",
        },
        neutral: {
          10: "#FFFDFD",
          50: "#FAF7F6",
          100: "#F1EDEA",
          200: "#E6DFD8",
          300: "#C3BCB5",
          400: "#8A7F75",
          500: "#594F47",
          600: "#1F1915",
        },
      },
    },
  },
  plugins: [],
};
