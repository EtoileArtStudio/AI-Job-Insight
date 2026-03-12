# AI Job Insight UI改善実装メモ

## 実装日
2026年3月12日

## 対応Issue
Issue #12: UI改善（AI Job Insight）

## 実装内容

### 1. サイドバーナビゲーションの実装
- 固定幅250pxのサイドバーを実装
- 4つのメインページへのナビゲーション（作業フロー順）
  - プロフィール（/profile）
  - 案件分析（/analysis）
  - 応募文章作成（/application）
  - 設定（/settings）
- アクティブ状態の視覚的フィードバック
- React Router NavLinkを使用

### 2. 画面の分割
- 従来の1画面縦並びから4画面構成に変更
- 各画面は独立したページコンポーネントとして実装
- react-router-domを使用したルーティング

### 3. 横レイアウトの採用
- 案件分析ページ：左側に案件入力、右側に分析結果
- 応募文章作成ページ：左側にエディタ、右側にAI提案
- Grid Layoutを使用（grid-template-columns: 1fr 1fr）

### 4. Card UIの導入
- 視覚的な区切りを強化するCardコンポーネントを実装
- 全体的な統一感のあるデザイン
- オプションでタイトル表示可能

### 5. エディタ+AI提案型UIの実装
- チャット形式から文章編集に特化したUIに変更
- エディタエリアとAI提案エリアを分離
- AI提案の適用・破棄機能
- クリップボードコピー機能

### 6. UI導線の改善（2026年3月12日追加）
- **サイドバー順序変更**：プロフィール → 案件分析 → 応募文章作成 → 設定
- **分析結果から応募文章作成への導線追加**：
  - 「この案件の応募文章を作成」ボタン実装
  - ボタンクリックで案件情報と分析結果を渡して遷移
- **案件情報の連動性を明確化**：
  - 応募文章作成ページに「対象案件情報」カード表示
  - 案件説明プレビュー、URL、おすすめ度を表示
  - AI提案時に案件情報と分析結果をコンテキストとして渡す

### 7. データ永続化と履歴機能の追加（2026年3月12日追加）
- **案件入力の永続化**：
  - 案件入力内容をlocalStorageに自動保存（キー：`ai_job_insight_job_data`）
  - ブラウザリロード時も入力内容を保持
  - useLocalStorageカスタムフックを使用
- **入力フォームのクリアリンク（2026年3月13日更新）**：
  - 「新規分析」ボタンから「入力フォームのクリア」テキストリンクに変更
  - 青色のテキストリンクデザイン（#3498db）、下線付き
  - 「AIで分析する」ボタンの下に配置
  - 分析実行ボタンとクリアリンクを中央揃え
- **分析結果の永続化（2026年3月13日追加）**：
  - 分析結果をlocalStorageに保存（キー：`ai_job_insight_analysis_result`）
  - ページを切り替えても分析結果を保持
- **分析履歴機能**：
  - 案件分析ページ下部に履歴リスト表示
  - localStorageに保存（キー：`ai_job_insight_analysis_history`）
  - 履歴データ構造：HistoryItem型（id, analyzedAt, profile, job, result）
  - 履歴アイテム表示：日時、おすすめ度、案件説明プレビュー、アクションボタン
  - 「結果を見る」ボタン：履歴から分析結果を表示
  - 「応募文章を作成」ボタン：履歴から応募文章作成ページへ遷移
  - ページネーション機能（5件/ページ）
  - 最新が先頭の降順表示
- **応募文章エディタと案件情報の永続化（2026年3月13日追加）**：
  - 応募文章エディタの内容をlocalStorageに保存（キー：`ai_job_insight_application_text`）
  - 対象案件情報（jobDataとanalysisResult）をlocalStorageに保存（キー：`ai_job_insight_linked_job_info`）
  - ページを切り替えてもエディタの内容と案件情報を保持
  - 分析ページから遷移した場合は案件情報を更新

### 8. 応募文章作成画面の案件管理機能（2026年3月13日追加）
- **案件ナビゲーション機能**：
  - 対象案件情報カードに「前の案件」「次の案件」ボタンを追加
  - 案件カウンター表示（例：2 / 5）
  - 分析履歴から案件を切り替え可能
  - ボタンスタイル：青背景（#3498db）、無効時グレー（#95a5a6）
- **案件ごとの応募文管理**：
  - 各案件に対して個別の応募文を保存
  - 案件ID（案件説明の先頭50文字）をキーとした辞書形式で管理
  - localStorageに保存（キー：`ai_job_insight_application_drafts`）
  - 案件を切り替えると、その案件に対応する応募文が自動的に表示
- **案件連動モードトグル**：
  - トグルスイッチ実装（幅48px × 高さ24px）
  - オン（青 #3498db）：案件に紐づいた応募文を管理（案件ごとに保存）
  - オフ（グレー #ccc）：汎用スロットで案件非連動の応募文を管理
  - トグル状態をlocalStorageに保存（キー：`ai_job_insight_application_linked_mode`）
- **汎用スロット機能**：
  - 案件に依存しない応募文の作成・保存
  - localStorageに保存（キー：`ai_job_insight_application_text_generic`）
  - トグルオフ時に使用
- **現在の案件インデックス保持**：
  - 表示中の案件インデックスをlocalStorageに保存（キー：`ai_job_insight_current_job_index`）
  - ページ再読み込み時も同じ案件を表示

## 想定作業フロー
1. プロフィール設定（初回のみ）
2. 案件情報入力とAI分析
3. 分析結果確認
4. 「この案件の応募文章を作成」ボタンで応募文章作成ページへ遷移
5. 案件情報が連動した状態でAI提案を利用して応募文章を作成
6. 履歴から過去の分析を確認・再利用

## ユースケース
- **基本パターン**：分析 → 応募文章作成（案件情報連動）
- **単独利用パターン**：サイドバーから直接応募文章作成ページへアクセス（既存文章の校正・改善）
- **履歴利用パターン**：過去の分析履歴から結果確認や応募文章作成

## 新規作成ファイル

### コンポーネント
- `src/components/common/Card.tsx` - カードUIコンポーネント
- `src/components/layout/Sidebar.tsx` - サイドバー
- `src/components/layout/AppLayout.tsx` - アプリケーションレイアウト
- `src/components/pages/AnalysisPage.tsx` - 案件分析ページ
- `src/components/pages/ProfilePage.tsx` - プロフィールページ
- `src/components/pages/ApplicationPage.tsx` - 応募文章作成ページ
- `src/components/pages/SettingsPage.tsx` - 設定ページ

### スタイル
- 各コンポーネントに対応するCSSファイル

## 変更ファイル
- `src/App.tsx` - ルーティング設定を追加
- `package.json` - react-router-dom依存追加

## 設計書の更新
- `docs/詳細設計/AI Job Insight_詳細仕様書_画面仕様.md` - UI構成の変更を反映

## 技術スタック
- React Router v6
- Grid Layout（CSS Grid）
- TypeScript

## 動作確認
- ビルド: ✅ 成功
- Lint: ✅ エラーなし

## 備考
- 既存のコンポーネント（ProfileInput, JobInput, AnalysisResult, ApiKeySettings, SettingsModal）は再利用
- MainLayoutコンポーネントは旧実装として保持（将来的に削除予定）
- レスポンシブ対応は1024px以下で1カラムレイアウトに切り替え
