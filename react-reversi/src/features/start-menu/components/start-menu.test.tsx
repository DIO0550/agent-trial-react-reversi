import { render, screen } from '@testing-library/react';
import { userEvent } from '@storybook/test';
import { describe, expect, it, vi } from 'vitest';
import { StartMenu } from './start-menu';
import {
  DEFAULT_CPU_LEVEL,
  DEFAULT_PLAYER_COLOR,
} from '../constants/start-menu-constants';

describe('StartMenuコンポーネント', () => {
  it('タイトルと説明が表示されること', () => {
    render(<StartMenu onStart={vi.fn()} />);
    expect(screen.getByText('リバーシ')).toBeInTheDocument();
    expect(screen.getByText('オセロ風ボードゲーム')).toBeInTheDocument();
    expect(screen.getByText('ゲーム設定')).toBeInTheDocument();
  });

  it('対戦モードが表示されること', () => {
    render(<StartMenu onStart={vi.fn()} />);
    expect(screen.getByText('対戦モード')).toBeInTheDocument();
    expect(screen.getByText('人間 vs CPU')).toBeInTheDocument();
  });

  it('CPUレベルと手番の選択肢が表示されること', () => {
    render(<StartMenu onStart={vi.fn()} />);
    // CPUレベルの選択肢
    expect(screen.getByText('弱い')).toBeInTheDocument();
    expect(screen.getByText('普通')).toBeInTheDocument();
    expect(screen.getByText('強い')).toBeInTheDocument();
    expect(screen.getByText('最強')).toBeInTheDocument();
    // 手番の選択肢
    expect(screen.getByText('先行')).toBeInTheDocument();
    expect(screen.getByText('後攻')).toBeInTheDocument();
  });

  it('デフォルトでは「普通」と「先行」が選択されていること', () => {
    render(<StartMenu onStart={vi.fn()} />);
    // 「普通」と「先行」が選択状態になっていることを確認
    expect(screen.getByText('普通').closest('button')).toHaveClass(
      'border-blue-500',
    );
    expect(screen.getByText('先行').closest('button')).toHaveClass(
      'border-blue-500',
    );
  });

  it('CPUレベルを選択できること', async () => {
    const user = userEvent.setup();
    render(<StartMenu onStart={vi.fn()} />);
    // 「強い」をクリック
    await user.click(screen.getByText('強い'));
    // 「強い」が選択状態になり、「普通」の選択が解除されていることを確認
    expect(screen.getByText('強い').closest('button')).toHaveClass(
      'border-blue-500',
    );
    expect(screen.getByText('普通').closest('button')).not.toHaveClass(
      'border-blue-500',
    );
  });

  it('手番を選択できること', async () => {
    const user = userEvent.setup();
    render(<StartMenu onStart={vi.fn()} />);
    // 「後攻」をクリック
    await user.click(screen.getByText('後攻'));
    // 「後攻」が選択状態になり、「先行」の選択が解除されていることを確認
    expect(screen.getByText('後攻').closest('button')).toHaveClass(
      'border-blue-500',
    );
    expect(screen.getByText('先行').closest('button')).not.toHaveClass(
      'border-blue-500',
    );
  });

  it('ゲームスタートボタンをクリックするとonStartが呼ばれること', async () => {
    const user = userEvent.setup();
    const handleStart = vi.fn();
    render(<StartMenu onStart={handleStart} />);
    // スタートボタンをクリック
    await user.click(screen.getByText('ゲームスタート'));
    // onStartが呼ばれたことを確認
    expect(handleStart).toHaveBeenCalledTimes(1);
    // デフォルト値が渡されていることを確認
    expect(handleStart).toHaveBeenCalledWith({
      cpuLevel: DEFAULT_CPU_LEVEL,
      playerColor: DEFAULT_PLAYER_COLOR,
    });
  });

  it('選択を変更してスタートするとその値がonStartに渡されること', async () => {
    const user = userEvent.setup();
    const handleStart = vi.fn();
    render(<StartMenu onStart={handleStart} />);
    // 「最強」と「後攻」を選択
    await user.click(screen.getByText('最強'));
    await user.click(screen.getByText('後攻'));
    // スタートボタンをクリック
    await user.click(screen.getByText('ゲームスタート'));
    // 選択した値が渡されていることを確認
    expect(handleStart).toHaveBeenCalledWith({
      cpuLevel: 'strongest',
      playerColor: 'white',
    });
  });

  it('ボードのミニプレビューが表示されること', () => {
    render(<StartMenu onStart={vi.fn()} />);
    // 4x4のグリッドがあることを確認
    const gridCells = screen
      .getAllByRole('generic')
      .filter(
        (el) =>
          el.className.includes('rounded-full') &&
          (el.className.includes('bg-black') ||
            el.className.includes('bg-white') ||
            el.className.includes('bg-green-600')),
      );

    // 16マスあることを確認（4x4グリッド）
    expect(gridCells).toHaveLength(16);

    // 初期配置の石が正しく配置されていることを確認
    // 黒と白の石が各2つずつあるはず
    const blackCells = gridCells.filter((el) =>
      el.className.includes('bg-black'),
    );
    const whiteCells = gridCells.filter((el) =>
      el.className.includes('bg-white'),
    );

    expect(blackCells).toHaveLength(2);
    expect(whiteCells).toHaveLength(2);
  });
});
