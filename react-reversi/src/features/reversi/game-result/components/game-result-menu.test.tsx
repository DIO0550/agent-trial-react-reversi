import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { GameResultMenu } from './game-result-menu';

describe('GameResultMenu', () => {
  const mockOnRestart = vi.fn();
  const mockOnBackToMenu = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('勝利時に正しいメッセージが表示される', () => {
    render(
      <GameResultMenu
        result="win"
        playerScore={40}
        cpuScore={24}
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />,
    );

    expect(screen.getByText('勝利しました！')).toBeInTheDocument();
    expect(screen.getByText('あなた:')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('CPU:')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  test('敗北時に正しいメッセージが表示される', () => {
    render(
      <GameResultMenu
        result="lose"
        playerScore={24}
        cpuScore={40}
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />,
    );

    expect(screen.getByText('敗北しました...')).toBeInTheDocument();
  });

  test('引き分け時に正しいメッセージが表示される', () => {
    render(
      <GameResultMenu
        result="draw"
        playerScore={32}
        cpuScore={32}
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />,
    );

    expect(screen.getByText('引き分けです')).toBeInTheDocument();
  });

  test('リスタートボタンをクリックすると、onRestartが呼ばれる', async () => {
    render(
      <GameResultMenu
        result="win"
        playerScore={40}
        cpuScore={24}
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />,
    );

    const restartButton = screen.getByText('もう一度プレイ');
    await userEvent.click(restartButton);

    expect(mockOnRestart).toHaveBeenCalledTimes(1);
  });

  test('メニューに戻るボタンをクリックすると、onBackToMenuが呼ばれる', async () => {
    render(
      <GameResultMenu
        result="win"
        playerScore={40}
        cpuScore={24}
        onRestart={mockOnRestart}
        onBackToMenu={mockOnBackToMenu}
      />,
    );

    const backToMenuButton = screen.getByText('メニューに戻る');
    await userEvent.click(backToMenuButton);

    expect(mockOnBackToMenu).toHaveBeenCalledTimes(1);
  });
});
