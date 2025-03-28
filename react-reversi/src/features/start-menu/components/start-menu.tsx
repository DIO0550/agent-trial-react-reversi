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
    // ランダムの場合は黒か白をランダムに決定
    if (playerColor === 'random') {
      const randomColor = Math.random() < 0.5 ? 'black' : 'white';
      onStart({
        cpuLevel,
        playerColor: randomColor as PlayerColor,
      });
      return;
    }

    onStart({
      cpuLevel,
      playerColor,
    });
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">リバーシ</h2>

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
        className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
        onClick={handleStartClick}
      >
        スタート
      </button>
    </div>
  );
};
