## 基本要件

- 一般的なリバーシの作成

### マス数

- 8×8 の 64 マス

### ルール

- 基本的なリバーシのルールとする

### 対戦方法

- CPU との対戦のみとする

## 画面構成

- スタート画面
- ゲーム画面
- 404 画面

## スタート画面仕様

### UI

#### メニュー

- CPU のレベルメニュー
  - 弱い
  - 普通 - デフォルト選択
  - 強い
  - 最強
- プレイヤーの先行/後攻
  - 先行 - デフォルト選択
  - 後攻
  - ランダム

#### メニューの選択処理

- クリックするとメニューを選択状態とする
  - 選択しているメニューは、選択されていることを判断できるように、ボーダーを付ける

#### ボタン

- スタートボタン
  - クリックで、ゲーム画面に遷移する

### URL

- `/`

## ゲーム画面

### UI

#### ボード

- 画面中に石を置くボードを配置する。
- 石を置ける位置にマークを付ける。

#### スコア表示

- 画面左下にプレイヤーの石の数を表示する。
- 画面右上に CPU の石の数を表示する。

#### アニメーション

- 石を置く動作
- 石が反転する動作
  - 置いた位置から順に反転していく。

### URL

- `/game`

#### 仕様

- スタート画面を経由せずに表示した場合は、スタート画面を表示する。
- 石のアニメーションが終わるまでは、プレイヤー、CPU ともに石は置けないこと。
