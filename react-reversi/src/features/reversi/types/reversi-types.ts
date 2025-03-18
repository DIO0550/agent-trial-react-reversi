/**
 * 石の色を表す列挙型
 */
export enum DiscColor {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
}

/**
 * 盤面上の位置を表す型
 */
export type BoardPosition = {
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