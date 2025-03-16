import { FC } from "react";

/**
 * ディスク(石)の色を表す型
 */
export type DiscColor = "black" | "white" | "none";

/**
 * ディスク(石)コンポーネントのProps
 */
type Props = {
  /** ディスクの色 */
  color: DiscColor;
  /** クリック時のイベントハンドラ */
  onClick?: () => void;
  /** 置くことが可能かどうか（ヒント表示用） */
  canPlace?: boolean;
  /** サイズ（px） */
  size?: number;
};

/**
 * リバーシの石コンポーネント
 */
export const Disc: FC<Props> = ({
  color,
  onClick,
  canPlace = false,
  size = 40,
}) => {
  // 色に基づいたスタイルを決定
  const discStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.3s ease",
    border: canPlace && color === "none" ? "2px dashed #666" : "none",
    background:
      color === "black" ? "#000" : color === "white" ? "#fff" : "transparent",
    boxShadow: color !== "none" ? "0 3px 5px rgba(0, 0, 0, 0.3)" : "none",
  };

  return (
    <div
      style={discStyle}
      onClick={onClick}
      data-testid={`disc-${color}${canPlace ? "-can-place" : ""}`}
      aria-label={`${color} disc${canPlace ? " (can place here)" : ""}`}
      role={onClick ? "button" : "presentation"}
    />
  );
};
