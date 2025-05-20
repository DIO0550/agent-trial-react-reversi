import { describe, expect, test, vi } from 'vitest';
import { DiscColor } from './disc-color';
import { PlayerColor } from '@/features/start-menu/types/start-menu-types';

describe('DiscColor', () => {
  describe('fromPlayerColor', () => {
    test('黒を選択したらDiscColor.BLACKが返される', () => {
      const playerColor: PlayerColor = 'black';
      const result = DiscColor.fromPlayerColor(playerColor);
      expect(result).toBe(DiscColor.BLACK);
    });

    test('白を選択したらDiscColor.WHITEが返される', () => {
      const playerColor: PlayerColor = 'white';
      const result = DiscColor.fromPlayerColor(playerColor);
      expect(result).toBe(DiscColor.WHITE);
    });
    
    test('ランダムを選択したら黒または白がランダムに返される', () => {
      const playerColor: PlayerColor = 'random';
      
      // Math.random のモックを作成
      const mockMath = Object.create(global.Math);
      mockMath.random = vi.fn();
      global.Math = mockMath;
      
      // Math.random が 0.4 を返すようにする (0.5未満なので黒が返される)
      Math.random = vi.fn().mockReturnValueOnce(0.4);
      let result = DiscColor.fromPlayerColor(playerColor);
      expect(result).toBe(DiscColor.BLACK);
      
      // Math.random が 0.6 を返すようにする (0.5以上なので白が返される)
      Math.random = vi.fn().mockReturnValueOnce(0.6);
      result = DiscColor.fromPlayerColor(playerColor);
      expect(result).toBe(DiscColor.WHITE);
    });
  });
});