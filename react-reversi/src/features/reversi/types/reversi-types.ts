/**
 * 石の色を表す列挙型
 * 0: 空、1: 黒、2: 白
 */
export enum DiscColor {
  NONE = 0,
  BLACK = 1,
  WHITE = 2,
}

/**
 * 盤面上の位置を表す型
 */
export type BoardPosition = {
  row: number;
  col: number;
};

/**
 * 位置を表す型（CPU用）
 */
export type Point = {
  row: number;
  col: number;
};

/**
 * 盤面上の石の配置状態を表す型
 * キーは "行,列" の形式の文字列
 * 値は石の色
 */
export type DiscsState = {
  [key: string]: DiscColor;
};

/**
 * ひっくり返しアニメーション中の石の情報を表す型
 */
export type FlippingDiscInfo = {
  /** 前の色 */
  previousColor: DiscColor;
  /** ひっくり返した後の色 */
  targetColor: DiscColor;
  /** ひっくり返す軸 */
  flipAxis: 'x' | 'y';
};

/**
 * ひっくり返しアニメーション中の石の状態を表す型
 * キーは "行,列" の形式の文字列
 */
export type FlippingDiscsState = {
  [key: string]: FlippingDiscInfo;
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
 * DiscColorの二次元配列
 */
export type Board = DiscColor[][];
