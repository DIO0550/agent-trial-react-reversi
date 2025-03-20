import { Point } from '../types/reversi-types';
import { CpuPlayer } from './types/cpu-player-types';

/**
 * 利用可能な位置を取得する関数
 */
const getAvailablePositions = (board: number[][]): Point[] => {
  const availablePositions: Point[] = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        availablePositions.push({ row, col });
      }
    }
  }
  return availablePositions;
};

/**
 * 普通の強さのCPUプレイヤーを作成する関数
 */
export const createNormalCpuPlayer = (): CpuPlayer => {
  /**
   * 次の手を計算する関数
   */
  const calculateNextMove = (
    board: number[][],
    currentPlayer: number,
  ): Point => {
    // TODO: ここに普通の強さのCPUのロジックを実装する
    const availablePositions = getAvailablePositions(board);
    if (availablePositions.length === 0) {
      throw new Error('No available positions');
    }
    // 仮実装：ランダムな位置を返す
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  };

  return {
    calculateNextMove,
  };
};
