type Props = {
  /** 表面の要素 */
  front: React.ReactNode;
  /** 裏面の要素 */
  back: React.ReactNode;
  /** ひっくり返すかどうか */
  isFlipped?: boolean;
  /** ひっくり返す軸 */
  flipAxis?: 'x' | 'y';
};

/**
 * ひっくり返るカードコンポーネント
 */
export const FlipCard = ({
  front,
  back,
  isFlipped = false,
  flipAxis = 'y',
}: Props) => {
  const containerClasses = 'relative w-full h-full perspective';
  const cardClasses = `relative w-full h-full transition-transform duration-500 transform-gpu preserve-3d ${
    isFlipped ? 'rotate-y-180' : ''
  }`;

  const frontClasses = 'absolute w-full h-full backface-hidden';
  const backClasses = 'absolute w-full h-full backface-hidden rotate-y-180';

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        <div className={frontClasses}>{front}</div>
        <div className={backClasses}>{back}</div>
      </div>
    </div>
  );
};
