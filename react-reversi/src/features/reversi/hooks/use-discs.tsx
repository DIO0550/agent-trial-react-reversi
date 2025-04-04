import { useState, useCallback } from 'react';
import {
  BoardPosition,
  BOARD_SIZE,
  DiscColor,
  Board,
  CellState,
  RotationState,
  FlipDirection,
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
  const board = ArrayExtension.createMatrixWithLength<CellState>(BOARD_SIZE, {
    discColor: DiscColor.NONE,
    rotationState: RotationState.createInitial(),
  }) as Board;

  const middle = BOARD_SIZE / 2 - 1;

  board[middle][middle] = {
    discColor: DiscColor.WHITE,
    rotationState: RotationState.fromDiscColor(DiscColor.WHITE),
  };
  board[middle][middle + 1] = {
    discColor: DiscColor.BLACK,
    rotationState: RotationState.fromDiscColor(DiscColor.BLACK),
  };
  board[middle + 1][middle] = {
    discColor: DiscColor.BLACK,
    rotationState: RotationState.fromDiscColor(DiscColor.BLACK),
  };
  board[middle + 1][middle + 1] = {
    discColor: DiscColor.WHITE,
    rotationState: RotationState.fromDiscColor(DiscColor.WHITE),
  };

  return board;
};

/**
 * 反対の色を返す関数
 */
const getOppositeColor = (color: DiscColor): DiscColor => {
  return color === DiscColor.BLACK ? DiscColor.WHITE : DiscColor.BLACK;
};

/**
 * 位置関係から回転方向を決定する関数
 */
const determineFlipDirection = (
  sourcePos: BoardPosition,
  targetPos: BoardPosition,
): FlipDirection => {
  // 行の差分
  const rowDiff = targetPos.row - sourcePos.row;
  // 列の差分
  const colDiff = targetPos.col - sourcePos.col;

  // 水平方向（左右）の動きが主要な場合
  if (Math.abs(colDiff) > Math.abs(rowDiff)) {
    // 右向きか左向き
    return colDiff > 0
      ? FlipDirection.LEFT_TO_RIGHT
      : FlipDirection.RIGHT_TO_LEFT;
  }
  // 垂直方向（上下）の動きが主要または同等の場合
  else {
    // 下向きか上向き
    return rowDiff > 0
      ? FlipDirection.TOP_TO_BOTTOM
      : FlipDirection.BOTTOM_TO_TOP;
  }
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
    newBoard[position.row][position.col] = {
      discColor: currentTurn,
      rotationState: RotationState.fromDiscColor(currentTurn),
    };

    // ひっくり返す石を処理
    flippableDiscs.forEach((flipPosition) => {
      // 現在の石の回転状態を取得
      const currentRotationState =
        board[flipPosition.row][flipPosition.col].rotationState;

      // 回転方向を決定（置いた石の位置からひっくり返す石への方向）
      const flipDirection = determineFlipDirection(position, flipPosition);

      // 回転方向に基づいて新しい回転状態を計算
      const newRotationState = RotationState.calculateDirectionalRotation(
        currentRotationState,
        flipDirection,
      );

      // 石をひっくり返す
      newBoard[flipPosition.row][flipPosition.col] = {
        discColor: currentTurn,
        rotationState: newRotationState,
      };
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
