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
      rotate: {
        'y-180': 'rotateY(180deg)',
        'x-180': 'rotateX(180deg)',
      },
      // 3D石ひっくり返しアニメーション用の設定
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        // ディスクを90度まで回転させるアニメーション
        flipHalfY: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(90deg)' },
        },
        // ディスクを90度から180度まで回転させるアニメーション
        flipSecondHalfY: {
          '0%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        // X軸でディスクを90度まで回転させるアニメーション
        flipHalfX: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(90deg)' },
        },
        // X軸でディスクを90度から180度まで回転させるアニメーション
        flipSecondHalfX: {
          '0%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(180deg)' },
        },
      },
      animation: {
        flip: 'flip 0.6s ease-in-out forwards',
        // 最初の半回転（表面が見えなくなるまで）
        'flip-half-y': 'flipHalfY 0.25s ease-in-out forwards',
        // 後半の半回転（裏面が見えるように）
        'flip-second-half-y': 'flipSecondHalfY 0.25s ease-in-out forwards',
        // X軸での最初の半回転
        'flip-half-x': 'flipHalfX 0.25s ease-in-out forwards',
        // X軸での後半の半回転
        'flip-second-half-x': 'flipSecondHalfX 0.25s ease-in-out forwards',
      },
      // 3D効果のためのパースペクティブ設定
      perspective: {
        500: '500px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective': {
          perspective: '1000px',
        },
      });
    },
  ],
};
