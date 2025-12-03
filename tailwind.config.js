/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Nossa fonte personalizada de Dinossauro
        dino: ['Bangers', 'system-ui'], 
        sans: ['Inter', 'system-ui'],
      }
    },
  },
  plugins: [],
}