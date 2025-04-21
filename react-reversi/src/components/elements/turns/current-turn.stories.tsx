import type { Meta, StoryObj } from '@storybook/react';
import { CurrentTurn } from './current-turn';
import { DiscColor } from '../../../features/reversi/types/reversi-types';

const meta = {
  title: 'Elements/Turns/CurrentTurn',
  component: CurrentTurn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CurrentTurn>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 黒の手番表示
 */
export const BlackTurn: Story = {
  args: {
    currentTurn: DiscColor.BLACK,
  },
};

/**
 * 白の手番表示
 */
export const WhiteTurn: Story = {
  args: {
    currentTurn: DiscColor.WHITE,
  },
};
