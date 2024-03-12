/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#C826101A",
          200: "#C8261040",
          300: "#C8261099",
          400: "#C82610FF",
          500: "#850B1F",
        },
        secondary: {
          100: "#D1BFA4",
          200: "#A4804A",
          300: "#524025",
        },
        neutral: {
          100: "FDFDFD",
          200: "#EFEDEA",
          300: "#D4CFCA",
          400: "#A99F97",
          500: "#4E443C",
          600: "#20170F",
        },
      },
    },
  },
  plugins: [],
};
