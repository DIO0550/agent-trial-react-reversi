import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrentTurn } from './current-turn';
import { DiscColor } from '../../../features/reversi/types/reversi-types';

describe('CurrentTurnコンポーネント', () => {
  it('黒の手番が正しく表示される', () => {
    render(<CurrentTurn currentTurn={DiscColor.BLACK} />);

    // テキストが表示されているか確認
    expect(screen.getByText('現在の手番：')).toBeInTheDocument();
    expect(screen.getByText('黒')).toBeInTheDocument();

    // 黒い円が表示されているか確認（クラス名で確認）
    const disc = screen.getByText('黒').previousSibling;
    expect(disc).toHaveClass('bg-black');
  });

  it('白の手番が正しく表示される', () => {
    render(<CurrentTurn currentTurn={DiscColor.WHITE} />);

    // テキストが表示されているか確認
    expect(screen.getByText('現在の手番：')).toBeInTheDocument();
    expect(screen.getByText('白')).toBeInTheDocument();

    // 白い円が表示されているか確認（クラス名で確認）
    const disc = screen.getByText('白').previousSibling;
    expect(disc).toHaveClass('bg-white');
    expect(disc).toHaveClass('border-gray-300');
  });
});
