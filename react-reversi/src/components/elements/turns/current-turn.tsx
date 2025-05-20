import { DiscColor } from '../../../features/reversi/utils/disc-color';

type Props = {
  /**
   * 現在の手番の色
   */
  currentTurn: DiscColor.Type;
};

/**
 * 現在の手番を表示するコンポーネント
 */
export const CurrentTurn = ({ currentTurn }: Props) => {
  return (
    <div className="mb-6 text-xl font-medium">
      <div className="flex items-center gap-2">
        <span>現在の手番：</span>
        <span
          className={`inline-block w-6 h-6 rounded-full ${
            currentTurn === DiscColor.BLACK
              ? 'bg-black'
              : 'bg-white border border-gray-300'
          }`}
        ></span>
        <span>{currentTurn === DiscColor.BLACK ? '黒' : '白'}</span>
      </div>
    </div>
  );
};
