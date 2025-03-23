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
      // 3D石ひっくり返しアニメーション用の設定
      animation: {
        'flip-x': 'flipX 0.6s ease-in-out',
        'flip-y': 'flipY 0.6s ease-in-out',
      },
      keyframes: {
        flipX: {
          '0%, 100%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(180deg)' },
        },
        flipY: {
          '0%, 100%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
        },
      },
      // 3D効果のためのパースペクティブ設定
      perspective: {
        500: '500px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.perspective-500': {
          perspective: '500px',
          transformStyle: 'preserve-3d',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
