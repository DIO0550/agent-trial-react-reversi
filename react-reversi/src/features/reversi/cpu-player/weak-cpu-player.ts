import { Point } from "../types/reversi-types";
import { CpuPlayer } from "./types/cpu-player-types";

export class WeakCpuPlayer implements CpuPlayer {
  calculateNextMove(board: number[][], currentPlayer: number): Point {
    const availablePositions = this.getAvailablePositions(board);
    if (availablePositions.length === 0) {
      throw new Error("No available positions");
    }
    
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  }

  private getAvailablePositions(board: number[][]): Point[] {
    const availablePositions: Point[] = [];
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) {
          availablePositions.push({ row, col });
        }
      }
    }
    
    return availablePositions;
  }
}