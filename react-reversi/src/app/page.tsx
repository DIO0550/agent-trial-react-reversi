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
    // ゲーム画面に遷移する
    router.push(
      `/games/reversi?cpuLevel=${settings.cpuLevel}&playerColor=${settings.playerColor}`,
    );
  };

  return (
    <div>
      <StartMenu onStart={handleStart} />
    </div>
  );
}
