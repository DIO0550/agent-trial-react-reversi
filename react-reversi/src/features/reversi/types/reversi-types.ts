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
 * 回転方向を表す列挙型
 */
export enum FlipDirection {
  LEFT_TO_RIGHT = 'leftToRight', // 左から右
  RIGHT_TO_LEFT = 'rightToLeft', // 右から左
  TOP_TO_BOTTOM = 'topToBottom', // 上から下
  BOTTOM_TO_TOP = 'bottomToTop', // 下から上
}

/**
 * 回転軸を表す型
 */
export type FlipAxis = 'x' | 'y';

/**
 * 石の回転状態（角度）を表す型
 */
export type RotationState = {
  /** X軸の回転角度（度） */
  xDeg: number;
  /** Y軸の回転角度（度） */
  yDeg: number;
};

/**
 * RotationStateのコンパニオンオブジェクト
 * DiscColorに基づいたRotationStateを提供する
 */
export const RotationState = {
  /**
   * 初期状態の回転角度を返す
   */
  createInitial: (): RotationState => ({
    xDeg: 0,
    yDeg: 0,
  }),

  /**
   * DiscColorに基づいた回転状態を返す
   * @param discColor 石の色
   * @returns 対応するRotationState
   */
  fromDiscColor: (discColor: DiscColor): RotationState => {
    switch (discColor) {
      case DiscColor.BLACK:
        return { xDeg: 0, yDeg: 0 };
      case DiscColor.WHITE:
        return { xDeg: 180, yDeg: 0 };
      case DiscColor.NONE:
      default:
        return { xDeg: 90, yDeg: 0 };
    }
  },

  /**
   * 指定された軸で回転させた状態を計算する
   * @param currentRotation 現在の回転状態
   * @param flipAxis 回転軸
   * @param degree 回転角度（デフォルト180度）
   * @returns 回転後の状態
   */
  calculateAxisRotation: (
    currentRotation: RotationState,
    flipAxis: FlipAxis,
    degree: number = 180,
  ): RotationState => {
    // 新しい回転状態のオブジェクトを作成（現在の状態をコピー）
    const newRotation: RotationState = {
      xDeg: currentRotation.xDeg,
      yDeg: currentRotation.yDeg,
    };

    // 指定された軸に基づいて回転角度を更新（剰余計算なし）
    if (flipAxis === 'x') {
      newRotation.xDeg = currentRotation.xDeg + degree;
    } else {
      newRotation.yDeg = currentRotation.yDeg + degree;
    }

    return newRotation;
  },

  /**
   * 指定した方向に基づいて回転させた状態を計算する
   * @param currentRotation 現在の回転状態
   * @param direction 回転方向
   * @returns 回転後の状態
   */
  calculateDirectionalRotation: (
    currentRotation: RotationState,
    direction: FlipDirection,
  ): RotationState => {
    // 現在の回転状態をコピー
    const newRotation: RotationState = {
      xDeg: currentRotation.xDeg,
      yDeg: currentRotation.yDeg,
    };

    // 方向に基づいて回転角度を更新（剰余計算なし）
    switch (direction) {
      case FlipDirection.LEFT_TO_RIGHT:
        // Y軸周りに180度回転
        newRotation.yDeg = currentRotation.yDeg + 180;
        break;
      case FlipDirection.RIGHT_TO_LEFT:
        // Y軸周りに-180度回転
        newRotation.yDeg = currentRotation.yDeg - 180;
        break;
      case FlipDirection.TOP_TO_BOTTOM:
        // X軸周りに180度回転
        newRotation.xDeg = currentRotation.xDeg + 180;
        break;
      case FlipDirection.BOTTOM_TO_TOP:
        // X軸周りに-180度回転
        newRotation.xDeg = currentRotation.xDeg - 180;
        break;
      default:
        throw new Error('Invalid flip direction');
    }

    return newRotation;
  },

  /**
   * 色の変更に基づいた回転状態を計算する（以前のバージョンとの互換性のため）
   * @param fromColor 元の色
   * @param toColor 裏返し後の色
   * @returns 回転状態
   * @deprecated 代わりに calculateAxisRotation(RotationState, FlipAxis) を使用してください
   */
  calculateColorBasedRotation: (
    fromColor: DiscColor,
    toColor: DiscColor,
  ): RotationState => {
    if (fromColor === DiscColor.BLACK && toColor === DiscColor.WHITE) {
      return { xDeg: 180, yDeg: 0 };
    }
    if (fromColor === DiscColor.WHITE && toColor === DiscColor.BLACK) {
      return { xDeg: 0, yDeg: 0 };
    }
    return { xDeg: 90, yDeg: 0 };
  },
};

/**
 * 1マスの状態を表す型
 * 石の色と回転状態を一緒に管理する
 */
export type CellState = {
  /** 石の色 */
  discColor: DiscColor;
  /** 回転状態（角度） */
  rotationState: RotationState;
};

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
  flipAxis: FlipAxis;
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
 * CellStateの二次元配列
 */
export type Board = CellState[][];
