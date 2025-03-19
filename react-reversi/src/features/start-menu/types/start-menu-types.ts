/**
 * CPUレベルの型
 */
export type CpuLevel = 'easy' | 'normal' | 'hard' | 'strongest';

/**
 * プレイヤーの色（手番）の型
 */
export type PlayerColor = 'black' | 'white';

/**
 * スタートメニューの設定項目
 */
export type StartMenuSettings = {
  cpuLevel: CpuLevel;
  playerColor: PlayerColor;
};

/**
 * スタートメニューのProps
 */
export type StartMenuProps = {
  /**
   * ゲーム開始時のコールバック
   */
  onStart: (settings: StartMenuSettings) => void;
};

/**
 * 選択肢の型
 */
export type SelectionOption<T> = {
  value: T;
  label: string;
};
