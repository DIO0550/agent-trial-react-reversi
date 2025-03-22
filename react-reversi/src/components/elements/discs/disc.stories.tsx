import type { Meta, StoryObj } from '@storybook/react';
import { Disc } from './disc';

/**
 * リバーシの石を表示するコンポーネント
 */
const meta: Meta<typeof Disc> = {
  title: 'Elements/Disc',
  component: Disc,
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
type Story = StoryObj<typeof Disc>;

/**
 * 黒の石
 */
export const Black: Story = {
  args: {
    color: 'black',
    canPlace: false,
  },
};

/**
 * 白の石
 */
export const White: Story = {
  args: {
    color: 'white',
    canPlace: false,
  },
};

/**
 * 空の石
 */
export const None: Story = {
  args: {
    color: 'none',
    canPlace: false,
  },
};

/**
 * 配置可能な状態（ヒント表示）
 */
export const CanPlace: Story = {
  args: {
    color: 'none',
    canPlace: true,
  },
};
