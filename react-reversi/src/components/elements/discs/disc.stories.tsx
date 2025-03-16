import type { Meta, StoryObj } from "@storybook/react";
import { Disc, DiscColor } from "./disc";

/**
 * リバーシの石を表示するコンポーネント
 */
const meta: Meta<typeof Disc> = {
  title: "Elements/Disc",
  component: Disc,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: { type: "select" },
      options: ["black", "white", "none"],
      description: "ディスクの色",
    },
    onClick: { action: "clicked" },
    canPlace: {
      control: { type: "boolean" },
      description: "置くことが可能かどうか（ヒント表示用）",
    },
    size: {
      control: { type: "number", min: 20, max: 100, step: 5 },
      description: "ディスクのサイズ（px）",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Disc>;

/**
 * 黒の石
 */
export const Black: Story = {
  args: {
    color: "black",
    canPlace: false,
    size: 40,
  },
};

/**
 * 白の石
 */
export const White: Story = {
  args: {
    color: "white",
    canPlace: false,
    size: 40,
  },
};

/**
 * 空の石
 */
export const None: Story = {
  args: {
    color: "none",
    canPlace: false,
    size: 40,
  },
};

/**
 * 配置可能な状態（ヒント表示）
 */
export const CanPlace: Story = {
  args: {
    color: "none",
    canPlace: true,
    size: 40,
  },
};

/**
 * 様々なサイズ
 */
export const Sizes: Story = {
  render: () => {
    const sizes: number[] = [20, 30, 40, 50, 60];
    const colors: DiscColor[] = ["black", "white", "none"];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {colors.map((color) => (
          <div
            key={color}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div style={{ width: "80px" }}>{color}:</div>
            {sizes.map((size) => (
              <Disc key={`${color}-${size}`} color={color} size={size} />
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
    const colors: DiscColor[] = ["black", "white", "none"];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ width: "120px" }}>通常:</div>
          {colors.map((color) => (
            <Disc key={`normal-${color}`} color={color} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ width: "120px" }}>配置可能:</div>
          {colors.map((color) => (
            <Disc key={`canPlace-${color}`} color={color} canPlace={true} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ width: "120px" }}>クリック可能:</div>
          {colors.map((color) => (
            <Disc key={`clickable-${color}`} color={color} onClick={() => {}} />
          ))}
        </div>
      </div>
    );
  },
};
