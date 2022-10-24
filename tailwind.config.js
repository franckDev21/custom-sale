/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : '#ac3265',
        secondary : '#77717e'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}