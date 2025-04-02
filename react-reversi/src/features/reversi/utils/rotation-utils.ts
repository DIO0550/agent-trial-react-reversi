import {
  Board,
  BoardPosition,
  CellState,
  DiscColor,
  FlipDirection,
  RotationState,
} from '../types/reversi-types';
import { ArrayExtension } from '@/utils/extensions/array-extenstion';

/**
 * 石の回転状態に対する操作を表すアクション型
 */
export type RotationAction = {
  type: FlipDirection;
  payload: {
    position: BoardPosition;
    discColor: DiscColor;
  };
};

/**
 * CellState型の盤面データに対してreducer関数を実装
 * 指定された位置の石を指定された方向に回転させる
 *
 * @param state 現在の盤面状態
 * @param action 実行するアクション
 * @returns 新しい盤面状態
 */
export const rotationReducer = (
  state: Board,
  action: RotationAction,
): Board => {
  const { type: flipDirection, payload } = action;
  const { position, discColor } = payload;
  const { row, col } = position;

  // 新しい盤面状態を作成
  const newState: Board = state.map((rowCells) => [...rowCells]);

  // 指定された位置のセル状態を取得
  const currentCell = newState[row][col];

  // セルが存在しない場合、新しいセルを作成
  if (!currentCell) {
    newState[row][col] = {
      discColor,
      rotationState: RotationState.fromDiscColor(discColor),
    };
    return newState;
  }

  // 現在の回転状態から新しい回転状態を計算
  const newRotationState = RotationState.calculateDirectionalRotation(
    currentCell.rotationState,
    flipDirection,
  );

  // 更新されたセル状態をセット
  newState[row][col] = {
    ...currentCell,
    rotationState: newRotationState,
  };

  return newState;
};

/**
 * 初期の盤面状態を作成する関数
 * @param boardSize 盤面のサイズ
 * @returns 初期盤面状態
 */
export const createInitialBoard = (boardSize: number): Board => {
  // 有効なボードサイズを確保（4以上の偶数）
  const size = ensureValidBoardSize(boardSize);

  // 空のセルで埋められた盤面を作成
  const board = ArrayExtension.createMatrix<CellState>(size, size, {
    discColor: DiscColor.NONE,
    rotationState: RotationState.fromDiscColor(DiscColor.NONE),
  });

  // 中央に初期配置の石をセット
  const centerIndex = size / 2 - 1;

  // 黒石をセット
  board[centerIndex][centerIndex] = {
    discColor: DiscColor.BLACK,
    rotationState: RotationState.fromDiscColor(DiscColor.BLACK),
  };

  board[centerIndex + 1][centerIndex + 1] = {
    discColor: DiscColor.BLACK,
    rotationState: RotationState.fromDiscColor(DiscColor.BLACK),
  };

  // 白石をセット
  board[centerIndex][centerIndex + 1] = {
    discColor: DiscColor.WHITE,
    rotationState: RotationState.fromDiscColor(DiscColor.WHITE),
  };

  board[centerIndex + 1][centerIndex] = {
    discColor: DiscColor.WHITE,
    rotationState: RotationState.fromDiscColor(DiscColor.WHITE),
  };

  return board;
};

/**
 * ボードサイズが有効か確認し、必要に応じて調整する
 * @param size 指定されたボードサイズ
 * @returns 有効なボードサイズ（4以上の偶数）
 */
const ensureValidBoardSize = (size: number): number => {
  // 最小サイズよりも小さい場合は標準サイズを使用
  if (size < 4) {
    return 8;
  }

  // 奇数の場合は+1して偶数に
  return size % 2 === 0 ? size : size + 1;
};
