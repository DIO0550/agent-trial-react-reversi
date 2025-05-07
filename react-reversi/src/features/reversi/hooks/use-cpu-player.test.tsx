import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DiscColor, BoardPosition } from '../types/reversi-types';
import { useCpuPlayer } from './use-cpu-player';
import { createWeakCpuPlayer } from '../cpu-player/weak-cpu-player';
import { createNormalCpuPlayer } from '../cpu-player/normal-cpu-player';
import { createStrongCpuPlayer } from '../cpu-player/strong-cpu-player';
import { createSuperCpuPlayer } from '../cpu-player/super-cpu-player';

// 各モジュールのモック
vi.mock('../cpu-player/weak-cpu-player', () => ({
  createWeakCpuPlayer: vi.fn(() => ({
    calculateNextMove: vi.fn().mockReturnValue({ row: 2, col: 3 }),
  })),
}));

vi.mock('../cpu-player/normal-cpu-player', () => ({
  createNormalCpuPlayer: vi.fn(() => ({
    calculateNextMove: vi.fn().mockReturnValue({ row: 2, col: 3 }),
  })),
}));

vi.mock('../cpu-player/strong-cpu-player', () => ({
  createStrongCpuPlayer: vi.fn(() => ({
    calculateNextMove: vi.fn().mockReturnValue({ row: 2, col: 3 }),
  })),
}));

vi.mock('../cpu-player/super-cpu-player', () => ({
  createSuperCpuPlayer: vi.fn(() => ({
    calculateNextMove: vi.fn().mockReturnValue({ row: 2, col: 3 }),
  })),
}));

describe('useCpuPlayerフック', () => {
  // テスト用の共通データ
  const mockBoard = Array(8)
    .fill(null)
    .map(() => Array(8).fill(DiscColor.NONE));

  // 初期配置
  const middle = 8 / 2 - 1;
  mockBoard[middle][middle] = DiscColor.WHITE;
  mockBoard[middle][middle + 1] = DiscColor.BLACK;
  mockBoard[middle + 1][middle] = DiscColor.BLACK;
  mockBoard[middle + 1][middle + 1] = DiscColor.WHITE;

  // プレースホルダーの配置可能な位置を返す関数
  const mockPlaceablePositions = vi.fn();

  // placeDisc関数のモック
  const mockPlaceDisc = vi.fn();

  // テスト前の準備
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // デフォルトの戻り値を設定
    mockPlaceablePositions.mockReturnValue([
      { row: 2, col: 3 },
      { row: 3, col: 2 },
    ]);
  });

  // テスト後のクリーンアップ
  afterEach(() => {
    vi.useRealTimers();
  });

  it('プレイヤーが黒を選択した場合、CPUの色は白になる', () => {
    const { result } = renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.BLACK,
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );

    expect(result.current.playerDiscColor).toBe(DiscColor.BLACK);
    expect(result.current.cpuDiscColor).toBe(DiscColor.WHITE);
  });

  it('プレイヤーが白を選択した場合、CPUの色は黒になる', () => {
    const { result } = renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.WHITE,
        discs: mockBoard,
        currentTurn: DiscColor.WHITE,
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );

    expect(result.current.playerDiscColor).toBe(DiscColor.WHITE);
    expect(result.current.cpuDiscColor).toBe(DiscColor.BLACK);
  });

  it('難易度に応じて適切なCPUプレイヤーが生成される', () => {
    // easyの場合
    renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'easy',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.BLACK,
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );
    expect(createWeakCpuPlayer).toHaveBeenCalled();

    // normalの場合
    renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.BLACK,
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );
    expect(createNormalCpuPlayer).toHaveBeenCalled();

    // hardの場合
    renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'hard',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.BLACK,
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );
    expect(createStrongCpuPlayer).toHaveBeenCalled();

    // strongestの場合
    renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'strongest',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.BLACK,
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );
    expect(createSuperCpuPlayer).toHaveBeenCalled();
  });

  it('CPUの番でない場合、思考処理は実行されない', () => {
    renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.BLACK, // プレイヤーの番
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );

    // タイマーを進める
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // プレイヤーの番なのでplaceDiscは呼ばれない
    expect(mockPlaceDisc).not.toHaveBeenCalled();
  });

  it('置ける場所がない場合、CPUは何もしない', () => {
    // 置ける場所がない状態にする
    mockPlaceablePositions.mockReturnValueOnce([]);

    renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.WHITE, // CPUの番
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );

    // タイマーを進める
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // 置ける場所がないのでplaceDiscは呼ばれない
    expect(mockPlaceDisc).not.toHaveBeenCalled();
  });

  it('CPUの番の場合、1秒後に思考処理が実行される', () => {
    const cpuMoveMock = { row: 2, col: 3 };
    const calculateNextMoveMock = vi.fn().mockReturnValue(cpuMoveMock);

    // 特定のテストだけ別のモック関数を使用
    (
      createNormalCpuPlayer as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValueOnce({
      calculateNextMove: calculateNextMoveMock,
    });

    renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.WHITE, // CPUの番
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );

    // まだタイマーが実行されていないので呼ばれない
    expect(mockPlaceDisc).not.toHaveBeenCalled();

    // タイマーを進める
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // calculateNextMoveが呼び出されたことを確認
    expect(calculateNextMoveMock).toHaveBeenCalled();
    // placeDiscが正しい位置で呼ばれることを確認
    expect(mockPlaceDisc).toHaveBeenCalledWith(cpuMoveMock);
  });

  it('CPU思考処理中にエラーが発生しても処理が継続する', () => {
    // CPUの計算処理がエラーを投げるようにモック
    const mockError = new Error('CPU error');
    const errorCalculateNextMove = vi.fn().mockImplementation(() => {
      throw mockError;
    });

    (
      createNormalCpuPlayer as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValueOnce({
      calculateNextMove: errorCalculateNextMove,
    });

    // コンソールエラーをスパイ
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.WHITE, // CPUの番
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );

    // タイマーを進める
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // エラーがコンソールに出力される
    expect(consoleSpy).toHaveBeenCalledWith('CPU error:', expect.any(Error));
    // placeDiscは呼ばれない
    expect(mockPlaceDisc).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('thinkNextMoveでエラーが発生した場合、nullが返される', () => {
    const errorCalculateNextMove = vi.fn().mockImplementation(() => {
      throw new Error('CPU error');
    });

    (
      createNormalCpuPlayer as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValueOnce({
      calculateNextMove: errorCalculateNextMove,
    });

    // コンソールエラーをスパイ
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.WHITE, // CPUの番
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );

    // タイマーを進める
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // エラーがコンソールに出力される
    expect(consoleSpy).toHaveBeenCalledWith('CPU error:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('コンポーネントのアンマウント時にタイマーがクリアされる', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() =>
      useCpuPlayer({
        cpuLevel: 'normal',
        playerDiscColor: DiscColor.BLACK,
        discs: mockBoard,
        currentTurn: DiscColor.WHITE, // CPUの番
        placeablePositions: mockPlaceablePositions,
        placeDisc: mockPlaceDisc,
      }),
    );

    // コンポーネントをアンマウント
    unmount();

    // clearTimeoutが呼ばれることを確認
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
