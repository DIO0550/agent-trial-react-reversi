# リバーシ用の石コンポーネントの作成

## ユーザーからの依頼
リバーシ用の石のコンポーネントとストーリーの作成依頼

## 作成したファイル

1. `/app/react-reversi/src/components/elements/discs/disc.tsx`
   - リバーシの石を表示するコンポーネント
   - 黒、白、空の状態を持ち、配置可能表示（ヒント）にも対応
   - アクセシビリティ対応（aria属性、role設定）
   - サイズ指定可能

2. `/app/react-reversi/src/components/elements/discs/disc.stories.tsx`
   - 石コンポーネントのStorybook用ストーリーファイル
   - 各種状態（黒、白、空、配置可能）の表示
   - サイズバリエーションの表示
   - すべての状態を一覧表示するストーリー

3. `/app/react-reversi/src/components/elements/discs/disc.test.tsx`
   - 石コンポーネントのユニットテスト
   - 各種状態のレンダリングテスト
   - イベントハンドラのテスト
   - スタイル適用のテスト
   - アクセシビリティ属性のテスト

## 実装内容

### DiscColor型
- `'black' | 'white' | 'none'` の三種類の状態を表現

### Propsの設計
- color: ディスク（石）の色
- onClick: クリック時のイベントハンドラ（オプション）
- canPlace: 配置可能かどうかを表す状態（オプション）
- size: ディスクのサイズ（px）（オプション、デフォルト40px）

### アクセシビリティ対応
- `aria-label` 属性の設定
- クリック可能な場合は `role="button"`、そうでない場合は `role="presentation"`

### スタイル
- サイズに応じた円形表示
- 黒と白の石は影付き
- 配置可能な場所は点線の枠表示
- トランジション効果