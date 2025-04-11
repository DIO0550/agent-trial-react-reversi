// filepath: /app/react-reversi/src/components/elements/discs/placeable-disc.test.tsx
import { render, screen } from '@testing-library/react';
import { PlaceableDisc } from './placeable-disc';

describe('PlaceableDisc', () => {
  it('正しくレンダリングされること', () => {
    render(<PlaceableDisc />);
    const discElement = screen.getByTestId('placeable-disc');
    expect(discElement).toBeInTheDocument();
    expect(discElement).toHaveAttribute('aria-label', '配置可能な位置');
  });

  it('点線のボーダーが適用されていること', () => {
    render(<PlaceableDisc />);
    const discElement = screen.getByTestId('placeable-disc');
    expect(discElement).toHaveClass('border-dashed');
    expect(discElement).toHaveClass('border-gray-600');
  });

  it('aria-labelとrole属性が正しく設定されていること', () => {
    render(<PlaceableDisc />);
    const discElement = screen.getByTestId('placeable-disc');

    expect(discElement).toHaveAttribute('aria-label', '配置可能な位置');
    expect(discElement).toHaveAttribute('role', 'presentation');
  });
});
