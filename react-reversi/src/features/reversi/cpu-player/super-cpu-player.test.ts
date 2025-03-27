import { describe, expect, it, vi } from 'vitest';
import { createSuperCpuPlayer } from './super-cpu-player';
import { Board, Point } from '../types/reversi-types';
import * as boardUtils from '../utils/board-utils';

describe('SuperCpuPlayer', () => {
  // テスト後にモックをリセット
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('相手の石を挟める場所がない場合はエラーをスローする', () => {
    const board: Board = [
      [1, 2, 1],
      [2, 1, 2],
      [1, 2, 1],
    ];
    const currentPlayer = 1;
    const cpuPlayer = createSuperCpuPlayer();

    // 置ける場所が無いことをモックする
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue([]);

    expect(() => cpuPlayer.calculateNextMove(board, currentPlayer)).toThrow(
      'No available positions',
    );
  });

  it('角が選択肢にある場合は角を最優先で選択する', () => {
    const board: Board = [
      [0, 1, 0],
      [2, 2, 0],
      [0, 0, 0],
    ];
    // プレイヤー1の番：(0,0)が角かつ相手の石(2)を挟める位置
    const currentPlayer = 1;

    // 角の位置を含む有効な位置をモック
    const availablePositions: Point[] = [
      { row: 0, col: 0 }, // 角
      { row: 2, col: 1 }, // その他
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // 両方の位置で石を1つだけ裏返せるようにモック
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockReturnValue([
      { row: 1, col: 1 },
    ]);

    // ランダム要素を排除するためにMath.randomをモック
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const cpuPlayer = createSuperCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 角の座標(0,0)が選択されることを確認
    expect(result).toEqual({ row: 0, col: 0 });
  });

  it('X打点（角の隣）の位置は可能な限り避ける', () => {
    const boardSize = 8;
    const board: Board = Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0));
    const currentPlayer = 1;

    // X打点と通常のマスを含む有効な位置をモック
    const availablePositions: Point[] = [
      { row: 0, col: 1 }, // X打点（角の隣）
      { row: 1, col: 0 }, // X打点（角の隣）
      { row: 3, col: 3 }, // 通常のマス
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // どの位置も同じ数の石を裏返せるようにモック
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockReturnValue([
      { row: 1, col: 1 },
    ]);

    // ランダム要素を排除するためにMath.randomをモック
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const cpuPlayer = createSuperCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // X打点ではなく通常のマスが選択されることを確認
    expect(result).toEqual({ row: 3, col: 3 });
  });

  it('C打点（対角から3つ目）は積極的に取る', () => {
    const boardSize = 8;
    const board: Board = Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0));
    const currentPlayer = 1;

    // C打点と通常のマスを含む有効な位置をモック
    const availablePositions: Point[] = [
      { row: 0, col: 2 }, // C打点（角から2つ目）
      { row: 2, col: 0 }, // C打点（角から2つ目）
      { row: 4, col: 4 }, // 通常のマス
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // どの位置も同じ数の石を裏返せるようにモック
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockReturnValue([
      { row: 1, col: 1 },
    ]);

    // ランダム要素を排除するためにMath.randomをモック
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const cpuPlayer = createSuperCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // C打点が選択されることを確認
    expect(result).toEqual({ row: 0, col: 2 });
  });

  it('角がなく、端がある場合は端を優先的に選択する', () => {
    const boardSize = 8;
    const board: Board = Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0));
    const currentPlayer = 1;

    // 端とその他のマスを含む有効な位置をモック
    const availablePositions: Point[] = [
      { row: 0, col: 3 }, // 端
      { row: 3, col: 3 }, // その他
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // どの位置も同じ数の石を裏返せるようにモック
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockReturnValue([
      { row: 1, col: 1 },
    ]);

    // ランダム要素を排除するためにMath.randomをモック
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const cpuPlayer = createSuperCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 端のマスが選択されることを確認
    expect(result).toEqual({ row: 0, col: 3 });
  });

  it('初期盤面では長期的な評価を優先する', () => {
    // 初期盤面に似た状態でテスト
    const board: Board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const currentPlayer = 1;

    // 初期状態で選択可能な位置をモック
    const availablePositions: Point[] = [
      { row: 2, col: 3 }, // 石が少なく取れるが戦略的に有利な位置
      { row: 3, col: 2 }, // 石が多く取れるが戦略的に不利な位置
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // 裏返せる石の数をモック
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockImplementation(
      (row, col, player, board) => {
        if (row === 2 && col === 3) return [{ row: 3, col: 3 }]; // 1つだけ裏返せる
        if (row === 3 && col === 2)
          return [
            { row: 3, col: 3 },
            { row: 3, col: 4 },
          ]; // 2つ裏返せる
        return [];
      },
    );

    // ランダム要素を排除するためにMath.randomをモック
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const cpuPlayer = createSuperCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 石は少なく取れるが戦略的に有利な位置が選択されることを確認
    expect(result).toEqual({ row: 2, col: 3 });
  });

  it('終盤では石を多く取れる手を選択する', () => {
    // ほとんどのマスが埋まっている終盤の盤面
    const board: Board = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 2, 2, 1, 1, 1],
      [1, 1, 2, 0, 0, 2, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 1],
    ];
    const currentPlayer = 1;

    // 終盤で選択可能な位置をモック
    const availablePositions: Point[] = [
      { row: 6, col: 3 }, // 石を多く取れる位置
      { row: 6, col: 4 }, // 石を少なく取れる位置
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // 裏返せる石の数をモック
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockImplementation(
      (row, col, player, board) => {
        if (row === 6 && col === 3)
          return [
            { row: 6, col: 2 },
            { row: 6, col: 5 },
            { row: 7, col: 3 },
          ]; // 3つ裏返せる
        if (row === 6 && col === 4) return [{ row: 7, col: 4 }]; // 1つだけ裏返せる
        return [];
      },
    );

    const cpuPlayer = createSuperCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 石をより多く取れる位置が選択されることを確認
    expect(result).toEqual({ row: 6, col: 3 });
  });

  it('同じ評価値の手が複数ある場合はその中からランダムに選択する', () => {
    const board: Board = [
      [0, 0, 0, 0],
      [0, 1, 2, 0],
      [0, 2, 1, 0],
      [0, 0, 0, 0],
    ];
    const currentPlayer = 1;

    // 同じ評価値を持つ位置をモック
    const availablePositions: Point[] = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // どちらの位置も同じ数の石を裏返せるようにモック
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockReturnValue([
      { row: 1, col: 1 },
    ]);

    const cpuPlayer = createSuperCpuPlayer();

    // 最初のランダム値で1つ目の位置が選択されるようにする
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const firstResult = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 次のランダム値で2つ目の位置が選択されるようにする
    vi.restoreAllMocks();
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockReturnValue([
      { row: 1, col: 1 },
    ]);
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    const secondResult = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 選択された結果が異なることを確認（ランダム性があることを確認）
    expect(
      firstResult.row !== secondResult.row ||
        firstResult.col !== secondResult.col,
    ).toBeTruthy();
  });
});
