import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from './score-display';
import { DiscColor } from '../../../features/reversi/utils/disc-color';

describe('ScoreDisplay コンポーネント', () => {
  // テスト用の石の配置データ
  const sampleDiscs = {
    '3,3': DiscColor.Type.WHITE,
    '3,4': DiscColor.Type.BLACK,
    '4,3': DiscColor.Type.BLACK,
    '4,4': DiscColor.Type.WHITE,
    '2,3': DiscColor.Type.BLACK,
    '5,5': DiscColor.Type.BLACK,
  };

  it('プレイヤーのスコアが正しく表示されること', () => {
    render(
      <ScoreDisplay
        playerColor={DiscColor.Type.BLACK}
        cpuColor={DiscColor.Type.WHITE}
        discs={sampleDiscs}
        position="player"
      />,
    );

    // プレイヤー(黒)の石は4つ
    const scoreElement = screen.getByTestId('score-player');
    expect(scoreElement).toBeInTheDocument();
    expect(scoreElement.textContent).toContain('4');
  });

  it('CPUのスコアが正しく表示されること', () => {
    render(
      <ScoreDisplay
        playerColor={DiscColor.Type.BLACK}
        cpuColor={DiscColor.Type.WHITE}
        discs={sampleDiscs}
        position="cpu"
      />,
    );

    // CPU(白)の石は2つ
    const scoreElement = screen.getByTestId('score-cpu');
    expect(scoreElement).toBeInTheDocument();
    expect(scoreElement.textContent).toContain('2');
  });

  it('プレイヤーが白の場合も正しくスコアが表示されること', () => {
    render(
      <ScoreDisplay
        playerColor={DiscColor.Type.WHITE}
        cpuColor={DiscColor.Type.BLACK}
        discs={sampleDiscs}
        position="player"
      />,
    );

    // プレイヤー(白)の石は2つ
    const scoreElement = screen.getByTestId('score-player');
    expect(scoreElement).toBeInTheDocument();
    expect(scoreElement.textContent).toContain('2');
  });

  it('表示位置が正しく適用されること', () => {
    const { rerender } = render(
      <ScoreDisplay
        playerColor={DiscColor.Type.BLACK}
        cpuColor={DiscColor.Type.WHITE}
        discs={sampleDiscs}
        position="player"
      />,
    );

    // プレイヤー位置のクラスが適用されていることを確認
    const playerScoreElement = screen.getByTestId('score-player');
    expect(playerScoreElement.className).toContain('bottom-4 left-4');

    // CPUの位置に再レンダリング
    rerender(
      <ScoreDisplay
        playerColor={DiscColor.Type.BLACK}
        cpuColor={DiscColor.Type.WHITE}
        discs={sampleDiscs}
        position="cpu"
      />,
    );

    // CPU位置のクラスが適用されていることを確認
    const cpuScoreElement = screen.getByTestId('score-cpu');
    expect(cpuScoreElement.className).toContain('top-4 right-4');
  });

  it('石がない場合は0が表示されること', () => {
    render(
      <ScoreDisplay
        playerColor={DiscColor.Type.BLACK}
        cpuColor={DiscColor.Type.WHITE}
        discs={{}} // 空のディスク状態
        position="player"
      />,
    );

    const scoreElement = screen.getByTestId('score-player');
    expect(scoreElement.textContent).toContain('0');
  });
});
