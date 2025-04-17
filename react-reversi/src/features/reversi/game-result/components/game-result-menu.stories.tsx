import type { Meta, StoryObj } from '@storybook/react';
import { GameResultMenu } from './game-result-menu';

const meta = {
  title: 'Features/Reversi/GameResult/GameResultMenu',
  component: GameResultMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRestart: { action: 'restart clicked' },
    onBackToMenu: { action: 'back to menu clicked' },
  },
} satisfies Meta<typeof GameResultMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Win: Story = {
  args: {
    result: 'win',
    playerScore: 40,
    cpuScore: 24,
  },
};

export const Lose: Story = {
  args: {
    result: 'lose',
    playerScore: 24,
    cpuScore: 40,
  },
};

export const Draw: Story = {
  args: {
    result: 'draw',
    playerScore: 32,
    cpuScore: 32,
  },
};
