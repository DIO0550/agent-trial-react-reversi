import { useState, useCallback } from 'react';
import {
  DiscColor,
  BOARD_SIZE,
  BoardPosition,
  Direction,
  Board,
} from '../types/reversi-types';
import { RotationState, FlipDirection } from '../utils/rotation-state-utils';
import { CanPlace } from '../utils/can-place';
import {
  FlipDiscPosition,
  getFlipDirection,
  useFlipDiscQueue,
} from './use-flip-disc-queue';

// 8方向の移動ベクトル
const DIRECTIONS: Direction[] = [
  { rowDelta: -1, colDelta: 0 }, // 上
  { rowDelta: -1, colDelta: 1 }, // 右上
  { rowDelta: 0, colDelta: 1 }, // 右
  { rowDelta: 1, colDelta: 1 }, // 右下
  { rowDelta: 1, colDelta: 0 }, // 下
  { rowDelta: 1, colDelta: -1 }, // 左下
  { rowDelta: 0, colDelta: -1 }, // 左
  { rowDelta: -1, colDelta: -1 }, // 左上
];

/**
 * 初期盤面を作成する
 * @returns 石の配置情報を持つ二次元配列
 */
const createInitialDiscs = (): DiscColor[][] => {
  // 8x8の空の盤面を作成
  const discs: DiscColor[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(DiscColor.NONE));

  // 中央に4つの石を配置
  const middle = Math.floor(BOARD_SIZE / 2) - 1;
  discs[middle][middle] = DiscColor.WHITE;
  discs[middle][middle + 1] = DiscColor.BLACK;
  discs[middle + 1][middle] = DiscColor.BLACK;
  discs[middle + 1][middle + 1] = DiscColor.WHITE;

  return discs;
};

/**
 * 石の管理と配置のためのフック
 */
export const useDiscs = () => {
  // 盤面の状態
  const [discs, setDiscs] = useState<DiscColor[][]>(createInitialDiscs);
  // 現在のターン
  const [currentTurn, setCurrentTurn] = useState<DiscColor>(DiscColor.BLACK);
  // 裏返し処理中かどうか
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  // 裏返すキューの管理
  const { flippingDiscs, enqueueFlipDiscs, clearFlipQueue, completeFlipping } =
    useFlipDiscQueue();

  /**
   * 盤面の位置が有効かどうかを確認
   * @param row 行番号
   * @param col 列番号
   * @returns 有効な位置ならtrue
   */
  const isValidPosition = useCallback((row: number, col: number): boolean => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }, []);

  /**
   * 指定した方向に対する反転できる石の位置と方向情報を取得
   * @param row 起点の行番号
   * @param col 起点の列番号
   * @param direction 方向
   * @param turnColor 現在のターンの色
   * @returns 反転できる石の情報の配列
   */
  const getFlippableDiscsInDirection = useCallback(
    (
      row: number,
      col: number,
      direction: Direction,
      turnColor: DiscColor,
    ): FlipDiscPosition[] => {
      const flippableDiscs: FlipDiscPosition[] = [];
      const opponentColor =
        turnColor === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK;

      let currentRow = row + direction.rowDelta;
      let currentCol = col + direction.colDelta;

      // 相手の石が続く間、位置を記録
      while (
        isValidPosition(currentRow, currentCol) &&
        discs[currentRow][currentCol] === opponentColor
      ) {
        // 反転方向を計算
        const flipDirection = getFlipDirection(direction);

        flippableDiscs.push({
          position: { row: currentRow, col: currentCol },
          direction: flipDirection,
        });

        currentRow += direction.rowDelta;
        currentCol += direction.colDelta;
      }

      // 最後に自分の石があれば反転可能
      if (
        isValidPosition(currentRow, currentCol) &&
        discs[currentRow][currentCol] === turnColor &&
        flippableDiscs.length > 0
      ) {
        return flippableDiscs;
      }

      return [];
    },
    [discs, isValidPosition],
  );

  /**
   * すべての方向に対する反転できる石の位置と方向情報を取得
   * @param row 起点の行番号
   * @param col 起点の列番号
   * @param turnColor 現在のターンの色
   * @returns 反転できる石の情報の配列
   */
  const getAllFlippableDiscs = useCallback(
    (row: number, col: number, turnColor: DiscColor): FlipDiscPosition[] => {
      return DIRECTIONS.flatMap((direction) =>
        getFlippableDiscsInDirection(row, col, direction, turnColor),
      );
    },
    [getFlippableDiscsInDirection],
  );

  /**
   * 盤面上で石を置ける位置をすべて取得
   * @returns 石を置ける位置の配列
   */
  const placeablePositions = useCallback((): BoardPosition[] => {
    const positions: BoardPosition[] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // 空のセルで、かつ石を反転させられる場所を探す
        if (
          discs[row][col] === DiscColor.NONE &&
          getAllFlippableDiscs(row, col, currentTurn).length > 0
        ) {
          positions.push({ row, col });
        }
      }
    }

    return positions;
  }, [discs, currentTurn, getAllFlippableDiscs]);

  /**
   * キューに登録された石の裏返しが全て終わったか確認
   * 終わっていれば次のターンに移行する
   */
  const checkFlippingComplete = useCallback(() => {
    if (flippingDiscs.length === 0 && isFlipping) {
      setIsFlipping(false);

      // 手番を切り替え
      setCurrentTurn(
        currentTurn === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK,
      );
    }
  }, [flippingDiscs.length, isFlipping, currentTurn]);

  /**
   * 石の裏返しが完了したときに呼び出される処理
   * @param position 裏返しが完了した石の位置
   */
  const handleFlipComplete = useCallback(
    (position: BoardPosition) => {
      // 石の色を反転させる
      setDiscs((prev) => {
        const newDiscs = prev.map((row) => [...row]);
        // 現在のターンと逆の色を設定
        const flippedColor =
          currentTurn === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK;
        newDiscs[position.row][position.col] = flippedColor;
        return newDiscs;
      });

      completeFlipping(position);
      checkFlippingComplete();
    },
    [completeFlipping, checkFlippingComplete, currentTurn],
  );

  /**
   * 盤面に石を置く
   * @param position 石を置く位置
   * @throws 石を置けない位置の場合はエラー
   */
  const placeDisc = useCallback(
    (position: BoardPosition) => {
      // 裏返し処理中は新たに石を置けないようにする
      if (isFlipping) {
        return;
      }

      const { row, col } = position;

      // 空のセルかチェック
      if (discs[row][col] !== DiscColor.NONE) {
        throw new Error('この位置には既に石が置かれています');
      }

      // 反転できる石の情報を取得
      const flippableDiscs = getAllFlippableDiscs(row, col, currentTurn);

      // 反転できる石がない場合はエラー
      if (flippableDiscs.length === 0) {
        throw new Error('この位置には石を置けません');
      }

      // 盤面をコピー
      const newDiscs = discs.map((row) => [...row]);

      // 新しい石を置く
      newDiscs[row][col] = currentTurn;

      // 盤面を更新
      setDiscs(newDiscs);

      // 裏返し処理を開始
      setIsFlipping(true);

      // 裏返す石をキューに登録
      enqueueFlipDiscs(flippableDiscs);
    },
    [discs, currentTurn, isFlipping, getAllFlippableDiscs, enqueueFlipDiscs],
  );

  /**
   * 盤面の状態をBoardコンポーネントに渡す形式に変換する関数
   * @returns Board型の盤面状態
   */
  const convertToBoardState = useCallback((): Board => {
    const boardState: Board = Array(BOARD_SIZE)
      .fill(null)
      .map(() =>
        Array(BOARD_SIZE)
          .fill(null)
          .map(() => ({
            discColor: DiscColor.NONE,
            rotationState: {
              xDeg: 0,
              yDeg: 0,
            },
            canPlace: CanPlace.createEmpty(),
          })),
      );

    // 石の配置を反映
    discs.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        if (color !== DiscColor.NONE) {
          boardState[rowIndex][colIndex].discColor = color;
          boardState[rowIndex][colIndex].rotationState =
            RotationState.fromDiscColor(color);
        }
      });
    });

    return boardState;
  }, [discs]);

  /**
   * 指定したセルが置ける位置かどうかを判定
   * @param row 行番号
   * @param col 列番号
   * @returns 置ける位置ならtrue、そうでなければfalse
   */
  const isPlaceablePosition = useCallback(
    (row: number, col: number): boolean => {
      return (
        discs[row][col] === DiscColor.NONE &&
        getAllFlippableDiscs(row, col, currentTurn).length > 0
      );
    },
    [discs, currentTurn, getAllFlippableDiscs],
  );

  return {
    discs,
    currentTurn,
    placeDisc,
    placeablePositions,
    isPlaceablePosition,
    convertToBoardState,
    flippingDiscs,
    handleFlipComplete,
    isFlipping,
  };
};
