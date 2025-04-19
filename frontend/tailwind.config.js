/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'soccer-field': "url('/src/assets/images/soccer-field-bg.jpg')",
      },
    },
  },
  plugins: [],
}
