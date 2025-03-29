/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // perspective クラスを追加
      perspective: {
        none: 'none',
        500: '500px',
        1000: '1000px',
      },
      // backface-visibility を追加
      backfaceVisibility: {
        visible: 'visible',
        hidden: 'hidden',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.perspective-none': {
          perspective: 'none',
        },
        '.perspective-500': {
          perspective: '500px',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.backface-visible': {
          backfaceVisibility: 'visible',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
