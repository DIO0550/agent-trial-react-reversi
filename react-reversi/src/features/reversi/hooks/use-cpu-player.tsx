import { useEffect, useState, useCallback } from 'react';
import { DiscColor, Board, BoardPosition } from '../types/reversi-types';
import { createWeakCpuPlayer } from '../cpu-player/weak-cpu-player';
import { createNormalCpuPlayer } from '../cpu-player/normal-cpu-player';
import { createStrongCpuPlayer } from '../cpu-player/strong-cpu-player';
import { CpuPlayer } from '../cpu-player/types/cpu-player-types';
import { CpuLevel, PlayerColor } from '../../start-menu/types/start-menu-types';

/**
 * CPU思考処理のためのカスタムフック
 * リバーシゲームでのCPUプレイヤーの動作を制御する
 */
export const useCpuPlayer = (
  cpuLevel: CpuLevel,
  playerColor: PlayerColor,
  discs: Board,
  currentTurn: DiscColor,
  placeablePositions: () => BoardPosition[],
  placeDisc: (position: BoardPosition) => void,
) => {
  // プレイヤーとCPUの色を設定
  const playerDiscColor =
    playerColor === 'black' ? DiscColor.BLACK : DiscColor.WHITE;
  const cpuDiscColor =
    playerColor === 'black' ? DiscColor.WHITE : DiscColor.BLACK;

  // 現在のプレイヤーがCPUかどうか判定
  const isCpuTurn = currentTurn === cpuDiscColor;

  // CPUプレイヤーの初期化
  const [cpuPlayer] = useState<CpuPlayer>(() => {
    switch (cpuLevel) {
      case 'easy':
        return createWeakCpuPlayer();
      case 'hard':
        return createStrongCpuPlayer();
      case 'strongest':
        // 最強CPUも一旦strongCPUを使用
        return createStrongCpuPlayer();
      case 'normal':
      default:
        return createNormalCpuPlayer();
    }
  });

  // CPU思考ロジックを実行して次の手を計算する
  const thinkNextMove = useCallback(() => {
    try {
      // Boardはすでに適切な形式なので変換不要
      // CPUプレイヤーに次の手を計算させる
      const cpuPlayerNumber = playerColor === 'black' ? 2 : 1;
      return cpuPlayer.calculateNextMove(discs, cpuPlayerNumber);
    } catch (error) {
      console.error('CPU error:', error);
      return null;
    }
  }, [discs, cpuPlayer, playerColor]);

  // CPUの思考ロジックを実行
  useEffect(() => {
    // アニメーション中またはCPUの番でない場合は何もしない
    if (!isCpuTurn) return;

    // 配置可能な位置を取得
    const positions = placeablePositions();

    // 置ける場所がない場合は何もしない
    if (positions.length === 0) return;

    // CPUの思考時間を再現するため少し遅延させる
    const timer = setTimeout(() => {
      try {
        // 次の手を計算して石を置く
        const nextMove = thinkNextMove();
        if (nextMove) {
          placeDisc(nextMove);
        }
      } catch (error) {
        console.error('CPU execution error:', error);
      }
    }, 1000); // 1秒後にCPUが打つ

    return () => clearTimeout(timer);
  }, [isCpuTurn, placeablePositions, thinkNextMove, placeDisc]);

  return {
    isCpuTurn,
    cpuDiscColor,
    playerDiscColor,
  };
};
