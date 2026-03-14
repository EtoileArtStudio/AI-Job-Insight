# Changelog

すべての注目すべき変更をこのファイルに記録します。

このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/) に準拠しています。
フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいています。

## [Unreleased]

### Added
- [src/core/ai/] 共通AI処理基盤を実装 (#23)
  - types.ts: AI共通型定義（AIService, ChatMessage, AIClientRequest等）
  - client.ts: AI通信処理（callAI, callAIChat関数、30秒タイムアウト実装）
  - transform.ts: AI応答整形処理（transformAIResponse関数、JSONブロック抽出対応）
  - index.ts: エントリーポイント
- [src/domains/job/prompts/] Job固有プロンプト定義を分離 (#23)
  - analysisPrompt.ts: 案件分析プロンプト定義
  - chatPrompts.ts: チャット用プロンプト定義（相談・応募文作成モード）
  - profilePrompts.ts: プロフィール生成プロンプト定義
  - index.ts: エントリーポイント
- [src/domains/job/services/] Job固有サービス層を実装 (#23)
  - jobAnalysisService.ts: 案件分析サービス（共通AI基盤を使用）
  - jobChatService.ts: チャットサービス（共通AI基盤を使用）
  - jobProfileService.ts: プロフィール生成サービス（共通AI基盤を使用）
  - index.ts: エントリーポイント

### Changed
- [src/components/ChatInterface.tsx] chatWithAIのimport元を共通基盤に変更 (#23)
- [src/components/MainLayout.tsx] analyzeJobのimport元を共通基盤に変更 (#23)
- [src/components/ProfileInput.tsx] generateProfileTextのimport元を共通基盤に変更 (#23)

## [1.0.0] - 2026-03-15

### Added
- 初回リリース
- クラウドソーシング案件分析機能
- AI応募文作成支援機能
- プロフィール管理機能
- デモモード実装
- OpenAI API / Google Gemini API 対応
