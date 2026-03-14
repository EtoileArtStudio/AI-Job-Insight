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
    client.ts       # AI通信処理
    transform.ts    # AI応答整形処理
    config.ts       # AI設定管理
    types.ts        # 型定義
```

## Phase 3以降で実装予定

現在は空のディレクトリ構造のみ。Phase 3でservices/aiService.tsから共通処理を抽出して配置。

## 関連ドキュメント

- [AI Job Insight_詳細仕様書_共通AI応答基盤機能.md](../docs/詳細設計/AI%20Job%20Insight_詳細仕様書_共通AI応答基盤機能.md)
- [共通基盤リファクタリング_機能責務一覧.md](../docs/development/共通基盤リファクタリング_機能責務一覧.md)
