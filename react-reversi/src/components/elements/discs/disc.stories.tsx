import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Disc, DiscColor } from './disc';

/**
 * リバーシの石を表示するコンポーネント
 */
const meta: Meta<typeof Disc> = {
  title: 'Elements/Disc',
  component: Disc,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['black', 'white', 'none'],
      description: 'ディスクの色',
    },
    onClick: { action: 'clicked' },
    canPlace: {
      control: { type: 'boolean' },
      description: '置くことが可能かどうか（ヒント表示用）',
    },
    isFlipping: {
      control: { type: 'boolean' },
      description: '裏返しのアニメーション中かどうか',
    },
    flipAxis: {
      control: { type: 'select' },
      options: ['x', 'y'],
      description: 'アニメーションの回転軸',
    },
    previousColor: {
      control: { type: 'select' },
      options: ['black', 'white', 'none'],
      description: 'ひっくり返る前の色（アニメーション用）',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '40px', height: '40px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Disc>;

/**
 * 黒の石
 */
export const Black: Story = {
  args: {
    color: 'black',
    canPlace: false,
  },
};

/**
 * 白の石
 */
export const White: Story = {
  args: {
    color: 'white',
    canPlace: false,
  },
};

/**
 * 空の石
 */
export const None: Story = {
  args: {
    color: 'none',
    canPlace: false,
  },
};

/**
 * 配置可能な状態（ヒント表示）
 */
export const CanPlace: Story = {
  args: {
    color: 'none',
    canPlace: true,
  },
};

/**
 * 静的なひっくり返しアニメーション表示
 */
export const Flipping: Story = {
  args: {
    color: 'black',
    previousColor: 'white',
    isFlipping: true,
    flipAxis: 'y',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '40px', height: '40px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Y軸でひっくり返るアニメーション
 */
export const FlippingYAxis = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [color, setColor] = useState<DiscColor>('black');
  const [previousColor, setPreviousColor] = useState<DiscColor>('white');

  // クリックで裏返すアニメーションをトリガー
  const handleFlip = () => {
    if (isFlipping) return;

    setPreviousColor(color);
    setIsFlipping(true);

    // アニメーションの途中（50%地点）で色を変更
    setTimeout(() => {
      setColor(color === 'black' ? 'white' : 'black');
    }, 250);

    // アニメーション終了時にフラグをリセット
    setTimeout(() => {
      setIsFlipping(false);
    }, 500);
  };

  return (
    <div
      style={{ width: '60px', height: '60px', cursor: 'pointer' }}
      onClick={handleFlip}
    >
      <Disc
        color={color}
        isFlipping={isFlipping}
        flipAxis="y"
        previousColor={previousColor}
      />
    </div>
  );
};

/**
 * X軸でひっくり返るアニメーション
 */
export const FlippingXAxis = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [color, setColor] = useState<DiscColor>('white');
  const [previousColor, setPreviousColor] = useState<DiscColor>('black');

  // クリックで裏返すアニメーションをトリガー
  const handleFlip = () => {
    if (isFlipping) return;

    setPreviousColor(color);
    setIsFlipping(true);

    // アニメーションの途中（50%地点）で色を変更
    setTimeout(() => {
      setColor(color === 'black' ? 'white' : 'black');
    }, 250);

    // アニメーション終了時にフラグをリセット
    setTimeout(() => {
      setIsFlipping(false);
    }, 500);
  };

  return (
    <div
      style={{ width: '60px', height: '60px', cursor: 'pointer' }}
      onClick={handleFlip}
    >
      <Disc
        color={color}
        isFlipping={isFlipping}
        flipAxis="x"
        previousColor={previousColor}
      />
    </div>
  );
};

/**
 * 自動的にひっくり返るデモ
 */
export const AutoFlippingDemo = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [color, setColor] = useState<DiscColor>('black');
  const [previousColor, setPreviousColor] = useState<DiscColor>('white');
  const [flipAxis, setFlipAxis] = useState<'x' | 'y'>('y');

  // 定期的に自動で裏返すためのエフェクト
  useEffect(() => {
    const flipInterval = setInterval(() => {
      if (isFlipping) return;

      setPreviousColor(color);
      setIsFlipping(true);

      // アニメーションの途中（50%地点）で色を変更
      setTimeout(() => {
        setColor((prev) => (prev === 'black' ? 'white' : 'black'));
      }, 250);

      // アニメーション終了時にフラグをリセットと軸を変更
      setTimeout(() => {
        setIsFlipping(false);
        setFlipAxis((prev) => (prev === 'x' ? 'y' : 'x'));
      }, 500);
    }, 2000);

    return () => clearInterval(flipInterval);
  }, [isFlipping, color]);

  return (
    <div style={{ width: '60px', height: '60px' }}>
      <Disc
        color={color}
        isFlipping={isFlipping}
        flipAxis={flipAxis}
        previousColor={previousColor}
      />
    </div>
  );
};
