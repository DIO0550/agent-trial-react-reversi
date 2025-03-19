import { describe, expect, it, vi } from "vitest";
import { WeakCpuPlayer } from "./weak-cpu-player";

describe("WeakCpuPlayer", () => {
  it("置ける場所の中からランダムな位置を返すこと", () => {
    // Arrange
    const board = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 2],
    ];
    const currentPlayer = 1;
    const weakCpuPlayer = new WeakCpuPlayer();
    
    // 乱数生成をモック化
    vi.spyOn(Math, "random").mockReturnValue(0);
    
    // Act
    const result = weakCpuPlayer.calculateNextMove(board, currentPlayer);
    
    // Assert
    // 置ける場所（0の位置）からランダムに選択されることを確認
    expect(result).toEqual({ row: 0, col: 0 });
  });

  it("石を置ける場所が1箇所しかない場合、その位置を返すこと", () => {
    // Arrange
    const board = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ];
    const currentPlayer = 2;
    const weakCpuPlayer = new WeakCpuPlayer();
    
    // Act
    const result = weakCpuPlayer.calculateNextMove(board, currentPlayer);
    
    // Assert
    expect(result).toEqual({ row: 1, col: 1 });
  });
});