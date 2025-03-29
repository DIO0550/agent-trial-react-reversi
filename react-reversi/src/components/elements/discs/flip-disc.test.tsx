import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FlipDisc } from './flip-disc';
describe('Discコンポーネント', () => {
  it('黒の石が正しくレンダリングされること', () => {
    render(<FlipDisc color="black" />);
    const disc = screen.getByTestId('disc-black');
    expect(disc).toBeInTheDocument();
  });
  it('白の石が正しくレンダリングされること', () => {
    render(<FlipDisc color="white" />);
    const disc = screen.getByTestId('disc-white');
    expect(disc).toBeInTheDocument();
  });
  it('空の石が正しくレンダリングされること', () => {
    render(<FlipDisc color="none" />);
    const disc = screen.getByTestId('disc-none');
    expect(disc).toBeInTheDocument();
  });
  it('配置可能な表示がされること', () => {
    render(<FlipDisc color="none" canPlace={true} />);
    const disc = screen.getByTestId('disc-none-can-place');
    expect(disc).toBeInTheDocument();
    // クラス名に border が含まれていることを確認
    expect(disc.className).toContain('border');
  });
  it('クリックイベントが発火すること', () => {
    const handleClick = vi.fn();
    render(<FlipDisc color="black" onClick={handleClick} />);
    const disc = screen.getByTestId('disc-black');
    fireEvent.click(disc);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('親要素のサイズに合わせたスタイルが適用されること', () => {
    render(
      <div style={{ width: '100px', height: '100px' }}>
        <FlipDisc color="white" />
      </div>,
    );
    const disc = screen.getByTestId('disc-white');
    expect(disc.className).toContain('w-full');
    expect(disc.className).toContain('h-full');
  });
  it('適切なアクセシビリティ属性が設定されること', () => {
    render(<FlipDisc color="black" />);
    const disc = screen.getByTestId('disc-black');
    expect(disc).toHaveAttribute('aria-label', 'black disc');
    expect(disc).toHaveAttribute('role', 'presentation');
  });
  it('クリック可能な場合は適切なロール属性が設定されること', () => {
    render(<FlipDisc color="black" onClick={() => {}} />);
    const disc = screen.getByTestId('disc-black');
    expect(disc).toHaveAttribute('role', 'button');
  });
  it('アニメーション中の場合、適切なクラスが適用されること', () => {
    render(<FlipDisc color="black" isFlipping={true} previousColor="white" />);
    const disc = screen.getByTestId('disc-black-flipping');
    // 親要素がperspectiveクラスを持っていることを確認
    expect(disc.className).toContain('perspective');

    // アニメーション関連のクラスが適用されていることを確認
    const cardElement = disc.firstChild;
    expect(cardElement.className).toContain('transform-gpu');
    expect(cardElement.className).toContain('preserve-3d');
    expect(cardElement.className).toContain('transition-transform');

    // アニメーション関連クラス（animateクラスまたはtestクラス）が含まれていることを確認
    const animationClasses =
      cardElement.className.includes('animate-flip-') ||
      cardElement.className.includes('animate-flip-half-') ||
      cardElement.className.includes('animate-flip-second-half-');
    expect(animationClasses).toBe(true);
  });
  it('X軸方向のアニメーションが適用されること', () => {
    render(
      <FlipDisc
        color="white"
        isFlipping={true}
        flipAxis="x"
        previousColor="black"
      />,
    );
    const disc = screen.getByTestId('disc-white-flipping');
    // 親要素がperspectiveクラスを持っていることを確認
    expect(disc.className).toContain('perspective');

    // アニメーション関連のクラスが適用されていることを確認
    const cardElement = disc.firstChild;
    expect(cardElement.className).toContain('transform-gpu');
    expect(cardElement.className).toContain('preserve-3d');

    // X軸に関連するアニメーションクラスが含まれていることを確認
    const hasAnimationX =
      cardElement.className.includes('animate-flip-x') ||
      cardElement.className.includes('animate-flip-half-x') ||
      cardElement.className.includes('animate-flip-second-half-x');
    expect(hasAnimationX).toBe(true);
  });
  it('アニメーション中のアクセシビリティ属性が適切に設定されること', () => {
    render(<FlipDisc color="black" isFlipping={true} />);
    const disc = screen.getByTestId('disc-black-flipping');
    expect(disc).toHaveAttribute('aria-label', 'black disc (flipping)');
  });
});
