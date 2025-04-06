import { useState, useCallback } from 'react';
import { BoardPosition } from '../types/reversi-types';
import { FlipDirection } from '../utils/rotation-state-utils';

// 裏返す石の情報を表す型（シンプル化）
export type FlipDiscPosition = {
  position: BoardPosition;
  direction: FlipDirection;
};

/**
 * 裏返す石のキューを管理するフック
 * @returns キューと操作関数
 */
export const useFlipDiscQueue = () => {
  // 裏返す石のキュー
  const [flippingDiscs, setFlippingDiscs] = useState<FlipDiscPosition[]>([]);

  /**
   * 裏返す石の情報をキューに登録する
   */
  const enqueueFlipDisc = useCallback((disc: FlipDiscPosition) => {
    setFlippingDiscs((prev) => [...prev, disc]);
  }, []);

  /**
   * 複数の裏返す石の情報をキューに一括登録する
   */
  const enqueueFlipDiscs = useCallback((discs: FlipDiscPosition[]) => {
    if (discs.length === 0) {
      return;
    }

    setFlippingDiscs((prev) => [...prev, ...discs]);
  }, []);

  /**
   * キューから先頭の要素を取り出す
   * @returns キューの先頭要素。キューが空の場合はundefined
   */
  const dequeueFlipDisc = useCallback((): FlipDiscPosition | undefined => {
    if (flippingDiscs.length === 0) {
      return undefined;
    }

    const [nextDisc, ...remainingDiscs] = flippingDiscs;
    setFlippingDiscs(remainingDiscs);
    return nextDisc;
  }, [flippingDiscs]);

  /**
   * キューをクリアする
   */
  const clearFlipQueue = useCallback(() => {
    setFlippingDiscs([]);
  }, []);

  /**
   * 裏返し処理が終了したときに呼び出す関数
   * 指定した位置の石をキューから削除する
   */
  const completeFlipping = useCallback((position: BoardPosition) => {
    setFlippingDiscs((prev) =>
      prev.filter(
        (disc) =>
          !(
            disc.position.row === position.row &&
            disc.position.col === position.col
          ),
      ),
    );
  }, []);

  return {
    flippingDiscs,
    enqueueFlipDisc,
    enqueueFlipDiscs,
    dequeueFlipDisc,
    clearFlipQueue,
    completeFlipping,
  };
};

/**
 * 方向に基づいて、裏返しの方向を決定する関数
 * @param direction 方向（上下左右斜めの情報）
 * @returns 裏返しの方向
 */
export const getFlipDirection = (direction: {
  rowDelta: number;
  colDelta: number;
}): FlipDirection => {
  if (direction.rowDelta === 0) {
    return direction.colDelta > 0
      ? FlipDirection.LEFT_TO_RIGHT
      : FlipDirection.RIGHT_TO_LEFT;
  } else if (direction.colDelta === 0) {
    return direction.rowDelta > 0
      ? FlipDirection.TOP_TO_BOTTOM
      : FlipDirection.BOTTOM_TO_TOP;
  } else if (Math.abs(direction.rowDelta) === Math.abs(direction.colDelta)) {
    // 斜め方向は、主要な動きを優先する（ここでは横方向を優先）
    return direction.colDelta > 0
      ? FlipDirection.LEFT_TO_RIGHT
      : FlipDirection.RIGHT_TO_LEFT;
  }

  return FlipDirection.TOP_TO_BOTTOM; // デフォルト値
};
