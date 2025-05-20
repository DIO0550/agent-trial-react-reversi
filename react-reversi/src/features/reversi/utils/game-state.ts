import { GameResult } from '@/features/reversi/utils/game-result';
import { DiscColor } from '@/features/reversi/utils/disc-color';

/**
 * ゲームの状態を表す列挙型
 */
export enum GameStateType {
  PLAYING = 'PLAYING', // ゲーム進行中
  GAME_OVER = 'GAME_OVER', // ゲーム終了
}

/**
 * ゲームの状態を表す型
 */
export type GameState = {
  /** 現在のゲーム状態 */
  type: GameStateType;
  /** 勝敗結果 */
  result: GameResult;
  /** プレイヤーの石の色（勝敗判定で使用） */
  playerColor?: DiscColor.Type;
};

/**
 * ゲーム状態のコンパニオンオブジェクト
 */
export const GameState = {
  /**
   * 初期状態のゲーム状態を生成する
   * @param playerColor プレイヤーの石の色
   * @returns 初期状態のゲーム状態
   */
  createInitial: (playerColor?: DiscColor.Type): GameState => {
    return {
      type: GameStateType.PLAYING,
      result: GameResult.IN_PROGRESS,
      playerColor,
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
    // playerColorがない場合のデフォルト値（'black'）
    const playerColorStr =
      state.playerColor === DiscColor.Type.BLACK ? 'black' : 'white';

    // GameResultコンパニオンオブジェクトを使用して勝敗を判定
    const result = GameResult.determineResult(
      blackCount,
      whiteCount,
      playerColorStr,
    );

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
          // GameResultのtoStringメソッドを使用
          return GameResult.toString(state.result);
        default:
          return '不明な状態';
      }
    })();

    return `${statusStr} (黒:${blackCount}, 白:${whiteCount})`;
  },
};
