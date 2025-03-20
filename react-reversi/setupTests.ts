import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';

// カスタムマッチャーを追加
expect.extend({
  /**
   * 値がtrueであるか確認するマッチャー
   */
  toBeTrue(received) {
    const pass = received === true;
    if (pass) {
      return {
        message: () => `expected ${received} not to be true`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be true`,
        pass: false,
      };
    }
  },
  /**
   * 値がfalseであるか確認するマッチャー
   */
  toBeFalse(received) {
    const pass = received === false;
    if (pass) {
      return {
        message: () => `expected ${received} not to be false`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be false`,
        pass: false,
      };
    }
  },
});

// TypeScriptの型定義を拡張
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeTrue(): T;
    toBeFalse(): T;
  }
}
