/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",   // 👈 include your pages folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
