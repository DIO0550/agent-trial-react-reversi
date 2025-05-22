import { Board, BoardPosition } from '../types/reversi-types';
import { CpuPlayer } from './types/cpu-player-types';
import {
  findFlippableDiscs,
  getPlaceablePositions,
} from '../utils/board-utils';

/**
 * マスの位置の種類を表す定数
 */
const POSITION_TYPE = {
  CORNER: 'corner',
  X_POINT: 'x_point', // 角の隣（X打点）
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
  flippableCount: number;
};

/**
 * isCornerPosition関数の引数の型
 */
type IsCornerPositionParams = {
  /** 行番号 */
  row: number;
  /** 列番号 */
  col: number;
  /** ボードのサイズ */
  size: number;
};

/**
 * マスの位置が角かどうか判定する関数
 */
const isCornerPosition = ({
  row,
  col,
  size,
}: IsCornerPositionParams): boolean => {
  return (
    (row === 0 && col === 0) ||
    (row === 0 && col === size - 1) ||
    (row === size - 1 && col === 0) ||
    (row === size - 1 && col === size - 1)
  );
};

/**
 * isXPointPosition関数の引数の型
 */
type IsXPointPositionParams = {
  /** 行番号 */
  row: number;
  /** 列番号 */
  col: number;
  /** ボードのサイズ */
  size: number;
};

/**
 * マスの位置がX打点（角の隣）かどうか判定する関数
 */
const isXPointPosition = ({
  row,
  col,
  size,
}: IsXPointPositionParams): boolean => {
  return (
    (row === 0 && col === 1) ||
    (row === 1 && col === 0) ||
    (row === 0 && col === size - 2) ||
    (row === 1 && col === size - 1) ||
    (row === size - 2 && col === 0) ||
    (row === size - 1 && col === 1) ||
    (row === size - 2 && col === size - 1) ||
    (row === size - 1 && col === size - 2) ||
    (row === 1 && col === 1) ||
    (row === 1 && col === size - 2) ||
    (row === size - 2 && col === 1) ||
    (row === size - 2 && col === size - 2)
  );
};

/**
 * isEdgePosition関数の引数の型
 */
type IsEdgePositionParams = {
  /** 行番号 */
  row: number;
  /** 列番号 */
  col: number;
  /** ボードのサイズ */
  size: number;
};

/**
 * マスの位置が端（角とX打点を除く）かどうか判定する関数
 */
const isEdgePosition = ({
  row,
  col,
  size,
}: IsEdgePositionParams): boolean => {
  return (
    (row === 0 || row === size - 1 || col === 0 || col === size - 1) &&
    !isCornerPosition({ row, col, size }) &&
    !isXPointPosition({ row, col, size })
  );
};

/**
 * getPositionType関数の引数の型
 */
type GetPositionTypeParams = {
  /** 位置 */
  position: BoardPosition;
  /** ボードのサイズ */
  boardSize: number;
};

/**
 * 位置の種類を判定する関数
 */
const getPositionType = ({
  position,
  boardSize,
}: GetPositionTypeParams): PositionType => {
  const { row, col } = position;
  if (isCornerPosition({ row, col, size: boardSize })) {
    return POSITION_TYPE.CORNER;
  }
  if (isXPointPosition({ row, col, size: boardSize })) {
    return POSITION_TYPE.X_POINT;
  }
  if (isEdgePosition({ row, col, size: boardSize })) {
    return POSITION_TYPE.EDGE;
  }
  return POSITION_TYPE.OTHER;
};

/**
 * 配列からランダムに要素を1つ選択する関数
 */
const getRandomElement = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * 位置の評価値に基づいて並べ替える関数
 * 1. 角が最優先
 * 2. X打点は最も避ける
 * 3. 端が次に優先
 * 4. 同じ種類の中では、裏返せる石が多い方を優先
 */
const sortPositionsByEvaluation = (
  positionsWithEval: PositionWithEvaluation[],
): PositionWithEvaluation[] => {
  return [...positionsWithEval].sort((a, b) => {
    // 位置の種類で優先順位をつける
    if (a.type !== b.type) {
      if (a.type === POSITION_TYPE.CORNER) return -1;
      if (b.type === POSITION_TYPE.CORNER) return 1;
      if (a.type === POSITION_TYPE.X_POINT) return 1;
      if (b.type === POSITION_TYPE.X_POINT) return -1;
      if (a.type === POSITION_TYPE.EDGE) return -1;
      if (b.type === POSITION_TYPE.EDGE) return 1;
    }

    // 同じ種類の位置では、裏返せる石の数で比較する
    return b.flippableCount - a.flippableCount;
  });
};

/**
 * 強いCPUプレイヤーを作成する関数
 */
export const createStrongCpuPlayer = (): CpuPlayer => {
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

    // 各利用可能な位置に評価情報を追加
    const positionsWithEvaluation: PositionWithEvaluation[] =
      availablePositions.map((position) => {
        const { row, col } = position;
        const type = getPositionType({
          position,
          boardSize,
        });
        const flippableDiscs = findFlippableDiscs({
          row,
          col,
          currentPlayer,
          board,
        });

        return {
          position,
          type,
          flippableCount: flippableDiscs.length,
        };
      });

    // 評価に基づいて位置を並べ替え
    const sortedPositions = sortPositionsByEvaluation(positionsWithEvaluation);

    // 最も評価の高い位置の評価値を取得
    const highestEval = sortedPositions[0];

    // 同じ評価値を持つ位置をすべて取得
    const bestPositions = sortedPositions.filter(
      (pos) =>
        pos.type === highestEval.type &&
        pos.flippableCount === highestEval.flippableCount,
    );

    // 複数の同評価の位置がある場合はランダムに選択
    const selectedPosition = getRandomElement(bestPositions);

    return selectedPosition.position;
  };

  return {
    calculateNextMove,
  };
};
