import { renderHook, act } from '@testing-library/react';
import { useDiscs } from './use-discs';
import { DiscColor } from '../types/reversi-types';

describe('useDiscs', () => {
  it('初期状態で中央に4つの石が配置されていること', () => {
    const { result } = renderHook(() => useDiscs());

    const board = result.current.discs;
    const middle = Math.floor(board.length / 2) - 1;

    expect(board[middle][middle]).toBe(DiscColor.WHITE);
    expect(board[middle][middle + 1]).toBe(DiscColor.BLACK);
    expect(board[middle + 1][middle]).toBe(DiscColor.BLACK);
    expect(board[middle + 1][middle + 1]).toBe(DiscColor.WHITE);
  });

  it('初期状態で黒の手番から開始すること', () => {
    const { result } = renderHook(() => useDiscs());
    expect(result.current.currentTurn).toBe(DiscColor.BLACK);
  });

  it('置ける位置に石を置くと、間の石がひっくり返ること', () => {
    const { result } = renderHook(() => useDiscs());

    act(() => {
      result.current.placeDisc({ row: 3, col: 2 });
    });

    // 新しく置いた石と、ひっくり返った石を確認
    expect(result.current.discs[3][2]).toBe(DiscColor.BLACK);
    expect(result.current.discs[3][3]).toBe(DiscColor.BLACK);
  });

  it('石を置いた後、手番が切り替わること', () => {
    const { result } = renderHook(() => useDiscs());

    act(() => {
      result.current.placeDisc({ row: 3, col: 2 });
    });

    expect(result.current.currentTurn).toBe(DiscColor.WHITE);
  });

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
