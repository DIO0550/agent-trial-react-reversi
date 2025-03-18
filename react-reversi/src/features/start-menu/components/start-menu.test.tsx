import { render, screen } from "@testing-library/react";
import { userEvent } from "@storybook/test";
import { describe, expect, it, vi } from "vitest";
import { StartMenu } from "./start-menu";
import {
  DEFAULT_CPU_LEVEL,
  DEFAULT_PLAYER_COLOR,
} from "../constants/start-menu-constants";

describe("StartMenuコンポーネント", () => {
  it("CPUレベルと手番の選択肢が表示されること", () => {
    render(<StartMenu onStart={vi.fn()} />);

    // CPUレベルの選択肢
    expect(screen.getByText("弱い")).toBeInTheDocument();
    expect(screen.getByText("普通")).toBeInTheDocument();
    expect(screen.getByText("強い")).toBeInTheDocument();
    expect(screen.getByText("最強")).toBeInTheDocument();

    // 手番の選択肢
    expect(screen.getByText("先行")).toBeInTheDocument();
    expect(screen.getByText("後攻")).toBeInTheDocument();
  });

  it("デフォルトでは「普通」と「先行」が選択されていること", () => {
    render(<StartMenu onStart={vi.fn()} />);

    // 「普通」と「先行」が選択状態になっていることを確認
    expect(screen.getByText("普通").closest("button")).toHaveClass(
      "border-blue-500"
    );
    expect(screen.getByText("先行").closest("button")).toHaveClass(
      "border-blue-500"
    );
  });

  it("CPUレベルを選択できること", async () => {
    const user = userEvent.setup();
    render(<StartMenu onStart={vi.fn()} />);

    // 「強い」をクリック
    await user.click(screen.getByText("強い"));

    // 「強い」が選択状態になり、「普通」の選択が解除されていることを確認
    expect(screen.getByText("強い").closest("button")).toHaveClass(
      "border-blue-500"
    );
    expect(screen.getByText("普通").closest("button")).not.toHaveClass(
      "border-blue-500"
    );
  });

  it("手番を選択できること", async () => {
    const user = userEvent.setup();
    render(<StartMenu onStart={vi.fn()} />);

    // 「後攻」をクリック
    await user.click(screen.getByText("後攻"));

    // 「後攻」が選択状態になり、「先行」の選択が解除されていることを確認
    expect(screen.getByText("後攻").closest("button")).toHaveClass(
      "border-blue-500"
    );
    expect(screen.getByText("先行").closest("button")).not.toHaveClass(
      "border-blue-500"
    );
  });

  it("スタートボタンをクリックするとonStartが呼ばれること", async () => {
    const user = userEvent.setup();
    const handleStart = vi.fn();
    render(<StartMenu onStart={handleStart} />);

    // スタートボタンをクリック
    await user.click(screen.getByText("スタート"));

    // onStartが呼ばれたことを確認
    expect(handleStart).toHaveBeenCalledTimes(1);
    // デフォルト値が渡されていることを確認
    expect(handleStart).toHaveBeenCalledWith({
      cpuLevel: DEFAULT_CPU_LEVEL,
      playerColor: DEFAULT_PLAYER_COLOR,
    });
  });

  it("選択を変更してスタートするとその値がonStartに渡されること", async () => {
    const user = userEvent.setup();
    const handleStart = vi.fn();
    render(<StartMenu onStart={handleStart} />);

    // 「最強」と「後攻」を選択
    await user.click(screen.getByText("最強"));
    await user.click(screen.getByText("後攻"));

    // スタートボタンをクリック
    await user.click(screen.getByText("スタート"));

    // 選択した値が渡されていることを確認
    expect(handleStart).toHaveBeenCalledWith({
      cpuLevel: "strongest",
      playerColor: "white",
    });
  });
});
