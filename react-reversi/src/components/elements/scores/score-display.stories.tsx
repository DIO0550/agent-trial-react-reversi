import type { Meta, StoryObj } from '@storybook/react';
import { ScoreDisplay } from './score-display';
import { DiscColor } from '../../../features/reversi/types/reversi-types';

const meta: Meta<typeof ScoreDisplay> = {
  title: 'Elements/Scores/ScoreDisplay',
  component: ScoreDisplay,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="relative w-96 h-96 border border-gray-300">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScoreDisplay>;

// サンプルデータ
const sampleDiscs = {
  '3,3': DiscColor.WHITE,
  '3,4': DiscColor.BLACK,
  '4,3': DiscColor.BLACK,
  '4,4': DiscColor.WHITE,
  '2,3': DiscColor.BLACK,
  '5,5': DiscColor.BLACK,
};

export const PlayerScore: Story = {
  args: {
    playerColor: DiscColor.BLACK,
    cpuColor: DiscColor.WHITE,
    discs: sampleDiscs,
    position: 'player',
  },
};

export const CpuScore: Story = {
  args: {
    playerColor: DiscColor.BLACK,
    cpuColor: DiscColor.WHITE,
    discs: sampleDiscs,
    position: 'cpu',
  },
};

export const PlayerIsWhite: Story = {
  args: {
    playerColor: DiscColor.WHITE,
    cpuColor: DiscColor.BLACK,
    discs: sampleDiscs,
    position: 'player',
  },
};

export const CpuIsBlack: Story = {
  args: {
    playerColor: DiscColor.WHITE,
    cpuColor: DiscColor.BLACK,
    discs: sampleDiscs,
    position: 'cpu',
  },
};

export const NoDiscs: Story = {
  args: {
    playerColor: DiscColor.BLACK,
    cpuColor: DiscColor.WHITE,
    discs: {},
    position: 'player',
  },
};

export const ManyDiscs: Story = {
  args: {
    playerColor: DiscColor.BLACK,
    cpuColor: DiscColor.WHITE,
    discs: {
      // 多くの石が置かれた状態をシミュレート
      ...sampleDiscs,
      '0,0': DiscColor.BLACK,
      '0,1': DiscColor.BLACK,
      '0,2': DiscColor.BLACK,
      '1,0': DiscColor.WHITE,
      '1,1': DiscColor.WHITE,
      '1,2': DiscColor.BLACK,
      '2,0': DiscColor.BLACK,
      '2,1': DiscColor.WHITE,
      '2,2': DiscColor.BLACK,
      '5,0': DiscColor.WHITE,
      '6,0': DiscColor.WHITE,
      '7,0': DiscColor.WHITE,
    },
    position: 'player',
  },
};
