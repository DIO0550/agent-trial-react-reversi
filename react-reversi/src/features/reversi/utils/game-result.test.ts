import { describe, expect, it } from 'vitest';
import { GameResult } from './game-result';

describe('GameResult', () => {
  describe('isPlayerWin', () => {
    it('プレイヤーの勝ちの場合にtrueを返すこと', () => {
      expect(GameResult.isPlayerWin(GameResult.PLAYER_WIN)).toBeTrue();
    });

    it('プレイヤーの勝ち以外の場合にfalseを返すこと', () => {
      expect(GameResult.isPlayerWin(GameResult.PLAYER_LOSE)).toBeFalse();
      expect(GameResult.isPlayerWin(GameResult.DRAW)).toBeFalse();
      expect(GameResult.isPlayerWin(GameResult.IN_PROGRESS)).toBeFalse();
    });
  });

  describe('isPlayerLose', () => {
    it('プレイヤーの負けの場合にtrueを返すこと', () => {
      expect(GameResult.isPlayerLose(GameResult.PLAYER_LOSE)).toBeTrue();
    });

    it('プレイヤーの負け以外の場合にfalseを返すこと', () => {
      expect(GameResult.isPlayerLose(GameResult.PLAYER_WIN)).toBeFalse();
      expect(GameResult.isPlayerLose(GameResult.DRAW)).toBeFalse();
      expect(GameResult.isPlayerLose(GameResult.IN_PROGRESS)).toBeFalse();
    });
  });

  describe('isDraw', () => {
    it('引き分けの場合にtrueを返すこと', () => {
      expect(GameResult.isDraw(GameResult.DRAW)).toBeTrue();
    });

    it('引き分け以外の場合にfalseを返すこと', () => {
      expect(GameResult.isDraw(GameResult.PLAYER_WIN)).toBeFalse();
      expect(GameResult.isDraw(GameResult.PLAYER_LOSE)).toBeFalse();
      expect(GameResult.isDraw(GameResult.IN_PROGRESS)).toBeFalse();
    });
  });

  describe('isInProgress', () => {
    it('ゲーム進行中の場合にtrueを返すこと', () => {
      expect(GameResult.isInProgress(GameResult.IN_PROGRESS)).toBeTrue();
    });

    it('ゲーム進行中以外の場合にfalseを返すこと', () => {
      expect(GameResult.isInProgress(GameResult.PLAYER_WIN)).toBeFalse();
      expect(GameResult.isInProgress(GameResult.PLAYER_LOSE)).toBeFalse();
      expect(GameResult.isInProgress(GameResult.DRAW)).toBeFalse();
    });
  });

  describe('determineResult', () => {
    it('プレイヤーが黒で黒が多い場合にプレイヤーの勝ちを返すこと', () => {
      expect(GameResult.determineResult(40, 24, 'black')).toBe(
        GameResult.PLAYER_WIN,
      );
    });

    it('プレイヤーが黒で白が多い場合にプレイヤーの負けを返すこと', () => {
      expect(GameResult.determineResult(24, 40, 'black')).toBe(
        GameResult.PLAYER_LOSE,
      );
    });

    it('プレイヤーが白で白が多い場合にプレイヤーの勝ちを返すこと', () => {
      expect(GameResult.determineResult(24, 40, 'white')).toBe(
        GameResult.PLAYER_WIN,
      );
    });

    it('プレイヤーが白で黒が多い場合にプレイヤーの負けを返すこと', () => {
      expect(GameResult.determineResult(40, 24, 'white')).toBe(
        GameResult.PLAYER_LOSE,
      );
    });

    it('同数の場合に引き分けを返すこと', () => {
      expect(GameResult.determineResult(32, 32, 'black')).toBe(GameResult.DRAW);
      expect(GameResult.determineResult(32, 32, 'white')).toBe(GameResult.DRAW);
    });
  });

  describe('toString', () => {
    it('適切なメッセージを返すこと', () => {
      expect(GameResult.toString(GameResult.PLAYER_WIN)).toBe('勝利しました！');
      expect(GameResult.toString(GameResult.PLAYER_LOSE)).toBe(
        '敗北しました...',
      );
      expect(GameResult.toString(GameResult.DRAW)).toBe('引き分けです');
      expect(GameResult.toString(GameResult.IN_PROGRESS)).toBe('ゲーム進行中');
    });

    it('不明な結果の場合は「不明な結果」を返すこと', () => {
      expect(GameResult.toString('UNKNOWN' as any)).toBe('不明な結果');
    });
  });
});
