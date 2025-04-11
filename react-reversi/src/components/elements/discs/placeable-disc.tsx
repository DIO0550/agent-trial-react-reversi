// filepath: /app/react-reversi/src/components/elements/discs/placeable-disc.tsx
/**
 * 石を置ける場所を表示するコンポーネント
 * 点線の丸で置ける場所を示します
 */
export const PlaceableDisc = () => {
  const baseClasses = 'w-full h-full rounded-full';
  const placeableClasses = 'border-2 border-dashed border-gray-600';

  return (
    <div
      className={`${baseClasses} ${placeableClasses}`}
      data-testid="placeable-disc"
      aria-label="配置可能な位置"
      role="presentation"
    />
  );
};
