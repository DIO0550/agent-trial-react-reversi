import { useState, useCallback, useRef } from 'react';
import {
  BoardPosition,
  BOARD_SIZE,
  DiscColor,
  DiscsState,
  FlippingDiscsState,
} from '../types/reversi-types';
import {
  findFlippableDiscs,
  getPlaceablePositions,
} from '../utils/board-utils';

/**
 * エラーメッセージ
 */
const ERROR_MESSAGES = {
  CANNOT_PLACE_DISC: 'この位置には石を置けません',
};

/**
 * アニメーションの設定
 */
const ANIMATION_DURATION = 600; // ミリ秒

/**
 * 初期盤面の設定
 */
const createInitialDiscs = (): DiscsState => {
  const middle = BOARD_SIZE / 2 - 1;
  return {
    [`${middle},${middle}`]: DiscColor.WHITE,
    [`${middle},${middle + 1}`]: DiscColor.BLACK,
    [`${middle + 1},${middle}`]: DiscColor.BLACK,
    [`${middle + 1},${middle + 1}`]: DiscColor.WHITE,
  };
};

/**
 * 位置をキー文字列に変換する関数
 */
const positionToKey = (position: BoardPosition): string => {
  return `${position.row},${position.col}`;
};

/**
 * 反対の色を返す関数
 */
const getOppositeColor = (color: DiscColor): DiscColor => {
  return color === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK;
};

/**
 * useDiscsフックのオプション
 */
type UseDiscsOptions = {
  /** テスト時にアニメーションをスキップする */
  skipAnimationForTesting?: boolean;
};

/**
 * リバーシの石を管理するためのカスタムフック
 * 石の配置状態や置ける場所の管理、石を置く処理を提供する
 */
export const useDiscs = (options: UseDiscsOptions = {}) => {
  const { skipAnimationForTesting = false } = options;

  // 石の配置状態
  const [discs, setDiscs] = useState<DiscsState>(createInitialDiscs());
  // 現在の手番
  const [currentTurn, setCurrentTurn] = useState<DiscColor>(DiscColor.BLACK);
  // ひっくり返しアニメーション中の石
  const [flippingDiscs, setFlippingDiscs] = useState<FlippingDiscsState>({});
  // アニメーション中かどうか
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  // タイマーIDを管理するref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * DiscsStateをBoard型に変換する関数
   */
  const discsToBoard = (): DiscColor[][] => {
    const board: DiscColor[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(DiscColor.NONE));
    // DiscsStateの内容をBoardにコピー
    for (const key in discs) {
      const [row, col] = key.split(',').map(Number);
      board[row][col] = discs[key];
    }
    return board;
  };

  /**
   * 現在の手番で石を置ける位置をすべて取得
   */
  const placeablePositions = useCallback((): BoardPosition[] => {
    // アニメーション中は石を置けないようにする
    if (isAnimating && !skipAnimationForTesting) return [];

    const board = discsToBoard();
    return getPlaceablePositions(board, currentTurn);
  }, [currentTurn, discs, isAnimating, skipAnimationForTesting]);

  /**
   * 特定の位置に石を置けるかどうかをチェック
   */
  const canPlaceDisc = useCallback(
    (position: BoardPosition): boolean => {
      // アニメーション中は石を置けないようにする
      if (isAnimating && !skipAnimationForTesting) return false;

      const board = discsToBoard();
      return (
        findFlippableDiscs(position.row, position.col, currentTurn, board)
          .length > 0
      );
    },
    [currentTurn, discs, isAnimating, skipAnimationForTesting],
  );

  /**
   * 指定した位置に石を置く
   */
  const placeDisc = (position: BoardPosition): void => {
    // アニメーション中は石を置けないようにする
    if (isAnimating && !skipAnimationForTesting) return;

    // 石を置けるか確認
    if (!canPlaceDisc(position)) {
      throw new Error(ERROR_MESSAGES.CANNOT_PLACE_DISC);
    }

    const board = discsToBoard();
    const flippableDiscs = findFlippableDiscs(
      position.row,
      position.col,
      currentTurn,
      board,
    );

    // 新しい盤面を作成
    const newDiscs = { ...discs };
    // 置いた位置に石を追加
    newDiscs[positionToKey(position)] = currentTurn;

    // テスト環境ではアニメーションをスキップ
    if (skipAnimationForTesting) {
      // ひっくり返す石を処理
      flippableDiscs.forEach((flipPosition) => {
        newDiscs[positionToKey(flipPosition)] = currentTurn;
      });

      // 盤面と手番を更新
      setDiscs(newDiscs);
      setCurrentTurn(getOppositeColor(currentTurn));
      return;
    }

    // ひっくり返すアニメーション用の情報をセット
    const newFlippingDiscs: FlippingDiscsState = {};

    // ひっくり返す石の情報を保存（前の色と、ひっくり返し方向を決定）
    flippableDiscs.forEach((flipPosition) => {
      const posKey = positionToKey(flipPosition);
      const previousColor = newDiscs[posKey];

      // X方向かY方向のアニメーションを決定（交互に変える）
      const flipAxis =
        (flipPosition.row + flipPosition.col) % 2 === 0 ? 'x' : 'y';

      newFlippingDiscs[posKey] = {
        previousColor,
        targetColor: currentTurn,
        flipAxis,
      };
    });

    // アニメーション開始
    setIsAnimating(true);
    setFlippingDiscs(newFlippingDiscs);

    // アニメーション完了後に実行する処理
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      // アニメーションが完了したら実際に石をひっくり返す
      const finalDiscs = { ...newDiscs };
      flippableDiscs.forEach((flipPosition) => {
        finalDiscs[positionToKey(flipPosition)] = currentTurn;
      });

      // 状態を更新
      setDiscs(finalDiscs);
      setFlippingDiscs({});
      setIsAnimating(false);
      // 手番を変更
      setCurrentTurn(getOppositeColor(currentTurn));

      timerRef.current = null;
    }, ANIMATION_DURATION);
  };

  return {
    discs,
    currentTurn,
    flippingDiscs,
    isAnimating,
    placeablePositions,
    placeDisc,
  };
};
