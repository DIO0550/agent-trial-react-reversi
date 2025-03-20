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
 * 弱いCPUプレイヤーを作成する関数
 */
export const createWeakCpuPlayer = (): CpuPlayer => {
  /**
   * 次の手を計算する関数
   */
  const calculateNextMove = (
    board: number[][],
    currentPlayer: number,
  ): Point => {
    const availablePositions = getAvailablePositions(board);
    if (availablePositions.length === 0) {
      throw new Error('No available positions');
    }

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  };

  return {
    calculateNextMove,
  };
};
