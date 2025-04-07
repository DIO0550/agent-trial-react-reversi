import { FlipDisc } from '../discs/flip-disc';
import {
  Board as ReversiBoard,
  DiscColor,
  BOARD_SIZE,
} from '@/features/reversi/types/reversi-types';

/**
 * ボードコンポーネントのProps
 */
type Props = {
  /** ボードの状態 */
  boardState: ReversiBoard;
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
export const Board = ({ boardState, onCellClick, onFlipComplete }: Props) => {
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
                  canPlace={false} // canPlaceは一旦無視して常にfalseを渡す
                  onClick={
                    onCellClick
                      ? () => onCellClick(rowIndex, colIndex)
                      : undefined
                  }
                  isFlipping={false} // isFlippingはフリップ中の状態を親コンポーネントから受け取る想定
                  onFlipComplete={
                    onFlipComplete
                      ? () => onFlipComplete(rowIndex, colIndex)
                      : undefined
                  }
                  blackRotateX={cell.rotationState.blackRotateX}
                  blackRotateY={cell.rotationState.blackRotateY}
                  whiteRotateX={cell.rotationState.whiteRotateX}
                  whiteRotateY={cell.rotationState.whiteRotateY}
                />
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
};
