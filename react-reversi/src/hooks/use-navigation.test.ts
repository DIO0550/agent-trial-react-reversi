import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNavigation } from '@/hooks/use-navigation';

// useRouterとそのpushメソッドのモック
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// windowのreloadメソッドのモック
const originalWindowLocation = window.location;
const mockReload = vi.fn();

describe('useNavigation', () => {
  // テスト前の準備
  beforeEach(() => {
    // pushメソッドのモックをリセット
    mockPush.mockReset();

    // windowオブジェクトのモックをリセット
    mockReload.mockReset();

    // windowオブジェクトのreloadメソッドをモック
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockReload },
    });
  });

  // テスト後の後片付け
  afterEach(() => {
    // windowオブジェクトを元に戻す
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalWindowLocation,
    });
  });

  it('navigateToHomeが呼ばれると、ルートパスにナビゲートする', () => {
    // フックをレンダリング
    const { result } = renderHook(() => useNavigation());

    // navigateToHomeを実行
    result.current.navigateToHome();

    // useRouter().pushが正しいパスで呼ばれたことを確認
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('navigateToReversiGameが呼ばれると、正しいパラメータ付きのリバーシゲームパスにナビゲートする', () => {
    // フックをレンダリング
    const { result } = renderHook(() => useNavigation());

    // テスト用のパラメータ
    const cpuLevel = 'hard';
    const playerColor = 'black';

    // navigateToReversiGameを実行
    result.current.navigateToReversiGame(cpuLevel, playerColor);

    // useRouter().pushが正しいパスとクエリパラメータで呼ばれたことを確認
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(
      `/games/reversi?cpuLevel=${cpuLevel}&playerColor=${playerColor}`,
    );
  });

  it('reloadCurrentPageが呼ばれると、ページをリロードする', () => {
    // フックをレンダリング
    const { result } = renderHook(() => useNavigation());

    // reloadCurrentPageを実行
    result.current.reloadCurrentPage();

    // window.location.reloadが呼ばれたことを確認
    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});
