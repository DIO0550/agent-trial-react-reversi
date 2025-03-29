import { FlipDisc, DiscColor } from '../discs/flip-disc';
import { FlippingDiscsState } from '../../../features/reversi/types/reversi-types';

/**
 * ボードの1マスの状態を表す型
 */
export type CellState = {
  /** 石の色 */
  color: DiscColor;
  /** 配置可能かどうか */
  canPlace: boolean;
};

/**
 * ボード全体の状態を表す型
 * 8×8の二次元配列
 */
export type BoardState = CellState[][];

/**
 * ボードコンポーネントのProps
 */
type Props = {
  /** ボードの状態 */
  boardState: BoardState;
  /** セルクリック時のイベントハンドラ */
  onCellClick?: (row: number, col: number) => void;
  /** ひっくり返しアニメーション中の石の状態 */
  flippingDiscs?: FlippingDiscsState;
};

/**
 * ボードの大きさの定数
 */
const BOARD_SIZE = 8;
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
                  color={cell.color}
                  canPlace={cell.canPlace}
                  onClick={
                    onCellClick
                      ? () => onCellClick(rowIndex, colIndex)
                      : undefined
                  }
                  isFlipping={Boolean(flippingInfo)}
                  flipAxis={flippingInfo?.flipAxis}
                  previousColor={flippingInfo?.previousColor}
                />
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
};

/**
 * 新しいボードの状態を作成する関数
 * すべてのセルが空の状態で初期化
 */
export const createEmptyBoardState = (): BoardState => {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({
          color: 'none',
          canPlace: false,
        })),
    );
};

/**
 * 初期配置のボードの状態を作成する関数
 * 中央に黒と白を配置
 */
export const createInitialBoardState = (): BoardState => {
  const board = createEmptyBoardState();
  // 中央に初期配置
  const center = BOARD_SIZE / 2;
  board[center - 1][center - 1] = { color: 'white', canPlace: false };
  board[center - 1][center] = { color: 'black', canPlace: false };
  board[center][center - 1] = { color: 'black', canPlace: false };
  board[center][center] = { color: 'white', canPlace: false };
  return board;
};
