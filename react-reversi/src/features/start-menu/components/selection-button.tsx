import { SelectionOption } from '../types/start-menu-types';

type Props<T> = {
  /**
   * 選択肢
   */
  option: SelectionOption<T>;

  /**
   * 選択状態
   */
  isSelected: boolean;

  /**
   * フルワイド表示にするか
   */
  fullWidth?: boolean;

  /**
   * クリック時のハンドラ
   */
  onClick: (value: T) => void;
};

/**
 * 選択ボタンコンポーネント
 */
export const SelectionButton = <T extends string>({
  option,
  isSelected,
  fullWidth = false,
  onClick,
}: Props<T>) => {
  return (
    <button
      className={`
        py-2 px-4 rounded-md transition-all
        ${fullWidth ? 'flex-1' : ''}
        ${
          isSelected
            ? 'border-2 border-blue-500 bg-blue-50'
            : 'border-2 border-gray-300 hover:bg-gray-100'
        }
      `}
      onClick={() => onClick(option.value)}
      aria-pressed={isSelected}
    >
      {option.label}
    </button>
  );
};
