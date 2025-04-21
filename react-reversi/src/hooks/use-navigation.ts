import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * アプリケーション全体で使用するナビゲーション機能を提供するカスタムフック
 *
 * @returns ナビゲーション関連の関数オブジェクト
 */
export const useNavigation = () => {
  const router = useRouter();

  // ホーム画面（スタートメニュー）に移動
  const navigateToHome = useCallback(() => {
    router.push('/');
  }, [router]);

  // リバーシゲーム画面に移動
  const navigateToReversiGame = useCallback(
    (cpuLevel: string, playerColor: string) => {
      router.push(
        `/games/reversi?cpuLevel=${cpuLevel}&playerColor=${playerColor}`,
      );
    },
    [router],
  );

  // 現在のページをリロード
  const reloadCurrentPage = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    navigateToHome,
    navigateToReversiGame,
    reloadCurrentPage,
  };
};
