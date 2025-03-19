import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Disc } from './disc';

describe('Discコンポーネント', () => {
  it('黒の石が正しくレンダリングされること', () => {
    render(<Disc color="black" />);
    const disc = screen.getByTestId('disc-black');
    expect(disc).toBeInTheDocument();
  });

  it('白の石が正しくレンダリングされること', () => {
    render(<Disc color="white" />);
    const disc = screen.getByTestId('disc-white');
    expect(disc).toBeInTheDocument();
  });

  it('空の石が正しくレンダリングされること', () => {
    render(<Disc color="none" />);
    const disc = screen.getByTestId('disc-none');
    expect(disc).toBeInTheDocument();
  });

  it('配置可能な表示がされること', () => {
    render(<Disc color="none" canPlace={true} />);
    const disc = screen.getByTestId('disc-none-can-place');
    expect(disc).toBeInTheDocument();

    // クラス名に border が含まれていることを確認
    expect(disc.className).toContain('border');
  });

  it('クリックイベントが発火すること', () => {
    const handleClick = vi.fn();
    render(<Disc color="black" onClick={handleClick} />);
    const disc = screen.getByTestId('disc-black');

    fireEvent.click(disc);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('親要素のサイズに合わせたスタイルが適用されること', () => {
    render(
      <div style={{ width: '100px', height: '100px' }}>
        <Disc color="white" />
      </div>,
    );
    const disc = screen.getByTestId('disc-white');
    expect(disc.className).toContain('w-full');
    expect(disc.className).toContain('h-full');
  });

  it('適切なアクセシビリティ属性が設定されること', () => {
    render(<Disc color="black" />);
    const disc = screen.getByTestId('disc-black');

    expect(disc).toHaveAttribute('aria-label', 'black disc');
    expect(disc).toHaveAttribute('role', 'presentation');
  });

  it('クリック可能な場合は適切なロール属性が設定されること', () => {
    render(<Disc color="black" onClick={() => {}} />);
    const disc = screen.getByTestId('disc-black');

    expect(disc).toHaveAttribute('role', 'button');
  });
});
