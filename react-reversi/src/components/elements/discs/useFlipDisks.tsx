import {
  BOARD_SIZE,
  BoardPosition,
  DiscColor,
  MIN_BOARD_SIZE,
} from '@/features/reversi/types/reversi-types';
import { ArrayExtension } from '@/utils/extensions/array-extenstion';
import { NumberExtension } from '@/utils/extensions/number-extension';
import { useReducer } from 'react';

export enum FlipDirection {
  LEFT_TO_RIGHT = 'leftToRight', // 左から右
  RIGHT_TO_LEFT = 'rightToLeft', // 右から左
  TOP_TO_BOTTOM = 'topToBottom', // 上から下
  BOTTOM_TO_TOP = 'bottomToTop', // 下から上
}

export const initialFlipState = (diskColor: DiscColor): FlipState => {
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
      throw new Error('Invalid disk color');
  }
};

type Rotate = {
  x: number;
  y: number;
};

type FlipState = {
  front: Rotate;
  back: Rotate;
};

const collectBoardSize = (boardSize: number): number => {
  if (boardSize < MIN_BOARD_SIZE) {
    return BOARD_SIZE;
  }

  if (NumberExtension.isEven(boardSize)) {
    return boardSize;
  }

  return boardSize + 1;
};

const center = (boardSize: number): number => {
  return boardSize / 2 - 1;
};

const initialFlipStates = (boardSize: number): (FlipState | undefined)[][] => {
  const size = collectBoardSize(boardSize);
  const initialState = ArrayExtension.createMatrixWithLength<FlipState>(
    size,
    undefined,
  );
  const centerIndex = center(size);

  initialState[centerIndex][centerIndex] = {
    front: { x: 0, y: 0 },
    back: { x: 0, y: 180 },
  };
  initialState[centerIndex + 1][centerIndex + 1] = {
    front: { x: 0, y: 180 },
    back: { x: 0, y: 0 },
  };
  initialState[centerIndex][centerIndex + 1] = {
    front: { x: 0, y: 0 },
    back: { x: 0, y: 180 },
  };
  initialState[centerIndex + 1][centerIndex] = {
    front: { x: 0, y: 180 },
    back: { x: 0, y: 0 },
  };

  return initialState;
};

type Props = {
  initalBoardSize: number;
};

const flip = ({
  state,
  flipDirection,
  diskColor,
}: {
  state: FlipState | undefined;
  flipDirection: FlipDirection;
  diskColor: DiscColor;
}) => {
  if (!state) {
    return initialFlipState(diskColor);
  }

  switch (flipDirection) {
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
      throw new Error('Invalid flip direction');
  }
};

type Action = {
  type: FlipDirection;
  payload: {
    position: BoardPosition;
    diskColor: DiscColor;
  };
};

const reducer = (state: (FlipState | undefined)[][], action: Action) => {
  const { type, payload } = action;
  const newState = [...state];

  newState[payload.position.row][payload.position.col] = flip({
    state: newState[payload.position.row][payload.position.col],
    flipDirection: type,
    diskColor: payload.diskColor,
  });

  return newState;
};

export const useFlipDisks = ({ initalBoardSize }: Props) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialFlipStates(initalBoardSize),
  );

  const flipDisks = (action: Action) => {
    dispatch(action);
  };

  return [state, flipDisks] as const;
};
