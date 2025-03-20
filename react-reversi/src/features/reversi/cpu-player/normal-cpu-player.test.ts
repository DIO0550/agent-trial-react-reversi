import { describe, expect, it, vi } from 'vitest';
import { createNormalCpuPlayer } from './normal-cpu-player';
import { Point } from '../types/reversi-types';

describe('NormalCpuPlayer', () => {
  // テスト後にモックをリセット
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('相手の石を挟める場所がない場合はエラーをスローする', () => {
    const board = [
      [1, 2, 1],
      [2, 1, 2],
      [1, 2, 1],
    ];
    const currentPlayer = 1;
    const cpuPlayer = createNormalCpuPlayer();

    expect(() => cpuPlayer.calculateNextMove(board, currentPlayer)).toThrow(
      'No available positions',
    );
  });

  it('角が選択肢にある場合は角を優先的に選択する', () => {
    const board = [
      [0, 1, 0],
      [2, 2, 0],
      [0, 0, 0],
    ];
    // プレイヤー1の番：(0,0)が角かつ相手の石(2)を挟める位置
    const currentPlayer = 1;
    const cpuPlayer = createNormalCpuPlayer();

    // ランダム要素を排除するためにMath.randomをモック
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 角の座標(0,0)が選択されることを確認
    expect(result).toEqual({ row: 0, col: 0 });
  });

  it('角がなければ端を優先的に選択する', () => {
    const board = [
      [1, 0, 1],
      [2, 2, 2],
      [1, 0, 1],
    ];
    // プレイヤー1の番：端のマスの(0,1)と(2,1)は相手の石(2)を挟める位置
    const currentPlayer = 1;
    const cpuPlayer = createNormalCpuPlayer();

    // ランダム要素を排除するためにMath.randomをモック
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 端のマスが選択されることを確認
    const edgePositions = [
      { row: 0, col: 1 },
      { row: 2, col: 1 },
    ];

    expect(
      edgePositions.some(
        (pos) => pos.row === result.row && pos.col === result.col,
      ),
    ).toBeTrue();
  });

  it('角と端がなければその他のマスを選択する', () => {
    const board = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 2, 1],
    ];
    // プレイヤー2の番：中央のマス(1,1)のみが相手の石(1)を挟める位置
    const currentPlayer = 2;
    const cpuPlayer = createNormalCpuPlayer();

    const result = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 中央のマスが選択されることを確認
    expect(result).toEqual({ row: 1, col: 1 });
  });

  it('評価値が同じ場合はその中からランダムに選択する', () => {
    // 同じ評価値を持つ端のマスが複数ある場合
    const board = [
      [1, 0, 1],
      [2, 2, 2],
      [1, 0, 1],
    ];
    // プレイヤー1の番：端のマスの(0,1)と(2,1)は相手の石(2)を挟める位置で同じ評価値
    const currentPlayer = 1;
    const cpuPlayer = createNormalCpuPlayer();

    // 最初のランダム値で端のマスの1つ目が選択されるようにする
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const firstResult = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 次のランダム値で端のマスの2つ目が選択されるようにする
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const secondResult = cpuPlayer.calculateNextMove(board, currentPlayer);

    // 選択された結果が異なることを確認（ランダム性があることを確認）
    expect(
      firstResult.row !== secondResult.row ||
        firstResult.col !== secondResult.col,
    ).toBeTrue();
  });
});
