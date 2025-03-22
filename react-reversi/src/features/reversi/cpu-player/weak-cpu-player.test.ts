import { describe, expect, it, vi } from 'vitest';
import { createWeakCpuPlayer } from './weak-cpu-player';
import { Board, Point } from '../types/reversi-types';
import * as boardUtils from '../utils/board-utils';

describe('createWeakCpuPlayer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('相手の石を挟める位置の中からランダムな位置を返すこと', () => {
    const board: Board = [
      [0, 0, 0],
      [0, 1, 2],
      [0, 0, 0],
    ];
    const currentPlayer = 1;

    // 複数の有効な位置をモック
    const availablePositions: Point[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // ランダム値を固定
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const cpuPlayer = createWeakCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // availablePositionsのいずれかの位置が選択されているか確認
    expect(
      availablePositions.some(
        (pos) => pos.row === result.row && pos.col === result.col,
      ),
    ).toBeTruthy();
  });

  it('相手の石を挟める場所が1箇所しかない場合、その位置を返すこと', () => {
    const board: Board = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 2, 1],
    ];
    const currentPlayer = 2;

    // 1箇所だけ有効な位置をモック
    const availablePositions: Point[] = [{ row: 1, col: 1 }];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    const cpuPlayer = createWeakCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    expect(result).toEqual({ row: 1, col: 1 });
  });

  it('相手の石を挟める場所がない場合、エラーをスローすること', () => {
    const board: Board = [
      [1, 2, 1],
      [2, 1, 2],
      [1, 2, 1],
    ];
    const currentPlayer = 1;

    // 有効な位置がないことをモック
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue([]);

    const cpuPlayer = createWeakCpuPlayer();
    expect(() => cpuPlayer.calculateNextMove(board, currentPlayer)).toThrow(
      'No available positions',
    );
  });
});
