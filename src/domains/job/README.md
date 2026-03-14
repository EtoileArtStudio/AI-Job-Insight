# domains/job/ - Job固有機能

AI Job Insightに特化した機能を配置するディレクトリ。

## 責務

- 案件分析プロンプト定義
- Job評価軸定義
- Job固有画面コンポーネント
- Job固有ビジネスロジック

## 設計原則

1. Job固有の概念（案件、プロフィールなど）を扱う
2. 共通基盤機能（core/）を組み合わせて利用
3. 共通UIコンポーネント（ui/）を利用して画面構成

## ディレクトリ構成

```
domains/job/
  prompts/              # プロンプト定義
    analysisPrompt.ts   # 案件分析用プロンプト
    chatPrompts.ts      # チャット用プロンプト
  config/               # Job固有設定
    evaluationAxis.ts   # 評価軸定義
  components/           # Job固有コンポーネント
    JobInput.tsx
    ProfileInput.tsx
    AnalysisResult.tsx
```

## 段階的移行

Phase 2では既存のcomponents/配下のファイルは当面そのまま維持。
Phase 3以降で段階的にこのディレクトリへ移行。

## 依存関係

```
domains/job/ → core/ (共通基盤機能)
domains/job/ → ui/   (共通UIコンポーネント)
core/ ×→ domains/job/ (依存してはいけない)
ui/   ×→ domains/job/ (依存してはいけない)
```

## 関連ドキュメント

- [共通基盤リファクタリング_機能責務一覧.md](../docs/development/共通基盤リファクタリング_機能責務一覧.md)
