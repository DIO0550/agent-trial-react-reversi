'use client';

import { useRouter } from 'next/navigation';
import { StartMenu } from '../features/start-menu/components/start-menu';
import { StartMenuSettings } from '../features/start-menu/types/start-menu-types';

export default function Home() {
  const router = useRouter();

  /**
   * ゲーム開始時の処理
   * 設定を受け取ってゲームページに遷移する
   */
  const handleStart = (settings: StartMenuSettings) => {
    // 画面遷移などは一旦なしとのことなので、コンソールにログを出力するだけにしておく
    console.log('ゲーム開始: ', settings);
    // 実際に画面遷移する場合は以下のようなコード
    // router.push(`/games/reversi?cpuLevel=${settings.cpuLevel}&playerColor=${settings.playerColor}`);
  };

  return (
    <div>
      <StartMenu onStart={handleStart} />
    </div>
  );
}
