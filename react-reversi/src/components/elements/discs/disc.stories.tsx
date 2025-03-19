import type { Meta, StoryObj } from '@storybook/react';
import { Disc, DiscColor } from './disc';

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

/**
 * 様々なサイズ
 */
export const Sizes: Story = {
  render: () => {
    const sizes: number[] = [20, 30, 40, 50, 60];
    const colors: DiscColor[] = ['black', 'white', 'none'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {colors.map((color) => (
          <div
            key={color}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ width: '80px' }}>{color}:</div>
            {sizes.map((size) => (
              <div
                key={`${color}-${size}`}
                style={{ width: `${size}px`, height: `${size}px` }}
              >
                <Disc color={color} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/**
 * すべての状態
 */
export const AllStates: Story = {
  render: () => {
    const colors: DiscColor[] = ['black', 'white', 'none'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '120px' }}>通常:</div>
          {colors.map((color) => (
            <div
              key={`normal-${color}`}
              style={{ width: '40px', height: '40px' }}
            >
              <Disc color={color} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '120px' }}>配置可能:</div>
          {colors.map((color) => (
            <div
              key={`canPlace-${color}`}
              style={{ width: '40px', height: '40px' }}
            >
              <Disc color={color} canPlace={true} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '120px' }}>クリック可能:</div>
          {colors.map((color) => (
            <div
              key={`clickable-${color}`}
              style={{ width: '40px', height: '40px' }}
            >
              <Disc color={color} onClick={() => {}} />
            </div>
          ))}
        </div>
      </div>
    );
  },
};
