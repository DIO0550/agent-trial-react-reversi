import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { StartMenu } from './start-menu';
import { StartMenuProps } from '../types/start-menu-types';

/**
 * リバーシゲームのスタート画面メニューコンポーネント。
 * CPUのレベルとプレイヤーの手番を選択できます。
 */
const meta: Meta<typeof StartMenu> = {
  title: 'Features/StartMenu',
  component: StartMenu,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'green-gradient',
      values: [
        {
          name: 'green-gradient',
          value: 'linear-gradient(to bottom, #f0fdf4, #dcfce7)',
        },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onStart: { action: 'started' },
  },
};

export default meta;
type Story = StoryObj<StartMenuProps>;

/**
 * デフォルト状態のスタートメニュー
 */
export const Default: Story = {
  args: {
    onStart: fn(),
  },
};

/**
 * モバイル表示のスタートメニュー
 */
export const Mobile: Story = {
  args: {
    onStart: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * タブレット表示のスタートメニュー
 */
export const Tablet: Story = {
  args: {
    onStart: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
