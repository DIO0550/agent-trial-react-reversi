'use client';
import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Board } from '../../../components/elements/boards/board';
import { ScoreDisplay } from '../../../components/elements/scores/score-display';
import { useDiscs } from '../../../features/reversi/hooks/use-discs';
import { useCpuPlayer } from '../../../features/reversi/hooks/use-cpu-player';
import { DiscColor } from '../../../features/reversi/types/reversi-types';
import {
  CpuLevel,
  PlayerColor,
} from '../../../features/start-menu/types/start-menu-types';

export default function ReversiGamePage() {
  const searchParams = useSearchParams();
  // URLパラメータからCPUレベルとプレイヤーの色を取得
  const cpuLevel = (searchParams.get('cpuLevel') as CpuLevel) || 'normal';
  const playerColor =
    (searchParams.get('playerColor') as PlayerColor) || 'black';

  // useDiscsフックを使用して、ゲームの状態と石の配置を管理
  const {
    board,
    currentTurn,
    placeablePositions,
    placeDisc,
    notifyFlipCompleted,
  } = useDiscs();

  // useCpuPlayerフックを使用して、CPU思考処理を管理
  const { playerDiscColor, cpuDiscColor } = useCpuPlayer(
    cpuLevel,
    playerColor,
    board,
    currentTurn,
    placeablePositions,
    placeDisc,
  );

  // 盤面の状態をBoardコンポーネントに渡す形式に変換する関数
  const convertToBoardState = useCallback(() => {
    // board型はすでにBoardコンポーネントに必要な形式なので、そのまま返す
    return board;
  }, [board]);

  // セルがクリックされた時のハンドラ
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      try {
        placeDisc({ row, col });
      } catch {
        // エラーが発生した場合は何もしない
        // （石が置けない場所でのクリックなど）
      }
    },
    [placeDisc],
  );

  // フリップアニメーション完了時のハンドラ
  const handleFlipComplete = useCallback(() => {
    notifyFlipCompleted();
  }, [notifyFlipCompleted]);

  // 現在の盤面状態を取得
  const boardState = convertToBoardState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-100">
      <h1 className="text-3xl font-bold mb-4">リバーシゲーム</h1>

      {/* 現在の手番表示 */}
      <div className="mb-6 text-xl font-medium">
        <div className="flex items-center gap-2">
          <span>現在の手番：</span>
          <span
            className={`inline-block w-6 h-6 rounded-full ${
              currentTurn === DiscColor.BLACK
                ? 'bg-black'
                : 'bg-white border border-gray-300'
            }`}
          ></span>
          <span>{currentTurn === DiscColor.BLACK ? '黒' : '白'}</span>
        </div>
      </div>

      {/* ゲームボードとスコア表示のコンテナ - 相対位置にして内部のスコア配置の基準にする */}
      <div className="relative mb-8">
        {/* CPUのスコア - ボードの上部右側に表示 */}
        <div className="absolute -top-16 right-0">
          <ScoreDisplay
            playerColor={playerDiscColor}
            cpuColor={cpuDiscColor}
            discs={board}
            position="cpu"
          />
        </div>

        {/* ボード */}
        <Board
          boardState={boardState}
          currentTurn={currentTurn}
          onCellClick={handleCellClick}
          onFlipComplete={handleFlipComplete}
        />

        {/* プレイヤーのスコア - ボードの下部左側に表示 */}
        <div className="absolute -bottom-16 left-0">
          <ScoreDisplay
            playerColor={playerDiscColor}
            cpuColor={cpuDiscColor}
            discs={board}
            position="player"
          />
        </div>
      </div>
    </div>
  );
}
