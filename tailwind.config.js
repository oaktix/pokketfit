/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#E37210', // Pokketfit Energy Orange
          600: '#D25E09',
          700: '#A44407',
          800: '#83340A',
          900: '#6C2B0B',
        },
        obsidian: {
          950: '#070504', // Darkest Lacquer
          900: '#0A0705', // PRD near-black
          850: '#110D0A',
          800: '#16120E', // Surface dark
          700: '#1E1914', // Card dark
          600: '#2A241E',
          500: '#3F3730',
        },
        paper: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F4EFEA', // Card light
          300: '#E7E6E5', // PRD white/off-white
          400: '#D5D1CB',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.07)',
        'card-light': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
