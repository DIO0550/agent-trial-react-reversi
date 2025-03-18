import { useState } from "react";

/**
 * CPUレベルの型
 */
type CpuLevel = "easy" | "normal" | "hard" | "strongest";

/**
 * プレイヤーの色（手番）の型
 */
type PlayerColor = "black" | "white";

/**
 * スタートメニューの設定項目
 */
type StartMenuSettings = {
  cpuLevel: CpuLevel;
  playerColor: PlayerColor;
};

/**
 * スタートメニューのProps
 */
type Props = {
  /**
   * ゲーム開始時のコールバック
   */
  onStart: (settings: StartMenuSettings) => void;
};

/**
 * CPUレベルの選択肢の定義
 */
const CPU_LEVEL_OPTIONS: { value: CpuLevel; label: string }[] = [
  { value: "easy", label: "弱い" },
  { value: "normal", label: "普通" },
  { value: "hard", label: "強い" },
  { value: "strongest", label: "最強" },
];

/**
 * プレイヤーの色（手番）の選択肢の定義
 */
const PLAYER_COLOR_OPTIONS: { value: PlayerColor; label: string }[] = [
  { value: "black", label: "先行" },
  { value: "white", label: "後攻" },
];

/**
 * リバーシゲームのスタート画面メニューコンポーネント
 * CPUのレベルとプレイヤーの手番を選択できる
 */
export const StartMenu = ({ onStart }: Props) => {
  // CPUレベルのステート (デフォルトは「普通」)
  const [cpuLevel, setCpuLevel] = useState<CpuLevel>("normal");
  
  // プレイヤーの色（手番）のステート (デフォルトは「先行(黒)」)
  const [playerColor, setPlayerColor] = useState<PlayerColor>("black");

  /**
   * スタートボタンのクリックハンドラ
   */
  const handleStartClick = () => {
    onStart({
      cpuLevel,
      playerColor,
    });
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">リバーシ</h2>

      {/* CPUレベル選択 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">CPUレベル</h3>
        <div className="flex flex-wrap gap-2">
          {CPU_LEVEL_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`
                py-2 px-4 rounded-md transition-all
                ${cpuLevel === option.value 
                  ? "border-2 border-blue-500 bg-blue-50" 
                  : "border-2 border-gray-300 hover:bg-gray-100"}
              `}
              onClick={() => setCpuLevel(option.value)}
              aria-pressed={cpuLevel === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* プレイヤー手番選択 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">手番</h3>
        <div className="flex gap-2">
          {PLAYER_COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`
                flex-1 py-2 px-4 rounded-md transition-all
                ${playerColor === option.value 
                  ? "border-2 border-blue-500 bg-blue-50" 
                  : "border-2 border-gray-300 hover:bg-gray-100"}
              `}
              onClick={() => setPlayerColor(option.value)}
              aria-pressed={playerColor === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

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