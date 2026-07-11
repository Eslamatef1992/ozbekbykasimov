/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Modern SaaS admin palette built around the restaurant's forest-green
        // brand color. `navy`/`gold`/`accent` are kept as aliases so existing
        // pages that reference them don't break while we restyle.
        forest: '#1F3D33',
        'forest-dark': '#14281F',
        'forest-light': '#E8F1EC',
        surface: '#F6F8F7',
        ink: '#101614',
        muted: '#6B7A73',
        line: '#E6ECE9',
        danger: '#C0392B',
        warning: '#B7791F',
        success: '#1F8A57',
        navy: '#101614',
        gold: '#1F3D33',
        accent: '#1F3D33',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 22, 20, 0.04), 0 1px 12px rgba(16, 22, 20, 0.05)',
        pop: '0 8px 24px rgba(16, 22, 20, 0.10)',
      },
    },
  },
  plugins: [],
};
