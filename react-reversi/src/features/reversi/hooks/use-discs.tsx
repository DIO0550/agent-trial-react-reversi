import { useState, useCallback } from 'react';
import {
  BoardPosition,
  BOARD_SIZE,
  DiscColor,
  Board,
} from '../types/reversi-types';
import {
  findFlippableDiscs,
  getPlaceablePositions,
} from '../utils/board-utils';
import { ArrayExtension } from '../../../utils/extensions/array-extenstion';

/**
 * エラーメッセージ
 */
const ERROR_MESSAGES = {
  CANNOT_PLACE_DISC: 'この位置には石を置けません',
};

/**
 * 初期盤面の設定
 */
const createInitialBoard = (): Board => {
  const board = ArrayExtension.createMatrixWithLength<DiscColor>(
    BOARD_SIZE,
    DiscColor.NONE,
  ) as Board;

  const middle = BOARD_SIZE / 2 - 1;

  board[middle][middle] = DiscColor.WHITE;
  board[middle][middle + 1] = DiscColor.BLACK;
  board[middle + 1][middle] = DiscColor.BLACK;
  board[middle + 1][middle + 1] = DiscColor.WHITE;

  return board;
};

/**
 * 反対の色を返す関数
 */
const getOppositeColor = (color: DiscColor): DiscColor => {
  return color === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK;
};

/**
 * リバーシの石を管理するためのカスタムフック
 * 石の配置状態や置ける場所の管理、石を置く処理を提供する
 */
export const useDiscs = () => {
  // 石の配置状態（2次元配列）
  const [board, setBoard] = useState<Board>(createInitialBoard());
  // 現在の手番
  const [currentTurn, setCurrentTurn] = useState<DiscColor>(DiscColor.BLACK);

  /**
   * 現在の手番で石を置ける位置をすべて取得
   */
  const placeablePositions = useCallback((): BoardPosition[] => {
    return getPlaceablePositions(board, currentTurn);
  }, [currentTurn, board]);

  /**
   * 特定の位置に石を置けるかどうかをチェック
   */
  const canPlaceDisc = useCallback(
    (position: BoardPosition): boolean => {
      return (
        findFlippableDiscs(position.row, position.col, currentTurn, board)
          .length > 0
      );
    },
    [currentTurn, board],
  );

  /**
   * 指定した位置に石を置く
   */
  const placeDisc = (position: BoardPosition): void => {
    // 石を置けるか確認
    if (!canPlaceDisc(position)) {
      throw new Error(ERROR_MESSAGES.CANNOT_PLACE_DISC);
    }

    const flippableDiscs = findFlippableDiscs(
      position.row,
      position.col,
      currentTurn,
      board,
    );

    // 新しい盤面を作成
    const newBoard = board.map((row) => [...row]);

    // 置いた位置に石を追加
    newBoard[position.row][position.col] = currentTurn;

    // ひっくり返す石を処理
    flippableDiscs.forEach((flipPosition) => {
      newBoard[flipPosition.row][flipPosition.col] = currentTurn;
    });

    // 盤面と手番を更新
    setBoard(newBoard);
    setCurrentTurn(getOppositeColor(currentTurn));
  };

  return {
    discs: board,
    currentTurn,
    placeablePositions,
    placeDisc,
  };
};
