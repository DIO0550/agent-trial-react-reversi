import { DiscColor } from '@/features/reversi/types/reversi-types';
import { useCallback, useReducer } from 'react';

export enum FlipDirection {
  LEFT_TO_RIGHT = 'leftToRight', // 左から右
  RIGHT_TO_LEFT = 'rightToLeft', // 右から左
  TOP_TO_BOTTOM = 'topToBottom', // 上から下
  BOTTOM_TO_TOP = 'bottomToTop', // 下から上
}

type Rotate = {
  x: number;
  y: number;
};

type FlipState = {
  front: Rotate;
  back: Rotate;
};

const flip = (state: FlipState, direction: FlipDirection) => {
  switch (direction) {
    case FlipDirection.LEFT_TO_RIGHT:
      return {
        front: { x: state.front.x, y: state.front.y + 180 },
        back: { x: state.back.x, y: state.back.y - 180 },
      };
    case FlipDirection.RIGHT_TO_LEFT:
      return {
        front: { x: state.front.x, y: state.front.y - 180 },
        back: { x: state.back.x, y: state.back.y + 180 },
      };
    case FlipDirection.TOP_TO_BOTTOM:
      return {
        front: { x: state.front.x + 180, y: state.front.y },
        back: { x: state.back.x - 180, y: state.back.y },
      };
    case FlipDirection.BOTTOM_TO_TOP:
      return {
        front: { x: state.front.x - 180, y: state.front.y },
        back: { x: state.back.x + 180, y: state.back.y },
      };
    default:
      return state;
  }
};

const initialState = (diskColor: DiscColor): FlipState => {
  switch (diskColor) {
    case DiscColor.BLACK:
      return {
        front: { x: 0, y: 0 },
        back: { x: 0, y: 180 },
      };
    case DiscColor.WHITE:
      return {
        front: { x: 0, y: 180 },
        back: { x: 0, y: 0 },
      };
    default:
      return {
        front: { x: 0, y: 0 },
        back: { x: 0, y: 180 },
      };
  }
};

type Props = {
  initialColor: DiscColor;
};

export const useFlipDisk = ({ initialColor }: Props) => {
  const [state, dispatch] = useReducer(flip, initialState(initialColor));

  const flipDisk = useCallback((direction: FlipDirection) => {
    dispatch(direction);
  }, []);

  return {
    state,
    flipDisk,
  };
};
