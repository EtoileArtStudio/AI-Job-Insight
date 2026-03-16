# Changelog

すべての注目すべき変更をこのファイルに記録します。

このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/) に準拠しています。
フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいています。

## [Unreleased]

### Added
- [初期構成] AI Job Insight 初期構成および設計ドキュメント（README.md・各種仕様書）を追加
- [.github/] GitHub Issue テンプレート追加（bug.yml, feature.yml, refactor.yml）
- [src/] v1実装完了 - 仕様準拠の案件分析システム (#9)
  - クラウドソーシング案件分析機能（AnalysisPage, AnalysisResult）
  - AI応募文作成支援機能（ApplicationPage）
  - プロフィール管理機能（ProfileInput）
  - IMPLEMENTATION_STATUS.md, TEST_GUIDE.md 追加
- [src/components/] アプリビジュアル・アニメーション追加（背景画像・チャットアイコン・CSSアニメーション）
- [src/components/AnalysisButton.tsx, src/components/pages/ApplicationPage.tsx] ローディング中のボタンにスピナー・パルスアニメーションを追加
- [src/components/ProfileInput.tsx] プロフィール生成ボタンにスピナー・パルスアニメーションを追加
- [src/components/pages/AnalysisPage.tsx] タブUI・AIチャット機能追加とレイアウト最適化 (#13)
- [src/] デモモード機能を追加 (#16, #17)
- [docs/] 共通基盤機能の設計書を整備（Phase 1, #26）
  - docs/AI Job Insight_基本仕様書.md: 共通基盤機能ブロック(4.7)を追加（共通AI応答基盤・共通可視化・Job固有機能との依存関係）
  - docs/development/共通基盤リファクタリング_機能責務一覧.md: 機能責務一覧を新規作成（共通機能とJob固有機能の責務境界・将来の横展開イメージ）
  - docs/詳細設計/AI Job Insight_詳細仕様書_共通AI応答基盤機能.md: AI通信・応答整形の汎用化設計・OpenAI/Gemini API対応仕様
  - docs/詳細設計/AI Job Insight_詳細仕様書_共通可視化機能.md: StarRating・RadarChart・ResultCard コンポーネント仕様
- [src/core/ai/] 共通AI処理基盤を実装 (#23)
  - types.ts: AI共通型定義（AIService, ChatMessage, AIClientRequest 等）
  - client.ts: AI通信処理（callAI, callAIChat 関数、30秒タイムアウト実装）
  - transform.ts: AI応答整形処理（transformAIResponse 関数、JSONブロック抽出対応）
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
- [README.md] ライセンス欄・作成者欄を記入、変更履歴欄を削除
- [docs/詳細設計/] UIモックアップ仕様を画面設計書（AI Job Insight_詳細仕様書_画面仕様.md・設定管理機能.md）に反映 (#8)
- [src/components/common/Card.css, src/components/pages/AnalysisPage.css, src/components/pages/ApplicationPage.css] パネルに box-shadow・backdrop-filter を追加し、背景画像への視認性を向上
- [src/components/ApiKeySettings.tsx] AIモデル選択UIを改善（input + datalist 方式を実装） (#19)
- [src/] ディレクトリ構造整理 - src/core/, src/domains/, src/ui/ の構成を確立（Phase 2, #27）
  - src/core/ai/, src/ui/components/, src/domains/job/{prompts,config,components}/ を新設（各 .gitkeep 配置）
  - src/core/README.md, src/ui/README.md, src/domains/job/README.md を追加（責務・設計原則・依存関係を明記）
- [src/components/ChatInterface.tsx] chatWithAI の import 元を共通基盤に変更 (#23)
- [src/components/MainLayout.tsx] analyzeJob の import 元を共通基盤に変更 (#23)
- [src/components/ProfileInput.tsx] generateProfileText の import 元を共通基盤に変更 (#23)
- [src/components/pages/AnalysisPage.tsx] AnalysisResult 参照を JobAnalysisResult に変更 (#24)
- [docs/詳細設計/AI Job Insight_詳細仕様書_共通AI応答基盤機能.md] 実装ファイル一覧を実態と整合（config.ts 削除・index.ts 追加）、Phase 3 移行済みに更新 (#25)
- [docs/詳細設計/AI Job Insight_詳細仕様書_AI応答サービス機能.md] プロンプト・サービス実装場所を Phase 3 移行後の正しい場所に更新 (#25)
- [docs/詳細設計/AI Job Insight_詳細仕様書_分析実行機能.md] プロンプト分離（Phase 3）の注記を追加 (#25)
- [docs/] ドキュメント構成を整理し、正式設計書・設計補助資料・作業メモを明確に分類 (#32)
  - docs/仕様書/ を新設し、要求定義書・システム仕様書・基本仕様書を移動
  - docs/仕様書/詳細仕様書/ を新設し、詳細仕様書14ファイルを移動（旧: docs/詳細設計/）
  - docs/設計資料/ を新設し、共通基盤リファクタリング_機能責務一覧.md を移動・リネーム
    （旧: docs/development/共通基盤リファクタリング_機能責務一覧.md → 新: docs/設計資料/共通基盤設計_機能責務一覧.md）
- [src/ui/README.md, src/core/README.md, src/domains/job/README.md] 内部リンクを新ディレクトリ構成に更新 (#32)
- [README.md] ヒーロー画像・コンセプト説明資料を追加
- [docs/] OSS版向けにv2/バックエンド/OAuth前提の記述を整理し、クライアント完結型OSSであることを明確化 (#34)
  - README.md: 「完全クライアント型（v1）」→「完全クライアント型」に変更、データ保存欄のv1注記・IndexedDB（将来拡張）を削除、プロジェクト構成を現行構造に更新、制約事項のv1前置き表現を削除
  - docs/仕様書/AI Job Insight_システム仕様書.md: v2アーキテクチャ図・バックエンド通信方式の記述を削除、IndexedDB将来拡張削除、Googleログイン(OAuth)削除、設計方針のv1/v2ラベル削除
  - docs/仕様書/AI_Job_Insight_要求定義書.md: 3.1の「初期バージョン」表記を修正、4.1のOAuth認可設定削除、8のGoogleログイン・v1ラベル削除
  - docs/仕様書/AI Job Insight_基本仕様書.md: 3.2 v2以降の方式サブセクション削除、4.3 v2以降バックエンド記述削除、4.5 ログイン/認証機能(v2以降)セクション削除、旧4.6→4.5・旧4.7→4.6にリナンバー、9.3 v2追加機能サブセクション削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_分析実行機能.md: v2以降バックエンド記述2箇所を削除、v1前置き表現を修正
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_AI応答サービス機能.md: v1/v2記述・OAuthバックエンドセッション関連の記述を削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_画面仕様.md: 使用データ表のv1注記削除、v1実装/v1追加ラベルを全箇所から除去、v2設定画面認証セクションを削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_設定管理機能.md: v2以降ログイン状態・ログイン認証機能関連の記述を全箇所削除、v2設定画面認証セクションを削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_入力管理機能.md: モデル名入力仕様の「v1.1以降」ラベルを削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_履歴管理機能.md: 将来拡張からクラウド履歴保存の「v2以降」ラベルを削除
  - docs/仕様書/詳細仕様書/AI Job Insight_詳細設計書テンプレート.md: v2以降の記載ガイドラインを「将来拡張予定」表記に更新

### Fixed
- [docs/詳細設計/] 詳細設計書レビュー指摘事項の修正 (#6)
- [src/components/layout/AppLayout.css] 背景画像をタイル表示（tiled）に修正
- [public/assets/images/] prefers-reduced-motion に対応し、アクセシビリティ設定を尊重 (#14)
- [public/assets/images/app_background_v2.png] 背景画像サイズを128x128ピクセルに修正
- [IMPLEMENTATION_STATUS.md] Phase 5 レビュー指摘により機能責務一覧の実装不一致を修正 (#31)
  - src/services/aiService.ts 記載を削除済みとして更新し Phase 3 移管先に差し替え
  - JobInput の入力項目を現行実装（案件説明1フィールド10行）に更新
  - AnalysisResult.tsx 記載を削除済みとして更新し JobAnalysisResult.tsx に差し替え
  - SettingsModal のデータ管理メニューを現行UI構成に更新・ストレージキー一覧を STORAGE_KEYS 定義に合わせて更新
- [docs/設計資料/共通基盤設計_機能責務一覧.md] Phase 5 レビュー指摘による整合修正（src/core/ai/config.ts を実在ファイルに差し替え）(#31)

### Removed
- [src/components/AnalysisResult.tsx] JobAnalysisResult.tsx への移行に伴い削除 (#24)
- [src/services/aiService.ts] 共通AI基盤・domains/job/services/ への全機能移行完了に伴い削除 (#25)
- [src/core/ai/.gitkeep] 実ファイル配置済みのため削除 (#25)
- [src/domains/job/components/.gitkeep] 実ファイル配置済みのため削除 (#25)
- [src/domains/job/prompts/.gitkeep] 実ファイル配置済みのため削除 (#25)
- [src/ui/components/.gitkeep] 実ファイル配置済みのため削除 (#25)
- [docs/UI_IMPROVEMENT_MEMO.md] 設計書への反映確認済みのため削除 (#32)
- [docs/development/] ディレクトリを削除（設計資料は docs/設計資料/ に移動済み）(#32)
- [docs/仕様書/詳細仕様書/AI Job Insight_詳細仕様書_ログイン認証機能(v2以降).md] OSS版には非対応のv2ログイン認証仕様のため削除 (#34)
