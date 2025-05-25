/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        jersey: ['"Jersey 10"', 'cursive'], // Quote the font name if it has spaces
      },
    },
  },
  plugins: [],
};
