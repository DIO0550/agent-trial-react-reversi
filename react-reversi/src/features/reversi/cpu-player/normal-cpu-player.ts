import { Point } from '../types/reversi-types';
import { CpuPlayer } from './types/cpu-player-types';

/**
 * マスの位置の種類を表す定数
 */
const PositionType = {
  CORNER: 'corner',
  EDGE: 'edge',
  OTHER: 'other',
} as const;

/**
 * マスの位置の種類
 */
type PositionType = (typeof PositionType)[keyof typeof PositionType];

/**
 * 評価付きの位置を表す型
 */
type PositionWithEvaluation = {
  position: Point;
  type: PositionType;
};

/**
 * 盤面上の角の座標を取得する関数
 */
const getCornerPositions = (board: number[][]): Point[] => {
  const size = board.length;
  return [
    { row: 0, col: 0 },
    { row: 0, col: size - 1 },
    { row: size - 1, col: 0 },
    { row: size - 1, col: size - 1 },
  ];
};

/**
 * 盤面上の端の座標を取得する関数（角を除く）
 */
const getEdgePositions = (board: number[][]): Point[] => {
  const size = board.length;
  const edges: Point[] = [];

  // 上辺（左右の角を除く）
  for (let col = 1; col < size - 1; col++) {
    edges.push({ row: 0, col });
  }

  // 下辺（左右の角を除く）
  for (let col = 1; col < size - 1; col++) {
    edges.push({ row: size - 1, col });
  }

  // 左辺（上下の角を除く）
  for (let row = 1; row < size - 1; row++) {
    edges.push({ row, col: 0 });
  }

  // 右辺（上下の角を除く）
  for (let row = 1; row < size - 1; row++) {
    edges.push({ row, col: size - 1 });
  }

  return edges;
};

/**
 * 位置の種類を判定する関数
 */
const getPositionType = (position: Point, board: number[][]): PositionType => {
  const size = board.length;
  const { row, col } = position;

  // 角の判定
  if (
    (row === 0 && col === 0) ||
    (row === 0 && col === size - 1) ||
    (row === size - 1 && col === 0) ||
    (row === size - 1 && col === size - 1)
  ) {
    return PositionType.CORNER;
  }

  // 端の判定（角以外）
  if (row === 0 || row === size - 1 || col === 0 || col === size - 1) {
    return PositionType.EDGE;
  }

  // その他
  return PositionType.OTHER;
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

    // 利用可能な位置を評価値付きで取得
    const positionsWithEvaluation: PositionWithEvaluation[] =
      availablePositions.map((position) => ({
        position,
        type: getPositionType(position, board),
      }));

    // 角があれば最優先で選択
    const cornersAvailable = positionsWithEvaluation.filter(
      (item) => item.type === PositionType.CORNER,
    );
    if (cornersAvailable.length > 0) {
      // 角が複数ある場合はランダムに1つ選ぶ
      const randomIndex = Math.floor(Math.random() * cornersAvailable.length);
      return cornersAvailable[randomIndex].position;
    }

    // 角がなければ端を優先
    const edgesAvailable = positionsWithEvaluation.filter(
      (item) => item.type === PositionType.EDGE,
    );
    if (edgesAvailable.length > 0) {
      // 端が複数ある場合はランダムに1つ選ぶ
      const randomIndex = Math.floor(Math.random() * edgesAvailable.length);
      return edgesAvailable[randomIndex].position;
    }

    // 角も端もなければその他のマスからランダムに選択
    const randomIndex = Math.floor(
      Math.random() * positionsWithEvaluation.length,
    );
    return positionsWithEvaluation[randomIndex].position;
  };

  return {
    calculateNextMove,
  };
};
