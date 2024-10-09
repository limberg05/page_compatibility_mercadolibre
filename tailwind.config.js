/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Asegúrate de que incluya tus archivos de componentes
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}', // Incluye los estilos de NextUI
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
  darkMode: 'class',
  plugins: [nextui({ addCommonColors: true })],
};
