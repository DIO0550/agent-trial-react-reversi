import { describe, expect, it } from 'vitest';
import { GameState, GameStateType } from './game-state';
import { GameResult } from './game-result';
import { DiscColor } from '@/features/reversi/types/reversi-types';

describe('GameState', () => {
  describe('createInitial', () => {
    it('初期状態が正しく生成されること', () => {
      const initialState = GameState.createInitial();

      expect(initialState.type).toBe(GameStateType.PLAYING);
      expect(initialState.result).toBe(GameResult.IN_PROGRESS);
    });
  });

  describe('setGameOver', () => {
    it('黒が勝利の場合、正しく状態が更新されること', () => {
      const state = GameState.createInitial(DiscColor.BLACK);
      const blackCount = 40;
      const whiteCount = 24;

      const result = GameState.setGameOver(state, blackCount, whiteCount);

      expect(result.type).toBe(GameStateType.GAME_OVER);
      expect(result.result).toBe(GameResult.PLAYER_WIN);
    });

    it('白が勝利の場合、正しく状態が更新されること', () => {
      const state = GameState.createInitial(DiscColor.WHITE);
      const blackCount = 20;
      const whiteCount = 44;

      const result = GameState.setGameOver(state, blackCount, whiteCount);

      expect(result.type).toBe(GameStateType.GAME_OVER);
      expect(result.result).toBe(GameResult.PLAYER_WIN);
    });

    it('引き分けの場合、正しく状態が更新されること', () => {
      const state = GameState.createInitial();
      const blackCount = 32;
      const whiteCount = 32;

      const result = GameState.setGameOver(state, blackCount, whiteCount);

      expect(result.type).toBe(GameStateType.GAME_OVER);
      expect(result.result).toBe(GameResult.DRAW);
    });

    it('元の状態を変更しないこと', () => {
      const state = GameState.createInitial();
      const blackCount = 40;
      const whiteCount = 24;

      GameState.setGameOver(state, blackCount, whiteCount);

      expect(state.type).toBe(GameStateType.PLAYING);
      expect(state.result).toBe(GameResult.IN_PROGRESS);
    });
  });

  describe('isGameOver', () => {
    it('GAME_OVER状態の場合、trueを返すこと', () => {
      const state = {
        type: GameStateType.GAME_OVER,
        result: GameResult.PLAYER_WIN,
      };

      const result = GameState.isGameOver(state);

      expect(result).toBeTrue();
    });

    it('PLAYING状態の場合、falseを返すこと', () => {
      const state = GameState.createInitial();

      const result = GameState.isGameOver(state);

      expect(result).toBeFalse();
    });
  });

  describe('toString', () => {
    it('ゲーム進行中の状態が正しく文字列化されること', () => {
      const state = GameState.createInitial();
      const blackCount = 10;
      const whiteCount = 8;

      const result = GameState.toString(state, blackCount, whiteCount);

      expect(result).toBe('ゲーム進行中 (黒:10, 白:8)');
    });

    it('ゲーム終了状態（黒の勝ち）が正しく文字列化されること', () => {
      const state = {
        type: GameStateType.GAME_OVER,
        result: GameResult.PLAYER_WIN,
      };
      const blackCount = 40;
      const whiteCount = 24;

      const result = GameState.toString(state, blackCount, whiteCount);

      expect(result).toBe('勝利しました！ (黒:40, 白:24)');
    });

    it('ゲーム終了状態（白の勝ち）が正しく文字列化されること', () => {
      const state = {
        type: GameStateType.GAME_OVER,
        result: GameResult.PLAYER_WIN,
      };
      const blackCount = 24;
      const whiteCount = 40;

      const result = GameState.toString(state, blackCount, whiteCount);

      expect(result).toBe('勝利しました！ (黒:24, 白:40)');
    });

    it('ゲーム終了状態（引き分け）が正しく文字列化されること', () => {
      const state = {
        type: GameStateType.GAME_OVER,
        result: GameResult.DRAW,
      };
      const blackCount = 32;
      const whiteCount = 32;

      const result = GameState.toString(state, blackCount, whiteCount);

      expect(result).toBe('引き分け (黒:32, 白:32)');
    });

    it('不明な状態が正しく文字列化されること', () => {
      const state = {
        type: 'UNKNOWN' as GameStateType,
        result: GameResult.IN_PROGRESS,
      };
      const blackCount = 10;
      const whiteCount = 8;

      const result = GameState.toString(state, blackCount, whiteCount);

      expect(result).toBe('不明な状態 (黒:10, 白:8)');
    });
  });
});
