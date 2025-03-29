import type { Meta, StoryObj } from '@storybook/react';
import { FlipCard } from './flip-card';
import { useState } from 'react';

const meta: Meta<typeof FlipCard> = {
  title: 'Elements/FlipCard',
  component: FlipCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FlipCard>;

/** クリックでひっくり返るデモ */
export const Interactive = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="w-[200px] h-[200px] cursor-pointer" onClick={handleClick}>
      <FlipCard
        front={
          <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white rounded-md">
            クリックで裏返る
          </div>
        }
        back={
          <div className="w-full h-full bg-red-500 flex items-center justify-center text-white rounded-md">
            クリックで表に戻る
          </div>
        }
        isFlipped={isFlipped}
      />
    </div>
  );
};
