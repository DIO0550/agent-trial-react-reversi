'use client';
import { StartMenu } from '../features/start-menu/components/start-menu';
import { StartMenuSettings } from '../features/start-menu/types/start-menu-types';
import { useNavigation } from '@/hooks/use-navigation';

export default function Home() {
  const { navigateToReversiGame } = useNavigation();

  /**
   * ゲーム開始時の処理
   * 設定を受け取ってゲームページに遷移する
   */
  const handleStart = (settings: StartMenuSettings) => {
    // ゲーム画面に遷移する
    navigateToReversiGame({
      cpuLevel: settings.cpuLevel,
      playerColor: settings.playerColor,
    });
  };

  return (
    <div>
      <StartMenu onStart={handleStart} />
    </div>
  );
}
