/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ajusta esto según la estructura de tu proyecto
    "./public/index.html", // Incluye todos los archivos relevantes
  ],

  theme: {
    extend: {
      colors: {
        //button Sate gradient
        'default': 'linear-gradient(to right, from-PrimaryGreen, to-DarkGreen)',

        //Colores de Fondo
        BackgroundBlue: '#10111B',
        BackgroundBlueDark: '#1C1C27',
        BackgroundGray: '#1E1F26',
        gradientBlue: '#010852',
        gradientGreen: '#84D7B0',
        GreenDark: '#45715C',

        //Colores de Texto
        PrimaryGreen: '#84D7B0',
        DarkGreen: '#5F9580',

      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #010852, #84D7B0, #45715C)',
        'button-default': 'linear-gradient(to right, #84D7B0 , #609C80, #45715C)',
        'button-hover': 'linear-gradient(to right, #45715C, #609C80, #84D7B0)',
        'button-pressed': 'linear-gradient(to right, #000DAB, #00BBFF)',
      },
    },
    fontFamily: {
      'sans': ['Poppins', 'sans-serif'],
    },



  },
  plugins: [],
};
