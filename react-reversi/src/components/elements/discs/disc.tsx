/**
 * ディスク(石)の色を表す型
 */
export type DiscColor = 'black' | 'white' | 'none';

/**
 * ディスク(石)コンポーネントのProps
 */
type Props = {
  /** ディスクの色 */
  color: DiscColor;
  /** クリック時のイベントハンドラ */
  onClick?: () => void;
  /** 置くことが可能かどうか（ヒント表示用） */
  canPlace?: boolean;
};

/**
 * リバーシの石コンポーネント
 */
export const Disc = ({ color, onClick, canPlace = false }: Props) => {
  // 色とcanPlaceに基づいたクラス名を決定
  const baseClasses =
    'w-full h-full rounded-full transition-all duration-300 ease-in-out';
  const colorClasses =
    color === 'black'
      ? 'bg-black'
      : color === 'white'
        ? 'bg-white'
        : 'bg-transparent';
  const cursorClasses = onClick ? 'cursor-pointer' : 'cursor-default';
  const borderClasses =
    canPlace && color === 'none'
      ? 'border-2 border-dashed border-gray-600'
      : '';
  const shadowClasses = color !== 'none' ? 'shadow-md' : '';

  return (
    <div
      className={`${baseClasses} ${colorClasses} ${cursorClasses} ${borderClasses} ${shadowClasses}`}
      onClick={onClick}
      data-testid={`disc-${color}${canPlace ? '-can-place' : ''}`}
      aria-label={`${color} disc${canPlace ? ' (can place here)' : ''}`}
      role={onClick ? 'button' : 'presentation'}
    />
  );
};
