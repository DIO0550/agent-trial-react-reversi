import { DiscColor } from '../../../features/reversi/utils/disc-color';

type Props = {
  /** 表示する石の色 */
  discColor: DiscColor.Type;
  /** 表示する石の数 */
  count: number;
};

/**
 * スコア表示用のコンポーネント
 * 指定された色の石の数を表示する
 */
export const ScoreDisplay = ({ discColor, count }: Props) => {
  // 石の色に応じたスタイルを適用
  const colorStyles = {
    [DiscColor.Type.BLACK]: 'bg-black text-white',
    [DiscColor.Type.WHITE]: 'bg-white text-black',
    [DiscColor.Type.NONE]: '', // NONEは使用しない想定
  };

  // 石の色に応じたリングカラーを定義（コントラストを確保）
  const ringStyles = {
    [DiscColor.Type.BLACK]: 'ring-2 ring-white',
    [DiscColor.Type.WHITE]: 'ring-2 ring-black',
    [DiscColor.Type.NONE]: '',
  };

  return (
    <div
      className={`flex items-center justify-center p-2 rounded-full shadow-md`}
      data-testid={`score-${discColor}`}
    >
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-full ${colorStyles[discColor]} border border-gray-300`}
      >
        <div
          className={`w-5 h-5 rounded-full ${colorStyles[discColor]} ${ringStyles[discColor]} shadow-inner flex items-center justify-center`}
          aria-hidden="true"
        />
        <span className="font-bold text-lg">{count}</span>
      </div>
    </div>
  );
};
