import { DiscColor } from '../../../features/reversi/types/reversi-types';

type Props = {
  /** プレイヤーの石の色 */
  playerColor: DiscColor;
  /** CPUの石の色 */
  cpuColor: DiscColor;
  /** すべての石の配置状態 */
  discs: { [key: string]: DiscColor };
  /** 表示位置 'player' または 'cpu' */
  position: 'player' | 'cpu';
};

/**
 * スコア表示用のコンポーネント
 * プレイヤーまたはCPUの石の数を表示する
 */
export const ScoreDisplay = ({
  playerColor,
  cpuColor,
  discs,
  position,
}: Props) => {
  // 石の数をカウント
  const countDiscs = (color: DiscColor): number => {
    return Object.values(discs).filter((discColor) => discColor === color)
      .length;
  };

  const playerCount = countDiscs(playerColor);
  const cpuCount = countDiscs(cpuColor);

  // 表示する色と数を決定
  const displayColor = position === 'player' ? playerColor : cpuColor;
  const displayCount = position === 'player' ? playerCount : cpuCount;

  // 表示位置に応じたスタイルを適用
  const positionStyles = {
    player: 'bottom-4 left-4',
    cpu: 'top-4 right-4',
  };

  // 石の色に応じたスタイルを適用
  const colorStyles = {
    [DiscColor.BLACK]: 'bg-black text-white',
    [DiscColor.WHITE]: 'bg-white text-black',
    [DiscColor.NONE]: '', // NONEは使用しない想定
  };

  return (
    <div
      className={`absolute ${positionStyles[position]} flex items-center justify-center p-2 rounded-full shadow-md`}
      data-testid={`score-${position}`}
    >
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-full ${colorStyles[displayColor]} border border-gray-300`}
      >
        <div
          className={`w-5 h-5 rounded-full ${colorStyles[displayColor]} shadow-inner flex items-center justify-center`}
          aria-hidden="true"
        />
        <span className="font-bold text-lg">{displayCount}</span>
      </div>
    </div>
  );
};
