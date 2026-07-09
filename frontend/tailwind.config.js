/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette matched from the Figma screenshots: pale mint header/footer,
        // deep forest green as the primary accent, near-black body text.
        mint: '#E9F2EC',
        forest: '#1E3A2C',
        'forest-dark': '#16291E',
        ink: '#1A1A1A',
        tag: '#DCEDE1',
        border: '#E3EAE5',
        // kept for backward compatibility with any leftover references
        cream: '#E9F2EC',
        navy: '#1A1A1A',
        gold: '#1E3A2C',
        accent: '#1E3A2C',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
