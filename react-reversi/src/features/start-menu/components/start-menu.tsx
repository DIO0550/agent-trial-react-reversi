import { useState } from 'react';
import { SelectionGroup } from './selection-group';
import {
  CpuLevel,
  PlayerColor,
  StartMenuProps,
} from '../types/start-menu-types';
import {
  CPU_LEVEL_OPTIONS,
  DEFAULT_CPU_LEVEL,
  DEFAULT_PLAYER_COLOR,
  PLAYER_COLOR_OPTIONS,
} from '../constants/start-menu-constants';
import Image from 'next/image';
import { DiscColor } from '@/features/reversi/utils/disc-color';

/**
 * リバーシゲームのスタート画面メニューコンポーネント
 * CPUのレベルとプレイヤーの手番を選択できる
 */
export const StartMenu = ({ onStart }: StartMenuProps) => {
  // CPUレベルのステート (デフォルトは「普通」)
  const [cpuLevel, setCpuLevel] = useState<CpuLevel>(DEFAULT_CPU_LEVEL);

  // プレイヤーの色（手番）のステート (デフォルトは「先行(黒)」)
  const [playerColor, setPlayerColor] =
    useState<PlayerColor>(DEFAULT_PLAYER_COLOR);

  /**
   * スタートボタンのクリックハンドラ
   * ランダムが選択された場合は、黒か白をランダムに決定する
   */
  const handleStartClick = () => {
    // ランダムの場合は DiscColor.fromPlayerColor でランダムに決定する
    if (playerColor === 'random') {
      const discColor = DiscColor.fromPlayerColor(playerColor);
      const actualPlayerColor = discColor === DiscColor.Type.BLACK ? 'black' : 'white';
      
      onStart({
        cpuLevel,
        playerColor: actualPlayerColor,
      });
      return;
    }

    onStart({
      cpuLevel,
      playerColor,
    });
  };

  // ディスクの表示用配列（ボードのミニプレビュー用）
  const renderPreviewBoard = () => {
    return (
      <div className="grid grid-cols-4 grid-rows-4 gap-1 w-32 h-32 mx-auto mb-6 bg-green-700 p-2 rounded-md">
        {Array(16)
          .fill(null)
          .map((_, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;

            // 初期配置の石を表示
            let discColor = null;
            if ((row === 1 && col === 1) || (row === 2 && col === 2)) {
              discColor = 'white';
            } else if ((row === 1 && col === 2) || (row === 2 && col === 1)) {
              discColor = 'black';
            }

            return (
              <div
                key={index}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  discColor
                    ? discColor === 'black'
                      ? 'bg-black'
                      : 'bg-white'
                    : 'bg-green-600'
                }`}
              />
            );
          })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-green-600 p-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">リバーシ</h1>
          <p className="text-green-100">オセロ風ボードゲーム</p>
        </div>

        <div className="p-8">
          {/* ボードのミニプレビュー */}
          {renderPreviewBoard()}

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ゲーム設定
            </h2>

            {/* 対戦モード選択 - 人間 vs CPU のみ実装 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">対戦モード</h3>
              <div className="py-2 px-4 bg-blue-50 border-2 border-blue-500 rounded-md text-center">
                人間 vs CPU
              </div>
            </div>

            {/* CPUレベル選択 */}
            <SelectionGroup
              title="CPUレベル"
              options={CPU_LEVEL_OPTIONS}
              value={cpuLevel}
              onChange={setCpuLevel}
            />

            {/* プレイヤー手番選択 */}
            <SelectionGroup
              title="手番"
              options={PLAYER_COLOR_OPTIONS}
              value={playerColor}
              onChange={setPlayerColor}
              fullWidthOptions={true}
              className="mb-8"
            />

            {/* スタートボタン */}
            <button
              className="w-full py-4 px-6 bg-green-600 text-white font-bold text-lg rounded-md hover:bg-green-700 transition-colors shadow-md transform hover:scale-105 transition-transform duration-200"
              onClick={handleStartClick}
            >
              ゲームスタート
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
