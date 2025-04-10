import { useState, useCallback, useEffect } from 'react';
import {
  DiscColor,
  BOARD_SIZE,
  BoardPosition,
  Direction,
  Board,
} from '../types/reversi-types';
import { RotationState } from '../utils/rotation-state-utils';
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

// 石の裏返しアニメーションの間隔（ミリ秒）
const FLIP_ANIMATION_INTERVAL = 150;

/**
 * 初期盤面を作成する
 * @returns 盤面データ
 */
const createInitialBoard = (): Board => {
  // 8x8の空の盤面を作成
  const board: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({
          discColor: DiscColor.NONE,
          rotationState: RotationState.createInitial(),
          canPlace: CanPlace.createEmpty(),
        })),
    );

  // 中央に4つの石を配置
  const middle = Math.floor(BOARD_SIZE / 2) - 1;
  board[middle][middle] = {
    ...board[middle][middle],
    discColor: DiscColor.WHITE,
    rotationState: RotationState.fromDiscColor(DiscColor.WHITE),
  };
  board[middle][middle + 1] = {
    ...board[middle][middle + 1],
    discColor: DiscColor.BLACK,
    rotationState: RotationState.fromDiscColor(DiscColor.BLACK),
  };
  board[middle + 1][middle] = {
    ...board[middle + 1][middle],
    discColor: DiscColor.BLACK,
    rotationState: RotationState.fromDiscColor(DiscColor.BLACK),
  };
  board[middle + 1][middle + 1] = {
    ...board[middle + 1][middle + 1],
    discColor: DiscColor.WHITE,
    rotationState: RotationState.fromDiscColor(DiscColor.WHITE),
  };

  return board;
};

/**
 * 石の管理と配置のためのフック
 */
export const useDiscs = () => {
  // 盤面の状態
  const [board, setBoard] = useState<Board>(createInitialBoard);
  // 現在のターン
  const [currentTurn, setCurrentTurn] = useState<DiscColor>(DiscColor.BLACK);
  // 裏返し処理中かどうか
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  // 裏返すキューの管理
  const { flippingDiscs, enqueueFlipDiscs, completeFlipping, dequeueFlipDisc } =
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
        board[currentRow][currentCol].discColor === opponentColor
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
        board[currentRow][currentCol].discColor === turnColor &&
        flippableDiscs.length > 0
      ) {
        return flippableDiscs;
      }

      return [];
    },
    [board, isValidPosition],
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
          board[row][col].discColor === DiscColor.NONE &&
          getAllFlippableDiscs(row, col, currentTurn).length > 0
        ) {
          positions.push({ row, col });
        }
      }
    }

    return positions;
  }, [board, currentTurn, getAllFlippableDiscs]);

  /**
   * 盤面上の各マスに石が置けるかどうかの状態を更新する
   * @param turnColor 評価するターンの色
   */
  const updatePlaceableState = useCallback(
    (turnColor: DiscColor) => {
      setBoard((prev) => {
        const newBoard = prev.map((rowArr) => [...rowArr]);

        // 全マスを確認して、石が置けるかどうかを判定
        for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            // 空のセルかつ、石を裏返せる位置かどうかを確認
            const canPlaceHere =
              newBoard[row][col].discColor === DiscColor.NONE &&
              getAllFlippableDiscs(row, col, turnColor).length > 0;

            // canPlace状態を更新（現在のターンの色に応じて適切なメソッドを使用）
            const currentCanPlace = newBoard[row][col].canPlace;
            const updatedCanPlace =
              turnColor === DiscColor.BLACK
                ? CanPlace.setBlackCanPlace(currentCanPlace, canPlaceHere)
                : CanPlace.setWhiteCanPlace(currentCanPlace, canPlaceHere);

            newBoard[row][col] = {
              ...newBoard[row][col],
              canPlace: updatedCanPlace,
            };
          }
        }

        return newBoard;
      });
    },
    [getAllFlippableDiscs],
  );

  /**
   * キューに登録された石の裏返しが全て終わったか判定して次のターンへ移行する
   */
  const processFlippingCompletion = useCallback(() => {
    if (flippingDiscs.length === 0 && isFlipping) {
      setIsFlipping(false);

      // 次のターンを計算
      const nextTurn =
        currentTurn === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK;

      // 手番を切り替え
      setCurrentTurn(nextTurn);

      // 次のターンの色に基づいて置ける位置を更新
      updatePlaceableState(nextTurn);
    }
  }, [flippingDiscs.length, isFlipping, currentTurn, updatePlaceableState]);

  /**
   * 石の裏返し処理を行う関数
   * @param flipDiscPosition 裏返す石の情報（位置と回転方向）
   */
  const handleFlipDisk = useCallback(
    (flipDiscPosition: FlipDiscPosition) => {
      const { position, direction } = flipDiscPosition;
      const { row, col } = position;

      // 現在の回転状態を取得
      const currentRotationState = board[row][col].rotationState;

      // 指定された方向に基づいて新しい回転状態を計算
      const newRotationState = RotationState.calculateDirectionalRotation(
        currentRotationState,
        direction,
      );

      // 石の色を反転させる
      setBoard((prev) => {
        const newBoard = prev.map((rowArr) => [...rowArr]);
        // 現在のターンと逆の色を設定
        const flippedColor =
          currentTurn === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK;

        newBoard[row][col] = {
          ...newBoard[row][col],
          discColor: flippedColor,
          rotationState: newRotationState,
        };

        return newBoard;
      });

      completeFlipping(position);
    },
    [completeFlipping, currentTurn, board],
  );

  /**
   * flippingDiscsを監視して、自動的に石を裏返す
   */
  useEffect(() => {
    // 裏返し処理中でない場合は何もしない
    if (!isFlipping || flippingDiscs.length === 0) {
      return;
    }

    // 一定間隔で石を裏返す
    const timeoutId = setTimeout(() => {
      const nextDisc = dequeueFlipDisc();
      if (nextDisc) {
        handleFlipDisk(nextDisc);
      }
    }, FLIP_ANIMATION_INTERVAL);

    // クリーンアップ関数
    return () => {
      clearTimeout(timeoutId);
    };
  }, [flippingDiscs, isFlipping, dequeueFlipDisc, handleFlipDisk]);

  /**
   * 初期盤面設定時に石が置ける位置を初期化
   */
  useEffect(() => {
    // コンポーネントのマウント時に初期の置ける位置を設定
    updatePlaceableState(DiscColor.BLACK);
  }, [updatePlaceableState]);

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
      if (board[row][col].discColor !== DiscColor.NONE) {
        throw new Error('この位置には既に石が置かれています');
      }

      // 反転できる石の情報を取得
      const flippableDiscs = getAllFlippableDiscs(row, col, currentTurn);

      // 反転できる石がない場合はエラー
      if (flippableDiscs.length === 0) {
        throw new Error('この位置には石を置けません');
      }

      // 新しい石を置く
      setBoard((prev) => {
        const newBoard = prev.map((rowArr) => [...rowArr]);
        newBoard[row][col] = {
          ...newBoard[row][col],
          discColor: currentTurn,
          rotationState: RotationState.fromDiscColor(currentTurn),
        };
        return newBoard;
      });

      // 裏返し処理を開始
      setIsFlipping(true);

      // 裏返す石をキューに登録
      enqueueFlipDiscs(flippableDiscs);
    },
    [board, currentTurn, isFlipping, getAllFlippableDiscs, enqueueFlipDiscs],
  );

  /**
   * 指定したセルが置ける位置かどうかを判定
   * @param row 行番号
   * @param col 列番号
   * @returns 置ける位置ならtrue、そうでなければfalse
   */
  const isPlaceablePosition = useCallback(
    (row: number, col: number): boolean => {
      return (
        board[row][col].discColor === DiscColor.NONE &&
        getAllFlippableDiscs(row, col, currentTurn).length > 0
      );
    },
    [board, currentTurn, getAllFlippableDiscs],
  );

  /**
   * 石が反転し終えた時の通知を受け取る関数
   * キューの中身が0なら裏返しが完了した扱いにする
   */
  const notifyFlipCompleted = useCallback(() => {
    if (flippingDiscs.length === 0) {
      processFlippingCompletion();
    }
  }, [flippingDiscs.length, processFlippingCompletion]);

  return {
    board,
    currentTurn,
    placeDisc,
    placeablePositions,
    isPlaceablePosition,
    flippingDiscs,
    handleFlipDisk,
    isFlipping,
    notifyFlipCompleted,
    updatePlaceableState,
  };
};
