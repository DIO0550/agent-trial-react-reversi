import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FlipDisc } from './flip-disc';
import { DiscColor } from '@/features/reversi/utils/disc-color';

// デフォルトの回転角度プロップス
const defaultRotateProps = {
  blackRotateX: 0,
  blackRotateY: 0,
  whiteRotateX: 0,
  whiteRotateY: 0,
};

describe('Discコンポーネント', () => {
  it('黒の石が正しくレンダリングされること', () => {
    render(<FlipDisc color={DiscColor.BLACK} {...defaultRotateProps} />);
    const disc = screen.getByTestId(`disc-${DiscColor.BLACK}`);
    expect(disc).toBeInTheDocument();
  });
  it('白の石が正しくレンダリングされること', () => {
    render(<FlipDisc color={DiscColor.WHITE} {...defaultRotateProps} />);
    const disc = screen.getByTestId(`disc-${DiscColor.WHITE}`);
    expect(disc).toBeInTheDocument();
  });
  it('空の石が正しくレンダリングされること', () => {
    render(<FlipDisc color={DiscColor.NONE} {...defaultRotateProps} />);
    const disc = screen.getByTestId('disc-none');
    expect(disc).toBeInTheDocument();
  });
  it('配置可能な表示がされること', () => {
    render(
      <FlipDisc
        color={DiscColor.NONE}
        canPlace={true}
        {...defaultRotateProps}
      />,
    );
    const disc = screen.getByTestId('disc-placeable');
    expect(disc).toBeInTheDocument();
    // クラス名に border が含まれていることを確認
    expect(disc.className).toContain('border');
  });
  it('クリックイベントが発火すること', () => {
    const handleClick = vi.fn();
    render(
      <FlipDisc
        color={DiscColor.BLACK}
        onClick={handleClick}
        {...defaultRotateProps}
      />,
    );
    const disc = screen.getByTestId(`disc-${DiscColor.BLACK}`);
    fireEvent.click(disc);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('親要素のサイズに合わせたスタイルが適用されること', () => {
    render(
      <div style={{ width: '100px', height: '100px' }}>
        <FlipDisc color={DiscColor.WHITE} {...defaultRotateProps} />
      </div>,
    );
    const disc = screen.getByTestId(`disc-${DiscColor.WHITE}`);
    expect(disc.className).toContain('w-full');
    expect(disc.className).toContain('h-full');
  });
  it('適切なアクセシビリティ属性が設定されること', () => {
    render(<FlipDisc color={DiscColor.BLACK} {...defaultRotateProps} />);
    const disc = screen.getByTestId(`disc-${DiscColor.BLACK}`);
    expect(disc).toHaveAttribute('aria-label', `${DiscColor.BLACK} disc`);
    expect(disc).toHaveAttribute('role', 'presentation');
  });
  it('クリック可能な場合は適切なロール属性が設定されること', () => {
    render(
      <FlipDisc
        color={DiscColor.BLACK}
        onClick={() => {}}
        {...defaultRotateProps}
      />,
    );
    const disc = screen.getByTestId(`disc-${DiscColor.BLACK}`);
    expect(disc).toHaveAttribute('role', 'button');
  });
  it.todo('アニメーション中の場合、適切なクラスが適用されること');
  it.todo('X軸方向のアニメーションが適用されること');
  it.todo('アニメーション中のアクセシビリティ属性が適切に設定されること');
});
