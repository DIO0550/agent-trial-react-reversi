import { Board, BoardPosition } from '../types/reversi-types';
import { CpuPlayer } from './types/cpu-player-types';
import { getPlaceablePositions } from '../utils/board-utils';

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
  position: BoardPosition;
  type: PositionType;
};

/**
 * マスの位置が角かどうか判定する関数
 */
const isCornerPosition = ({
  row,
  col,
  size,
}: {
  /** 行番号 */
  row: number;
  /** 列番号 */
  col: number;
  /** ボードのサイズ */
  size: number;
}): boolean => {
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
const isEdgePosition = ({
  row,
  col,
  size,
}: {
  /** 行番号 */
  row: number;
  /** 列番号 */
  col: number;
  /** ボードのサイズ */
  size: number;
}): boolean => {
  return (
    (row === 0 || row === size - 1 || col === 0 || col === size - 1) &&
    !isCornerPosition({ row, col, size })
  );
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
  const calculateNextMove = (board: Board, currentPlayer: number): BoardPosition => {
    const availablePositions = getPlaceablePositions({
      board,
      currentPlayer,
    });
    if (availablePositions.length === 0) {
      throw new Error('No available positions');
    }

    // ボードサイズを取得
    const boardSize = board.length;

    // 利用可能な位置を種類ごとに分類
    const corners: BoardPosition[] = [];
    const edges: BoardPosition[] = [];
    const others: BoardPosition[] = [];

    availablePositions.forEach((position) => {
      if (isCornerPosition({ row: position.row, col: position.col, size: boardSize })) {
        corners.push(position);
      } else if (isEdgePosition({ row: position.row, col: position.col, size: boardSize })) {
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
