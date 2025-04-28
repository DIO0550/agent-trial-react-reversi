import { Board, BoardPosition } from '@/features/reversi/types/reversi-types';

/**
 * CPUプレイヤーのインターフェース
 */
export type CpuPlayer = {
  calculateNextMove: (board: Board, currentPlayer: number) => BoardPosition;
};

/**
 * CPUプレイヤーの難易度レベル
 */
export type CpuPlayerLevel = 'weak' | 'normal' | 'strong' | 'strongest';
