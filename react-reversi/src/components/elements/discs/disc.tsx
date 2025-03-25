import { useEffect, useState } from 'react';

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
  /** 裏返しのアニメーション中かどうか */
  isFlipping?: boolean;
  /** アニメーションの方向（x軸、y軸）*/
  flipAxis?: 'x' | 'y';
  /** ひっくり返る前の色 (アニメーション用) */
  previousColor?: DiscColor;
};

/**
 * アニメーションの状態を表す型
 */
type AnimationStage = 'not-flipping' | 'first-half' | 'second-half';

/**
 * リバーシの石コンポーネント
 */
export const Disc = ({
  color,
  onClick,
  canPlace = false,
  isFlipping = false,
  flipAxis = 'y',
  previousColor,
}: Props) => {
  // アニメーションの状態を管理
  const [animationStage, setAnimationStage] =
    useState<AnimationStage>('not-flipping');
  const [displayedColor, setDisplayedColor] = useState<DiscColor>(color);

  // isFlippingの変更を検知して、アニメーションを開始
  useEffect(() => {
    if (isFlipping && previousColor) {
      // アニメーション開始時は前の色を表示
      setDisplayedColor(previousColor);
      setAnimationStage('first-half');

      // 最初の半回転（90度）が終わったら色を変更
      const firstHalfTimer = setTimeout(() => {
        setDisplayedColor(color);
        setAnimationStage('second-half');
      }, 250);

      // アニメーション終了時に状態をリセット
      const endTimer = setTimeout(() => {
        setAnimationStage('not-flipping');
      }, 500);

      return () => {
        clearTimeout(firstHalfTimer);
        clearTimeout(endTimer);
      };
    } else if (!isFlipping) {
      // アニメーションがなければ現在の色を表示
      setDisplayedColor(color);
      setAnimationStage('not-flipping');
    }
  }, [isFlipping, color, previousColor]);

  // 色とcanPlaceに基づいたクラス名を決定
  const baseClasses = 'w-full h-full rounded-full';
  const cursorClasses = onClick ? 'cursor-pointer' : 'cursor-default';
  const borderClasses =
    canPlace && color === 'none'
      ? 'border-2 border-dashed border-gray-600'
      : '';
  const shadowClasses = color !== 'none' ? 'shadow-md' : '';

  // ディスクが空の場合（色がnoneの場合）
  if (color === 'none') {
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

  // アニメーションステージに応じたクラスを決定
  const getAnimationClass = () => {
    if (animationStage === 'first-half') {
      return flipAxis === 'y' ? 'animate-flip-half-y' : 'animate-flip-half-x';
    }
    if (animationStage === 'second-half') {
      return flipAxis === 'y'
        ? 'animate-flip-second-half-y'
        : 'animate-flip-second-half-x';
    }
    return '';
  };

  // 3D反転アニメーション用のクラス
  const containerClasses = 'relative w-full h-full perspective';
  const animationClass = getAnimationClass();
  const discClasses = `w-full h-full rounded-full shadow-md ${
    displayedColor === 'black' ? 'bg-black' : 'bg-white'
  }`;

  // テスト用のクラス
  const testRotateClass =
    animationStage !== 'not-flipping' ? `animate-flip-${flipAxis}` : '';

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      data-testid={`disc-${color}${isFlipping ? '-flipping' : ''}`}
      aria-label={`${color} disc${isFlipping ? ' (flipping)' : ''}`}
      role={onClick ? 'button' : 'presentation'}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative w-full h-full transition-transform ${animationClass} ${testRotateClass} transform-gpu preserve-3d`}
      >
        <div className={discClasses} />
      </div>
    </div>
  );
};
