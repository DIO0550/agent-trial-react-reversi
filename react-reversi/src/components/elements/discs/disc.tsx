import { DiscColor } from '@/features/reversi/types/reversi-types';

const baseClasses = 'w-full h-full rounded-full';

/**
 * ディスク(石)コンポーネントのProps
 */
type Props = {
  /** ディスクの色 */
  color: Exclude<DiscColor, DiscColor.NONE>;
  /** 置くことが可能かどうか（ヒント表示用） */
  canPlace?: boolean;

  // X軸の回転角度
  rotateX?: number;
  /** Y軸の回転角度 */
  rotateY?: number;
};

export const Disk = ({ color, canPlace, rotateX = 0, rotateY = 0 }: Props) => {
  const discClasses = `w-full h-full rounded-full shadow-md absolute backface-hidden  ${
    color === DiscColor.BLACK ? 'bg-black' : 'bg-white'
  }`;

  if (canPlace) {
    return (
      <div
        className={`${baseClasses} border-2 border-dashed border-gray-600 ${discClasses}`}
        data-testid="disc-can-place"
        aria-label="empty disc (can place here)"
        role="presentation"
      />
    );
  }

  const rotateXClass = `${rotateX < 0 ? '-rotate-x-' + String(rotateX * -1) : 'rotate-x-' + String(rotateX)}`;
  const rotateYClass = `${rotateY < 0 ? '-rotate-y-' + String(rotateY * -1) : 'rotate-y-' + String(rotateY)}`;
  const transformClasses = `transform-style-3d ${rotateXClass} ${rotateYClass}`;

  return (
    <div
      className={`transition-transform duration-1000 ${discClasses} ${transformClasses}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    />
  );
};
