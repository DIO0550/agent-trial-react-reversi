import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Board, createEmptyBoardState, createInitialBoardState } from './board';

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

  it('配置可能な場所が正しく表示されること', () => {
    const boardState = createEmptyBoardState();
    // いくつかのセルを配置可能にする
    boardState[1][2] = { color: 'none', canPlace: true };
    boardState[3][4] = { color: 'none', canPlace: true };

    render(<Board boardState={boardState} />);

    // 配置可能なセルに適切な表示がされていることを確認
    const placeable1 = screen
      .getByTestId('cell-1-2')
      .querySelector('[data-testid="disc-none-can-place"]');
    const placeable2 = screen
      .getByTestId('cell-3-4')
      .querySelector('[data-testid="disc-none-can-place"]');

    expect(placeable1).toBeInTheDocument();
    expect(placeable2).toBeInTheDocument();
  });

  it('8x8以外のボードサイズでエラーメッセージが表示されること', () => {
    // 7x8の不正なボード
    const invalidBoard = Array(7)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({
            color: 'none' as const,
            canPlace: false,
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
