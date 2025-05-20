import { DiscColor as DiscColorEnum } from '../types/reversi-types';
import { PlayerColor } from '@/features/start-menu/types/start-menu-types';

/**
 * DiscColorのコンパニオンオブジェクト
 * PlayerColorからDiscColorを生成する関数を提供
 */
export const DiscColor = {
  /**
   * PlayerColorからDiscColorを生成する
   * @param playerColor プレイヤーの色
   * @returns 対応するDiscColor
   */
  fromPlayerColor: (playerColor: PlayerColor): DiscColorEnum => {
    // ランダムの場合は、ランダムに黒または白を返す
    if (playerColor === 'random') {
      return Math.random() < 0.5 ? DiscColorEnum.BLACK : DiscColorEnum.WHITE;
    }
    
    // 黒または白の場合は、対応するDiscColorを返す
    return playerColor === 'black' ? DiscColorEnum.BLACK : DiscColorEnum.WHITE;
  },
};