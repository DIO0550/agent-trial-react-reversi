import { useState } from 'react';
import {
  BoardPosition,
  BOARD_SIZE,
  DiscColor,
  DiscsState,
  Direction,
} from '../types/reversi-types';
import {
  findFlippableDiscs,
  getPlaceablePositions as utilGetPlaceablePositions,
  DIRECTIONS,
} from '../utils/board-utils';

/**
 * エラーメッセージ
 */
const ERROR_MESSAGES = {
  CANNOT_PLACE_DISC: 'この位置には石を置けません',
};

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
 * 盤面内かどうかをチェックする関数
 */
const isWithinBoard = (position: BoardPosition): boolean => {
  return (
    position.row >= 0 &&
    position.row < BOARD_SIZE &&
    position.col >= 0 &&
    position.col < BOARD_SIZE
  );
};

/**
 * リバーシの石を管理するためのカスタムフック
 * 石の配置状態や置ける場所の管理、石を置く処理を提供する
 */
export const useDiscs = () => {
  // 石の配置状態
  const [discs, setDiscs] = useState<DiscsState>(createInitialDiscs());
  // 現在の手番
  const [currentTurn, setCurrentTurn] = useState<DiscColor>(DiscColor.BLACK);

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
  const getPlaceablePositions = (): BoardPosition[] => {
    const board = discsToBoard();
    return utilGetPlaceablePositions(board, currentTurn);
  };

  /**
   * 特定の位置に石を置けるかどうかをチェック
   */
  const canPlaceDisc = (position: BoardPosition): boolean => {
    const board = discsToBoard();
    return (
      findFlippableDiscs(position.row, position.col, currentTurn, board)
        .length > 0
    );
  };

  /**
   * 指定した位置に石を置く
   */
  const placeDisc = (position: BoardPosition): void => {
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

    // ひっくり返す石を処理
    flippableDiscs.forEach((flipPosition) => {
      newDiscs[positionToKey(flipPosition)] = currentTurn;
    });

    // 盤面と手番を更新
    setDiscs(newDiscs);
    setCurrentTurn(getOppositeColor(currentTurn));
  };

  return {
    discs,
    currentTurn,
    getPlaceablePositions,
    placeDisc,
  };
};
