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
          50: "#F1EDEA",
          100: "#E6DFD8",
          200: "#C3BCB5",
          300: "#8A7F75",
          400: "#594F47",
          500: "#1F1915",
        },
      },
    },
  },
  plugins: [],
};
