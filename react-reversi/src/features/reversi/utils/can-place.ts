/**
 * 黒と白の石それぞれについて、盤面上に石を置けるかどうかを管理する型
 */
export type CanPlace = {
  /** 黒の石が置けるかどうか */
  black: boolean;
  /** 白の石が置けるかどうか */
  white: boolean;
};

/**
 * CanPlaceオブジェクト
 * CanPlace型に関する操作を提供する
 */
export const CanPlace = {
  /**
   * CanPlace型の初期状態を作成する
   * 両方とも置けない状態で初期化
   * @returns 初期化されたCanPlaceオブジェクト
   */
  createEmpty(): CanPlace {
    return {
      black: false,
      white: false,
    };
  },

  /**
   * 黒の石を置けるかどうかを設定する
   * @param canPlace 更新するCanPlaceオブジェクト
   * @param canPlaceValue 置けるかどうかの真偽値
   * @returns 更新されたCanPlaceオブジェクトのコピー
   */
  setBlackCanPlace(canPlace: CanPlace, canPlaceValue: boolean): CanPlace {
    return {
      ...canPlace,
      black: canPlaceValue,
    };
  },

  /**
   * 白の石を置けるかどうかを設定する
   * @param canPlace 更新するCanPlaceオブジェクト
   * @param canPlaceValue 置けるかどうかの真偽値
   * @returns 更新されたCanPlaceオブジェクトのコピー
   */
  setWhiteCanPlace(canPlace: CanPlace, canPlaceValue: boolean): CanPlace {
    return {
      ...canPlace,
      white: canPlaceValue,
    };
  },

  /**
   * 現在の手番が置けるかどうかを取得する
   * @param canPlace チェック対象のCanPlaceオブジェクト
   * @param isBlackTurn 黒の手番かどうか
   * @returns 現在の手番が置けるならtrue、置けないならfalse
   */
  getCurrentTurnCanPlace(canPlace: CanPlace, isBlackTurn: boolean): boolean {
    return isBlackTurn ? canPlace.black : canPlace.white;
  },

  /**
   * CanPlaceオブジェクトをコピーする
   * @param canPlace コピー元のCanPlaceオブジェクト
   * @returns コピーされたCanPlaceオブジェクト
   */
  clone(canPlace: CanPlace): CanPlace {
    return {
      black: canPlace.black,
      white: canPlace.white,
    };
  },
};
