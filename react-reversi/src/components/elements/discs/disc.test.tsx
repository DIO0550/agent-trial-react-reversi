import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Disc } from "./disc";

describe("Discコンポーネント", () => {
  it("黒の石が正しくレンダリングされること", () => {
    render(<Disc color="black" />);
    const disc = screen.getByTestId("disc-black");
    expect(disc).toBeInTheDocument();
  });

  it("白の石が正しくレンダリングされること", () => {
    render(<Disc color="white" />);
    const disc = screen.getByTestId("disc-white");
    expect(disc).toBeInTheDocument();
  });

  it("空の石が正しくレンダリングされること", () => {
    render(<Disc color="none" />);
    const disc = screen.getByTestId("disc-none");
    expect(disc).toBeInTheDocument();
  });

  it("配置可能な表示がされること", () => {
    render(<Disc color="none" canPlace={true} />);
    const disc = screen.getByTestId("disc-none-can-place");
    expect(disc).toBeInTheDocument();

    // スタイリングが適用されているか確認（点線のボーダー）
    const style = window.getComputedStyle(disc);
    expect(style.border).not.toBe("none");
  });

  it("クリックイベントが発火すること", () => {
    const handleClick = vi.fn();
    render(<Disc color="black" onClick={handleClick} />);
    const disc = screen.getByTestId("disc-black");

    fireEvent.click(disc);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("指定したサイズで表示されること", () => {
    const testSize = 60;
    render(<Disc color="white" size={testSize} />);
    const disc = screen.getByTestId("disc-white");

    const style = window.getComputedStyle(disc);
    expect(style.width).toBe(`${testSize}px`);
    expect(style.height).toBe(`${testSize}px`);
  });

  it("適切なアクセシビリティ属性が設定されること", () => {
    render(<Disc color="black" />);
    const disc = screen.getByTestId("disc-black");

    expect(disc).toHaveAttribute("aria-label", "black disc");
    expect(disc).toHaveAttribute("role", "presentation");
  });

  it("クリック可能な場合は適切なロール属性が設定されること", () => {
    render(<Disc color="black" onClick={() => {}} />);
    const disc = screen.getByTestId("disc-black");

    expect(disc).toHaveAttribute("role", "button");
  });
});
