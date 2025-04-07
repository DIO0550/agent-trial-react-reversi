# CellState の rotationState について、白と黒の RotationState を管理できるよう修正

## 概要

RotationState の型と実装を変更して、黒と白の石の回転状態を個別に管理できるようにする修正を行いました。

## ユーザーからの要望

```
CellStateのrotationStateについて、白と黒のRotationStateを管理できるようにしてもらえますか
```

## 対応内容

### 1. RotationState の型定義を変更

```typescript
/**
 * 石の回転状態（角度）を表す型
 */
export type RotationState = {
  /** 黒石の回転角度 */
  black: {
    /** X軸の回転角度（度） */
    xDeg: number;
    /** Y軸の回転角度（度） */
    yDeg: number;
  };
  /** 白石の回転角度 */
  white: {
    /** X軸の回転角度（度） */
    xDeg: number;
    /** Y軸の回転角度（度） */
    yDeg: number;
  };
};
```

### 2. RotationState コンパニオンオブジェクトのメソッド修正

#### fromDiscColor メソッド

```typescript
/**
 * DiscColorに基づいた回転状態を返す
 * @param discColor 石の色
 * @returns 対応するRotationState
 */
fromDiscColor: (discColor: DiscColor): RotationState => {
  // DiscColorに基づいた回転状態を返す
  switch (discColor) {
    case DiscColor.BLACK:
      return {
        black: {
          xDeg: 0,
          yDeg: 0,
        },
        white: {
          xDeg: 180,
          yDeg: 0,
        },
      };
    case DiscColor.WHITE:
      return {
        black: {
          xDeg: 180,
          yDeg: 0,
        },
        white: {
          xDeg: 360,
          yDeg: 0,
        },
      };
    case DiscColor.NONE:
    default:
      return {
        black: {
          xDeg: 90,
          yDeg: 0,
        },
        white: {
          xDeg: 90,
          yDeg: 0,
        },
      };
  }
};
```

#### calculateDirectionalRotation メソッド

```typescript
/**
 * 指定した方向に基づいて回転させた状態を計算する
 * @param currentRotation 現在の回転状態
 * @param direction 回転方向
 * @returns 回転後の状態
 */
calculateDirectionalRotation: (
  currentRotation: RotationState,
  direction: FlipDirection
): RotationState => {
  // 現在の回転状態をコピー
  const newRotation: RotationState = {
    black: {
      xDeg: currentRotation.black.xDeg,
      yDeg: currentRotation.black.yDeg,
    },
    white: {
      xDeg: currentRotation.white.xDeg,
      yDeg: currentRotation.white.yDeg,
    },
  };

  // 方向に基づいて黒石と白石の両方の回転角度を同じように更新
  switch (direction) {
    case FlipDirection.LEFT_TO_RIGHT:
      // Y軸周りに180度回転
      newRotation.black.yDeg += 180;
      newRotation.white.yDeg += 180;
      break;
    case FlipDirection.RIGHT_TO_LEFT:
      // Y軸周りに-180度回転
      newRotation.black.yDeg -= 180;
      newRotation.white.yDeg -= 180;
      break;
    case FlipDirection.TOP_TO_BOTTOM:
      // X軸周りに180度回転
      newRotation.black.xDeg += 180;
      newRotation.white.xDeg += 180;
      break;
    case FlipDirection.BOTTOM_TO_TOP:
      // X軸周りに-180度回転
      newRotation.black.xDeg -= 180;
      newRotation.white.xDeg -= 180;
      break;
    default:
      throw new Error("Invalid flip direction");
  }

  return newRotation;
};
```

### 3. Board コンポーネントを更新して新しい構造に対応

```typescript
<FlipDisc
  color={cell.discColor}
  canPlace={false} // canPlaceは一旦無視して常にfalseを渡す
  onClick={onCellClick ? () => onCellClick(rowIndex, colIndex) : undefined}
  isFlipping={false} // isFlippingはフリップ中の状態を親コンポーネントから受け取る想定
  onFlipComplete={
    onFlipComplete ? () => onFlipComplete(rowIndex, colIndex) : undefined
  }
  blackRotateX={cell.rotationState.black.xDeg}
  blackRotateY={cell.rotationState.black.yDeg}
  whiteRotateX={cell.rotationState.white.xDeg}
  whiteRotateY={cell.rotationState.white.yDeg}
/>
```

## コミット情報

この変更は以下のコミットで実施されました：

- コミットメッセージ: `♻️ [Refactaoring]: RotationStateで白と黒の回転状態をそれぞれ管理するよう修正`
- 変更ファイル:
  - src/features/reversi/utils/rotation-state-utils.ts
  - src/components/elements/boards/board.tsx
