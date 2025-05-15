// filepath: /app/react-reversi/src/components/elements/discs/placeable-disc.test.tsx
import { render, screen } from '@testing-library/react';
import { PlaceableDisc } from './placeable-disc';

describe('PlaceableDisc', () => {
  it('正しくレンダリングされること', () => {
    render(<PlaceableDisc />);
    const discElement = screen.getByTestId('disc-placeable');
    expect(discElement).toBeInTheDocument();
    expect(discElement).toHaveAttribute(
      'aria-label',
      'placeable disc position',
    );
  });

  it('点線のボーダーが適用されていること', () => {
    render(<PlaceableDisc />);
    const discElement = screen.getByTestId('disc-placeable');
    expect(discElement).toHaveClass('border-dashed');
    expect(discElement).toHaveClass('border-gray-600');
  });

  it('aria-labelとrole属性が正しく設定されていること', () => {
    render(<PlaceableDisc />);
    const discElement = screen.getByTestId('disc-placeable');

    expect(discElement).toHaveAttribute(
      'aria-label',
      'placeable disc position',
    );
    expect(discElement).toHaveAttribute('role', 'presentation');
  });
});
