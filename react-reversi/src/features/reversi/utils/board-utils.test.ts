import { describe, expect, it } from 'vitest';
import {
  isWithinBoard,
  findFlippableDiscsInDirection,
  findFlippableDiscs,
  getPlaceablePositions,
  DIRECTIONS,
} from './board-utils';
import {
  Direction,
  BoardPosition,
  Board,
  CellState,
} from '../types/reversi-types';
import { CanPlace } from '../utils/can-place';
import { RotationState } from '../utils/rotation-state-utils';
import { DiscColor } from './disc-color';

/**
 * テスト用にDiscColorの二次元配列をCellStateの二次元配列に変換するヘルパー関数
 */
const createBoardFromDiscColors = (discColors: DiscColor.Type[][]): Board => {
  return discColors.map((row) =>
    row.map((discColor) => ({
      discColor,
      rotationState: RotationState.fromDiscColor(discColor),
      canPlace: CanPlace.createEmpty(),
    })),
  );
};

describe('board-utils関数', () => {
  // isWithinBoardのテスト
  describe('isWithinBoard関数', () => {
    it('盤面内の座標の場合はtrueを返すこと', () => {
      expect(isWithinBoard({ row: 0, col: 0, size: 8 })).toBeTrue();
      expect(isWithinBoard({ row: 3, col: 4, size: 8 })).toBeTrue();
      expect(isWithinBoard({ row: 7, col: 7, size: 8 })).toBeTrue();
    });

    it('盤面外の座標の場合はfalseを返すこと', () => {
      expect(isWithinBoard({ row: -1, col: 0, size: 8 })).toBeFalse();
      expect(isWithinBoard({ row: 0, col: -1, size: 8 })).toBeFalse();
      expect(isWithinBoard({ row: 8, col: 0, size: 8 })).toBeFalse();
      expect(isWithinBoard({ row: 0, col: 8, size: 8 })).toBeFalse();
    });

    it('サイズが異なる盤面でも正しく判定すること', () => {
      expect(isWithinBoard({ row: 0, col: 0, size: 4 })).toBeTrue();
      expect(isWithinBoard({ row: 3, col: 3, size: 4 })).toBeTrue();
      expect(isWithinBoard({ row: 4, col: 0, size: 4 })).toBeFalse();
    });
  });

  // findFlippableDiscsInDirectionのテスト
  describe('findFlippableDiscsInDirection関数', () => {
    it('ひっくり返せる石がある場合はその位置の配列を返すこと', () => {
      // 盤面を設定（DiscColor.NONE: 空, DiscColor.BLACK: 黒, DiscColor.WHITE: 白）
      const board = createBoardFromDiscColors([
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.BLACK,
          DiscColor.WHITE,
          DiscColor.WHITE,
          DiscColor.BLACK,
          DiscColor.NONE,
        ], // この行に注目: (3,3)に黒、(3,4)(3,5)に白、(3,6)に黒
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
      ]);

      // 方向: 右（colDelta: 1, rowDelta: 0）
      const direction: Direction = { rowDelta: 0, colDelta: 1 };
      // 黒の立場で白を挟むかチェック
      const result = findFlippableDiscsInDirection({
        row: 3,
        col: 2,
        currentPlayer: DiscColor.BLACK,
        direction,
        board,
      });

      // 結果を検証（(3,4)(3,5)が裏返せるはず）
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ row: 3, col: 4 });
      expect(result[1]).toEqual({ row: 3, col: 5 });
    });

    it('直線上に複数の石がひっくり返せる場合は全ての位置を返すこと', () => {
      // 盤面を設定
      const board = createBoardFromDiscColors([
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.BLACK,
          DiscColor.WHITE,
          DiscColor.WHITE,
          DiscColor.WHITE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ], // この行に注目: (3,0)に黒、(3,1)(3,2)(3,3)に白
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
      ]);

      // 黒の立場で白を挟むかチェック
      const result = findFlippableDiscsInDirection({
        row: 3,
        col: 4,
        currentPlayer: DiscColor.BLACK,
        direction: { rowDelta: 0, colDelta: -1 }, // 左方向
        board,
      });

      // 結果を検証（(3,1)(3,2)(3,3)が裏返せるはず）
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { row: 3, col: 3 },
        { row: 3, col: 2 },
        { row: 3, col: 1 },
      ]);
    });

    it('相手の石がない場合は空の配列を返すこと', () => {
      const board = createBoardFromDiscColors([
        [DiscColor.NONE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.NONE],
      ]);

      const result = findFlippableDiscsInDirection({
        row: 0,
        col: 0,
        currentPlayer: DiscColor.BLACK,
        direction: { rowDelta: 0, colDelta: 1 },
        board,
      });

      expect(result).toHaveLength(0);
    });

    it('相手の石の後に自分の石がない場合は空の配列を返すこと', () => {
      const board = createBoardFromDiscColors([
        [DiscColor.NONE, DiscColor.WHITE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.NONE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.NONE, DiscColor.NONE],
      ]);

      const result = findFlippableDiscsInDirection({
        row: 0,
        col: 0,
        currentPlayer: DiscColor.BLACK,
        direction: { rowDelta: 0, colDelta: 1 },
        board,
      });

      expect(result).toHaveLength(0);
    });

    it('盤面の端を超える方向では空の配列を返すこと', () => {
      const board = createBoardFromDiscColors([
        [DiscColor.NONE, DiscColor.WHITE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.NONE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.NONE, DiscColor.NONE],
      ]);

      const result = findFlippableDiscsInDirection({
        row: 0,
        col: 0,
        currentPlayer: DiscColor.BLACK,
        direction: { rowDelta: -1, colDelta: 0 },
        board,
      });

      expect(result).toHaveLength(0);
    });
  });

  // findFlippableDiscsのテスト
  describe('findFlippableDiscs関数', () => {
    it('すべての方向のひっくり返せる石を取得できること', () => {
      // 初期盤面を設定
      const board = createBoardFromDiscColors([
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.WHITE,
          DiscColor.BLACK,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.BLACK,
          DiscColor.WHITE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
      ]);

      // 黒がプレイする場合、(3,5)に置くと(3,4)の白が裏返せるはず
      const result = findFlippableDiscs({
        row: 3,
        col: 5,
        currentPlayer: DiscColor.BLACK,
        board,
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ row: 3, col: 4 });

      // 黒がプレイする場合、(5,3)に置くと(4,3)の白が裏返せるはず
      const result2 = findFlippableDiscs({
        row: 5,
        col: 3,
        currentPlayer: DiscColor.BLACK,
        board,
      });

      expect(result2).toHaveLength(1);
      expect(result2[0]).toEqual({ row: 4, col: 3 });
    });

    it('既に石がある場所には置けないこと', () => {
      const board = createBoardFromDiscColors([
        [DiscColor.NONE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.BLACK],
      ]);

      const result = findFlippableDiscs({
        row: 1,
        col: 1,
        currentPlayer: DiscColor.BLACK,
        board,
      });

      expect(result).toHaveLength(0);
    });

    it('ひっくり返せる石がない場合は空の配列を返すこと', () => {
      const board = createBoardFromDiscColors([
        [DiscColor.NONE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.BLACK],
      ]);

      const result = findFlippableDiscs({
        row: 0,
        col: 0,
        currentPlayer: DiscColor.BLACK,
        board,
      });

      expect(result).toHaveLength(0);
    });
  });

  // getPlaceablePositionsのテスト
  describe('getPlaceablePositions関数', () => {
    it('初期盤面で黒が置ける位置を正しく取得できること', () => {
      // 初期盤面を設定
      const board = createBoardFromDiscColors([
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.WHITE,
          DiscColor.BLACK,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.BLACK,
          DiscColor.WHITE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
      ]);

      const positions = getPlaceablePositions({
        board,
        currentPlayer: DiscColor.BLACK,
      });

      // 初期盤面で黒が置ける位置は4箇所
      expect(positions).toHaveLength(4);
      expect(positions).toEqual(
        expect.arrayContaining([
          { row: 2, col: 4 },
          { row: 3, col: 5 },
          { row: 4, col: 2 },
          { row: 5, col: 3 },
        ]),
      );
    });

    it('置ける場所がない場合は空の配列を返すこと', () => {
      const board = createBoardFromDiscColors([
        [DiscColor.BLACK, DiscColor.BLACK],
        [DiscColor.BLACK, DiscColor.BLACK],
      ]);

      const positions = getPlaceablePositions({
        board,
        currentPlayer: DiscColor.WHITE,
      });

      expect(positions).toHaveLength(0);
    });

    it('盤面全体をスキャンして置ける場所をすべて返すこと', () => {
      const board = createBoardFromDiscColors([
        [DiscColor.NONE, DiscColor.NONE, DiscColor.BLACK],
        [DiscColor.NONE, DiscColor.WHITE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.NONE, DiscColor.NONE],
      ]);

      const positions = getPlaceablePositions({
        board,
        currentPlayer: DiscColor.BLACK,
      });

      // 黒が置ける場所は1箇所のはず
      expect(positions).toHaveLength(1);
      expect(positions[0]).toEqual({ row: 2, col: 1 });
    });
  });

  // DIRECTIONS定数のテスト
  describe('DIRECTIONS定数', () => {
    it('8方向すべての変化量が定義されていること', () => {
      expect(DIRECTIONS).toHaveLength(8);
      // 上下左右斜めの8方向全てが定義されているか確認
      expect(DIRECTIONS).toEqual(
        expect.arrayContaining([
          { rowDelta: -1, colDelta: -1 }, // 左上
          { rowDelta: -1, colDelta: 0 }, // 上
          { rowDelta: -1, colDelta: 1 }, // 右上
          { rowDelta: 0, colDelta: -1 }, // 左
          { rowDelta: 0, colDelta: 1 }, // 右
          { rowDelta: 1, colDelta: -1 }, // 左下
          { rowDelta: 1, colDelta: 0 }, // 下
          { rowDelta: 1, colDelta: 1 }, // 右下
        ]),
      );
    });
  });
});