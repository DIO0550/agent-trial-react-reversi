// 回転関連の型と関数を新しいファイルからインポート
import { FlipDirection, RotationState } from '../utils/rotation-state-utils';
import { CanPlace } from '../utils/can-place';
import { DiscColor } from '../utils/disc-color';

/**
 * 1マスの状態を表す型
 * 石の色と回転状態を一緒に管理する
 */
export type CellState = {
  /** 石の色 */
  discColor: DiscColor.Type;
  /** 回転状態（角度） */
  rotationState: RotationState;
  /** このマスに石を置けるかどうか */
  canPlace: CanPlace;
};

/**
 * 盤面上の位置を表す型
 * CPUプレイヤーとUI共通で使用
 */
export type BoardPosition = {
  row: number;
  col: number;
};

/**
 * 方向を表す型
 */
export type Direction = {
  rowDelta: number;
  colDelta: number;
};

/**
 * 盤面の大きさ
 */
export const BOARD_SIZE = 8;

/**
 * 盤面の最小サイズ
 * 4x4以上でなければならない
 */
export const MIN_BOARD_SIZE = 4;

/**
 * 盤面の型定義
 * CellStateの二次元配列
 */
export type Board = CellState[][];

export { FlipDirection, RotationState };
