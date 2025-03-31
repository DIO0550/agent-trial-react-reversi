import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DiscColor, BoardPosition } from '../types/reversi-types';
import { useCpuPlayer } from './use-cpu-player';
import { createWeakCpuPlayer } from '../cpu-player/weak-cpu-player';
import { createNormalCpuPlayer } from '../cpu-player/normal-cpu-player';
import { createStrongCpuPlayer } from '../cpu-player/strong-cpu-player';

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
  const mockPlaceablePositions = vi.fn().mockReturnValue([
    { row: 2, col: 3 },
    { row: 3, col: 2 },
  ]);

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
      useCpuPlayer(
        'normal',
        'black',
        mockBoard,
        DiscColor.BLACK,
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
    );

    expect(result.current.playerDiscColor).toBe(DiscColor.BLACK);
    expect(result.current.cpuDiscColor).toBe(DiscColor.WHITE);
  });

  it('プレイヤーが白を選択した場合、CPUの色は黒になる', () => {
    const { result } = renderHook(() =>
      useCpuPlayer(
        'normal',
        'white',
        mockBoard,
        DiscColor.WHITE,
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
    );

    expect(result.current.playerDiscColor).toBe(DiscColor.WHITE);
    expect(result.current.cpuDiscColor).toBe(DiscColor.BLACK);
  });

  it('難易度に応じて適切なCPUプレイヤーが生成される', () => {
    // easyの場合
    renderHook(() =>
      useCpuPlayer(
        'easy',
        'black',
        mockBoard,
        DiscColor.BLACK,
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
    );
    expect(createWeakCpuPlayer).toHaveBeenCalled();

    // normalの場合
    renderHook(() =>
      useCpuPlayer(
        'normal',
        'black',
        mockBoard,
        DiscColor.BLACK,
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
    );
    expect(createNormalCpuPlayer).toHaveBeenCalled();

    // hardの場合
    renderHook(() =>
      useCpuPlayer(
        'hard',
        'black',
        mockBoard,
        DiscColor.BLACK,
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
    );
    expect(createStrongCpuPlayer).toHaveBeenCalled();

    // strongestの場合
    renderHook(() =>
      useCpuPlayer(
        'strongest',
        'black',
        mockBoard,
        DiscColor.BLACK,
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
    );
    expect(createStrongCpuPlayer).toHaveBeenCalled();
  });

  it('CPUの番でない場合、思考処理は実行されない', () => {
    renderHook(() =>
      useCpuPlayer(
        'normal',
        'black',
        mockBoard,
        DiscColor.BLACK, // プレイヤーの番
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
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
      useCpuPlayer(
        'normal',
        'black',
        mockBoard,
        DiscColor.WHITE, // CPUの番
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
    );

    // タイマーを進める
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // 置ける場所がないのでplaceDiscは呼ばれない
    expect(mockPlaceDisc).not.toHaveBeenCalled();
  });

  it('CPUの番の場合、1秒後に思考処理が実行される', () => {
    // モック関数を取得
    const calculateNextMoveMock = vi.fn().mockReturnValue({ row: 2, col: 3 });
    const cpuMoveMock = { row: 2, col: 3 };

    // モック関数を設定
    (createNormalCpuPlayer as jest.Mock).mockImplementationOnce(() => ({
      calculateNextMove: calculateNextMoveMock,
    }));

    renderHook(() =>
      useCpuPlayer(
        'normal',
        'black',
        mockBoard,
        DiscColor.WHITE, // CPUの番
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
    );

    // まだタイマーが実行されていないので呼ばれない
    expect(mockPlaceDisc).not.toHaveBeenCalled();

    // タイマーを進める
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // placeDiscが呼ばれる
    expect(mockPlaceDisc).toHaveBeenCalled();
  });

  it('CPU思考処理中にエラーが発生しても処理が継続する', () => {
    // CPUの計算処理がエラーを投げるようにモック
    const mockError = new Error('CPU error');
    (createNormalCpuPlayer as jest.Mock).mockImplementationOnce(() => ({
      calculateNextMove: vi.fn().mockImplementation(() => {
        throw mockError;
      }),
    }));

    // コンソールエラーをスパイ
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() =>
      useCpuPlayer(
        'normal',
        'black',
        mockBoard,
        DiscColor.WHITE, // CPUの番
        mockPlaceablePositions,
        mockPlaceDisc,
      ),
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
});
