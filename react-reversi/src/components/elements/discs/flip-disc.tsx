import { Disk } from './disc';
import { DiscColor } from '@/features/reversi/types/reversi-types';

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
  /** アニメーション完了時のコールバック関数 */
  onFlipComplete?: () => void;
  /** X軸の回転角度 */
  blackRotateX: number;
  /** Y軸の回転角度 */
  blackRotateY: number;
  /** X軸の回転角度 */
  whiteRotateX: number;
  /** Y軸の回転角度 */
  whiteRotateY: number;
};

/**
 * リバーシの石コンポーネント
 */
export const FlipDisc = ({
  color,
  onClick,
  canPlace = false,
  onFlipComplete,
  blackRotateX,
  blackRotateY,
  whiteRotateX,
  whiteRotateY,
}: Props) => {
  // 色とcanPlaceに基づいたクラス名を決定
  const baseClasses = 'w-full h-full rounded-full ';
  const cursorClasses = onClick ? 'cursor-pointer' : 'cursor-default';
  const borderClasses =
    canPlace && color === DiscColor.NONE
      ? 'border-2 border-dashed border-gray-600'
      : '';

  // ディスクが空の場合（色がnoneの場合）
  if (color === DiscColor.NONE) {
    return (
      <div
        className={`${baseClasses} ${cursorClasses} ${borderClasses} bg-transparent`}
        onClick={onClick}
        data-testid={`disc-none${canPlace ? '-can-place' : ''}`}
        aria-label={`empty disc${canPlace ? ' (can place here)' : ''}`}
        role={onClick ? 'button' : 'presentation'}
      />
    );
  }

  if (canPlace) {
    return <Disk color={DiscColor.BLACK} canPlace />;
  }

  // 3D反転アニメーション用のクラス
  const containerClasses =
    'relative w-full h-full perspective-1000 preserve-3d';

  // トランジション完了時のハンドラー
  const handleTransitionEnd = () => {
    onFlipComplete?.();
  };

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      data-testid={`disc-${color}`}
      aria-label={`${color} disc`}
      role={onClick ? 'button' : 'presentation'}
      style={{ perspective: '1000px' }}
      onTransitionEnd={handleTransitionEnd}
    >
      <Disk
        color={DiscColor.BLACK}
        rotateX={blackRotateX}
        rotateY={blackRotateY}
      />
      <Disk
        color={DiscColor.WHITE}
        rotateX={whiteRotateX}
        rotateY={whiteRotateY}
      />
    </div>
  );
};
