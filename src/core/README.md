# core/ - 共通基盤機能

プロダクト固有の概念を含まない汎用的な基盤機能を配置するディレクトリ。

## 責務

- AI通信処理の汎用化
- AI応答整形処理の汎用化
- 共通ユーティリティ関数
- プロダクト横断で利用可能な機能

## 設計原則

1. Job固有の概念（案件、プロフィールなど）を含まない
2. 他プロダクト（Shopping Insight等）でも再利用可能
3. ドメイン層（domains/）に依存しない

## ディレクトリ構成

```
core/
  ai/          # AI通信・応答整形の共通機能
    types.ts        # 型定義
    client.ts       # AI通信処理 (callAI, callAIChat)
    transform.ts    # AI応答整形処理 (transformAIResponse)
    index.ts        # エントリーポイント
```

## Phase 3実装済み

services/aiService.tsから共通処理を抽出し、下記の実装を完了。
- AI通信処理: OpenAI / Google Gemini API対応、タイムアウト(30秒)実装済み
- チャット通信処理: マルチターン形式の会話API対応済み
- AI応答整形: JSONブロック抽出・パースエラーハンドリング実装済み

## 関連ドキュメント

- [AI Job Insight_詳細仕様書_共通AI応答基盤機能.md](../../docs/詳細設計/AI%20Job%20Insight_詳細仕様書_共通AI応答基盤機能.md)
- [共通基盤リファクタリング_機能責務一覧.md](../../docs/development/共通基盤リファクタリング_機能責務一覧.md)
