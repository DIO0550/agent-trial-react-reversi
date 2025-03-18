import { SelectionOption } from "../types/start-menu-types";
import { SelectionButton } from "./selection-button";

type Props<T> = {
  /**
   * グループのタイトル
   */
  title: string;

  /**
   * 選択肢リスト
   */
  options: SelectionOption<T>[];

  /**
   * 現在の選択値
   */
  value: T;

  /**
   * 値変更時のハンドラ
   */
  onChange: (value: T) => void;

  /**
   * 選択肢を横幅いっぱいに表示するか
   */
  fullWidthOptions?: boolean;

  /**
   * 下部のマージン
   */
  className?: string;
};

/**
 * 選択肢グループコンポーネント
 */
export const SelectionGroup = <T extends string>({
  title,
  options,
  value,
  onChange,
  fullWidthOptions = false,
  className = "mb-6",
}: Props<T>) => {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className={`flex ${fullWidthOptions ? "" : "flex-wrap"} gap-2`}>
        {options.map((option) => (
          <SelectionButton
            key={option.value}
            option={option}
            isSelected={value === option.value}
            fullWidth={fullWidthOptions}
            onClick={onChange}
          />
        ))}
      </div>
    </div>
  );
};
