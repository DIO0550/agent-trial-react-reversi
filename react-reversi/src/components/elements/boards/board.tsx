import { FlipDisc } from '../discs/flip-disc';
import {
  Board as ReversiBoard,
  BOARD_SIZE,
} from '@/features/reversi/types/reversi-types';
import { DiscColor } from '@/features/reversi/utils/disc-color';
import { CanPlace } from '@/features/reversi/utils/can-place';

/**
 * ボードコンポーネントのProps
 */
type Props = {
  /** ボードの状態 */
  boardState: ReversiBoard;
  /** 現在のターン (黒または白) */
  currentTurn: DiscColor.Type;
  /** セルクリック時のイベントハンドラ */
  onCellClick?: (row: number, col: number) => void;
  /** フリップ完了時のコールバック関数 */
  onFlipComplete?: (row: number, col: number) => void;
};

/**
 * ボードの大きさの定数
 */
const DEFAULT_CELL_SIZE = 64; // px

/**
 * リバーシのボードコンポーネント
 * 8×8のグリッドで石を配置する
 */
export const Board = ({
  boardState,
  currentTurn,
  onCellClick,
  onFlipComplete,
}: Props) => {
  // ボードの状態が8×8でない場合はエラーを表示
  if (
    boardState.length !== BOARD_SIZE ||
    boardState.some((row) => row.length !== BOARD_SIZE)
  ) {
    return <div className="text-red-500">Error: Board must be 8x8</div>;
  }

  return (
    <div
      className="grid bg-green-700 gap-px p-px border border-black shadow-lg"
      style={{
        gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
      }}
      data-testid="reversi-board"
      role="grid"
      aria-label="リバーシボード"
    >
      {boardState.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // 現在のターンに基づいて石が置けるかを判定
          const canPlace = CanPlace.getCurrentTurnCanPlace(
            cell.canPlace,
            currentTurn === DiscColor.BLACK,
          );

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`bg-green-600 aspect-square flex items-center justify-center ${
                onCellClick ? 'cursor-pointer' : ''
              }`}
              style={{ width: DEFAULT_CELL_SIZE, height: DEFAULT_CELL_SIZE }}
              data-testid={`cell-${rowIndex}-${colIndex}`}
              role="gridcell"
              aria-rowindex={rowIndex + 1}
              aria-colindex={colIndex + 1}
              onClick={
                onCellClick ? () => onCellClick(rowIndex, colIndex) : undefined
              }
            >
              <div className="w-[90%] h-[90%]">
                <FlipDisc
                  color={cell.discColor}
                  canPlace={canPlace}
                  onClick={
                    onCellClick
                      ? () => onCellClick(rowIndex, colIndex)
                      : undefined
                  }
                  onFlipComplete={
                    onFlipComplete
                      ? () => onFlipComplete(rowIndex, colIndex)
                      : undefined
                  }
                  blackRotateX={cell.rotationState.black.xDeg}
                  blackRotateY={cell.rotationState.black.yDeg}
                  whiteRotateX={cell.rotationState.white.xDeg}
                  whiteRotateY={cell.rotationState.white.yDeg}
                />
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
};
