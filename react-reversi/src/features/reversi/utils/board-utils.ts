import {
  Board,
  Direction,
  BoardPosition,
} from '../types/reversi-types';
import { DiscColor } from './disc-color';

/**
 * 盤面内かどうかをチェックする関数
 */
export const isWithinBoard = (
  row: number,
  col: number,
  size: number,
): boolean => {
  return row >= 0 && row < size && col >= 0 && col < size;
};

/**
 * 数値が有効なDiscColor値かチェックする関数
 */
export const isValidDiscColor = (value: number): boolean => {
  return (
    value === DiscColor.NONE ||
    value === DiscColor.BLACK ||
    value === DiscColor.WHITE
  );
};

// 変換関数は不要になったため削除
// discColorToNumberとnumberToDiscColor関数を削除

/**
 * 指定された位置から特定の方向にひっくり返せる石があるかチェックする関数
 */
export const findFlippableDiscsInDirection = (
  row: number,
  col: number,
  currentPlayer: DiscColor,
  direction: Direction,
  board: Board,
): BoardPosition[] => {
  const oppositePlayer =
    currentPlayer === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK;
  const flippablePositions: BoardPosition[] = [];
  let currentRow = row + direction.rowDelta;
  let currentCol = col + direction.colDelta;

  // 隣が相手の色である場合は進み続ける
  while (
    isWithinBoard(currentRow, currentCol, board.length) &&
    board[currentRow][currentCol].discColor === oppositePlayer
  ) {
    flippablePositions.push({ row: currentRow, col: currentCol });
    currentRow += direction.rowDelta;
    currentCol += direction.colDelta;
  }

  // 最後に自分の色があれば挟めると判断
  if (
    isWithinBoard(currentRow, currentCol, board.length) &&
    board[currentRow][currentCol].discColor === currentPlayer &&
    flippablePositions.length > 0
  ) {
    return flippablePositions;
  }

  return [];
};

/**
 * 指定された位置に石を置いた場合にひっくり返せる石の位置を取得する関数
 */
export const findFlippableDiscs = (
  row: number,
  col: number,
  currentPlayer: DiscColor,
  board: Board,
): BoardPosition[] => {
  // すでに石がある場合は置けない
  if (board[row][col].discColor !== DiscColor.NONE) {
    return [];
  }

  // 全方向をチェックして、ひっくり返せる石を集める
  return DIRECTIONS.flatMap((direction) =>
    findFlippableDiscsInDirection(row, col, currentPlayer, direction, board),
  );
};

/**
 * 盤面上で現在のプレイヤーが石を置ける位置をすべて取得する関数
 */
export const getPlaceablePositions = (
  board: Board,
  currentPlayer: DiscColor,
): BoardPosition[] => {
  const placeablePositions: BoardPosition[] = [];
  const size = board.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // 既に石があるマスにはおけない
      if (board[row][col].discColor !== DiscColor.NONE) {
        continue;
      }

      // ひっくり返せる石があるか確認
      const flippableDiscs = findFlippableDiscs(row, col, currentPlayer, board);
      if (flippableDiscs.length > 0) {
        placeablePositions.push({ row, col });
      }
    }
  }

  return placeablePositions;
};

/**
 * 全方向の変化量を定義
 */
export const DIRECTIONS: Direction[] = [
  { rowDelta: -1, colDelta: -1 }, // 左上
  { rowDelta: -1, colDelta: 0 }, // 上
  { rowDelta: -1, colDelta: 1 }, // 右上
  { rowDelta: 0, colDelta: -1 }, // 左
  { rowDelta: 0, colDelta: 1 }, // 右
  { rowDelta: 1, colDelta: -1 }, // 左下
  { rowDelta: 1, colDelta: 0 }, // 下
  { rowDelta: 1, colDelta: 1 }, // 右下
];
