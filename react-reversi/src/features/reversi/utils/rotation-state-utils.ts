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
 * 回転方向を表す列挙型
 */
export enum FlipDirection {
  LEFT_TO_RIGHT = 'leftToRight', // 左から右
  RIGHT_TO_LEFT = 'rightToLeft', // 右から左
  TOP_TO_BOTTOM = 'topToBottom', // 上から下
  BOTTOM_TO_TOP = 'bottomToTop', // 下から上
}

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
  fromDiscColor: (discColor: number): RotationState => {
    switch (discColor) {
      case 1: // BLACK
        return { xDeg: 0, yDeg: 0 };
      case 2: // WHITE
        return { xDeg: 180, yDeg: 0 };
      case 0: // NONE
      default:
        return { xDeg: 90, yDeg: 0 };
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
    fromColor: number,
    toColor: number,
  ): RotationState => {
    if (fromColor === 1 && toColor === 2) {
      // BLACK to WHITE
      return { xDeg: 180, yDeg: 0 };
    }
    if (fromColor === 2 && toColor === 1) {
      // WHITE to BLACK
      return { xDeg: 0, yDeg: 0 };
    }
    return { xDeg: 90, yDeg: 0 };
  },
};
