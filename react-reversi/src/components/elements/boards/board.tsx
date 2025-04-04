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
  /** ひっくり返しアニメーション中の石の状態 */
  flippingDiscs?: Record<string, unknown>;
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
  onCellClick,
  flippingDiscs = {},
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
          const cellKey = `${rowIndex},${colIndex}`;
          const flippingInfo = flippingDiscs[cellKey];

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
                  isFlipping={Boolean(flippingInfo)}
                  blackRotateX={cell.rotationState.xDeg}
                  blackRotateY={cell.rotationState.yDeg}
                  whiteRotateX={cell.rotationState.xDeg}
                  whiteRotateY={cell.rotationState.yDeg}
                />
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
};
