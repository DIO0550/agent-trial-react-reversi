import { PlayerColor } from '@/features/start-menu/types/start-menu-types';

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
 * 石の色を表す列挙型と関連する関数を提供する名前空間
 */
export namespace DiscColor {
  /**
   * PlayerColorからDiscColorを生成する
   * @param playerColor プレイヤーの色
   * @returns 対応するDiscColor
   */
  export function fromPlayerColor(playerColor: PlayerColor): DiscColor {
    // ランダムの場合は、ランダムに黒または白を返す
    if (playerColor === 'random') {
      return Math.random() < 0.5 ? DiscColor.BLACK : DiscColor.WHITE;
    }
    
    // 黒または白の場合は、対応するDiscColorを返す
    return playerColor === 'black' ? DiscColor.BLACK : DiscColor.WHITE;
  }
}