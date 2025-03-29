import type { Meta, StoryObj } from '@storybook/react';
import { FlipDisc } from './flip-disc';
import { useFlipDisks, FlipDirection } from './useFlipDisks';
import { useState, useEffect } from 'react';
import {
  DiscColor,
  BoardPosition,
} from '@/features/reversi/types/reversi-types';

/**
 * FlipDiscのアニメーションを表示するためのラッパーコンポーネント
 */
const FlipDiscAnimationWrapper = () => {
  const boardSize = 8;
  const [flipStates, flipDisks] = useFlipDisks({ initalBoardSize: boardSize });
  const [currentColor, setCurrentColor] = useState<DiscColor>(DiscColor.BLACK);
  const [position, setPosition] = useState<BoardPosition>({ row: 3, col: 3 });

  // 方向ごとのアニメーション実行関数
  const flipLeftToRight = () => {
    flipDisks({
      type: FlipDirection.LEFT_TO_RIGHT,
      payload: {
        position,
        diskColor: currentColor,
      },
    });
    // 色を切り替え
    setCurrentColor(
      currentColor === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK,
    );
  };

  const flipRightToLeft = () => {
    flipDisks({
      type: FlipDirection.RIGHT_TO_LEFT,
      payload: {
        position,
        diskColor: currentColor,
      },
    });
    setCurrentColor(
      currentColor === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK,
    );
  };

  const flipTopToBottom = () => {
    flipDisks({
      type: FlipDirection.TOP_TO_BOTTOM,
      payload: {
        position,
        diskColor: currentColor,
      },
    });
    setCurrentColor(
      currentColor === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK,
    );
  };

  const flipBottomToTop = () => {
    flipDisks({
      type: FlipDirection.BOTTOM_TO_TOP,
      payload: {
        position,
        diskColor: currentColor,
      },
    });
    setCurrentColor(
      currentColor === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK,
    );
  };

  // 現在のflipStateを取得
  const currentFlipState = flipStates[position.row][position.col];

  // flipStateが未定義の場合は初期状態を設定
  const blackRotateX = currentFlipState?.front.x || 0;
  const blackRotateY = currentFlipState?.front.y || 0;
  const whiteRotateX = currentFlipState?.back.x || 0;
  const whiteRotateY = currentFlipState?.back.y || 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold">石の反転アニメーション</h2>
      <div className="w-24 h-24">
        <FlipDisc
          color={currentColor}
          blackRotateX={blackRotateX}
          blackRotateY={blackRotateY}
          whiteRotateX={whiteRotateX}
          whiteRotateY={whiteRotateY}
          isFlipping={true}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={flipLeftToRight}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          左から右
        </button>
        <button
          onClick={flipRightToLeft}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          右から左
        </button>
        <button
          onClick={flipTopToBottom}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          上から下
        </button>
        <button
          onClick={flipBottomToTop}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          下から上
        </button>
      </div>
      <div className="mt-4 text-sm">
        現在の色: <span className="font-bold">{currentColor}</span>
      </div>
    </div>
  );
};

/**
 * 自動アニメーションを行うラッパーコンポーネント
 */
const AutoFlipDiscAnimation = () => {
  const boardSize = 8;
  const [flipStates, flipDisks] = useFlipDisks({ initalBoardSize: boardSize });
  const [currentColor, setCurrentColor] = useState<DiscColor>(DiscColor.BLACK);
  const [position] = useState<BoardPosition>({ row: 3, col: 3 });

  useEffect(() => {
    const directions = [
      FlipDirection.LEFT_TO_RIGHT,
      FlipDirection.TOP_TO_BOTTOM,
      FlipDirection.RIGHT_TO_LEFT,
      FlipDirection.BOTTOM_TO_TOP,
    ];

    let currentIndex = 0;

    const intervalId = setInterval(() => {
      flipDisks({
        type: directions[currentIndex],
        payload: {
          position,
          diskColor: currentColor,
        },
      });

      setCurrentColor(
        currentColor === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK,
      );

      currentIndex = (currentIndex + 1) % directions.length;
    }, 1500);

    return () => clearInterval(intervalId);
  }, [currentColor, flipDisks, position]);

  // 現在のflipStateを取得
  const currentFlipState = flipStates[position.row][position.col];

  // flipStateが未定義の場合は初期状態を設定
  const blackRotateX = currentFlipState?.front.x || 0;
  const blackRotateY = currentFlipState?.front.y || 0;
  const whiteRotateX = currentFlipState?.back.x || 0;
  const whiteRotateY = currentFlipState?.back.y || 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold">自動アニメーション</h2>
      <div className="w-24 h-24">
        <FlipDisc
          color={currentColor}
          blackRotateX={blackRotateX}
          blackRotateY={blackRotateY}
          whiteRotateX={whiteRotateX}
          whiteRotateY={whiteRotateY}
          isFlipping={true}
        />
      </div>
      <div className="mt-4 text-sm">1.5秒ごとに自動的に反転します</div>
    </div>
  );
};

const meta = {
  title: 'Components/Elements/Discs/FlipDiscAnimation',
  component: FlipDiscAnimationWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FlipDiscAnimationWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AutoAnimation: Story = {
  render: () => <AutoFlipDiscAnimation />,
};
