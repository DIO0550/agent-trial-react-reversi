/**
 * 石の回転状態（角度）を表す型
 */
export type RotationState = {
  /** 黒石の回転角度 */
  black: {
    /** X軸の回転角度（度） */
    xDeg: number;
    /** Y軸の回転角度（度） */
    yDeg: number;
  };
  /** 白石の回転角度 */
  white: {
    /** X軸の回転角度（度） */
    xDeg: number;
    /** Y軸の回転角度（度） */
    yDeg: number;
  };
};

/**
 * 回転方向を表す列挙型
 */
export enum FlipDirection {
  LEFT_TO_RIGHT = 'leftToRight', // 左から右
  RIGHT_TO_LEFT = 'rightToLeft', // 右から左
  TOP_TO_BOTTOM = 'topToBottom', // 上から下
  BOTTOM_TO_TOP = 'bottomToTop', // 下から上
}

// reversi-types.tsからDiscColorをインポート
import { DiscColor } from '../types/reversi-types';

/**
 * RotationStateのコンパニオンオブジェクト
 * DiscColorに基づいたRotationStateを提供する
 */
export const RotationState = {
  /**
   * 初期状態の回転状態を返す
   * @returns 初期回転状態
   */
  createInitial: (): RotationState => {
    return {
      black: {
        xDeg: 0,
        yDeg: 0,
      },
      white: {
        xDeg: 0,
        yDeg: 0,
      },
    };
  },

  /**
   * DiscColorに基づいた回転状態を返す
   * @param discColor 石の色
   * @returns 対応するRotationState
   */
  fromDiscColor: (discColor: DiscColor): RotationState => {
    // DiscColorに基づいた回転状態を返す
    switch (discColor) {
      case DiscColor.BLACK:
        return {
          black: {
            xDeg: 0,
            yDeg: 0,
          },
          white: {
            xDeg: 180,
            yDeg: 0,
          },
        };
      case DiscColor.WHITE:
        return {
          black: {
            xDeg: 180,
            yDeg: 0,
          },
          white: {
            xDeg: 360,
            yDeg: 0,
          },
        };
      case DiscColor.NONE:
      default:
        return {
          black: {
            xDeg: 90,
            yDeg: 0,
          },
          white: {
            xDeg: 90,
            yDeg: 0,
          },
        };
    }
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
      black: {
        xDeg: currentRotation.black.xDeg,
        yDeg: currentRotation.black.yDeg,
      },
      white: {
        xDeg: currentRotation.white.xDeg,
        yDeg: currentRotation.white.yDeg,
      },
    };

    // 方向に基づいて黒石と白石の両方の回転角度を同じように更新
    switch (direction) {
      case FlipDirection.LEFT_TO_RIGHT:
        // Y軸周りに180度回転
        newRotation.black.yDeg += 180;
        newRotation.white.yDeg += 180;
        break;
      case FlipDirection.RIGHT_TO_LEFT:
        // Y軸周りに-180度回転
        newRotation.black.yDeg -= 180;
        newRotation.white.yDeg -= 180;
        break;
      case FlipDirection.TOP_TO_BOTTOM:
        // X軸周りに180度回転
        newRotation.black.xDeg += 180;
        newRotation.white.xDeg += 180;
        break;
      case FlipDirection.BOTTOM_TO_TOP:
        // X軸周りに-180度回転
        newRotation.black.xDeg -= 180;
        newRotation.white.xDeg -= 180;
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
   * @deprecated 代わりに calculateDirectionalRotation を使用してください
   */
  calculateColorBasedRotation: (
    fromColor: DiscColor,
    toColor: DiscColor,
  ): RotationState => {
    const defaultRotationState: RotationState = {
      black: {
        xDeg: 0,
        yDeg: 0,
      },
      white: {
        xDeg: 180,
        yDeg: 0,
      },
    };

    if (fromColor === DiscColor.BLACK && toColor === DiscColor.WHITE) {
      // BLACK to WHITE
      return defaultRotationState;
    }
    if (fromColor === DiscColor.WHITE && toColor === DiscColor.BLACK) {
      // WHITE to BLACK
      return defaultRotationState;
    }

    return {
      black: {
        xDeg: 90,
        yDeg: 0,
      },
      white: {
        xDeg: 90,
        yDeg: 0,
      },
    };
  },
};
