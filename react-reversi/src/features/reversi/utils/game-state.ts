/**
 * ゲームの状態を表す列挙型
 */
export enum GameStateType {
  PLAYING = 'PLAYING', // ゲーム進行中
  GAME_OVER = 'GAME_OVER', // ゲーム終了
}

/**
 * 勝敗の結果を表す列挙型
 */
export enum GameResult {
  BLACK_WIN = 'BLACK_WIN',
  WHITE_WIN = 'WHITE_WIN',
  DRAW = 'DRAW',
  IN_PROGRESS = 'IN_PROGRESS',
}

/**
 * ゲームの状態を表す型
 */
export type GameState = {
  /** 現在のゲーム状態 */
  type: GameStateType;
  /** 勝敗結果 */
  result: GameResult;
};

/**
 * ゲーム状態のコンパニオンオブジェクト
 */
export const GameState = {
  /**
   * 初期状態のゲーム状態を生成する
   * @returns 初期状態のゲーム状態
   */
  createInitial: (): GameState => {
    return {
      type: GameStateType.PLAYING,
      result: GameResult.IN_PROGRESS,
    };
  },

  /**
   * ゲーム終了状態に更新する
   * @param state 現在のゲーム状態
   * @param blackCount 黒の石の数
   * @param whiteCount 白の石の数
   * @returns 更新されたゲーム状態
   */
  setGameOver: (
    state: GameState,
    blackCount: number,
    whiteCount: number,
  ): GameState => {
    // 勝敗を判定
    let result = GameResult.DRAW;
    if (blackCount > whiteCount) {
      result = GameResult.BLACK_WIN;
    } else if (blackCount < whiteCount) {
      result = GameResult.WHITE_WIN;
    }

    return {
      ...state,
      type: GameStateType.GAME_OVER,
      result,
    };
  },

  /**
   * ゲームが終了しているかどうかを判定する
   * @param state ゲーム状態
   * @returns ゲームが終了していればtrue、そうでなければfalse
   */
  isGameOver: (state: GameState): boolean => {
    return state.type === GameStateType.GAME_OVER;
  },

  /**
   * 現在のゲーム状態の文字列表現
   * @param state ゲーム状態
   * @param blackCount 黒の石の数
   * @param whiteCount 白の石の数
   * @returns 人間が読みやすい文字列
   */
  toString: (
    state: GameState,
    blackCount: number,
    whiteCount: number,
  ): string => {
    const statusStr = (() => {
      switch (state.type) {
        case GameStateType.PLAYING:
          return 'ゲーム進行中';
        case GameStateType.GAME_OVER:
          switch (state.result) {
            case GameResult.BLACK_WIN:
              return '黒の勝ち';
            case GameResult.WHITE_WIN:
              return '白の勝ち';
            case GameResult.DRAW:
              return '引き分け';
            default:
              return 'ゲーム終了';
          }
        default:
          return '不明な状態';
      }
    })();

    return `${statusStr} (黒:${blackCount}, 白:${whiteCount})`;
  },
};
