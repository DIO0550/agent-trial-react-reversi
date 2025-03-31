'use client';
import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Board, BoardState } from '../../../components/elements/boards/board';
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
  const { discs, currentTurn, placeablePositions, placeDisc } = useDiscs();

  // useCpuPlayerフックを使用して、CPU思考処理を管理
  const { playerDiscColor, cpuDiscColor } = useCpuPlayer(
    cpuLevel,
    playerColor,
    discs,
    currentTurn,
    placeablePositions,
    placeDisc,
  );

  // 盤面の状態をBoardコンポーネントに渡す形式に変換する関数
  const convertToBoardState = useCallback(() => {
    const boardState: BoardState = Array(8)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({ color: DiscColor.NONE, canPlace: false })),
      );

    // 二次元配列からボード状態に変換
    discs.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        if (color !== DiscColor.NONE) {
          boardState[rowIndex][colIndex].color = color;
        }
      });
    });

    // 置ける場所を設定
    const placeable = placeablePositions();
    placeable.forEach(({ row, col }) => {
      boardState[row][col].canPlace = true;
    });

    return boardState;
  }, [discs, placeablePositions]);

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

      {/* ゲームボードと情報 */}
      <div className="relative mb-8">
        {/* ボード */}
        <Board
          boardState={boardState}
          onCellClick={handleCellClick}
          flippingDiscs={{}} // 空のオブジェクトを渡して初期化
        />

        {/* プレイヤーのスコア */}
        <div className="absolute bottom-4 left-4">
          <ScoreDisplay
            playerColor={playerDiscColor}
            cpuColor={cpuDiscColor}
            discs={discs}
            position="player"
          />
        </div>

        {/* CPUのスコア */}
        <div className="absolute top-4 right-4">
          <ScoreDisplay
            playerColor={playerDiscColor}
            cpuColor={cpuDiscColor}
            discs={discs}
            position="cpu"
          />
        </div>
      </div>
    </div>
  );
}
