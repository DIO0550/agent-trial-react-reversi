import { useState } from 'react';
import {
  BoardPosition,
  BOARD_SIZE,
  DiscColor,
  DiscsState,
  Direction,
} from '../types/reversi-types';

/**
 * 全方向の変化量を定義
 */
const DIRECTIONS: Direction[] = [
  { rowDelta: -1, colDelta: -1 }, // 左上
  { rowDelta: -1, colDelta: 0 }, // 上
  { rowDelta: -1, colDelta: 1 }, // 右上
  { rowDelta: 0, colDelta: -1 }, // 左
  { rowDelta: 0, colDelta: 1 }, // 右
  { rowDelta: 1, colDelta: -1 }, // 左下
  { rowDelta: 1, colDelta: 0 }, // 下
  { rowDelta: 1, colDelta: 1 }, // 右下
];

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
   * 指定された位置に指定された色の石を置いたとき、ある方向にひっくり返せる石があるかチェック
   */
  const findFlippableDiscsInDirection = (
    position: BoardPosition,
    color: DiscColor,
    direction: Direction,
    currentDiscs: DiscsState,
  ): BoardPosition[] => {
    const oppositeColor = getOppositeColor(color);
    const flippablePositions: BoardPosition[] = [];

    let currentRow = position.row + direction.rowDelta;
    let currentCol = position.col + direction.colDelta;
    let currentPosition = { row: currentRow, col: currentCol };

    // 隣が相手の色である場合は進み続ける
    while (
      isWithinBoard(currentPosition) &&
      currentDiscs[positionToKey(currentPosition)] === oppositeColor
    ) {
      flippablePositions.push(currentPosition);
      currentRow += direction.rowDelta;
      currentCol += direction.colDelta;
      currentPosition = { row: currentRow, col: currentCol };
    }

    // 最後に自分の色があれば挟めると判断
    if (
      isWithinBoard(currentPosition) &&
      currentDiscs[positionToKey(currentPosition)] === color &&
      flippablePositions.length > 0
    ) {
      return flippablePositions;
    }

    return [];
  };

  /**
   * 指定された位置に石を置いた場合にひっくり返せる石の位置を取得
   */
  const findFlippableDiscs = (
    position: BoardPosition,
    color: DiscColor,
    currentDiscs: DiscsState,
  ): BoardPosition[] => {
    // すでに石がある場合は置けない
    if (currentDiscs[positionToKey(position)]) {
      return [];
    }

    // 全方向をチェックして、ひっくり返せる石を集める
    return DIRECTIONS.flatMap((direction) =>
      findFlippableDiscsInDirection(position, color, direction, currentDiscs),
    );
  };

  /**
   * 現在の手番で石を置ける位置をすべて取得
   */
  const getPlaceablePositions = (): BoardPosition[] => {
    const placeablePositions: BoardPosition[] = [];

    // 全マスをチェック
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const position = { row, col };

        // 既に石があるマスにはおけない
        if (discs[positionToKey(position)]) {
          continue;
        }

        // ひっくり返せる石があるか確認
        const flippableDiscs = findFlippableDiscs(position, currentTurn, discs);
        if (flippableDiscs.length > 0) {
          placeablePositions.push(position);
        }
      }
    }

    return placeablePositions;
  };

  /**
   * 特定の位置に石を置けるかどうかをチェック
   */
  const canPlaceDisc = (position: BoardPosition): boolean => {
    return findFlippableDiscs(position, currentTurn, discs).length > 0;
  };

  /**
   * 指定した位置に石を置く
   */
  const placeDisc = (position: BoardPosition): void => {
    // 石を置けるか確認
    if (!canPlaceDisc(position)) {
      throw new Error(ERROR_MESSAGES.CANNOT_PLACE_DISC);
    }

    const flippableDiscs = findFlippableDiscs(position, currentTurn, discs);

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
