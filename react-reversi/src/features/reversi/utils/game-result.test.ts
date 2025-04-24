import { describe, expect, it } from 'vitest';
import { GameResult } from './game-result';

describe('GameResult', () => {
  describe('isBlackWin', () => {
    it('黒の勝ちの場合にtrueを返すこと', () => {
      expect(GameResult.isBlackWin(GameResult.BLACK_WIN)).toBeTrue();
    });

    it('黒の勝ち以外の場合にfalseを返すこと', () => {
      expect(GameResult.isBlackWin(GameResult.WHITE_WIN)).toBeFalse();
      expect(GameResult.isBlackWin(GameResult.DRAW)).toBeFalse();
      expect(GameResult.isBlackWin(GameResult.IN_PROGRESS)).toBeFalse();
    });
  });

  describe('isWhiteWin', () => {
    it('白の勝ちの場合にtrueを返すこと', () => {
      expect(GameResult.isWhiteWin(GameResult.WHITE_WIN)).toBeTrue();
    });

    it('白の勝ち以外の場合にfalseを返すこと', () => {
      expect(GameResult.isWhiteWin(GameResult.BLACK_WIN)).toBeFalse();
      expect(GameResult.isWhiteWin(GameResult.DRAW)).toBeFalse();
      expect(GameResult.isWhiteWin(GameResult.IN_PROGRESS)).toBeFalse();
    });
  });

  describe('isDraw', () => {
    it('引き分けの場合にtrueを返すこと', () => {
      expect(GameResult.isDraw(GameResult.DRAW)).toBeTrue();
    });

    it('引き分け以外の場合にfalseを返すこと', () => {
      expect(GameResult.isDraw(GameResult.BLACK_WIN)).toBeFalse();
      expect(GameResult.isDraw(GameResult.WHITE_WIN)).toBeFalse();
      expect(GameResult.isDraw(GameResult.IN_PROGRESS)).toBeFalse();
    });
  });

  describe('isInProgress', () => {
    it('ゲーム進行中の場合にtrueを返すこと', () => {
      expect(GameResult.isInProgress(GameResult.IN_PROGRESS)).toBeTrue();
    });

    it('ゲーム進行中以外の場合にfalseを返すこと', () => {
      expect(GameResult.isInProgress(GameResult.BLACK_WIN)).toBeFalse();
      expect(GameResult.isInProgress(GameResult.WHITE_WIN)).toBeFalse();
      expect(GameResult.isInProgress(GameResult.DRAW)).toBeFalse();
    });
  });

  describe('determineResult', () => {
    it('黒が多い場合に黒の勝ちを返すこと', () => {
      expect(GameResult.determineResult(40, 24)).toBe(GameResult.BLACK_WIN);
    });

    it('白が多い場合に白の勝ちを返すこと', () => {
      expect(GameResult.determineResult(24, 40)).toBe(GameResult.WHITE_WIN);
    });

    it('同数の場合に引き分けを返すこと', () => {
      expect(GameResult.determineResult(32, 32)).toBe(GameResult.DRAW);
    });
  });

  describe('toString', () => {
    it('playerColorを指定しない場合に適切な文字列を返すこと', () => {
      expect(GameResult.toString(GameResult.BLACK_WIN)).toBe('黒の勝ち');
      expect(GameResult.toString(GameResult.WHITE_WIN)).toBe('白の勝ち');
      expect(GameResult.toString(GameResult.DRAW)).toBe('引き分け');
      expect(GameResult.toString(GameResult.IN_PROGRESS)).toBe('ゲーム進行中');
    });

    it('プレイヤーが黒で黒の勝ちの場合に「勝利しました！」を返すこと', () => {
      expect(GameResult.toString(GameResult.BLACK_WIN, 'black')).toBe(
        '勝利しました！',
      );
    });

    it('プレイヤーが黒で白の勝ちの場合に「敗北しました...」を返すこと', () => {
      expect(GameResult.toString(GameResult.WHITE_WIN, 'black')).toBe(
        '敗北しました...',
      );
    });

    it('プレイヤーが白で白の勝ちの場合に「勝利しました！」を返すこと', () => {
      expect(GameResult.toString(GameResult.WHITE_WIN, 'white')).toBe(
        '勝利しました！',
      );
    });

    it('プレイヤーが白で黒の勝ちの場合に「敗北しました...」を返すこと', () => {
      expect(GameResult.toString(GameResult.BLACK_WIN, 'white')).toBe(
        '敗北しました...',
      );
    });

    it('引き分けの場合にプレイヤーの色によらず「引き分けです」を返すこと', () => {
      expect(GameResult.toString(GameResult.DRAW, 'black')).toBe(
        '引き分けです',
      );
      expect(GameResult.toString(GameResult.DRAW, 'white')).toBe(
        '引き分けです',
      );
    });

    it('ゲーム進行中の場合にプレイヤーの色によらず「ゲーム進行中」を返すこと', () => {
      expect(GameResult.toString(GameResult.IN_PROGRESS, 'black')).toBe(
        'ゲーム進行中',
      );
      expect(GameResult.toString(GameResult.IN_PROGRESS, 'white')).toBe(
        'ゲーム進行中',
      );
    });

    it('playerColorがrandomの場合は通常の文字列を返すこと', () => {
      expect(GameResult.toString(GameResult.BLACK_WIN, 'random')).toBe(
        '黒の勝ち',
      );
      expect(GameResult.toString(GameResult.WHITE_WIN, 'random')).toBe(
        '白の勝ち',
      );
    });
  });
});
