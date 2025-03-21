import { Point } from '../../types/reversi-types';

/**
 * CPUプレイヤーのインターフェース
 */
export type CpuPlayer = {
  calculateNextMove: (board: number[][], currentPlayer: number) => Point;
};

/**
 * CPUプレイヤーの難易度レベル
 */
export type CpuPlayerLevel = 'weak' | 'normal' | 'strong';
