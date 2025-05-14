/**
 * 勝敗の結果の値を表すオブジェクト
 * 外部には公開せず、GameResultオブジェクトからアクセスする
 */
const GameResultValues = {
  PLAYER_WIN: 'PLAYER_WIN',
  PLAYER_LOSE: 'PLAYER_LOSE',
  DRAW: 'DRAW',
  IN_PROGRESS: 'IN_PROGRESS',
} as const;

/**
 * プレイヤー向けメッセージのマッピング
 */
const playerMessages = {
  PLAYER_WIN: '勝利しました！',
  PLAYER_LOSE: '敗北しました...',
  DRAW: '引き分け',
  IN_PROGRESS: 'ゲーム進行中',
};

/**
 * GameResultオブジェクト
 * 値とその操作メソッドを含む
 */
export const GameResult = {
  ...GameResultValues,

  /**
   * プレイヤーの勝ちかどうかを判定する
   * @param result ゲーム結果
   * @returns プレイヤーの勝ちならtrue
   */
  isPlayerWin: (result: GameResult): boolean => {
    return result === GameResultValues.PLAYER_WIN;
  },

  /**
   * プレイヤーの負けかどうかを判定する
   * @param result ゲーム結果
   * @returns プレイヤーの負けならtrue
   */
  isPlayerLose: (result: GameResult): boolean => {
    return result === GameResultValues.PLAYER_LOSE;
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
   * @param playerColor プレイヤーの石の色
   * @returns 勝敗結果
   */
  determineResult: (
    blackCount: number,
    whiteCount: number,
    playerColor: 'black' | 'white',
  ): GameResult => {
    // 引き分けの場合
    if (blackCount === whiteCount) {
      return GameResultValues.DRAW;
    }

    // プレイヤーが黒の場合
    if (playerColor === 'black') {
      return blackCount > whiteCount
        ? GameResultValues.PLAYER_WIN
        : GameResultValues.PLAYER_LOSE;
    }

    // プレイヤーが白の場合
    return whiteCount > blackCount
      ? GameResultValues.PLAYER_WIN
      : GameResultValues.PLAYER_LOSE;
  },

  /**
   * 勝敗結果の文字列表現を取得する
   * @param result 勝敗結果
   * @returns 人間が読みやすい文字列
   */
  toString: (result: GameResult): string => {
    return playerMessages[result] || '不明な結果';
  },
};

/**
 * 勝敗の結果を表す型
 * GameResultValuesの値の型を取得
 */
export type GameResult =
  (typeof GameResultValues)[keyof typeof GameResultValues];
