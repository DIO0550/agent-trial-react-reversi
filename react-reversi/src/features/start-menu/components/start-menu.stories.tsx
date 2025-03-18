import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { StartMenu } from "./start-menu";

/**
 * リバーシゲームのスタート画面メニューコンポーネント。
 * CPUのレベルとプレイヤーの手番を選択できます。
 */
const meta: Meta<typeof StartMenu> = {
  title: "Features/StartMenu",
  component: StartMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onStart: { action: "started" },
  },
};

export default meta;
type Story = StoryObj<typeof StartMenu>;

/**
 * デフォルト状態のスタートメニュー
 */
export const Default: Story = {
  args: {
    onStart: fn(),
  },
};