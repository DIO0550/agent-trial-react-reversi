import { Point } from '../types/reversi-types';
import { CpuPlayer } from './types/cpu-player-types';

/**
 * マスの位置の種類を表す定数
 */
const POSITION_TYPE = {
  CORNER: 'corner',
  EDGE: 'edge',
  OTHER: 'other',
} as const;

/**
 * マスの位置の種類
 */
type PositionType = (typeof POSITION_TYPE)[keyof typeof POSITION_TYPE];

/**
 * 評価付きの位置を表す型
 */
type PositionWithEvaluation = {
  position: Point;
  type: PositionType;
};

/**
 * マスの位置が角かどうか判定する関数
 */
const isCornerPosition = (row: number, col: number, size: number): boolean => {
  return (
    (row === 0 && col === 0) ||
    (row === 0 && col === size - 1) ||
    (row === size - 1 && col === 0) ||
    (row === size - 1 && col === size - 1)
  );
};

/**
 * マスの位置が端（角を除く）かどうか判定する関数
 */
const isEdgePosition = (row: number, col: number, size: number): boolean => {
  return (
    (row === 0 || row === size - 1 || col === 0 || col === size - 1) &&
    !isCornerPosition(row, col, size)
  );
};

/**
 * 位置の種類を判定する関数
 */
const getPositionType = (position: Point, boardSize: number): PositionType => {
  const { row, col } = position;

  if (isCornerPosition(row, col, boardSize)) {
    return POSITION_TYPE.CORNER;
  }

  if (isEdgePosition(row, col, boardSize)) {
    return POSITION_TYPE.EDGE;
  }

  return POSITION_TYPE.OTHER;
};

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
 * 配列からランダムに要素を1つ選択する関数
 */
const getRandomElement = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
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
    const availablePositions = getAvailablePositions(board);

    if (availablePositions.length === 0) {
      throw new Error('No available positions');
    }

    // ボードサイズを取得
    const boardSize = board.length;

    // 利用可能な位置を種類ごとに分類
    const corners: Point[] = [];
    const edges: Point[] = [];
    const others: Point[] = [];

    availablePositions.forEach((position) => {
      if (isCornerPosition(position.row, position.col, boardSize)) {
        corners.push(position);
      } else if (isEdgePosition(position.row, position.col, boardSize)) {
        edges.push(position);
      } else {
        others.push(position);
      }
    });

    // 角があれば最優先で選択
    if (corners.length > 0) {
      return getRandomElement(corners);
    }

    // 角がなければ端を優先
    if (edges.length > 0) {
      return getRandomElement(edges);
    }

    // 角も端もなければその他のマスからランダムに選択
    return getRandomElement(others);
  };

  return {
    calculateNextMove,
  };
};
