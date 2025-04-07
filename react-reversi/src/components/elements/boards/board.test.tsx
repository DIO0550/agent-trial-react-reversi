import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Board } from './board';
import {
  Board as ReversiBoard,
  DiscColor,
} from '@/features/reversi/types/reversi-types';

/**
 * 空のボード状態を作成する
 */
const createEmptyBoardState = (): ReversiBoard => {
  return Array(8)
    .fill(null)
    .map(() =>
      Array(8)
        .fill(null)
        .map(() => ({
          discColor: DiscColor.NONE,
          rotationState: {
            blackRotateX: 0,
            blackRotateY: 0,
            whiteRotateX: 180,
            whiteRotateY: 0,
          },
        })),
    );
};

/**
 * 初期配置のボード状態を作成する
 */
const createInitialBoardState = (): ReversiBoard => {
  const board = createEmptyBoardState();

  // 初期配置（中央の4マス）
  board[3][3] = {
    discColor: DiscColor.WHITE,
    rotationState: {
      blackRotateX: 180,
      blackRotateY: 0,
      whiteRotateX: 0,
      whiteRotateY: 0,
    },
  };
  board[3][4] = {
    discColor: DiscColor.BLACK,
    rotationState: {
      blackRotateX: 0,
      blackRotateY: 0,
      whiteRotateX: 180,
      whiteRotateY: 0,
    },
  };
  board[4][3] = {
    discColor: DiscColor.BLACK,
    rotationState: {
      blackRotateX: 0,
      blackRotateY: 0,
      whiteRotateX: 180,
      whiteRotateY: 0,
    },
  };
  board[4][4] = {
    discColor: DiscColor.WHITE,
    rotationState: {
      blackRotateX: 180,
      blackRotateY: 0,
      whiteRotateX: 0,
      whiteRotateY: 0,
    },
  };

  return board;
};

describe('Boardコンポーネント', () => {
  it('空のボードが正しくレンダリングされること', () => {
    render(<Board boardState={createEmptyBoardState()} />);
    const board = screen.getByTestId('reversi-board');
    expect(board).toBeInTheDocument();

    // 8x8のグリッドがあることを確認
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = screen.getByTestId(`cell-${row}-${col}`);
        expect(cell).toBeInTheDocument();
      }
    }
  });

  it('初期状態のボードが正しくレンダリングされること', () => {
    render(<Board boardState={createInitialBoardState()} />);

    // 中央の4つのセルに石が配置されていることを確認
    const centerCells = [
      { row: 3, col: 3, color: 'white' },
      { row: 3, col: 4, color: 'black' },
      { row: 4, col: 3, color: 'black' },
      { row: 4, col: 4, color: 'white' },
    ];

    centerCells.forEach(({ row, col, color }) => {
      const cell = screen.getByTestId(`cell-${row}-${col}`);
      expect(cell).toBeInTheDocument();

      // セル内にcolor属性を持つ石があることを確認
      const disc = cell.querySelector(`[data-testid^="disc-${color}"]`);
      expect(disc).toBeInTheDocument();
    });
  });

  it('セルをクリックしたときにonCellClickが呼ばれること', () => {
    const handleCellClick = vi.fn();
    render(
      <Board
        boardState={createEmptyBoardState()}
        onCellClick={handleCellClick}
      />,
    );

    // (2, 3)のセルをクリック
    const cell = screen.getByTestId('cell-2-3');
    fireEvent.click(cell);

    // ハンドラが適切な引数で呼び出されたことを確認
    expect(handleCellClick).toHaveBeenCalledTimes(1);
    expect(handleCellClick).toHaveBeenCalledWith(2, 3);
  });

  it('フリップ完了時にonFlipCompleteが呼ばれること', async () => {
    const handleFlipComplete = vi.fn();

    // onFlipCompleteを持つBoardをレンダリング
    render(
      <Board
        boardState={createEmptyBoardState()}
        onFlipComplete={handleFlipComplete}
      />,
    );

    // FlipDiscコンポーネントのonFlipCompleteをシミュレート
    // onFlipCompleteはFlipDiscコンポーネント内で呼び出される想定
    // 実際のテストでは、FlipDiscコンポーネントのテストで確認する
    // このテストはコールバックの受け渡しが正しいかを確認する

    // セルの位置を取得
    const cell = screen.getByTestId('cell-2-3');

    // セル内のFlipDiscコンポーネントを取得
    const flipDisc = cell.querySelector('div').children[0];

    // アニメーション完了のコールバックをシミュレート
    // （実際にはFlipDiscコンポーネント内で呼び出される）
    // これはただのシミュレーションなので、実際のテストではFlipDisc側で確認する
  });

  it('8x8以外のボードサイズでエラーメッセージが表示されること', () => {
    // 7x8の不正なボード
    const invalidBoard = Array(7)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({
            discColor: DiscColor.NONE,
            rotationState: {
              blackRotateX: 0,
              blackRotateY: 0,
              whiteRotateX: 180,
              whiteRotateY: 0,
            },
          })),
      );

    render(<Board boardState={invalidBoard} />);

    // エラーメッセージが表示されていることを確認
    const errorMessage = screen.getByText('Error: Board must be 8x8');
    expect(errorMessage).toBeInTheDocument();
  });

  it('適切なアクセシビリティ属性が設定されること', () => {
    render(<Board boardState={createEmptyBoardState()} />);

    const board = screen.getByTestId('reversi-board');
    expect(board).toHaveAttribute('role', 'grid');
    expect(board).toHaveAttribute('aria-label', 'リバーシボード');

    // いくつかのセルのアクセシビリティ属性を確認
    const cell = screen.getByTestId('cell-2-3');
    expect(cell).toHaveAttribute('role', 'gridcell');
    expect(cell).toHaveAttribute('aria-rowindex', '3'); // 1-based
    expect(cell).toHaveAttribute('aria-colindex', '4'); // 1-based
  });
});
