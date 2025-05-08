/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spring-green': '#00FF7F',
        'lime-green': '#32CD32',
        'spotify-green': '#1DB954',
        'dark-green': '#006400',
        'forest-green': '#158C46',
        'light-gray': '#E5E5E5',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 20s infinite linear',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}