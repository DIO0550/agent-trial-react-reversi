import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/test";
import { Board, BoardState, createInitialBoardState, createEmptyBoardState } from "./board";

/**
 * リバーシのボードを表示するコンポーネント
 */
const meta: Meta<typeof Board> = {
  title: "Elements/Board",
  component: Board,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onCellClick: { action: "cellClicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Board>;

/**
 * 初期状態のボード
 */
export const Initial: Story = {
  args: {
    boardState: createInitialBoardState(),
    onCellClick: action("cellClicked"),
  },
};

/**
 * 空のボード
 */
export const Empty: Story = {
  args: {
    boardState: createEmptyBoardState(),
    onCellClick: action("cellClicked"),
  },
};

/**
 * 途中経過のボード
 */
export const InProgress: Story = {
  args: {
    boardState: (() => {
      const boardState = createInitialBoardState();
      // 追加の石を配置
      boardState[2][3] = { color: "black", canPlace: false };
      boardState[2][4] = { color: "black", canPlace: false };
      boardState[3][2] = { color: "black", canPlace: false };
      boardState[4][2] = { color: "black", canPlace: false };
      
      boardState[1][3] = { color: "white", canPlace: false };
      boardState[3][5] = { color: "white", canPlace: false };
      boardState[5][3] = { color: "white", canPlace: false };
      
      // 配置可能な場所を表示
      boardState[1][2] = { color: "none", canPlace: true };
      boardState[2][1] = { color: "none", canPlace: true };
      boardState[4][5] = { color: "none", canPlace: true };
      boardState[5][4] = { color: "none", canPlace: true };
      
      return boardState;
    })(),
    onCellClick: action("cellClicked"),
  },
};

/**
 * ゲーム終了時のボード
 */
export const GameOver: Story = {
  args: {
    boardState: (() => {
      // ゲーム終了時の盤面を作成（黒が大多数）
      const boardState = createEmptyBoardState();
      
      // ボードをほぼ黒で埋める
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          boardState[i][j] = { color: "black", canPlace: false };
        }
      }
      
      // 一部を白にする
      boardState[0][0] = { color: "white", canPlace: false };
      boardState[0][7] = { color: "white", canPlace: false };
      boardState[7][0] = { color: "white", canPlace: false };
      boardState[7][7] = { color: "white", canPlace: false };
      boardState[2][2] = { color: "white", canPlace: false };
      boardState[2][5] = { color: "white", canPlace: false };
      boardState[5][2] = { color: "white", canPlace: false };
      boardState[5][5] = { color: "white", canPlace: false };
      
      return boardState;
    })(),
    onCellClick: action("cellClicked"),
  },
};

/**
 * カスタムボードビルダー
 */
export const BoardBuilder: Story = {
  render: () => {
    const customBoard: BoardState = createEmptyBoardState();
    
    // 5つの異なるパターンを作成
    const patterns = [
      { row: 1, col: 1, color: "black" },
      { row: 1, col: 6, color: "white" },
      { row: 6, col: 1, color: "white" },
      { row: 6, col: 6, color: "black" },
      { row: 3, col: 3, color: "black" },
      { row: 3, col: 4, color: "white" },
      { row: 4, col: 3, color: "white" },
      { row: 4, col: 4, color: "black" },
    ];
    
    // パターンを適用
    patterns.forEach(p => {
      customBoard[p.row][p.col] = { 
        color: p.color as "black" | "white", 
        canPlace: false 
      };
    });
    
    // 配置可能な場所を示す
    customBoard[2][2] = { color: "none", canPlace: true };
    customBoard[2][5] = { color: "none", canPlace: true };
    customBoard[5][2] = { color: "none", canPlace: true };
    customBoard[5][5] = { color: "none", canPlace: true };
    
    return (
      <div className="flex flex-col gap-6">
        <h3 className="text-lg font-bold">カスタムボードパターン</h3>
        <Board 
          boardState={customBoard} 
          onCellClick={action("cellClicked")}
        />
      </div>
    );
  },
};