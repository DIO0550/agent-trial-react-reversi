
## ロール定義
- TODO

## 技術スタック
### フロントエンド
- TypeScript
- Nextjs
- Vite
- storybook
### ユニットテスト
- Vitest
### フォーマッター
- Prettier

## 開発手法
- テスト駆動型開発

## コード規約
- ESLint/Prettier の標準的なルールに準拠すること。
- 早期returnを意識した実装にすること。
  - 極力else文を使わないような実装にすること。
- マジックナンバーは利用せず、必ず定数を定義すること。
- 自作クラスは作成しないこと。
- クラスコンポーネントは使用せず、関数コンポーネントのみを使用すること。
- interfaceは極力使わず、typeを使用すること。

## ディレクトリ構造
- 以下のようなディレクトリ構造とする（TODO）
```
- src 
  ├ app // ルーティング関連
  ├ components 
  | ├ elements // ボタンなどの共通のもの
  | | └ buttons
  | |   └ button.tsx
  | └ layouts // 共通のレイアウト関連
  | 　└ headers
  |     └ header.tsx
  ├ features // 機能ごとのフォルダ
  | └ cpu
  |   ├ components // 機能に関連するコンポーネント
  |   ├ hooks // 機能に関するカスタムフック
  |   ├ types // 機能に関する型定義関連
  |   └ utils // 機能に関する関数
  ├ hooks // 共通のカスタムフック
  ├ libs  // ライブラリなど
  ├ types // 型定義関連
  └ utils // アプリ全体で共通して使用する関数関連
```

## フォルダ名
- ケバブケースとする

## ファイル名規約
- ケバブケースとする


## テスト規約
### テスト名
- すべて日本語にすること。

### UI関連
- storybookで、ストーリーを作成して、見た目を確認できるようにする
- Play関数は基本使わない
  - ただし、ボタンを押して見た目を変えたりする必要がある場合は、Play関数を使用して見た目を変更する。

### ロジック
- ロジック関連のテストは、Vitestで行う
  - 例えば、コンポーネントであっても、ボタン押下時のロジック関連のテストは、Vitestで行う

### マッチャー
- マッチャーの使用は、以下に従うこと。
|比較内容|使用するマッチャー|
|プリミティブ|toBe|
|Undefined|toBeUndefined|
|Null|toBeNull|
|配列の長さ・文字列の長さ|toHaveLength|
|関数の呼び出し有無|toHaveBennCalled|
|関数の呼び出し回数|toHaveBeenCalledTimes|
|関数の呼び出しの引数|toHaveBeenCalledWith|

- 以下のマッチャーを作成すること
|作成するマッチャー|内容|
|toBeTrue|受け取ったboolean値がTrueかどうか|
|toBeFalse|受け取ったboolean値がFalseかどうか|

