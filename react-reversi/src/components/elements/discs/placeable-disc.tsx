// filepath: /app/react-reversi/src/components/elements/discs/placeable-disc.tsx

/**
 * 配置可能なディスクを表示するコンポーネントのProps
 */
type Props = {
  /** クリック時のイベントハンドラ */
  onClick?: () => void;
};

/**
 * 配置可能な場所を示すディスクコンポーネント
 */
export const PlaceableDisc = ({ onClick }: Props) => {
  const baseClasses = 'w-full h-full rounded-full';
  const cursorClasses = onClick ? 'cursor-pointer' : 'cursor-default';

  return (
    <div
      className={`${baseClasses} ${cursorClasses} bg-black/20 border-2 border-dashed border-gray-600`}
      onClick={onClick}
      data-testid="disc-placeable"
      aria-label="placeable disc position"
      role={onClick ? 'button' : 'presentation'}
    />
  );
};
