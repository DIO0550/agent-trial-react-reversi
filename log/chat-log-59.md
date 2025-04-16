# 未使用ファイルの削除作業

## ユーザーの要望

useFlipDisk.tsx と useFlipDiks.tsx は使っていないので削除して欲しいです

## 実行内容

`useFlipDisk.tsx`と`useFlipDisks.tsx`の 2 つのファイルを検索したところ、以下のパスで見つかりました：

- `/app/react-reversi/src/components/elements/discs/useFlipDisk.tsx`
- `/app/react-reversi/src/components/elements/discs/useFlipDisks.tsx`

これらのファイルは使用されていないため、削除しました。

## 追加の要望

flip-card.tsx とそのストーリーファイルも使用していないので、削除してください

## 追加実行内容

以下のファイルも使用されていないため削除しました：

- `/app/react-reversi/src/components/flip-card.tsx` - ひっくり返るカードコンポーネント
- `/app/react-reversi/src/components/flip-card.stories.tsx` - カードコンポーネントの Storybook 用ストーリー

## 変更のコミット

削除した 4 つのファイルについて、以下のコミットを行いました：

- コミットメッセージ: 「🗑️ [Remove]: 未使用の FlipCard 関連ファイルと useFlipDisk/useFlipDisks フックを削除」
- 削除したファイル:
  1. react-reversi/src/components/elements/discs/useFlipDisk.tsx
  2. react-reversi/src/components/elements/discs/useFlipDisks.tsx
  3. react-reversi/src/components/flip-card.stories.tsx
  4. react-reversi/src/components/flip-card.tsx
