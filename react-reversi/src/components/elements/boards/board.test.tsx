import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // fireEvent の代わりに userEvent をインポート
import { describe, expect, it, vi } from 'vitest';
import { Board } from './board';
import {
  Board as ReversiBoard,
  DiscColor,
} from '@/features/reversi/types/reversi-types';
import { CanPlace } from '@/features/reversi/utils/can-place'; // canPlace をインポート

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
            black: { xDeg: 0, yDeg: 0 },
            white: { xDeg: 180, yDeg: 0 },
          },
          canPlace: CanPlace.createEmpty(),
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
      black: { xDeg: 180, yDeg: 0 },
      white: { xDeg: 0, yDeg: 0 },
    },
    canPlace: CanPlace.createEmpty(),
  };
  board[3][4] = {
    discColor: DiscColor.BLACK,
    rotationState: {
      black: { xDeg: 0, yDeg: 0 },
      white: { xDeg: 180, yDeg: 0 },
    },
    canPlace: CanPlace.createEmpty(),
  };
  board[4][3] = {
    discColor: DiscColor.BLACK,
    rotationState: {
      black: { xDeg: 0, yDeg: 0 },
      white: { xDeg: 180, yDeg: 0 },
    },
    canPlace: CanPlace.createEmpty(),
  };
  board[4][4] = {
    discColor: DiscColor.WHITE,
    rotationState: {
      black: { xDeg: 180, yDeg: 0 },
      white: { xDeg: 0, yDeg: 0 },
    },
    canPlace: CanPlace.createEmpty(),
  };

  return board;
};

describe('Boardコンポーネント', () => {
  it('空のボードが正しくレンダリングされること', () => {
    render(
      <Board
        boardState={createEmptyBoardState()}
        currentTurn={DiscColor.BLACK}
      />,
    );
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
    render(
      <Board
        boardState={createInitialBoardState()}
        currentTurn={DiscColor.BLACK}
      />,
    );

    // 中央の4つのセルに石が配置されていることを確認
    const centerCells = [
      { row: 3, col: 3, expectedColor: DiscColor.WHITE },
      { row: 3, col: 4, expectedColor: DiscColor.BLACK },
      { row: 4, col: 3, expectedColor: DiscColor.BLACK },
      { row: 4, col: 4, expectedColor: DiscColor.WHITE },
    ];

    centerCells.forEach(({ row, col, expectedColor }) => {
      const cell = screen.getByTestId(`cell-${row}-${col}`);
      expect(cell).toBeInTheDocument();

      // セル内にcolor属性を持つ石があることを確認
      const disc = cell.querySelector(`[data-testid="disc-${expectedColor}"]`);
      expect(disc).toBeInTheDocument();
    });
  });

  it('セルをクリックしたときにonCellClickが呼ばれること', async () => {
    const handleCellClick = vi.fn();
    render(
      <Board
        boardState={createEmptyBoardState()}
        onCellClick={handleCellClick}
        currentTurn={DiscColor.BLACK}
      />,
    );

    // (2, 3)のセルをクリック
    const cell = screen.getByTestId('cell-2-3');
    await userEvent.click(cell);

    // ハンドラが適切な引数で呼び出されたことを確認
    expect(handleCellClick).toHaveBeenCalledTimes(1);
    expect(handleCellClick).toHaveBeenCalledWith(2, 3);
  });

  // 未実装のため一時的にスキップしていたテストのスキップを解除
  it('フリップ完了時にonFlipCompleteが呼ばれること', async () => {
    const handleFlipComplete = vi.fn();
    const boardStateWithDisc = createEmptyBoardState();
    // テスト対象のセルに石を置く
    boardStateWithDisc[2][3] = {
      ...boardStateWithDisc[2][3],
      discColor: DiscColor.BLACK, // 石の色を黒に設定
    };

    render(
      <Board
        boardState={boardStateWithDisc}
        onFlipComplete={handleFlipComplete}
        currentTurn={DiscColor.WHITE} // どちらでも良いが、明確にする
      />,
    );

    // (2,3)のセル内のFlipDisc要素を取得
    // FlipDiscコンポーネントのdata-testidは disc-${color} または disc-${color}-flipping
    // ここでは単純化のため、石が存在する前提で disc-black を探す
    const cell = screen.getByTestId('cell-2-3');
    // FlipDiscのルート要素は、Board内のdivの子要素として存在する
    // FlipDiscのdata-testidは `disc-${color}`
    const flipDiscElement = cell.querySelector('[data-testid="disc-1"]'); // DiscColor.BLACK は 1

    // FlipDisc要素が存在することを確認 (存在しない場合テストが失敗する)
    expect(flipDiscElement).toBeInTheDocument();

    // transitionendイベントを発火させて、onFlipCompleteをトリガー
    if (flipDiscElement) {
      // 要素が見つかった場合のみ実行
      fireEvent.transitionEnd(flipDiscElement);
    }

    // onFlipCompleteが適切な引数で呼び出されたことを確認
    expect(handleFlipComplete).toHaveBeenCalledTimes(1);
    expect(handleFlipComplete).toHaveBeenCalledWith(2, 3);
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
              black: { xDeg: 0, yDeg: 0 },
              white: { xDeg: 180, yDeg: 0 },
            },
            canPlace: CanPlace.createEmpty(),
          })),
      );

    render(
      <Board
        boardState={invalidBoard as ReversiBoard}
        currentTurn={DiscColor.BLACK}
      />,
    );

    // エラーメッセージが表示されていることを確認
    const errorMessage = screen.getByText('Error: Board must be 8x8');
    expect(errorMessage).toBeInTheDocument();
  });

  it('適切なアクセシビリティ属性が設定されること', () => {
    render(
      <Board
        boardState={createEmptyBoardState()}
        currentTurn={DiscColor.BLACK}
      />,
    );

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
