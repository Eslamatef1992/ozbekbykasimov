/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette matched from the Figma screenshots: pale mint header/footer,
        // deep forest green as the primary accent, near-black body text.
        mint: '#E9F2EC',
        forest: '#294037',
        'forest-dark': '#1C2C26',
        ink: '#1A1A1A',
        tag: '#DCEDE1',
        border: '#E3EAE5',
        // kept for backward compatibility with any leftover references
        cream: '#E9F2EC',
        navy: '#1A1A1A',
        gold: '#294037',
        accent: '#294037',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
