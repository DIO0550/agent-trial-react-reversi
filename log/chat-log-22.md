# スタート画面の色の選択にランダムオプションを追加

## ユーザーからの依頼内容

スタート画面の色の選択について、ランダムのメニューを追加して欲しいです。

## AI の回答

スタート画面に色のランダム選択メニューを追加する機能を実装します。まず、関連するファイルを確認し、必要な変更を行っていきます。

### 実装内容

スタート画面の手番選択（先行・後攻）にランダムオプションを追加するために、以下の 3 つのファイルを修正しました：

1. `src/features/start-menu/types/start-menu-types.ts` - `PlayerColor` 型に 'random' を追加

   ```typescript
   export type PlayerColor = "black" | "white" | "random";
   ```

2. `src/features/start-menu/constants/start-menu-constants.ts` - 選択肢リストに「ランダム」オプションを追加

   ```typescript
   export const PLAYER_COLOR_OPTIONS: SelectionOption<PlayerColor>[] = [
     { value: "black", label: "先行" },
     { value: "white", label: "後攻" },
     { value: "random", label: "ランダム" },
   ];
   ```

3. `src/features/start-menu/components/start-menu.tsx` - ランダム選択時の処理を追加

   ```typescript
   /**
    * スタートボタンのクリックハンドラ
    * ランダムが選択された場合は、黒か白をランダムに決定する
    */
   const handleStartClick = () => {
     // ランダムの場合は黒か白をランダムに決定
     if (playerColor === "random") {
       const randomColor = Math.random() < 0.5 ? "black" : "white";
       onStart({
         cpuLevel,
         playerColor: randomColor as PlayerColor,
       });
       return;
     }

     onStart({
       cpuLevel,
       playerColor,
     });
   };
   ```

### 動作

ユーザーがスタート画面で「ランダム」を選択した場合、ゲーム開始時に 50%の確率で先行（黒）または後攻（白）が自動的に決定されます。これにより、毎回異なる手番でゲームを始めることができ、ゲーム体験がより多様になります。

### コミット内容

実装後、以下のコマンドでコードのフォーマットを適用し、変更をコミットしました：

```
npm run format
git add src/features/start-menu/types/start-menu-types.ts src/features/start-menu/constants/start-menu-constants.ts src/features/start-menu/components/start-menu.tsx
git commit -m "✨ [New Feature]: スタート画面の手番選択にランダムオプションを追加"
```

コミットにより、以下の変更が記録されました：

- 3 files changed, 13 insertions(+), 1 deletion(-)
