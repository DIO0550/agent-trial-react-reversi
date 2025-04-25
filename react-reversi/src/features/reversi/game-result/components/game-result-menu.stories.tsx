import type { Meta, StoryObj } from '@storybook/react';
import { GameResultMenu } from './game-result-menu';
import { GameResult } from '../../utils/game-result';

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

export const PlayerWins: Story = {
  args: {
    result: GameResult.PLAYER_WIN,
    playerScore: 40,
    cpuScore: 24,
    onRestart: () => {},
    onBackToMenu: () => {},
  },
};

export const PlayerLoses: Story = {
  args: {
    result: GameResult.PLAYER_LOSE,
    playerScore: 24,
    cpuScore: 40,
    onRestart: () => {},
    onBackToMenu: () => {},
  },
};

export const Draw: Story = {
  args: {
    result: GameResult.DRAW,
    playerScore: 32,
    cpuScore: 32,
    onRestart: () => {},
    onBackToMenu: () => {},
  },
};
