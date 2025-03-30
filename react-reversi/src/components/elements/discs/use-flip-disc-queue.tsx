import { useState, useCallback } from 'react';
import { BoardPosition } from '@/features/reversi/types/reversi-types';

type Props = {
  /** 次のディスクを取り出す時に呼び出されるコールバック関数 */
  onNextDisc?: (position: BoardPosition) => void;
};

type UseFlipDiscQueueResult = {
  /** 現在のディスクキュー */
  queue: BoardPosition[];
  /**
   * ディスクをキューに追加する関数
   * 単一のディスク位置または複数のディスク位置の配列を受け付ける
   */
  enqueue: (position: BoardPosition | BoardPosition[]) => void;
  /** 次のディスクを取得してキューから削除する関数 */
  dequeue: () => BoardPosition | undefined;
  /** キューをクリアする関数 */
  clearQueue: () => void;
};

/**
 * 反転アニメーションを順番に実行するためのディスクキューを管理するカスタムフック
 *
 * @returns {UseFlipDiscQueueResult} ディスクキューとその操作関数
 */
export const useFlipDiscQueue = (props?: Props): UseFlipDiscQueueResult => {
  const [queue, setQueue] = useState<BoardPosition[]>([]);

  /**
   * ディスクをキューに追加する
   * 単一のディスク位置または複数のディスク位置の配列を受け付ける
   */
  const enqueue = useCallback((position: BoardPosition | BoardPosition[]) => {
    setQueue((prevQueue) => {
      if (Array.isArray(position)) {
        return [...prevQueue, ...position];
      }
      return [...prevQueue, position];
    });
  }, []);

  /**
   * 次のディスクを取得してキューから削除する
   */
  const dequeue = useCallback(() => {
    if (queue.length === 0) {
      return undefined;
    }

    const nextDisc = queue[0];
    setQueue((prevQueue) => prevQueue.slice(1));

    // コールバック関数が存在する場合は呼び出す
    props?.onNextDisc?.(nextDisc);

    return nextDisc;
  }, [queue, props?.onNextDisc]);

  /**
   * キューをクリアする
   */
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    enqueue,
    dequeue,
    clearQueue,
  };
};
