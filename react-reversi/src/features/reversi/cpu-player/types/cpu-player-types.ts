import { Point } from "../../types/reversi-types";

export type CpuPlayer = {
  calculateNextMove: (board: number[][], currentPlayer: number) => Point;
};

export type CpuPlayerLevel = "weak" | "normal" | "strong";