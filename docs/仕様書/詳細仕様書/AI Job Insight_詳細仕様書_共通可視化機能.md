# AI Job Insight 詳細設計書 - 共通可視化機能

---

# 1. 機能概要

## 1.1 機能名

共通可視化機能

## 1.2 機能ID

FUNC-COMMON-VISUAL-001

## 1.3 機能の目的

分析結果を視覚的に表示するための汎用的なUIコンポーネント群を提供する。

本機能は、AI Job Insightに限らず、将来的に別プロダクト（Shopping Insight等）への横展開を見据えた共通基盤として設計される。

## 1.4 位置づけ

- **共通基盤機能**：プロダクト固有の概念（案件、商品など）を含まない汎用コンポーネント
- **再利用可能**：Job固有画面から利用され、他プロダクトでも再利用可能
- **依存方向**：本機能はJob固有機能に依存しない

## 1.5 提供コンポーネント

1. 星評価表示コンポーネント（StarRating）
2. レーダーチャートコンポーネント（RadarChart）
3. 結果カード表示コンポーネント（ResultCard）

---

# 2. 処理の実現方式

## 2.1 技術スタック

- フレームワーク：React
- 言語：TypeScript
- スタイリング：インラインスタイル（既存実装に準拠）
- チャート描画：Recharts（レーダーチャート用）

## 2.2 実装場所（想定）

```
src/
  ui/
    components/
      StarRating.tsx
      RadarChart.tsx
      ResultCard.tsx
```

## 2.3 設計原則

1. **プロダクト固有の文言を含まない**
   - ラベルや説明文はpropsから受け取る
   - コンポーネント内にJob固有の用語を含まない

2. **拡張可能な設計**
   - オプショナルpropsで柔軟にカスタマイズ可能
   - デフォルト値を適切に設定

3. **アクセシビリティ対応**
   - aria-label などの属性を適切に設定
   - キーボード操作への配慮

---

# 3. コンポーネント詳細

## 3.1 星評価表示コンポーネント（StarRating）

### 3.1.1 責務

- 数値スコアの星表示への変換
- 星アイコンの描画
- 半星表示対応
- アクセシビリティ対応

### 3.1.2 入力プロパティ

|プロパティ名|型|必須|デフォルト値|説明|
|---|---|---|---|---|
|score|number|○|-|スコア値（0-5の範囲）|
|maxStars|number|任意|5|最大星数|
|size|'small' \| 'medium' \| 'large'|任意|'medium'|表示サイズ|
|readonly|boolean|任意|true|読み取り専用フラグ|
|ariaLabel|string|任意|`${score} out of ${maxStars} stars`|アクセシビリティ用ラベル|

**TypeScript型定義**
```typescript
interface StarRatingProps {
  score: number;
  maxStars?: number;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  ariaLabel?: string;
}
```

### 3.1.3 表示ロジック

- `score`を元に、満星・半星・空星の数を計算
- 例：score=3.7, maxStars=5 → ★★★☆☆（3つの満星、1つの半星、1つの空星）

### 3.1.4 表示ルール

- 満星数：`Math.floor(score)`
- 半星判定：`score % 1 >= 0.5` の場合に半星を1つ表示
- 空星数：`maxStars - 満星数 - 半星数`
- 色指定：満星・半星は金色（#FFD700）、空星は灰色（#D3D3D3）
- サイズ指定：small=16px, medium=24px, large=32px

---

## 3.2 レーダーチャートコンポーネント（RadarChart）

### 3.2.1 責務

- 多軸データの可視化
- レーダーチャートの描画
- ラベル・値の表示
- チャートサイズ調整
- アクセシビリティ対応

### 3.2.2 入力プロパティ

|プロパティ名|型|必須|デフォルト値|説明|
|---|---|---|---|---|
|data|RadarChartData|○|-|チャート表示用データ|
|width|number|任意|400|チャート幅（px）|
|height|number|任意|400|チャート高さ（px）|
|ariaLabel|string|任意|'Radar chart'|アクセシビリティ用ラベル|

**データ構造**
```typescript
interface RadarChartData {
  labels: string[];    // 軸ラベル（例：['文書作成', 'Web構築', 'プログラミング']）
  values: number[];    // 各軸の値（0-100、例：[80, 60, 90]）
  maxValue?: number;   // 最大値（デフォルト：100）
}

interface RadarChartProps {
  data: RadarChartData;
  width?: number;
  height?: number;
  ariaLabel?: string;
}
```

### 3.2.3 描画ルール

- Rechartsライブラリを使用してレーダーチャートを描画
- データ変換：`labels` と `values` を `{subject: string, value: number}[]` 形式に変換
- 軸の範囲：`[0, maxValue]`（デフォルト：100）
- チャート色：ストローク＆塗りは青系（#3B82F6）、透明度0.6
- ResponsiveContainer でレスポンシブ対応

---

## 3.3 結果カード表示コンポーネント（ResultCard）

### 3.3.1 責務

- 汎用的な結果表示カードの提供
- タイトル・説明・スコアの表示
- 拡張可能なレイアウト
- レスポンシブ対応

### 3.3.2 入力プロパティ

|プロパティ名|型|必須|デフォルト値|説明|
|---|---|---|---|---|
|title|string|○|-|カードタイトル|
|description|string|任意|-|説明文|
|score|number|任意|-|スコア（表示する場合）|
|scoreLabel|string|任意|'Score'|スコアラベル|
|children|React.ReactNode|任意|-|カード内に表示する追加コンテンツ|
|variant|'default' \| 'success' \| 'warning' \| 'info'|任意|'default'|表示バリエーション|

**TypeScript型定義**
```typescript
interface ResultCardProps {
  title: string;
  description?: string;
  score?: number;
  scoreLabel?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
}
```

### 3.3.3 スタイル仕様

**カラーバリエーション**
- default：背景白（#FFFFFF）、ボーダー灰色（#E5E7EB）
- success：背景淡緑（#F0FDF4）、ボーダー緑（#86EFAC）
- warning：背景淡黄（#FEF3C7）、ボーダー黄（#FCD34D）
- info：背景淡青（#EFF6FF）、ボーダー青（#93C5FD）

**レイアウト**
- パディング：24px
- ボーダー半径：8px
- ボックスシャドウ：`0 1px 3px rgba(0,0,0,0.1)`
- マージン下：16px

**表示順序**
1. タイトル（h3、18px、太字600）
2. スコア（score が指定されている場合、20px、太字700）
3. 説明文（description が指定されている場合、14px、行間1.6）
4. 追加コンテンツ（children が指定されている場合）

---

# 4. Job固有機能との連携

Job固有画面（AnalysisPage など）は、本共通可視化コンポーネントを以下の流れで利用する。

1. Job固有のデータ構造で分析結果を保持
2. 共通可視化コンポーネントに必要な形式（score, labels, values等）にデータ変換
3. 共通コンポーネントを呼び出して描画

**連携のポイント**
- 共通コンポーネントはJob固有の概念（案件、スキルマッチ等）を持たない
- ラベルや説明文はpropsとして外部から注入
- データ構造の解釈はJob固有機能で実施

---

# 5. 将来の横展開

## 5.1 Shopping Insight への適用

Shopping固有機能でも同様の流れで利用可能。

1. Shopping固有のデータ構造で商品評価結果を保持
2. 共通可視化コンポーネントに必要な形式にデータ変換
3. 共通コンポーネントを呼び出して描画（コンポーネント自体は再利用）

**横展開の利点**
- UI表示ロジックの再実装が不要
- 表示スタイルの一貫性維持
- 新たな可視化コンポーネント追加時の恩恵を全プロダクトが受けられる

---

# 6. エラー処理

|エラー内容|発生条件|対応|
|---|---|---|
|不正なスコア値|score < 0 または score > maxStars|コンソールに警告を出力、0または maxStars にクリップ|
|空のラベル配列|labels.length === 0|空のチャートを表示|
|ラベルと値の要素数不一致|labels.length !== values.length|コンソールに警告を出力、短い方に合わせる|

---

# 7. アクセシビリティ対応

## 7.1 StarRating

- `role="img"` と `aria-label` で星評価を説明
- 例：`aria-label="4.5 out of 5 stars"`

## 7.2 RadarChart

- `role="img"` と `aria-label` でチャート内容を説明
- 例：`aria-label="案件とのスキル適合度チャート"`

## 7.3 ResultCard

- セマンティックHTML（`<h3>`, `<p>`など）を使用
- 適切な見出しレベルの使用

---

# 8. テスト方針

## 8.1 単体テスト

- 各コンポーネントの props による表示変化テスト
- エッジケース（スコア0、最大値、半星など）のテスト
- アクセシビリティ属性の確認

## 8.2 ビジュアルリグレッションテスト

- スナップショットテストによる表示確認
- 各 variant の表示確認

---

# 9. 非機能要件

## 9.1 パフォーマンス

- レーダーチャートは Recharts の最適化機能を活用
- 大量データ表示時の考慮（現時点では軸数10以下を想定）

## 9.2 レスポンシブ対応

- ResultCard は親要素の幅に追従
- RadarChart は ResponsiveContainer で自動調整

## 9.3 拡張性

- 新たな variant 追加が容易
- カスタムスタイリングのためのprops追加が可能

---

# 10. 関連ドキュメント

- AI Job Insight 基本仕様書 - 4.7 共通基盤機能ブロック
- AI Job Insight_詳細仕様書_共通AI応答基盤機能.md
- AI Job Insight_詳細仕様書_結果表示機能.md（既存、Phase 2以降で本共通機能を利用するよう移行予定）

---

# 11. 変更履歴

|日付|バージョン|変更内容|担当者|
|---|---|---|---|
|2026-03-15|1.0|新規作成|コーディング担当|
