import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFlipDiscQueue } from './use-flip-disc-queue';
import { BoardPosition } from '@/features/reversi/types/reversi-types';

describe('useFlipDiscQueue', () => {
  it('初期状態では空のキューを持つ', () => {
    const { result } = renderHook(() => useFlipDiscQueue());

    expect(result.current.queue).toHaveLength(0);
  });

  it('ディスクをキューに追加できる', () => {
    const { result } = renderHook(() => useFlipDiscQueue());
    const position: BoardPosition = { row: 1, col: 2 };

    act(() => {
      result.current.enqueue(position);
    });

    expect(result.current.queue).toHaveLength(1);
    expect(result.current.queue[0]).toEqual(position);
  });

  it('複数のディスクをキューに追加できる', () => {
    const { result } = renderHook(() => useFlipDiscQueue());
    const positions: BoardPosition[] = [
      { row: 1, col: 2 },
      { row: 3, col: 4 },
      { row: 5, col: 6 },
    ];

    act(() => {
      positions.forEach((pos) => result.current.enqueue(pos));
    });

    expect(result.current.queue).toHaveLength(3);
    expect(result.current.queue).toEqual(positions);
  });

  it('配列で複数のディスクを一度にキューに追加できる', () => {
    const { result } = renderHook(() => useFlipDiscQueue());
    const positions: BoardPosition[] = [
      { row: 1, col: 2 },
      { row: 3, col: 4 },
      { row: 5, col: 6 },
    ];

    act(() => {
      result.current.enqueue(positions);
    });

    expect(result.current.queue).toHaveLength(3);
    expect(result.current.queue).toEqual(positions);
  });

  it('次のディスクを取得してキューから削除できる', () => {
    const { result } = renderHook(() => useFlipDiscQueue());
    const positions: BoardPosition[] = [
      { row: 1, col: 2 },
      { row: 3, col: 4 },
    ];

    act(() => {
      result.current.enqueue(positions);
    });

    let nextDisc: BoardPosition | undefined;

    act(() => {
      nextDisc = result.current.dequeue();
    });

    expect(nextDisc).toEqual(positions[0]);
    expect(result.current.queue).toHaveLength(1);
    expect(result.current.queue[0]).toEqual(positions[1]);
  });

  it('空のキューから次のディスクを取得するとundefinedが返る', () => {
    const { result } = renderHook(() => useFlipDiscQueue());

    let nextDisc: BoardPosition | undefined;

    act(() => {
      nextDisc = result.current.dequeue();
    });

    expect(nextDisc).toBeUndefined();
    expect(result.current.queue).toHaveLength(0);
  });

  it('キューをクリアできる', () => {
    const { result } = renderHook(() => useFlipDiscQueue());
    const positions: BoardPosition[] = [
      { row: 1, col: 2 },
      { row: 3, col: 4 },
    ];

    act(() => {
      result.current.enqueue(positions);
    });

    expect(result.current.queue).toHaveLength(2);

    act(() => {
      result.current.clearQueue();
    });

    expect(result.current.queue).toHaveLength(0);
  });

  it('単一要素と配列を組み合わせてキューに追加できる', () => {
    const { result } = renderHook(() => useFlipDiscQueue());
    const position1: BoardPosition = { row: 1, col: 2 };
    const positions: BoardPosition[] = [
      { row: 3, col: 4 },
      { row: 5, col: 6 },
    ];

    act(() => {
      result.current.enqueue(position1);
      result.current.enqueue(positions);
    });

    expect(result.current.queue).toHaveLength(3);
    expect(result.current.queue[0]).toEqual(position1);
    expect(result.current.queue[1]).toEqual(positions[0]);
    expect(result.current.queue[2]).toEqual(positions[1]);
  });

  it('コールバック関数が登録されていれば次のディスクを取得するときに呼び出される', () => {
    const onNextDisc = vi.fn();
    const { result } = renderHook(() => useFlipDiscQueue({ onNextDisc }));
    const position: BoardPosition = { row: 1, col: 2 };

    act(() => {
      result.current.enqueue(position);
    });

    act(() => {
      result.current.dequeue();
    });

    expect(onNextDisc).toHaveBeenCalledTimes(1);
    expect(onNextDisc).toHaveBeenCalledWith(position);
  });

  it('空のキューからディスクを取得するときはコールバック関数は呼び出されない', () => {
    const onNextDisc = vi.fn();
    const { result } = renderHook(() => useFlipDiscQueue({ onNextDisc }));

    act(() => {
      result.current.dequeue();
    });

    expect(onNextDisc).not.toHaveBeenCalled();
  });
});
