import {
  CpuLevel,
  PlayerColor,
  SelectionOption,
} from "../types/start-menu-types";

/**
 * CPUレベルのデフォルト値
 */
export const DEFAULT_CPU_LEVEL: CpuLevel = "normal";

/**
 * プレイヤーの色（手番）のデフォルト値
 */
export const DEFAULT_PLAYER_COLOR: PlayerColor = "black";

/**
 * CPUレベルの選択肢の定義
 */
export const CPU_LEVEL_OPTIONS: SelectionOption<CpuLevel>[] = [
  { value: "easy", label: "弱い" },
  { value: "normal", label: "普通" },
  { value: "hard", label: "強い" },
  { value: "strongest", label: "最強" },
];

/**
 * プレイヤーの色（手番）の選択肢の定義
 */
export const PLAYER_COLOR_OPTIONS: SelectionOption<PlayerColor>[] = [
  { value: "black", label: "先行" },
  { value: "white", label: "後攻" },
];
