# Changelog

すべての注目すべき変更をこのファイルに記録します。

このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/) に準拠しています。
フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいています。

## [Unreleased]

### Changed
- [docs/] OSS版向けにv2/バックエンド/OAuth前提の記述を整理し、クライアント完結型OSSであることを明確化 (#34)
  - README.md: 「完全クライアント型（v1）」→「完全クライアント型」に変更、データ保存欄のv1注記・IndexedDB（将来拡張）を削除、プロジェクト構成を現行構造に更新、制約事項のv1前置き表現を削除
  - docs/仕様書/AI Job Insight_システム仕様書.md: v2アーキテクチャ図・バックエンド通信方式の記述を削除、IndexedDB将来拡張削除、Googleログイン(OAuth)削除、設計方針のv1/v2ラベル削除
  - docs/仕様書/AI_Job_Insight_要求定義書.md: 3.1の「初期バージョン」表記を修正、4.1のOAuth認可設定削除、8のGoogleログイン・v1ラベル削除
  - docs/仕様書/AI Job Insight_基本仕様書.md: 3.2 v2以降の方式サブセクション削除、4.3 v2以降バックエンド記述削除、4.5 ログイン/認証機能(v2以降)セクション削除、旧4.6→4.5・旧4.7→4.6 にリナンバー、9.3 v2追加機能サブセクション削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_分析実行機能.md: v2以降バックエンド記述2箇所を削除、v1前置き表現を修正
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_AI応答サービス機能.md: v1/v2記述・OAuthバックエンドセッション関連の記述を削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_画面仕様.md: 使用データ表のv1注記削除、v1実装/v1追加ラベルを全箇所から除去、v2設定画面認証セクションを削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_設定管理機能.md: v2以降ログイン状態・ログイン認証機能関連の記述を全箇所削除、v2設定画面認証セクションを削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_入力管理機能.md: モデル名入力仕様の「v1.1以降」ラベルを削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_履歴管理機能.md: 将来拡張からクラウド履歴保存の「v2以降」ラベルを削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細設計書テンプレート.md: v2以降の記載ガイドラインを「将来拡張予定」表記に更新

### Removed
- [docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_ログイン認証機能(v2以降).md] OSS版には非対応のv2ログイン認証仕様のため削除 (#34)

- [docs/] ドキュメント構成を整理し、正式設計書・設計補助資料・作業メモを明確に分類 (#32)
  - docs/仕様書/ を新設し、要求定義書・システム仕様書・基本仕様書を移動
  - docs/仕様書/詳細仕様書/ を新設し、詳細仕様書14ファイルを移動（旧: docs/詳細設計/）
  - docs/設計資料/ を新設し、共通基盤リファクタリング_機能責務一覧.md を移動・リネーム
    （旧: docs/development/共通基盤リファクタリング_機能責務一覧.md → 新: docs/設計資料/共通基盤設計_機能責務一覧.md）
  - docs/UI_IMPROVEMENT_MEMO.md を削除（設計書への反映確認済み）
  - docs/development/ ディレクトリを削除
- [src/ui/README.md, src/core/README.md, src/domains/job/README.md] 内部リンクを新ディレクトリ構成に更新 (#32)

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
- [src/ui/components/] 共通可視化UIコンポーネントを実装 (#24)
  - StarRating.tsx: 星評価表示（満星・半星・空星、サイズ指定、aria-label対応）
  - RadarChart.tsx: レーダーチャート（Recharts使用、ResponsiveContainer対応）
  - ResultCard.tsx: 結果カード表示（default/success/warning/info バリアント）
  - index.ts: エントリーポイント
- [src/domains/job/components/JobAnalysisResult.tsx] Job固有分析結果表示コンポーネントを新規作成 (#24)
  - 共通UIコンポーネントを利用してJob固有文言（「応募おすすめ度」「スキル適合度」等）を組み合わせ

### Changed
- [docs/詳細設計/AI Job Insight_詳細仕様書_共通AI応答基盤機能.md] 実装ファイル一覧を実態と整合（config.ts削除・index.ts追加）、Phase 3移行済みに更新 (#25)
- [docs/詳細設計/AI Job Insight_詳細仕様書_AI応答サービス機能.md] プロンプト・サービス実装場所をPhase 3移行後の正しい場所に更新 (#25)
- [docs/詳細設計/AI Job Insight_詳細仕様書_分析実行機能.md] プロンプト分離（Phase 3）の注記を追加 (#25)
- [src/components/ChatInterface.tsx] chatWithAIのimport元を共通基盤に変更 (#23)
- [src/components/MainLayout.tsx] analyzeJobのimport元を共通基盤に変更 (#23)
- [src/components/ProfileInput.tsx] generateProfileTextのimport元を共通基盤に変更 (#23)
- [src/components/pages/AnalysisPage.tsx] AnalysisResult参照をJobAnalysisResultに変更 (#24)

### Removed
- [src/services/aiService.ts] 共通AI基盤・domains/job/services/ への全機能移行完了に伴い削除 (#25)
- [src/core/ai/.gitkeep] 実ファイル配置済みのため削除 (#25)
- [src/domains/job/components/.gitkeep] 実ファイル配置済みのため削除 (#25)
- [src/domains/job/prompts/.gitkeep] 実ファイル配置済みのため削除 (#25)
- [src/ui/components/.gitkeep] 実ファイル配置済みのため削除 (#25)
- [src/components/AnalysisResult.tsx] JobAnalysisResult.tsxへの移行に伴い削除 (#24)

## [1.0.0] - 2026-03-15

### Added
- 初回リリース
- クラウドソーシング案件分析機能
- AI応募文作成支援機能
- プロフィール管理機能
- デモモード実装
- OpenAI API / Google Gemini API 対応
