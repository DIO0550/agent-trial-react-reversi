import { describe, expect, it, vi } from 'vitest';
import { createWeakCpuPlayer } from './weak-cpu-player';

describe('createWeakCpuPlayer', () => {
  it('相手の石を挟める位置の中からランダムな位置を返すこと', () => {
    // Arrange
    const board = [
      [0, 0, 0],
      [0, 2, 0],
      [0, 1, 0],
    ];
    // プレイヤー1の番：(1,3)と(3,1)は相手の石(2)を挟める位置
    const currentPlayer = 1;
    const weakCpuPlayer = createWeakCpuPlayer();
    // 乱数生成をモック化して最初の位置を選択するようにする
    vi.spyOn(Math, 'random').mockReturnValue(0);

    // Act
    const result = weakCpuPlayer.calculateNextMove(board, currentPlayer);

    // Assert
    // 相手の石を挟める位置が選択されることを確認
    expect(result).toEqual({ row: 0, col: 1 });
  });

  it('相手の石を挟める場所が1箇所しかない場合、その位置を返すこと', () => {
    // Arrange
    const board = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 2, 1],
    ];
    // プレイヤー2の番：(1,1)だけが相手の石(1)を挟める位置
    const currentPlayer = 2;
    const weakCpuPlayer = createWeakCpuPlayer();

    // Act
    const result = weakCpuPlayer.calculateNextMove(board, currentPlayer);

    // Assert
    expect(result).toEqual({ row: 1, col: 1 });
  });

  it('相手の石を挟める場所がない場合、エラーをスローすること', () => {
    // Arrange
    const board = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const currentPlayer = 2;
    const weakCpuPlayer = createWeakCpuPlayer();

    // Act & Assert
    expect(() => weakCpuPlayer.calculateNextMove(board, currentPlayer)).toThrow(
      'No available positions',
    );
  });
});
