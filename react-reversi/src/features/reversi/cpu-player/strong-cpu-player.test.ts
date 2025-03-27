import { describe, expect, it, vi } from 'vitest';
import { createStrongCpuPlayer } from './strong-cpu-player';
import { Board, Point } from '../types/reversi-types';
import * as boardUtils from '../utils/board-utils';

describe('StrongCpuPlayer', () => {
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
    const cpuPlayer = createStrongCpuPlayer();

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

    const cpuPlayer = createStrongCpuPlayer();
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

    const cpuPlayer = createStrongCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // X打点ではなく通常のマスが選択されることを確認
    expect(result).toEqual({ row: 3, col: 3 });
  });

  it('角がなく、X打点以外の端がある場合は端を優先的に選択する', () => {
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

    const cpuPlayer = createStrongCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 端のマスが選択されることを確認
    expect(result).toEqual({ row: 0, col: 3 });
  });

  it('角も端もない場合は、最も多くの石を取れる手を選択する', () => {
    const board: Board = [
      [0, 0, 0, 0],
      [0, 1, 2, 0],
      [0, 2, 1, 0],
      [0, 0, 0, 0],
    ];
    const currentPlayer = 1;

    // 内側のマスを有効な位置としてモック
    const availablePositions: Point[] = [
      { row: 1, col: 0 }, // 1つ裏返せる
      { row: 0, col: 1 }, // 2つ裏返せる
    ];
    vi.spyOn(boardUtils, 'getPlaceablePositions').mockReturnValue(
      availablePositions,
    );

    // 各位置で裏返せる石の数をモック
    vi.spyOn(boardUtils, 'findFlippableDiscs').mockImplementation(
      (row, col, player, board) => {
        if (row === 1 && col === 0) return [{ row: 1, col: 1 }]; // 1つだけ裏返せる
        if (row === 0 && col === 1)
          return [
            { row: 1, col: 1 },
            { row: 2, col: 1 },
          ]; // 2つ裏返せる
        return [];
      },
    );

    const cpuPlayer = createStrongCpuPlayer();
    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // より多くの石を裏返せる位置が選択されることを確認
    expect(result).toEqual({ row: 0, col: 1 });
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

    const cpuPlayer = createStrongCpuPlayer();

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
