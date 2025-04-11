// filepath: /app/react-reversi/src/components/elements/discs/placeable-disc.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PlaceableDisc } from './placeable-disc';

const meta = {
  title: 'Components/Elements/Discs/PlaceableDisc',
  component: PlaceableDisc,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlaceableDisc>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 通常の配置可能なディスク
 */
export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ width: '64px', height: '64px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 小さいサイズの配置可能なディスク
 */
export const Small: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ width: '32px', height: '32px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 大きいサイズの配置可能なディスク
 */
export const Large: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ width: '128px', height: '128px' }}>
        <Story />
      </div>
    ),
  ],
};
