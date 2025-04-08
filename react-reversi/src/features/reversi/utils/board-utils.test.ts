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
  DiscColor,
  Board,
  CellState,
} from '../types/reversi-types';
import { CanPlace } from '../utils/can-place';
import { RotationState } from '../utils/rotation-state-utils';

/**
 * テスト用にDiscColorの二次元配列をCellStateの二次元配列に変換するヘルパー関数
 */
const createBoardFromDiscColors = (discColors: DiscColor[][]): Board => {
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
      expect(isWithinBoard(0, 0, 8)).toBeTrue();
      expect(isWithinBoard(3, 4, 8)).toBeTrue();
      expect(isWithinBoard(7, 7, 8)).toBeTrue();
    });

    it('盤面外の座標の場合はfalseを返すこと', () => {
      expect(isWithinBoard(-1, 0, 8)).toBeFalse();
      expect(isWithinBoard(0, -1, 8)).toBeFalse();
      expect(isWithinBoard(8, 0, 8)).toBeFalse();
      expect(isWithinBoard(0, 8, 8)).toBeFalse();
    });

    it('サイズが異なる盤面でも正しく判定すること', () => {
      expect(isWithinBoard(0, 0, 4)).toBeTrue();
      expect(isWithinBoard(3, 3, 4)).toBeTrue();
      expect(isWithinBoard(4, 0, 4)).toBeFalse();
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

      // 右方向をテスト: (3,3)の黒から見て、(3,4)(3,5)の白をひっくり返せる
      const direction: Direction = { rowDelta: 0, colDelta: 1 };
      const result = findFlippableDiscsInDirection(
        3,
        3,
        DiscColor.BLACK,
        direction,
        board,
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { row: 3, col: 4 },
        { row: 3, col: 5 },
      ]);
    });

    it('直線上に複数の石がひっくり返せる場合は全ての位置を返すこと', () => {
      // 盤面を設定（連続した相手の石がある場合）
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
          DiscColor.BLACK,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.WHITE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.WHITE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.WHITE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.BLACK,
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

      // 下方向をテスト: (2,2)から(5,2)までの石をひっくり返す
      const direction: Direction = { rowDelta: 1, colDelta: 0 };
      const result = findFlippableDiscsInDirection(
        2,
        2,
        DiscColor.BLACK,
        direction,
        board,
      );

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { row: 3, col: 2 },
        { row: 4, col: 2 },
        { row: 5, col: 2 },
      ]);
    });

    it('相手の石がない場合は空の配列を返すこと', () => {
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

      // 上方向をテスト (3,3)に黒(DiscColor.BLACK)を置こうとしても置けない
      const direction: Direction = { rowDelta: -1, colDelta: 0 };
      const result = findFlippableDiscsInDirection(
        3,
        3,
        DiscColor.BLACK,
        direction,
        board,
      );

      expect(result).toHaveLength(0);
    });

    it('相手の石の後に自分の石がない場合は空の配列を返すこと', () => {
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

      // 右方向をテスト (3,3)から(3,6)で自分の石がないため挟めない
      const direction: Direction = { rowDelta: 0, colDelta: 1 };
      const result = findFlippableDiscsInDirection(
        3,
        3,
        DiscColor.BLACK,
        direction,
        board,
      );

      // 最後に自分の石がないので、空の配列を返す
      expect(result).toHaveLength(0);
    });

    it('盤面の端を超える方向では空の配列を返すこと', () => {
      const board = createBoardFromDiscColors([
        [
          DiscColor.BLACK,
          DiscColor.WHITE,
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

      // 左上方向をテスト (0,0)に白(DiscColor.WHITE)を置こうとしても盤面外になる
      const direction: Direction = { rowDelta: -1, colDelta: -1 };
      const result = findFlippableDiscsInDirection(
        0,
        0,
        DiscColor.WHITE,
        direction,
        board,
      );

      expect(result).toHaveLength(0);
    });
  });

  // findFlippableDiscsのテスト
  describe('findFlippableDiscs関数', () => {
    it('すべての方向のひっくり返せる石を取得できること', () => {
      // 標準的な盤面を設定
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
          DiscColor.NONE,
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
      ]);

      // (5,3)に黒(DiscColor.BLACK)を置くと、白をひっくり返せる
      const result = findFlippableDiscs(5, 3, DiscColor.BLACK, board);

      expect(result).toHaveLength(1);
      expect(result).toEqual([
        { row: 4, col: 3 }, // 上方向
      ]);
    });

    it('既に石がある場所には置けないこと', () => {
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

      // 既に石がある(3,3)に置こうとする
      const result = findFlippableDiscs(3, 3, DiscColor.WHITE, board);

      expect(result).toHaveLength(0);
    });

    it('ひっくり返せる石がない場合は空の配列を返すこと', () => {
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

      // 相手の石を挟めない場所
      const result = findFlippableDiscs(0, 0, DiscColor.BLACK, board);

      expect(result).toHaveLength(0);
    });
  });

  // getPlaceablePositionsのテスト
  describe('getPlaceablePositions関数', () => {
    it('初期盤面で黒が置ける位置を正しく取得できること', () => {
      // 初期状態の盤面を設定（4x4の例）
      const board = createBoardFromDiscColors([
        [DiscColor.NONE, DiscColor.NONE, DiscColor.NONE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.BLACK, DiscColor.WHITE, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.WHITE, DiscColor.BLACK, DiscColor.NONE],
        [DiscColor.NONE, DiscColor.NONE, DiscColor.NONE, DiscColor.NONE],
      ]);

      // 黒(DiscColor.BLACK)が置ける位置を取得
      const result = getPlaceablePositions(board, DiscColor.BLACK);

      // 配列の要素数をチェック
      expect(result).toHaveLength(4);

      // 結果に特定の位置が含まれているか確認（順序は問わない）
      const expectedPositions: BoardPosition[] = [
        { row: 0, col: 2 },
        { row: 1, col: 3 },
        { row: 2, col: 0 },
        { row: 3, col: 1 },
      ];

      // 各要素が結果に含まれているか確認
      expectedPositions.forEach((pos) => {
        expect(
          result.some((r) => r.row === pos.row && r.col === pos.col),
        ).toBeTrue();
      });
    });

    it('置ける場所がない場合は空の配列を返すこと', () => {
      // 黒が置ける場所がない盤面
      const board = createBoardFromDiscColors([
        [DiscColor.BLACK, DiscColor.BLACK, DiscColor.BLACK],
        [DiscColor.BLACK, DiscColor.WHITE, DiscColor.BLACK],
        [DiscColor.BLACK, DiscColor.BLACK, DiscColor.BLACK],
      ]);

      // 白(DiscColor.WHITE)が置ける位置を取得
      const result = getPlaceablePositions(board, DiscColor.WHITE);

      expect(result).toHaveLength(0);
    });

    it('盤面全体をスキャンして置ける場所をすべて返すこと', () => {
      // 複雑な盤面
      const board = createBoardFromDiscColors([
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.BLACK,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.WHITE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.WHITE,
          DiscColor.BLACK,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.NONE,
        ],
        [
          DiscColor.NONE,
          DiscColor.NONE,
          DiscColor.WHITE,
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

      // 黒(DiscColor.BLACK)が置ける位置を取得
      const result = getPlaceablePositions(board, DiscColor.BLACK);

      // それぞれの位置に置けるか確認
      expect(result.length).toBeGreaterThan(0);

      // 1つだけ確認（(1,1)には置けるはず）
      expect(result.some((pos) => pos.row === 1 && pos.col === 1)).toBeTrue();
    });
  });

  // DIRECTIONSのテスト
  describe('DIRECTIONS定数', () => {
    it('8方向すべての変化量が定義されていること', () => {
      expect(DIRECTIONS).toHaveLength(8);

      // 全方向が含まれているか確認
      const expectedDirections: Direction[] = [
        { rowDelta: -1, colDelta: -1 }, // 左上
        { rowDelta: -1, colDelta: 0 }, // 上
        { rowDelta: -1, colDelta: 1 }, // 右上
        { rowDelta: 0, colDelta: -1 }, // 左
        { rowDelta: 0, colDelta: 1 }, // 右
        { rowDelta: 1, colDelta: -1 }, // 左下
        { rowDelta: 1, colDelta: 0 }, // 下
        { rowDelta: 1, colDelta: 1 }, // 右下
      ];

      expectedDirections.forEach((direction) => {
        expect(DIRECTIONS).toEqual(expect.arrayContaining([direction]));
      });
    });
  });
});
