import React from 'react';

type GameResult = 'win' | 'lose' | 'draw';

type Props = {
  /**
   * ゲームの結果
   */
  result: GameResult;
  /**
   * プレイヤーのスコア
   */
  playerScore: number;
  /**
   * CPUのスコア
   */
  cpuScore: number;
  /**
   * リスタートボタンがクリックされたときのハンドラ
   */
  onRestart: () => void;
  /**
   * メニューに戻るボタンがクリックされたときのハンドラ
   */
  onBackToMenu: () => void;
};

/**
 * ゲーム終了時に表示する結果メニューコンポーネント
 */
export const GameResultMenu = ({
  result,
  playerScore,
  cpuScore,
  onRestart,
  onBackToMenu,
}: Props): JSX.Element => {
  const createResultMessage = (result: GameResult): string => {
    switch (result) {
      case 'win':
        return '勝利しました！';
      case 'lose':
        return '敗北しました...';
      case 'draw':
        return '引き分けです';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {createResultMessage(result)}
        </h2>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">あなた:</span>
            <span className="font-bold">{playerScore}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">CPU:</span>
            <span className="font-bold">{cpuScore}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            もう一度プレイ
          </button>
          <button
            onClick={onBackToMenu}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
          >
            メニューに戻る
          </button>
        </div>
      </div>
    </div>
  );
};
