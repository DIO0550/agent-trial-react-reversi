import type { Meta, StoryObj } from '@storybook/react';
import { Disk } from './disc';
import { DiscColor } from '@/features/reversi/types/reversi-types';

/**
 * リバーシの石を表示するコンポーネント
 */
const meta: Meta<typeof Disk> = {
  component: Disk,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['black', 'white', 'none'],
      description: 'ディスクの色',
    },
    onClick: { action: 'clicked' },
    canPlace: {
      control: { type: 'boolean' },
      description: '置くことが可能かどうか（ヒント表示用）',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '40px', height: '40px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Disk>;

/**
 * 黒の石
 */
export const Black: Story = {
  args: {
    color: DiscColor.BLACK,
    canPlace: false,
  },
};

/**
 * 白の石
 */
export const White: Story = {
  args: {
    color: DiscColor.WHITE,
    canPlace: false,
  },
};

/**
 * 空の石
 */
export const None: Story = {
  args: {
    color: DiscColor.NONE,
    canPlace: false,
  },
};

/**
 * 配置可能な状態（ヒント表示）
 */
export const CanPlace: Story = {
  args: {
    color: DiscColor.NONE,
    canPlace: true,
  },
};
