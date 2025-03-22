import { Board, Point } from '../types/reversi-types';
import { CpuPlayer } from './types/cpu-player-types';
import { getPlaceablePositions } from '../utils/board-utils';

/**
 * 配列からランダムに要素を1つ選択する関数
 */
const getRandomElement = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * 弱いCPUプレイヤーを作成する関数
 */
export const createWeakCpuPlayer = (): CpuPlayer => {
  /**
   * 次の手を計算する関数
   */
  const calculateNextMove = (board: Board, currentPlayer: number): Point => {
    const availablePositions = getPlaceablePositions(board, currentPlayer);
    if (availablePositions.length === 0) {
      throw new Error('No available positions');
    }
    return getRandomElement(availablePositions);
  };

  return {
    calculateNextMove,
  };
};
