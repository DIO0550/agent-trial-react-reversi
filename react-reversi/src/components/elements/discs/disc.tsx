import { DiscColor } from '@/features/reversi/types/reversi-types';

/**
 * ディスク(石)コンポーネントのProps
 */
type Props = {
  /** ディスクの色 */
  color: Exclude<DiscColor, DiscColor.NONE>;

  // X軸の回転角度
  rotateX?: number;
  /** Y軸の回転角度 */
  rotateY?: number;
};

export const Disk = ({ color, rotateX = 0, rotateY = 0 }: Props) => {
  const discClasses = `w-full h-full rounded-full shadow-md absolute backface-hidden  ${
    color === DiscColor.BLACK ? 'bg-black' : 'bg-white'
  }`;

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
