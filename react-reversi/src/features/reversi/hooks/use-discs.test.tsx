import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDiscs } from './use-discs';
import { DiscColor } from '../types/reversi-types';

describe('useDiscsフック', () => {
  it('初期状態では中央に4つの石が配置されている', () => {
    const { result } = renderHook(() => useDiscs());

    const { discs } = result.current;

    // 盤面上の石の総数が4つであることを確認
    expect(Object.keys(discs).length).toBe(4);

    // 中央4マスに初期配置があることを確認
    expect(discs['3,3']).toBe(DiscColor.WHITE);
    expect(discs['3,4']).toBe(DiscColor.BLACK);
    expect(discs['4,3']).toBe(DiscColor.BLACK);
    expect(discs['4,4']).toBe(DiscColor.WHITE);
  });

  it('初期状態では黒の手番である', () => {
    const { result } = renderHook(() => useDiscs());

    const { currentTurn } = result.current;

    expect(currentTurn).toBe(DiscColor.BLACK);
  });

  it('石を置ける場所を取得できる', () => {
    const { result } = renderHook(() => useDiscs());

    const { placeablePositions: getPlaceablePositions } = result.current;
    const placeablePositions = getPlaceablePositions();

    // 初期状態での黒の置ける場所は4箇所
    expect(placeablePositions.length).toBe(4);

    // 具体的な置ける位置を確認
    expect(placeablePositions).toEqual(
      expect.arrayContaining([
        { row: 2, col: 3 },
        { row: 3, col: 2 },
        { row: 4, col: 5 },
        { row: 5, col: 4 },
      ]),
    );
  });

  it('石を指定の位置に置くことができる', () => {
    const { result } = renderHook(() => useDiscs());

    // (2,3)に黒を置く（初期状態では置ける場所の一つ）
    act(() => {
      result.current.placeDisc({ row: 2, col: 3 });
    });

    // 石が置かれたことを確認
    expect(result.current.discs['2,3']).toBe(DiscColor.BLACK);

    // 挟まれた石が裏返ることを確認（(3,3)が黒になる）
    expect(result.current.discs['3,3']).toBe(DiscColor.BLACK);

    // ターンが切り替わったことを確認
    expect(result.current.currentTurn).toBe(DiscColor.WHITE);
  });

  it('置けない場所に石を置こうとするとエラーになる', () => {
    const { result } = renderHook(() => useDiscs());

    // (0,0)は初期状態では置けない場所
    expect(() => {
      act(() => {
        result.current.placeDisc({ row: 0, col: 0 });
      });
    }).toThrow('この位置には石を置けません');
  });
});
