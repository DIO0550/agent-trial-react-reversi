import { renderHook, act } from '@testing-library/react';
import { useDiscs } from './use-discs';
import { DiscColor } from '../utils/disc-color';

describe('useDiscs', () => {
  it('初期状態で中央に4つの石が配置されていること', () => {
    const { result } = renderHook(() => useDiscs());

    const board = result.current.board;
    const middle = Math.floor(board.length / 2) - 1;

    expect(board[middle][middle].discColor).toBe(DiscColor.Type.WHITE);
    expect(board[middle][middle + 1].discColor).toBe(DiscColor.Type.BLACK);
    expect(board[middle + 1][middle].discColor).toBe(DiscColor.Type.BLACK);
    expect(board[middle + 1][middle + 1].discColor).toBe(DiscColor.Type.WHITE);
  });

  it('初期状態で黒の手番から開始すること', () => {
    const { result } = renderHook(() => useDiscs());
    expect(result.current.currentTurn).toBe(DiscColor.Type.BLACK);
  });

  it.todo('置ける位置に石を置くと、間の石がひっくり返ること');

  it.todo('石を置いた後、手番が切り替わること');

  it('置けない位置に石を置こうとするとエラーが発生すること', () => {
    const { result } = renderHook(() => useDiscs());

    expect(() => {
      act(() => {
        result.current.placeDisc({ row: 0, col: 0 });
      });
    }).toThrow('この位置には石を置けません');
  });

  it('初期状態で正しい位置に石を置けること', () => {
    const { result } = renderHook(() => useDiscs());

    const expectedPositions = [
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 4 },
    ];

    const actualPositions = result.current.placeablePositions();

    expect(actualPositions).toHaveLength(expectedPositions.length);
    expectedPositions.forEach((pos) => {
      expect(actualPositions).toContainEqual(pos);
    });
  });
});
