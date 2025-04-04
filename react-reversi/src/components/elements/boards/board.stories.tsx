import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Board } from './board';
import { createEmptyBoardState, createInitialBoardState } from './board';
import { DiscColor } from '@/features/reversi/types/reversi-types';

/**
 * リバーシのボードを表示するコンポーネント
 */
const meta: Meta<typeof Board> = {
  title: 'Elements/Board',
  component: Board,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onCellClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Board>;

/**
 * 初期状態のボード
 */
export const Initial: Story = {
  args: {
    boardState: createInitialBoardState(),
    onCellClick: fn(),
  },
};

/**
 * 空のボード
 */
export const Empty: Story = {
  args: {
    boardState: createEmptyBoardState(),
    onCellClick: fn(),
  },
};

/**
 * 途中経過のボード
 */
export const InProgress: Story = {
  args: {
    boardState: (() => {
      const boardState = createInitialBoardState();
      // 追加の石を配置
      boardState[2][3] = {
        discColor: DiscColor.BLACK,
        rotationState: {
          blackRotateX: 0,
          blackRotateY: 0,
          whiteRotateX: 0,
          whiteRotateY: 0,
        },
      };
      boardState[2][4] = {
        discColor: DiscColor.BLACK,
        rotationState: {
          blackRotateX: 0,
          blackRotateY: 0,
          whiteRotateX: 0,
          whiteRotateY: 0,
        },
      };
      boardState[3][2] = {
        discColor: DiscColor.BLACK,
        rotationState: {
          blackRotateX: 0,
          blackRotateY: 0,
          whiteRotateX: 0,
          whiteRotateY: 0,
        },
      };
      boardState[4][2] = {
        discColor: DiscColor.BLACK,
        rotationState: {
          blackRotateX: 0,
          blackRotateY: 0,
          whiteRotateX: 0,
          whiteRotateY: 0,
        },
      };

      boardState[1][3] = {
        discColor: DiscColor.WHITE,
        rotationState: {
          blackRotateX: 0,
          blackRotateY: 0,
          whiteRotateX: 0,
          whiteRotateY: 0,
        },
      };
      boardState[3][5] = {
        discColor: DiscColor.WHITE,
        rotationState: {
          blackRotateX: 0,
          blackRotateY: 0,
          whiteRotateX: 0,
          whiteRotateY: 0,
        },
      };
      boardState[5][3] = {
        discColor: DiscColor.WHITE,
        rotationState: {
          blackRotateX: 0,
          blackRotateY: 0,
          whiteRotateX: 0,
          whiteRotateY: 0,
        },
      };

      // 配置可能な場所は無視（あとでcanPlace対応時に実装）
      return boardState;
    })(),
    onCellClick: fn(),
  },
};

/**
 * ゲーム終了時のボード
 */
export const GameOver: Story = {
  args: {
    boardState: (() => {
      // ゲーム終了時の盤面を作成（黒が大多数）
      const boardState = createEmptyBoardState();

      // ボードをほぼ黒で埋める
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          boardState[i][j] = {
            discColor: DiscColor.BLACK,
            rotationState: {
              blackRotateX: 0,
              blackRotateY: 0,
              whiteRotateX: 0,
              whiteRotateY: 0,
            },
          };
        }
      }

      // 一部を白にする
      const whitePositions = [
        [0, 0],
        [0, 7],
        [7, 0],
        [7, 7],
        [2, 2],
        [2, 5],
        [5, 2],
        [5, 5],
      ];

      whitePositions.forEach(([row, col]) => {
        boardState[row][col] = {
          discColor: DiscColor.WHITE,
          rotationState: {
            blackRotateX: 0,
            blackRotateY: 0,
            whiteRotateX: 0,
            whiteRotateY: 0,
          },
        };
      });

      return boardState;
    })(),
    onCellClick: fn(),
  },
};

/**
 * カスタムボードビルダー
 */
export const BoardBuilder: Story = {
  render: () => {
    const customBoard = createEmptyBoardState();

    // 5つの異なるパターンを作成
    const patterns = [
      { row: 1, col: 1, discColor: DiscColor.BLACK },
      { row: 1, col: 6, discColor: DiscColor.WHITE },
      { row: 6, col: 1, discColor: DiscColor.WHITE },
      { row: 6, col: 6, discColor: DiscColor.BLACK },
      { row: 3, col: 3, discColor: DiscColor.BLACK },
      { row: 3, col: 4, discColor: DiscColor.WHITE },
      { row: 4, col: 3, discColor: DiscColor.WHITE },
      { row: 4, col: 4, discColor: DiscColor.BLACK },
    ];

    // パターンを適用
    patterns.forEach(({ row, col, discColor }) => {
      customBoard[row][col] = {
        discColor,
        rotationState: {
          blackRotateX: 0,
          blackRotateY: 0,
          whiteRotateX: 0,
          whiteRotateY: 0,
        },
      };
    });

    return (
      <div className="flex flex-col gap-6">
        <h3 className="text-lg font-bold">カスタムボードパターン</h3>
        <Board boardState={customBoard} onCellClick={fn()} />
      </div>
    );
  },
};
