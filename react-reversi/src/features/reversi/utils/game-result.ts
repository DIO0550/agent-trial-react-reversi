/**
 * 勝敗の結果の値を表すオブジェクト
 * 外部には公開せず、GameResultオブジェクトからアクセスする
 */
const GameResultValues = {
  BLACK_WIN: 'BLACK_WIN',
  WHITE_WIN: 'WHITE_WIN',
  DRAW: 'DRAW',
  IN_PROGRESS: 'IN_PROGRESS',
} as const;

/**
 * GameResultオブジェクト
 * 値とその操作メソッドを含む
 */
export const GameResult = {
  ...GameResultValues,

  /**
   * 黒の勝ちかどうかを判定する
   * @param result ゲーム結果
   * @returns 黒の勝ちならtrue
   */
  isBlackWin: (result: GameResult): boolean => {
    return result === GameResultValues.BLACK_WIN;
  },

  /**
   * 白の勝ちかどうかを判定する
   * @param result ゲーム結果
   * @returns 白の勝ちならtrue
   */
  isWhiteWin: (result: GameResult): boolean => {
    return result === GameResultValues.WHITE_WIN;
  },

  /**
   * 引き分けかどうかを判定する
   * @param result ゲーム結果
   * @returns 引き分けならtrue
   */
  isDraw: (result: GameResult): boolean => {
    return result === GameResultValues.DRAW;
  },

  /**
   * ゲームが進行中かどうかを判定する
   * @param result ゲーム結果
   * @returns ゲームが進行中ならtrue
   */
  isInProgress: (result: GameResult): boolean => {
    return result === GameResultValues.IN_PROGRESS;
  },

  /**
   * 石の数から勝敗結果を判定する
   * @param blackCount 黒の石の数
   * @param whiteCount 白の石の数
   * @returns 勝敗結果
   */
  determineResult: (blackCount: number, whiteCount: number): GameResult => {
    if (blackCount > whiteCount) {
      return GameResultValues.BLACK_WIN;
    }

    if (blackCount < whiteCount) {
      return GameResultValues.WHITE_WIN;
    }

    return GameResultValues.DRAW;
  },

  /**
   * 勝敗結果の文字列表現を取得する
   * @param result 勝敗結果
   * @returns 人間が読みやすい文字列
   */
  toString: (result: GameResult): string => {
    switch (result) {
      case GameResultValues.BLACK_WIN:
        return '黒の勝ち';
      case GameResultValues.WHITE_WIN:
        return '白の勝ち';
      case GameResultValues.DRAW:
        return '引き分け';
      case GameResultValues.IN_PROGRESS:
        return 'ゲーム進行中';
      default:
        return '不明な結果';
    }
  },
};

/**
 * 勝敗の結果を表す型
 * GameResultValuesの値の型を取得
 */
export type GameResult =
  (typeof GameResultValues)[keyof typeof GameResultValues];
