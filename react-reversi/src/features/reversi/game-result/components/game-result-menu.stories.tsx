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

export const BlackPlayerWins: Story = {
  args: {
    result: 'BLACK_WIN',
    playerColor: 'black',
    playerScore: 40,
    cpuScore: 24,
  },
};

export const WhitePlayerWins: Story = {
  args: {
    result: 'WHITE_WIN',
    playerColor: 'white',
    playerScore: 40,
    cpuScore: 24,
  },
};

export const BlackPlayerLoses: Story = {
  args: {
    result: 'WHITE_WIN',
    playerColor: 'black',
    playerScore: 24,
    cpuScore: 40,
  },
};

export const WhitePlayerLoses: Story = {
  args: {
    result: 'BLACK_WIN',
    playerColor: 'white',
    playerScore: 24,
    cpuScore: 40,
  },
};

export const Draw: Story = {
  args: {
    result: 'DRAW',
    playerColor: 'black',
    playerScore: 32,
    cpuScore: 32,
  },
};
