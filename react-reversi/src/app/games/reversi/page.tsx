'use client';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Board, BoardState } from '../../../components/elements/boards/board';
import { useDiscs } from '../../../features/reversi/hooks/use-discs';
import {
  BoardPosition,
  DiscColor,
} from '../../../features/reversi/types/reversi-types';
import {
  CpuLevel,
  PlayerColor,
} from '../../../features/start-menu/types/start-menu-types';
import { createNormalCpuPlayer } from '../../../features/reversi/cpu-player/normal-cpu-player';
import { createStrongCpuPlayer } from '../../../features/reversi/cpu-player/strong-cpu-player';

export default function ReversiGamePage() {
  const searchParams = useSearchParams();

  // URLパラメータからCPUレベルとプレイヤーの色を取得
  const cpuLevel = (searchParams.get('cpuLevel') as CpuLevel) || 'normal';
  const playerColor =
    (searchParams.get('playerColor') as PlayerColor) || 'black';

  // useDiscsフックを使用して、ゲームの状態と石の配置を管理
  const {
    discs,
    currentTurn,
    flippingDiscs,
    placeablePositions,
    placeDisc,
    isAnimating,
  } = useDiscs();

  // 現在のプレイヤーがCPUかどうか判定
  const isCpuTurn =
    currentTurn ===
    (playerColor === 'black' ? DiscColor.WHITE : DiscColor.BLACK);

  // CPUプレイヤーの初期化
  const [cpuPlayer] = useState(() => {
    switch (cpuLevel) {
      case 'easy':
        // 弱いCPUは適当な位置に配置する（ランダム選択）
        return {
          calculateNextMove: (board: number[][], currentPlayer: number) => {
            const positions = placeablePositions();
            const randomIndex = Math.floor(Math.random() * positions.length);
            return positions[randomIndex];
          },
        };
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

  // 盤面の状態をBoardコンポーネントに渡す形式に変換する関数
  const convertToBoardState = useCallback(() => {
    const boardState: BoardState = Array(8)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({ color: DiscColor.NONE, canPlace: false })),
      );

    // 石の配置情報をボード状態に変換
    Object.entries(discs).forEach(([key, color]) => {
      const [row, col] = key.split(',').map(Number);
      boardState[row][col].color = color;
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
      } catch (error) {
        // エラーが発生した場合は何もしない
        // （石が置けない場所でのクリックなど）
      }
    },
    [placeDisc],
  );

  // CPUの思考ロジックを実行
  useEffect(() => {
    // アニメーション中またはCPUの番でない場合は何もしない
    if (isAnimating || !isCpuTurn) return;

    // 配置可能な位置を取得
    const positions = placeablePositions();

    // 置ける場所がない場合は何もしない
    if (positions.length === 0) return;

    // CPUの思考時間を再現するため少し遅延させる
    const timer = setTimeout(() => {
      try {
        // CPUの手を計算
        const board = Array(8)
          .fill(0)
          .map(() => Array(8).fill(0));
        // DiscColorをnumber型に変換して board に設定
        Object.entries(discs).forEach(([key, color]) => {
          const [row, col] = key.split(',').map(Number);
          board[row][col] = color === DiscColor.BLACK ? 1 : 2;
        });

        // CPUプレイヤーに次の手を計算させる
        const cpuPlayerNumber = playerColor === 'black' ? 2 : 1;
        const nextMove = cpuPlayer.calculateNextMove(board, cpuPlayerNumber);

        // 計算された位置に石を置く
        placeDisc(nextMove);
      } catch (error) {
        console.error('CPU error:', error);
      }
    }, 1000); // 1秒後にCPUが打つ

    return () => clearTimeout(timer);
  }, [
    currentTurn,
    isAnimating,
    isCpuTurn,
    discs,
    placeablePositions,
    placeDisc,
    cpuPlayer,
    playerColor,
  ]);

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
            className={`inline-block w-6 h-6 rounded-full ${currentTurn === DiscColor.BLACK ? 'bg-black' : 'bg-white border border-gray-300'}`}
          ></span>
          <span>{currentTurn === DiscColor.BLACK ? '黒' : '白'}</span>
        </div>
      </div>

      {/* ボード */}
      <div className="mb-8">
        <Board
          boardState={boardState}
          onCellClick={handleCellClick}
          flippingDiscs={flippingDiscs}
        />
      </div>

      {/* ゲーム情報 */}
      <div className="text-lg mb-4">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-black"></span>
            <span>
              黒:{' '}
              {
                Object.values(discs).filter(
                  (color) => color === DiscColor.BLACK,
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-white border border-gray-300"></span>
            <span>
              白:{' '}
              {
                Object.values(discs).filter(
                  (color) => color === DiscColor.WHITE,
                ).length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
